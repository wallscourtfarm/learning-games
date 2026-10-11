# Map Explorer links

This file is the agreement between Map Explorer and anything that links to it (the enquiry builder's slides and
papers). File: `~/projects/learning-games/map-explorer/LINKS.md` (repo `wallscourtfarm/learning-games`).
Works from version **11.10.26a** onwards (the version is shown bottom right of the map). Use only the option
names below; if a lesson needs something that is not here, ask Innes for it to be added rather than guessing.

Base address: `https://games.wallscourt-farm-academy.co.uk/map-explorer/`

Add options after a `?`, joined with `&`. A link opens the same view on every device (handy as a QR code on a slide).
Teachers can also make a link from what is on screen: **Settings → Link to this exact view → Copy link**.

## How to use these links (read before generating any)

1. **Encode spaces and accents.** `New York` must be `New%20York`, `Queen Square` must be `Queen%20Square`.
   In Python build links with `urllib.parse.urlencode({...}, quote_via=urllib.parse.quote)`; commas in
   `layers=` may stay as commas.
2. **Every link starts from the same clean view** (default layers, nearest 10°, 10 questions, tenths shown…)
   and then applies only what it asks for, so it looks the same on every device whatever was used before.
   Without `map=` it opens the world map (or the WFA OS map when `mode=os`). The link's settings are then
   saved on that device until someone changes them. `preset=locations` sets Year 5 with earlier years off.
3. **How options combine.** `place=` always opens **Explore** (it is a "show me this place" link) and overrides
   `mode=`. `city=` only works with `mode=latlong&task=mycity`. `proj=` only affects the world map. `task=`
   must belong to the `mode=` it is used with. Unknown options and values are ignored, so a typo fails quietly:
   always open the link once to check.
4. **`view=` numbers** are map positions made by Copy link. Do not write them by hand; use `place=` instead.
5. **Clickable links, not QR codes** (Innes's choice for the enquiry slides). Put the finished, encoded link
   behind slide text such as "Try it on the map".
6. **Check every link before it goes on a printed slide or paper**: open it on a laptop and an iPad and check
   the view matches the slide.
7. **Children's words**: the tool says "quiz" and "practice", never "test". Slide wording beside a QR code
   should do the same, e.g. "Try it on the map".
8. **What the child sees** depends on the link: Explore links show a card about the place; quiz links start a
   set of 10 questions (change with `count=`); the city check waits for the child to pick a city unless
   `city=` is given.

## Stable names

Every option name and value on this page is fixed from version 11.10.26a: they will not be renamed or removed,
because enquiry slides link to them. New options may be added. The links the Locations enquiry publishes:
`preset=locations` with `mode=latlong&task=size`, `mode=compass&proj=grid`, `mode=explore&layers=grid,lines`,
`mode=latlong&task=read&round=1`, `mode=latlong&task=plot&round=1`, `mode=explore&layers=zones`,
`mode=explore&layers=biomes&biomes6=1`, `mode=latlong&task=mycity&proj=grid` (with or without `city=`);
and `year=5&mode=os&map=wfa&task=give&level=6`, `year=5&mode=os&map=wfa&task=find&level=6`, `year=5&mode=explore&map=wfa`.

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
| `rose` | `on` (default), `off` | Compass quiz answers as a compass, or as a mixed-up list so children picture the compass (added 11.10.26l) |
| `place` | a place name, e.g. `Nairobi`, `Gloucestershire`, `Stoke Gifford` | Opens Explore centred on that place with its card (uses the search) |
| `city` | with `task=mycity`: `Cairo`, `London`, `Moscow`, `New York`, `Paris`, `Rio de Janeiro`, `Singapore`, `Sydney`, `Tokyo`, `Nairobi` (worked example) | Opens the city check on that city (Mumbai is an ordinary place, not in the check) |
| `view` | `x,y,zoom` (made by "Copy link") | Exact map position |

## Ready-made links for the Year 5 Locations enquiry

- L1 continents and true size: `?preset=locations&mode=latlong&task=size` · `?preset=locations&mode=find`
- L2 compass points: `?preset=locations&mode=compass&proj=grid`
- L3 latitude: `?preset=locations&mode=explore&layers=grid,lines`
- L4 longitude and coordinates: `?preset=locations&mode=latlong&task=read&round=1` · `?preset=locations&mode=latlong&task=plot&round=1`
- L5 climate zones and biomes: `?preset=locations&mode=explore&layers=zones` · `?preset=locations&mode=explore&layers=biomes&biomes6=1`
- L6 six-figure grid references: `?year=5&mode=os&map=wfa&task=give&level=6` · find a reference: `?year=5&mode=os&map=wfa&task=find&level=6` · estimating: add `&tenths=none`
- L7 real places near school: `?year=5&mode=explore&map=wfa` (Beaufort Grange, UWE Exhibition and Conference Centre, The Plaza and Bristol Robotics Laboratory are named stars) · city centre: `?year=5&mode=explore&map=gorge&place=Queen%20Square`
- L8–L10 city check: `?preset=locations&mode=latlong&task=mycity&proj=grid` (child picks) or with `&city=Cairo`, `&city=New%20York`, `&city=Rio%20de%20Janeiro`

Full example, ready to paste:
`https://games.wallscourt-farm-academy.co.uk/map-explorer/?preset=locations&mode=latlong&task=mycity&proj=grid&city=Rio%20de%20Janeiro`

Tested on 11.10.26 (computer, not yet iPad): every example link on this page was opened and checked
(mode, task, map, projection, layers and the first question), plus the city check for all ten cities.
Still open each link on an iPad before printing (rule 6).

## Rules the city check uses (match the lessons)

Coordinates rounded to the nearest degree. Direction measured from Bristol (51.45°N, 2.58°W) on an equal-degree map, 8 compass points; within 8° of halfway between two points, both are accepted ("close to halfway, so east is fine too"). Climate zone: tropical up to 23° (23° counts as tropical), temperate over 23° to 66°, polar over 66°. Biome: the one taught for each city (Singapore and Rio rainforest, Nairobi savanna, Cairo hot desert, the rest temperate forest). These agree with the RESOLVE Ecoregions biome data at each city, except Cairo, whose exact point is in the Nile strip.

Checked 11.10.26 against the enquiry's table: all ten cities (Cairo, London, Moscow, New York, Paris, Rio de Janeiro, Singapore, Sydney, Tokyo, Nairobi) agree on coordinates, hemispheres, zone, direction, near-halfway flag and biome.

Notes for the enquiry:
- **The Plaza**: OpenStreetMap's outline gives ST 618 780 (the enquiry has 619 780; it is on the edge of two squares).
- WFA is ST 614 777, as in the enquiry. Happy Days Nursery is not in OpenStreetMap, so it is not on the map.
