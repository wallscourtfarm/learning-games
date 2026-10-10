"""Build map-data.js for Map Explorer.

Needs: python packages shapely + pyproj, and the raw downloads made by
fetch_raw.py (kept outside the repo, path given as the first argument).

    python build_data.py /path/to/raw ../map-data.js
"""
import json, math, sys, os, warnings
warnings.filterwarnings('ignore', category=DeprecationWarning)
from shapely.geometry import shape, Polygon, MultiPolygon, LineString, MultiLineString, Point, box, mapping
from shapely.ops import unary_union, linemerge, polygonize, transform as shp_transform
from pyproj import Transformer

sys.path.insert(0, os.path.dirname(__file__))
from content import ITEMS, WORLD_SEA_ANCHORS, UK_SEA_ANCHORS, COUNTY_GROUPS, LOCAL_MAPS

RAW = sys.argv[1]
OUT = sys.argv[2]

# ---------------------------------------------------------------- Gall-Peters (equal-area cylindrical, standard parallels 45°)
# The function keeps its old name, rob(), so the rest of the build is unchanged.
WW = 8000.0                                   # world map width in units
R = WW / (2 * math.pi * math.cos(math.radians(45)))
WH = 2 * R / math.cos(math.radians(45))


def rob(lon, lat):
    lat = max(-90.0, min(90.0, lat))
    x = R * math.radians(lon) * math.cos(math.radians(45))
    y = R * math.sin(math.radians(lat)) / math.cos(math.radians(45))
    return WW / 2 + x, WH / 2 - y


def rob_geom(g):
    return shp_transform(lambda xs, ys, zs=None: tuple(zip(*[rob(x, y) for x, y in zip(xs, ys)])), g)


# ---------------------------------------------------------------- paths
def ring_d(coords, q, close=True):
    pts = []
    for x, y in coords:
        p = (round(x / q), round(y / q))
        if not pts or p != pts[-1]:
            pts.append(p)
    if close and len(pts) > 1 and pts[0] == pts[-1]:
        pts.pop()
    if len(pts) < (3 if close else 2):
        return ''
    out = ['M%d %d' % pts[0]]
    rel = []
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        rel.append('%d %d' % (x1 - x0, y1 - y0))
    out.append('l' + ' '.join(rel))
    if close:
        out.append('z')
    return ''.join(out).replace(' -', '-')


def geom_d(g, q=1.0):
    """SVG path data. Coordinates are divided by q and rounded."""
    if g.is_empty:
        return ''
    parts = []
    if isinstance(g, (Polygon, MultiPolygon)):
        polys = [g] if isinstance(g, Polygon) else list(g.geoms)
        for p in polys:
            parts.append(ring_d(p.exterior.coords, q))
            for r in p.interiors:
                parts.append(ring_d(r.coords, q))
    elif isinstance(g, (LineString, MultiLineString)):
        lines = [g] if isinstance(g, LineString) else list(g.geoms)
        for l in lines:
            parts.append(ring_d(l.coords, q, close=False))
    elif hasattr(g, 'geoms'):
        for sub in g.geoms:
            parts.append(geom_d(sub, q))
    return ''.join(p for p in parts if p)


def polys_only(g):
    if isinstance(g, (Polygon, MultiPolygon)):
        return g
    if hasattr(g, 'geoms'):
        ps = [x for x in g.geoms if isinstance(x, (Polygon, MultiPolygon))]
        return unary_union(ps) if ps else Polygon()
    return Polygon()


def lines_only(g):
    if isinstance(g, (LineString, MultiLineString)):
        return g
    if hasattr(g, 'geoms'):
        ls = [x for x in g.geoms if isinstance(x, (LineString, MultiLineString))]
        return unary_union(ls) if ls else LineString()
    return LineString()


def merge(lines):
    u = unary_union(lines)
    return u if isinstance(u, LineString) else linemerge(u)


def load(name):
    return json.load(open(os.path.join(RAW, name)))


