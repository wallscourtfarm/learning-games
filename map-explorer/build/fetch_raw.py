"""Download the raw map data that build_data.py needs (about 200 MB, not kept in the repo).

    python fetch_raw.py /path/to/raw                 # everything
    python fetch_raw.py /path/to/raw local penyfan   # just one part (world, uk, rivers, local [ids], terrain)

Sources (all free to use; credited in the app):
  Natural Earth (public domain) - world countries, lakes, capital cities, time zones
  Biomes: RESOLVE Ecoregions 2017 (CC-BY 4.0)
  Tectonic plate boundaries: Bird (2002), github.com/fraxen/tectonicplates (ODC-BY)
  Flags (../flags): flag-icons, MIT licence (downloaded separately, see flags/LICENSE.txt)
  ONS Open Geography Portal (Open Government Licence) - UK countries, English regions, counties
  OS Terrain 50 (OS OpenData, Open Government Licence) - heights for contour lines
  OpenStreetMap via the Overpass API (ODbL) - rivers and the local OS-style maps
"""
import io, json, os, sys, time, urllib.parse, urllib.request, zipfile

sys.path.insert(0, os.path.dirname(__file__))
from content import LOCAL_MAPS
from pyproj import Transformer

RAW = sys.argv[1]
os.makedirs(RAW, exist_ok=True)
UA = {'User-Agent': 'WFA-map-explorer/1.0'}


def get(url, path=None, data=None):
    req = urllib.request.Request(url, data=data, headers=UA)
    body = urllib.request.urlopen(req, timeout=900).read()
    if path:
        open(os.path.join(RAW, path), 'wb').write(body)
        print(path, len(body))
    return body


def fetch_world():
    ne = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/'
    for f in ['ne_50m_admin_0_countries', 'ne_50m_populated_places_simple', 'ne_10m_populated_places_simple', 'ne_50m_lakes', 'ne_10m_time_zones']:
        get(ne + f + '.geojson', f + '.geojson')
    get('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json', 'PB2002_boundaries.json')
    # biomes: RESOLVE Ecoregions 2017 (CC-BY 4.0), about 150 MB
    zipfile.ZipFile(io.BytesIO(get('https://storage.googleapis.com/teow2016/Ecoregions2017.zip'))).extractall(os.path.join(RAW, 'eco'))


def fetch_uk():
    ons = 'https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/'
    for n in ['Countries_December_2023_Boundaries_UK_BUC', 'Regions_December_2023_Boundaries_EN_BUC',
              'Counties_and_Unitary_Authorities_December_2023_Boundaries_UK_BUC']:
        get(ons + n + '/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=27700&f=geojson', n + '.geojson')


def overpass(q, path):
    body = get('https://overpass-api.de/api/interpreter', path, urllib.parse.urlencode({'data': q}).encode())
    time.sleep(20)          # be kind to the shared server
    return body


# rivers named in the curriculum (bounding boxes pick the right river where names repeat)
RIVERS = {'avon': ('River Avon', 'river', '51.30,-2.75,51.65,-1.90'),
          'parrett': ('River Parrett', 'river', '50.85,-3.20,51.25,-2.60'),
          'tone': ('River Tone', 'river', '50.95,-3.50,51.10,-2.90'),
          'severn': ('River Severn', 'river', '51.40,-3.80,52.70,-2.00'),
          'thames': ('River Thames', 'river', '51.40,-2.10,51.80,0.80'),
          'trent': ('River Trent', 'river', '52.60,-2.30,53.75,-0.60'),
          'mersey': ('River Mersey', 'river', '53.25,-3.10,53.50,-2.00'),
          'ouse': ('River Ouse', 'river', '53.65,-1.40,54.10,-0.70'),
          'tyne': ('River Tyne', 'river', '54.85,-2.30,55.05,-1.40'),
          'guc': ('Grand Union Canal', 'canal', '51.45,-2.00,52.70,-0.20')}


def fetch_towns():
    """UK towns and cities (OpenStreetMap), fetched in tiles because the server times out on the whole UK."""
    tiles = [(49.8, -8.3, 53.0, -2.0), (49.8, -2.0, 53.0, 1.8), (53.0, -8.3, 56.0, -2.0), (53.0, -2.0, 56.0, 1.8), (56.0, -8.3, 60.9, 1.8)]
    els = {}
    for t in tiles:
        q = f'[out:json][timeout:120];node[place~"^(city|town)$"]({t[0]},{t[1]},{t[2]},{t[3]});out;'
        for attempt in range(5):
            try:
                for e in json.loads(overpass(q, None))['elements']:
                    els[e['id']] = e
                break
            except Exception as ex:
                print('retry', t, ex); time.sleep(30)
    json.dump({'elements': list(els.values())}, open(os.path.join(RAW, 'uk_towns.json'), 'w'))


