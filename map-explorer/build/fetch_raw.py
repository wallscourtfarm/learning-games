"""Download the raw map data that build_data.py needs (about 35 MB, not kept in the repo).

    python fetch_raw.py /path/to/raw

Sources (all free to use; credited in the app):
  Natural Earth (public domain) - world countries, lakes, capital cities
  ONS Open Geography Portal (Open Government Licence) - UK countries, English regions, counties
  OpenStreetMap via the Overpass API (ODbL) - rivers and the two local OS-style maps
"""
import json, os, sys, time, urllib.parse, urllib.request

sys.path.insert(0, os.path.dirname(__file__))
from content import LOCAL_MAPS
from pyproj import Transformer

RAW = sys.argv[1]
os.makedirs(RAW, exist_ok=True)
UA = {'User-Agent': 'WFA-map-explorer/1.0'}


def get(url, path, data=None):
    req = urllib.request.Request(url, data=data, headers=UA)
    body = urllib.request.urlopen(req, timeout=400).read()
    open(os.path.join(RAW, path), 'wb').write(body)
    print(path, len(body))
    return body


NE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/'
for f in ['ne_50m_admin_0_countries', 'ne_50m_populated_places_simple', 'ne_50m_lakes']:
    get(NE + f + '.geojson', f + '.geojson')

ONS = 'https://services1.arcgis.com/ESMARspQHYMw9BZ9/arcgis/rest/services/'
for n in ['Countries_December_2023_Boundaries_UK_BUC', 'Regions_December_2023_Boundaries_EN_BUC',
          'Counties_and_Unitary_Authorities_December_2023_Boundaries_UK_BUC']:
    get(ONS + n + '/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=27700&f=geojson', n + '.geojson')

OVERPASS = 'https://overpass-api.de/api/interpreter'


def overpass(q, path):
    body = get(OVERPASS, path, urllib.parse.urlencode({'data': q}).encode())
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
nwr[historic](BB);nwr[man_made~"^(tower|bridge|water_tower|mast)$"](BB);
nwr[shop~"^(supermarket|mall)$"](BB);
node[place~"^(suburb|village|neighbourhood|hamlet|quarter|town|city)$"](BB);
);out tags geom;'''
to_ll = Transformer.from_crs(27700, 4326, always_xy=True)
for spec in LOCAL_MAPS:
    pts = [to_ll.transform(e, n) for e in (spec['e0'], spec['e1']) for n in (spec['n0'], spec['n1'])]
    bb = f"{min(p[1] for p in pts) - .003:.4f},{min(p[0] for p in pts) - .004:.4f},{max(p[1] for p in pts) + .003:.4f},{max(p[0] for p in pts) + .004:.4f}"
    overpass(LOCAL_Q.replace('BB', bb), spec['raw'] + '.json')