# ================================================================ WORLD
def part_continent(code, cont, poly):
    c = poly.representative_point()
    lon, lat = c.x, c.y
    if code == 'RUS':
        return 'Europe' if lon < 60 and lon > 0 else 'Asia'
    if code in ('FRA', 'NLD'):
        if lon < -30:
            return 'South America' if lat < 10 else 'North America'
        if lon > 40 and lon < 80:
            return 'Africa'
        if lon > 150 or lon < -100:
            return 'Oceania'
    if code == 'USA' and lon < -150 and lat < 30:
        return 'Oceania'
    if code == 'ESP' and lat < 30:
        return 'Africa'
    if code == 'PRT' and lon < -20:
        return 'Europe'
    if cont == 'Seven seas (open ocean)':
        return 'Islands'
    return cont


def build_world():
    nec = load('ne_50m_admin_0_countries.geojson')['features']
    caps = {}
    caplist = []
    for f in load('ne_50m_populated_places_simple.geojson')['features']:
        p = f['properties']
        if p.get('featurecla') == 'Admin-0 capital':
            caps.setdefault(p['adm0_a3'], []).append(p['name'])
            caplist.append([p['name'], p['adm0_a3'], round(p['latitude'], 2), round(p['longitude'], 2)])
    countries = {}
    parts = []
    for f in nec:
        p = f['properties']
        code = p['ADM0_A3']
        name = p['NAME_EN'] or p['NAME']
        if code == 'GBR':
            name = 'United Kingdom'
        cont = p['CONTINENT']
        g = shape(f['geometry'])
        if code == 'RUS':  # split Russia where Europe meets Asia (roughly the Urals)
            west = g.intersection(box(0, -90, 60, 90))
            east = g.difference(box(0, -90, 60, 90))
            g = unary_union([west, east])
            polys = []
            for sub in [west, east]:
                sub = polys_only(sub)
                polys += [sub] if isinstance(sub, Polygon) else list(sub.geoms)
        else:
            polys = [g] if isinstance(g, Polygon) else list(g.geoms)
        largest = max(polys, key=lambda x: x.area)
        conts = set()
        for poly in polys:
            pc = part_continent(code, cont, poly)
            pg = rob_geom(poly).simplify(0.9, preserve_topology=True)
            if pg.area < 2.0 and poly is not largest:
                continue
            d = geom_d(pg, 1)
            if d:
                parts.append([code, pc, d])
                conts.add(pc)
        lp = rob_geom(largest).representative_point()
        cap = caps.get(code, [])
        countries[code] = dict(n=name, c=cont if cont != 'Seven seas (open ocean)' else 'Islands', cap=' / '.join(cap[:2]), l=[round(lp.x), round(lp.y)])
        if code == 'RUS':
            countries[code]['c'] = 'Europe and Asia'
    lakes = []
    for f in load('ne_50m_lakes.geojson')['features']:
        if f['properties'].get('scalerank', 9) <= 2:
            lg = rob_geom(shape(f['geometry'])).simplify(0.9)
            if lg.area > 6:
                lakes.append(geom_d(lg, 1))
    anchors = []
    for name, pts in WORLD_SEA_ANCHORS.items():
        for lat, lon in pts:
            anchors.append([name, lat, lon])
    caplist = [[n, countries[c]['n'] if c in countries else c, la, lo] for n, c, la, lo in caplist]
    return dict(w=WW, h=round(WH, 1), R=R, countries=countries, parts=parts, lakes=''.join(lakes), anchors=anchors, caps=caplist)


# ================================================================ UK
UK_S = 250.0          # metres per unit
UK_E0, UK_E1, UK_N0, UK_N1 = -110000, 760000, -40000, 1230000
to_bng = Transformer.from_crs(4326, 27700, always_xy=True)


def bng_geom(g):
    return shp_transform(lambda xs, ys, zs=None: to_bng.transform(xs, ys), g)


def uk_xy(e, n):
    return ((e - UK_E0) / UK_S, (UK_N1 - n) / UK_S)


def uk_unit(g):
    return shp_transform(lambda xs, ys, zs=None: (tuple((x - UK_E0) / UK_S for x in xs), tuple((UK_N1 - y) / UK_S for y in ys)), g)


def lab(g):
    if isinstance(g, MultiPolygon):
        g = max(g.geoms, key=lambda x: x.area)
    p = g.representative_point()
    return [round(c) for c in uk_xy(p.x, p.y)]


