# Map Explorer — data build

The app (`../index.html`, `../app.js`, `../app.css`) reads `../map-data.js`, which is generated here.
Places, facts and year groups are in `content.py` (from the CLF Geographers curriculum, July 2026).

To change a fact or add a place: edit `content.py`, then rebuild.

```
python3 -m venv /tmp/mapvenv && /tmp/mapvenv/bin/pip install shapely pyproj
/tmp/mapvenv/bin/python fetch_raw.py /tmp/map-raw        # downloads ~35 MB (only needed once)
/tmp/mapvenv/bin/python build_data.py /tmp/map-raw ../map-data.js
```

Then bump `VERSION` in `../app.js` and the `?v=` in `../index.html`.

Map data: Natural Earth (public domain); ONS boundaries (OGL, contains OS data © Crown copyright);
© OpenStreetMap contributors (ODbL). The local maps are drawn in the style of an Ordnance Survey
map; they are not OS maps, but use the real British National Grid, so grid references match.
