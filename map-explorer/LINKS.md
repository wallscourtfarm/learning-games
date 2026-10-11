# Map Explorer links

Base address: `https://games.wallscourt-farm-academy.co.uk/map-explorer/`

Add options after a `?`, joined with `&`. A link opens the same view on every device (handy as a QR code on a slide).
Teachers can also make a link from what is on screen: **Settings → Link to this exact view → Copy link**.

## Options

| Option | Values | What it does |
|---|---|---|
| `preset` | `locations` | Year 5 Locations setup: Year 5 only (no earlier years), the six biomes, nearest-degree latitude and longitude, latitude/longitude lines, Equator, tropics and polar circles |
| `year` | `1`–`6`, `all` | Year group |
| `mode` | `explore`, `find`, `os`, `compass`, `latlong` | Activity tab |
| `task` | with `mode=os`: `give`, `find`, `symbols`, `far`, `high` · with `mode=latlong`: `read`, `plot`, `mycity`, `time`, `size` | Activity inside the tab |
| `map` | `world`, `uk`, `wfa` (school area), `gorge` (Clifton and city centre), `penyfan`, `london` | Map |
| `proj` | `gallpeters` (default), `mercator`, `globe`, `grid` | World map projection. `grid` = equal degrees of latitude and longitude (plate carrée), as used in the Locations lessons for compass directions |
| `layers` | comma list: `grid` (latitude/longitude lines), `lines` (Equator, tropics, polar circles), `zones` (climate zones), `biomes`, `timezones`, `plates`, `colour`, `names`, `places`, `counties`, `regions`, `rivers`, `contours`, `symbols` | Turn layers on |
| `hide` | same names as `layers` | Turn layers off |
| `biomes6` | `1` / `0` | Just the six biomes taught in Year 5 (rainforest, savanna, desert, temperate forest, grassland, tundra; ice sheets stay as ice) |
| `round` | `1` or `10` | Latitude and longitude quiz: nearest degree or nearest 10° |
| `level` | `4` or `6` | OS grid references |
| `tenths` | `all`, `lines`, `none` | 100 m lines and 0–9 numbers; `none` = estimate, like a real OS map (answers within one tenth count) |
| `count` | number, `0` = no limit | Questions in a set |
| `labels` | `big` | Larger labels on the map for the board |
| `place` | a place name, e.g. `Nairobi`, `Gloucestershire`, `Stoke Gifford` | Opens Explore centred on that place with its card (uses the search) |
| `city` | with `task=mycity`: `London`, `Moscow`, `Mumbai`, `New York`, `Paris`, `Rio de Janeiro`, `Singapore`, `Sydney`, `Tokyo`, `Nairobi` | Opens the city check on that city |
| `view` | `x,y,zoom` (made by "Copy link") | Exact map position |

## Ready-made links for the Year 5 Locations enquiry

- L1 continents and true size: `?preset=locations&mode=latlong&task=size` · `?preset=locations&mode=find`
- L2 compass points: `?preset=locations&mode=compass&proj=grid`
- L3 latitude: `?preset=locations&mode=explore&layers=grid,lines`
- L4 longitude and coordinates: `?preset=locations&mode=latlong&task=read&round=1` · `?preset=locations&mode=latlong&task=plot&round=1`
- L5 climate zones and biomes: `?preset=locations&mode=explore&layers=zones` · `?preset=locations&mode=explore&layers=biomes&biomes6=1`
- L6 six-figure grid references: `?year=5&mode=os&map=wfa&task=give&level=6` · estimating: `…&tenths=none`
- L7 real places near school: `?year=5&mode=explore&map=wfa` (Beaufort Grange, UWE Exhibition and Conference Centre, The Plaza and Bristol Robotics Laboratory are named stars) · city centre: `?year=5&mode=explore&map=gorge&place=Queen Square`
- L8–L10 city check: `?preset=locations&mode=latlong&task=mycity&proj=grid&city=Mumbai`

## Rules the city check uses (match the lessons)

Coordinates rounded to the nearest degree. Direction measured from Bristol (51.45°N, 2.58°W) on an equal-degree map, 8 compass points; within 8° of halfway between two points, both are accepted ("close to halfway, so east is fine too"). Climate zone: tropical up to 23° (23° counts as tropical), temperate over 23° to 66°, polar over 66°. Biome from RESOLVE Ecoregions 2017, folded into the six taught biomes.

Checked 11.10.26 against the enquiry's table: all ten cities agree on coordinates, zone, direction and the near-halfway flag.

Things the enquiry may want to change:
- **Mumbai's biome**: the biome data puts Mumbai in tropical moist forest (shown as rainforest), not savanna. The rest of the cards agree.
- **The Plaza**: OpenStreetMap's outline gives ST 618 780 (the enquiry has 619 780; it is on the edge of two squares).
- WFA is ST 614 777, as in the enquiry. Happy Days Nursery is not in OpenStreetMap, so it is not on the map.