def build_uk():
    frame = box(UK_E0, UK_N0, UK_E1, UK_N1)
    out = dict(w=(UK_E1 - UK_E0) / UK_S, h=(UK_N1 - UK_N0) / UK_S, s=UK_S, e0=UK_E0, n1=UK_N1)
    ctry = []
    for f in load('Countries_December_2023_Boundaries_UK_BUC.geojson')['features']:
        g = shape(f['geometry']).simplify(250)
        ctry.append(dict(n=f['properties']['CTRY23NM'], d=geom_d(uk_unit(g)), l=lab(g)))
    out['countries'] = ctry
    reg = []
    for f in load('Regions_December_2023_Boundaries_EN_BUC.geojson')['features']:
        g = shape(f['geometry']).simplify(250)
        reg.append(dict(n=f['properties']['RGN23NM'], d=geom_d(uk_unit(g)), l=lab(g)))
    out['regions'] = reg
    ua = {f['properties']['CTYUA23NM']: shape(f['geometry']) for f in load('Counties_and_Unitary_Authorities_December_2023_Boundaries_UK_BUC.geojson')['features']}
    cty = []
    used = set()
    for cname, members in COUNTY_GROUPS.items():
        gs = [ua[m] for m in members]
        used.update(members)
        g = unary_union([x.buffer(1) for x in gs]).buffer(-1).simplify(250)
        cty.append(dict(n=cname, d=geom_d(uk_unit(g)), l=lab(g)))
    missing = [k for k in ua if k not in used and not any(k == x for x in [])]
    out['counties'] = cty
    # neighbouring land for context
    ctx = []
    for f in load('ne_50m_admin_0_countries.geojson')['features']:
        p = f['properties']
        if p['ADM0_A3'] in ('IRL', 'FRA', 'BEL', 'NLD', 'IMN', 'GGY', 'JEY', 'NOR', 'DNK', 'DEU'):
            g = bng_geom(shape(f['geometry'])).intersection(frame).simplify(400)
            if not g.is_empty:
                ctx.append(dict(n=p['NAME_EN'] or p['NAME'], code=p['ADM0_A3'], d=geom_d(uk_unit(g))))
    out['context'] = ctx
    rv = load('rivers.json')
    rivers = {}
    for k, ways in rv.items():
        g = merge([bng_geom(LineString(w)) for w in ways if len(w) > 1])
        g = g.simplify(150)
        rivers[k] = geom_d(uk_unit(g))
    out['rivers'] = rivers
    anchors = []
    for name, pts in UK_SEA_ANCHORS.items():
        for lat, lon in pts:
            e, n = to_bng.transform(lon, lat)
            x, y = uk_xy(e, n)
            anchors.append([name, round(x, 1), round(y, 1)])
    out['anchors'] = anchors
    return out