def fetch_rivers():
    body = ''.join(f'way[waterway="{w}"][name="{n}"]({bb});' for n, w, bb in RIVERS.values())
    d = json.loads(overpass(f'[out:json][timeout:300];({body});out tags geom;', 'rivers_raw.json'))
    out = {k: [] for k in RIVERS}
    for e in d['elements']:
        g = [[p['lon'], p['lat']] for p in e['geometry']]
        for k, (n, w, bb) in RIVERS.items():
            s, wl, nn, el = map(float, bb.split(','))
            if e['tags'].get('name') == n and e['tags'].get('waterway') == w and any(s <= y <= nn and wl <= x <= el for x, y in g):
                out[k].append(g)
    json.dump(out, open(os.path.join(RAW, 'rivers.json'), 'w'))


LOCAL_Q = '''[out:json][timeout:180];(
way[highway~"^(motorway|trunk|primary|secondary|tertiary|unclassified|residential|motorway_link|trunk_link|primary_link|secondary_link|tertiary_link|living_street|pedestrian|footway|path|bridleway|cycleway|track|service)$"](BB);
way[railway~"^(rail|light_rail|disused|abandoned)$"](BB);
way[waterway~"^(river|stream|canal|drain|ditch|tidal_channel)$"](BB);
nwr[natural~"^(water|wood|scrub|heath|grassland|cliff|bare_rock|wetland|coastline|mud|peak)$"](BB);
nwr[landuse~"^(residential|retail|commercial|industrial|forest|grass|meadow|farmland|allotments|cemetery|recreation_ground|construction|railway|brownfield|greenfield|village_green|orchard)$"](BB);
nwr[leisure~"^(park|golf_course|pitch|nature_reserve|playground|sports_centre|stadium|garden|common)$"](BB);
nwr[amenity~"^(place_of_worship|school|college|university|pub|parking|hospital|post_office|bus_station|fire_station|police|library|community_centre|townhall|telephone|grave_yard)$"](BB);
nwr[railway~"^(station|halt)$"](BB);
nwr[tourism~"^(viewpoint|museum|attraction|information|picnic_site|camp_site|zoo)$"](BB);
nwr[historic](BB);nwr[man_made~"^(tower|bridge|water_tower|mast|survey_point)$"](BB);
nwr[shop~"^(supermarket|mall)$"](BB);
node[place~"^(suburb|village|neighbourhood|hamlet|quarter|town|city)$"](BB);
);out tags geom;'''


def fetch_local(ids):
    to_ll = Transformer.from_crs(27700, 4326, always_xy=True)
    for spec in LOCAL_MAPS:
        if ids and spec['id'] not in ids:
            continue
        pts = [to_ll.transform(e, n) for e in (spec['e0'], spec['e1']) for n in (spec['n0'], spec['n1'])]
        bb = f"{min(p[1] for p in pts) - .003:.4f},{min(p[0] for p in pts) - .004:.4f},{max(p[1] for p in pts) + .003:.4f},{max(p[0] for p in pts) + .004:.4f}"
        overpass(LOCAL_Q.replace('BB', bb), spec['raw'] + '.json')


def terrain_tiles():
    """OS 10 km tile names (e.g. 'st57') covering each local map."""
    letters = {(3, 1): 'st', (3, 2): 'so', (2, 1): 'ss', (2, 2): 'sn', (4, 1): 'su', (4, 2): 'sp', (5, 1): 'tq', (5, 2): 'tl'}
    need = set()
    for spec in LOCAL_MAPS:
        for e in range(spec['e0'] - 1000, spec['e1'] + 1000, 1000):
            for n in range(spec['n0'] - 1000, spec['n1'] + 1000, 1000):
                sq = letters[(e // 100000, n // 100000)]
                need.add(f'{sq}{(e % 100000) // 10000}{(n % 100000) // 10000}')
    return sorted(need)


def fetch_terrain():
    url = 'https://api.os.uk/downloads/v1/products/Terrain50/downloads?area=GB&format=ASCII+Grid+and+GML+%28Grid%29&redirect'
    big = zipfile.ZipFile(io.BytesIO(get(url)))
    out = os.path.join(RAW, 'terr50'); os.makedirs(out, exist_ok=True)
    for t in terrain_tiles():
        name = next(n for n in big.namelist() if f'/{t}_OST50GRID_' in n)
        inner = zipfile.ZipFile(io.BytesIO(big.read(name)))
        for n in inner.namelist():
            if n.lower().endswith('.asc'):
                open(os.path.join(out, os.path.basename(n).upper().replace('.ASC', '.asc')), 'wb').write(inner.read(n))
                print('terrain', n)


if __name__ == '__main__':
    parts = sys.argv[2:] or ['world', 'uk', 'rivers', 'towns', 'local', 'terrain']
    if 'world' in parts: fetch_world()
    if 'uk' in parts: fetch_uk()
    if 'rivers' in parts: fetch_rivers()
    if 'towns' in parts: fetch_towns()
    if 'local' in parts: fetch_local([p for p in parts if p not in ('world', 'uk', 'rivers', 'towns', 'local', 'terrain')])
    if 'terrain' in parts: fetch_terrain()