# ================================================================ items
def item_geo(it):
    o = {k: v for k, v in it.items() if k not in ('p', 'line')}
    if it['m'] == 'world':
        if 'p' in it:
            x, y = rob(it['p'][1], it['p'][0])
            o['xy'] = [round(x, 1), round(y, 1)]
            o['ll'] = it['p']
        if 'line' in it:
            o['pts'] = [[round(c, 1) for c in rob(lon, lat)] for lat, lon in it['line']]
            o['ll'] = it['line'][len(it['line']) // 2]
    else:
        if 'p' in it:
            e, n = to_bng.transform(it['p'][1], it['p'][0])
            o['xy'] = [round(c, 1) for c in uk_xy(e, n)]
        if 'line' in it:
            o['pts'] = [[round(c, 1) for c in uk_xy(*to_bng.transform(lon, lat))] for lat, lon in it['line']]
    return o


# ================================================================ local OS-style maps
AREA_RULES = [  # (class, test)
    ('water', lambda t: t.get('natural') == 'water' or t.get('waterway') == 'riverbank'),
    ('mud', lambda t: t.get('natural') in ('mud',) or t.get('wetland') in ('tidalflat',)),
    ('wood', lambda t: t.get('natural') == 'wood' or t.get('landuse') == 'forest'),
    ('scrub', lambda t: t.get('natural') in ('scrub', 'heath')),
    ('cemetery', lambda t: t.get('landuse') == 'cemetery' or t.get('amenity') == 'grave_yard'),
    ('golf', lambda t: t.get('leisure') == 'golf_course'),
    ('pitch', lambda t: t.get('leisure') in ('pitch', 'stadium', 'sports_centre')),
    ('park', lambda t: t.get('leisure') in ('park', 'garden', 'common', 'nature_reserve', 'playground') or t.get('landuse') in ('grass', 'recreation_ground', 'village_green', 'meadow', 'greenfield') or t.get('natural') in ('grassland',)),
    ('allot', lambda t: t.get('landuse') in ('allotments', 'orchard')),
    ('farm', lambda t: t.get('landuse') == 'farmland'),
    ('rock', lambda t: t.get('natural') in ('bare_rock',)),
    ('urban', lambda t: t.get('landuse') in ('residential', 'retail', 'commercial', 'industrial', 'construction', 'brownfield', 'railway')),
]
ROAD_CLASS = {
    'motorway': 'mway', 'motorway_link': 'mway', 'trunk': 'a', 'trunk_link': 'a', 'primary': 'a', 'primary_link': 'a',
    'secondary': 'b', 'secondary_link': 'b', 'tertiary': 'minor', 'tertiary_link': 'minor', 'unclassified': 'minor',
    'residential': 'street', 'living_street': 'street', 'pedestrian': 'street',
    'footway': 'path', 'path': 'path', 'bridleway': 'path', 'cycleway': 'path', 'track': 'track',
}
POI_RULES = [  # (type, test, needs_area_m2)
    ('worship', lambda t: t.get('amenity') == 'place_of_worship', 0),
    ('school', lambda t: t.get('amenity') in ('school', 'college'), 0),
    ('univ', lambda t: t.get('amenity') == 'university', 0),
    ('pub', lambda t: t.get('amenity') == 'pub', 0),
    ('po', lambda t: t.get('amenity') == 'post_office', 0),
    ('parking', lambda t: t.get('amenity') == 'parking' and t.get('access', 'yes') in ('yes', 'customers', 'public', 'permissive') and t.get('parking') not in ('underground', 'street_side', 'lane', 'rooftop'), 3000),
    ('hospital', lambda t: t.get('amenity') == 'hospital', 0),
    ('bus', lambda t: t.get('amenity') == 'bus_station', 0),
    ('fire', lambda t: t.get('amenity') == 'fire_station', 0),
    ('police', lambda t: t.get('amenity') == 'police', 0),
    ('station', lambda t: t.get('railway') in ('station', 'halt') and t.get('station') not in ('subway',), 0),
    ('viewpoint', lambda t: t.get('tourism') == 'viewpoint', 0),
    ('museum', lambda t: t.get('tourism') == 'museum', 0),
    ('info', lambda t: t.get('tourism') == 'information' and t.get('information') in ('office', 'visitor_centre'), 0),
    ('picnic', lambda t: t.get('tourism') == 'picnic_site', 0),
    ('golf', lambda t: t.get('leisure') == 'golf_course', 0),
    ('tower', lambda t: t.get('man_made') == 'tower' and t.get('tower:type') not in ('communication', 'cooling', 'lighting'), 0),
    ('antiquity', lambda t: t.get('historic') in ('archaeological_site', 'fort', 'castle'), 0),
    ('trig', lambda t: t.get('man_made') == 'survey_point' and t.get('survey_point:structure') in ('pillar', 'beacon'), 0),
]


def osm_geoms(el):
    """Shapely geometry (lon/lat) of an Overpass element."""
    t = el['type']
    if t == 'node':
        return Point(el['lon'], el['lat'])
    if t == 'way':
        pts = [(p['lon'], p['lat']) for p in el.get('geometry', []) if p]
        if len(pts) < 2:
            return None
        if pts[0] == pts[-1] and len(pts) >= 4:
            return Polygon(pts)
        return LineString(pts)
    if t == 'relation':
        outer, inner = [], []
        for m in el.get('members', []):
            g = m.get('geometry')
            if not g:
                continue
            pts = [(p['lon'], p['lat']) for p in g if p]
            if len(pts) < 2:
                continue
            (inner if m.get('role') == 'inner' else outer).append(LineString(pts))
        if not outer:
            return None
        op = list(polygonize(unary_union(outer)))
        if not op:
            return None
        g = unary_union(op)
        if inner:
            ip = list(polygonize(unary_union(inner)))
            if ip:
                g = g.difference(unary_union(ip))
        return g
    return None


def build_local(spec):
    data = load(spec['raw'] + '.json')['elements']
    e0, n0, e1, n1 = spec['e0'], spec['n0'], spec['e1'], spec['n1']
    pad = 150
    frame = box(e0 - pad, n0 - pad, e1 + pad, n1 + pad)

    def loc(g):
        g = bng_geom(g)
        return shp_transform(lambda xs, ys, zs=None: (tuple(x - e0 for x in xs), tuple(n1 - y for y in ys)), g)

    areas = {k: [] for k, _ in AREA_RULES}
    roads = {}
    rails, rail_dis, rivers, streams, canals, cliffs = [], [], [], [], [], []
    pois, places, names, spots = [], [], [], []
    road_refs = {}
    for el in data:
        tags = el.get('tags', {})
        g = osm_geoms(el)
        if g is None or g.is_empty:
            continue
        try:
            gb = bng_geom(g)
        except Exception:
            continue
        if not gb.intersects(frame):
            continue
        gl = loc(g)
        # areas
        if isinstance(g, (Polygon, MultiPolygon)) and not tags.get('highway'):
            for cls, test in AREA_RULES:
                if test(tags):
                    areas[cls].append(gl)
                    if tags.get('name') and cls in ('water', 'wood', 'park', 'golf') and gb.area > 20000:
                        rp = gl.representative_point()
                        names.append(dict(t=tags['name'], x=round(rp.x), y=round(rp.y), c=cls))
                    break
        # lines
        hw = tags.get('highway')
        if hw in ROAD_CLASS and isinstance(gl, LineString):
            if tags.get('footway') in ('sidewalk', 'crossing') or tags.get('area') == 'yes':
                pass
            elif hw in ('footway', 'cycleway', 'path') and tags.get('designation') is None and tags.get('foot') not in ('designated',) and gb.length < 40:
                pass
            else:
                c = ROAD_CLASS[hw]
                if tags.get('tunnel') == 'yes' and c in ('path', 'street'):
                    continue
                roads.setdefault(c, []).append(gl)
                ref = tags.get('ref')
                if ref and c in ('mway', 'a', 'b'):
                    road_refs.setdefault(ref.split(';')[0], []).append(gl)
        rw = tags.get('railway')
        if rw in ('rail', 'light_rail') and isinstance(gl, LineString) and tags.get('service') not in ('siding', 'yard', 'spur'):
            if tags.get('tunnel') != 'yes':
                rails.append(gl)
        if rw in ('disused', 'abandoned') and isinstance(gl, LineString):
            rail_dis.append(gl)
        ww = tags.get('waterway')
        if isinstance(gl, LineString) and tags.get('tunnel') not in ('culvert', 'yes'):
            if ww == 'river':
                rivers.append(gl)
                if tags.get('name') and gb.length > 600:
                    names.append(dict(t=tags['name'], line=1, g=gl, c='water'))
            elif ww in ('stream', 'drain', 'ditch'):
                streams.append(gl)
            elif ww == 'canal':
                canals.append(gl)
        if tags.get('natural') == 'cliff' and isinstance(gl, LineString):
            cliffs.append(gl)
        # points of interest
        for typ, test, min_area in POI_RULES:
            if test(tags):
                if min_area and (not isinstance(gb, (Polygon, MultiPolygon)) or gb.area < min_area):
                    break
                rp = gl if isinstance(gl, Point) else gl.representative_point()
                if 0 <= rp.x <= e1 - e0 and 0 <= rp.y <= n1 - n0:
                    pois.append(dict(t=typ, x=round(rp.x), y=round(rp.y), n=tags.get('name', ''), area=round(gb.area) if hasattr(gb, 'area') else 0))
                break
        if el['type'] == 'node' and tags.get('natural') == 'peak' and tags.get('ele'):
            try:
                gl2 = loc(g)
                if 0 <= gl2.x <= e1 - e0 and 0 <= gl2.y <= n1 - n0:
                    hgt = round(float(tags['ele'].replace('m', '').strip()))
                    spots.append(dict(x=round(gl2.x), y=round(gl2.y), h=hgt, n=tags.get('name', '')))
                    pois.append(dict(t='peak', x=round(gl2.x), y=round(gl2.y), n=tags.get('name', ''), h=hgt, area=0))
            except ValueError:
                pass
        if el['type'] == 'node' and tags.get('place') in ('suburb', 'village', 'neighbourhood', 'hamlet', 'quarter', 'town') and tags.get('name'):
            gl2 = loc(g)
            if 0 <= gl2.x <= e1 - e0 and 0 <= gl2.y <= n1 - n0:
                places.append(dict(t=tags['name'], x=round(gl2.x), y=round(gl2.y), p=tags['place']))

    W, H = e1 - e0, n1 - n0
    clipbox = box(-pad, -pad, W + pad, H + pad)

    def ad(lst, tol=2.0):
        if not lst:
            return ''
        g = unary_union([x.buffer(0) for x in lst]).intersection(clipbox)
        g = polys_only(g).simplify(tol)
        return geom_d(g, 1)

    def ld(lst, tol=2.0):
        if not lst:
            return ''
        g = merge(lst)
        g = lines_only(g.intersection(clipbox)).simplify(tol)
        return geom_d(g, 1)

    # dedupe pois of the same type within 40 m (e.g. a church node + building)
    keep = []
    for p in sorted(pois, key=lambda p: -len(p['n'])):
        if any(q['t'] == p['t'] and abs(q['x'] - p['x']) < 40 and abs(q['y'] - p['y']) < 40 for q in keep):
            continue
        keep.append(p)
    # thin out crowded symbols so the board stays readable
    SPACING = dict(peak=150, trig=150, pub=350, worship=220, school=160, po=400, parking=300, tower=150, museum=200, viewpoint=250,
                   univ=400, station=150, hospital=300, police=300, fire=300, info=200, picnic=200, golf=400, antiquity=150, bus=200)
    thin = []
    for p in sorted(keep, key=lambda p: (0 if 'Wallscourt' in p['n'] else 1, -bool(p['n']), -p.get('area', 0))):
        sp = SPACING.get(p['t'], 150)
        if any(q['t'] == p['t'] and (q['x'] - p['x']) ** 2 + (q['y'] - p['y']) ** 2 < sp * sp for q in thin):
            continue
        thin.append(p)
    keep = thin
    for p in keep:
        p.pop('area', None)
        if 'Wallscourt Farm' in p['n']:
            p['ours'] = 1

    label_names = []
    for nm in names:
        if nm.get('line'):
            g = nm['g'].intersection(box(0, 0, W, H))
            if g.is_empty or g.length < 300:
                continue
            mid = g.interpolate(0.5, normalized=True)
            label_names.append(dict(t=nm['t'], x=round(mid.x), y=round(mid.y), c=nm['c']))
        else:
            if 0 <= nm['x'] <= W and 0 <= nm['y'] <= H:
                label_names.append({k: v for k, v in nm.items()})
    seen = set()
    label_names = [n for n in label_names if not (n['t'] in seen or seen.add(n['t']))]
    refs = []
    for ref, ls in road_refs.items():
        g = merge(ls).intersection(box(150, 150, W - 150, H - 150))
        if g.is_empty:
            continue
        longest = max([g] if isinstance(g, LineString) else [x for x in getattr(g, 'geoms', []) if isinstance(x, LineString)] or [None], key=lambda x: x.length if x else 0)
        if longest is None or longest.length < 300:
            continue
        mid = longest.interpolate(0.5, normalized=True)
        refs.append(dict(t=ref, x=round(mid.x), y=round(mid.y)))

    contours, clabels = build_contours(spec)
    out = dict(id=spec['id'], name=spec['name'], e0=e0, n0=n0, e1=e1, n1=n1, years=spec['years'], views=spec.get('views', {}),
               sq=spec.get('sq', 'ST'), contours=contours, clabels=clabels, spots=spots, ci=spec.get('contour', 10),
               areas={k: ad(v) for k, v in areas.items() if v},
               roads={k: ld(v, 2.5) for k, v in roads.items()},
               rail=ld(rails), raildis=ld(rail_dis), river=ld(rivers), stream=ld(streams), canal=ld(canals), cliff=ld(cliffs),
               pois=keep, places=places, names=label_names, refs=refs)
    return out


def load_terrain(e0, n0, e1, n1):
    """Heights (OS Terrain 50, 50 m grid) covering the box, as (xs, ys, z) in BNG metres."""
    import numpy as np
    letters = {(3, 1): 'ST', (3, 2): 'SO', (2, 1): 'SS', (2, 2): 'SN', (4, 1): 'SU', (4, 2): 'SP'}
    E0, N0 = (e0 // 10000) * 10000, (n0 // 10000) * 10000
    E1, N1 = -(-e1 // 10000) * 10000, -(-n1 // 10000) * 10000
    nx, ny = (E1 - E0) // 50, (N1 - N0) // 50
    Z = np.full((ny, nx), np.nan)
    for te in range(E0, E1, 10000):
        for tn in range(N0, N1, 10000):
            name = f"{letters[(te // 100000, tn // 100000)]}{(te % 100000) // 10000}{(tn % 100000) // 10000}"
            path = os.path.join(RAW, 'terr50', name + '.asc')
            if not os.path.exists(path):
                continue
            lines = open(path).read().split('\n')
            hdr = {l.split()[0].lower(): float(l.split()[1]) for l in lines[:5]}
            arr = np.array([[float(v) for v in l.split()] for l in lines[5:] if l.strip()])
            r, c = arr.shape
            ox, oy = int((hdr['xllcorner'] - E0) // 50), int((hdr['yllcorner'] - N0) // 50)
            Z[oy:oy + r, ox:ox + c] = arr[::-1]          # row 0 = south
    xs = E0 + 25 + 50 * np.arange(nx)
    ys = N0 + 25 + 50 * np.arange(ny)
    return xs, ys, Z


def build_contours(spec):
    import numpy as np, contourpy
    e0, n0, e1, n1, ci = spec['e0'], spec['n0'], spec['e1'], spec['n1'], spec.get('contour', 10)
    xs, ys, Z = load_terrain(e0 - 500, n0 - 500, e1 + 500, n1 + 500)
    if np.isnan(Z).all():
        return [], []
    gen = contourpy.contour_generator(xs, ys, Z)
    W, H = e1 - e0, n1 - n0
    frame = box(0, 0, W, H)
    out, labels = [], []
    lo, hi = int(np.nanmin(Z) // ci + 1) * ci, int(np.nanmax(Z) // ci) * ci
    for h in range(lo, hi + 1, ci):
        lines = [LineString([(x - e0, n1 - y) for x, y in seg]) for seg in gen.lines(h) if len(seg) > 2]
        if not lines:
            continue
        g = lines_only(unary_union(lines).intersection(frame)).simplify(4)
        if g.is_empty:
            continue
        idx = h % 50 == 0
        out.append(dict(h=h, i=1 if idx else 0, d=geom_d(g, 1)))
        if idx:                                    # label index contours every ~1.5 km along the line
            for ln in ([g] if isinstance(g, LineString) else list(g.geoms)):
                L = ln.length
                for k in range(int(L // 1500) + (1 if L > 500 else 0)):
                    t = (k + .5) * L / (int(L // 1500) + 1) if L > 1500 else L / 2
                    p, q = ln.interpolate(max(0, t - 30)), ln.interpolate(min(L, t + 30))
                    a = math.degrees(math.atan2(q.y - p.y, q.x - p.x))
                    if a > 90: a -= 180
                    if a < -90: a += 180
                    m = ln.interpolate(t)
                    if 120 < m.x < W - 120 and 120 < m.y < H - 120:
                        labels.append(dict(x=round(m.x), y=round(m.y), a=round(a), h=h))
    return out, labels


def build_timezones():
    zones = []
    for f in load('ne_10m_time_zones.geojson')['features']:
        p = f['properties']
        g = rob_geom(shape(f['geometry'])).simplify(1.2, preserve_topology=True)
        if g.is_empty or g.area < 1:
            continue
        zones.append(dict(z=p['zone'], d=geom_d(g, 1)))
    return zones


def main():
    data = dict(world=build_world(), uk=build_uk(), items=[item_geo(i) for i in ITEMS], tz=build_timezones(),
                local=[build_local(s) for s in LOCAL_MAPS])
    js = '/* Generated by build/build_data.py. Do not edit by hand. */\nwindow.MAP_DATA=' + json.dumps(data, separators=(',', ':')) + ';\n'
    open(OUT, 'w').write(js)
    print('wrote', OUT, len(js) // 1024, 'KB')
    print('world parts', len(data['world']['parts']), 'uk counties', len(data['uk']['counties']))
    for l in data['local']:
        from collections import Counter
        print(l['id'], Counter(p['t'] for p in l['pois']), 'places', len(l['places']), 'names', len(l['names']), 'refs', [r['t'] for r in l['refs']])


if __name__ == '__main__':
    main()
