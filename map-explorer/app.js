/* Map Explorer — Wallscourt Farm Academy
 * World, UK and OS-style local maps for Years 1-6 geography.
 * Content and year groups follow the CLF Geographers curriculum (July 2026).
 * Data: map-data.js (built by build/build_data.py). No pupil data is stored.
 */
'use strict';
const VERSION = '10.10.26r';
const D = window.MAP_DATA;
const NS = 'http://www.w3.org/2000/svg';
const $ = s => document.querySelector(s);

/* ------------------------------------------------------------ settings */
const STORE = 'wfa_map_explorer_v1';
const DEFAULTS = {
  year: null, map: 'world', mode: 'explore', revision: true, autoZoom: true, count: 10, big: false,
  teams: 0, scores: [0, 0, 0, 0, 0, 0], gridLevel: 0, gridTask: 'give', globeTask: 'read', panelOpen: true,
  layers: {
    world: { names: true, colour: true, lines: true, grid: false, markers: true, tz: false, climate: false, plates: false, biomes: false },
    uk: { names: true, regions: false, counties: false, rivers: true, markers: true },
    local: { names: true, symbols: true, contours: true, tenths: true, tenthNums: true, hide: [] },
  },
};
let S = (() => {
  try {
    const s = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (s) { const L = s.layers || {}; return Object.assign({}, DEFAULTS, s, { layers: { world: Object.assign({}, DEFAULTS.layers.world, L.world), uk: Object.assign({}, DEFAULTS.layers.uk, L.uk), local: Object.assign({}, DEFAULTS.layers.local, L.local) } }); }
  } catch (e) { /* storage blocked */ }
  return JSON.parse(JSON.stringify(DEFAULTS));
})();
function save() { try { localStorage.setItem(STORE, JSON.stringify(S)); } catch (e) { /* ignore */ } }
const yr = () => S.year || 0;                      // 0 = all years
const fourPoint = () => yr() === 1 || yr() === 2;
const gridLevel = () => S.gridLevel || (yr() === 3 ? 4 : 6);

/* ------------------------------------------------------------ helpers */
function E(tag, attrs, parent) {
  const n = document.createElementNS(NS, tag);
  if (attrs) for (const k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(n);
  return n;
}
function H(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function cs(parent, x, y, cls) {           // a group that stays the same size on screen
  const g = E('g', { class: 'cs ' + (cls || '') }, parent);
  g.style.transform = `translate(${x}px,${y}px) scale(var(--k))`;
  return g;
}
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }
const pick = a => a[Math.random() * a.length | 0];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function toast(msg, ms = 2200) {
  const t = $('#toast'); t.textContent = msg; t.hidden = false;
  clearTimeout(toast.t); toast.t = setTimeout(() => { t.hidden = true; }, ms);
}
function parsePath(d) {                     // our compact "M x y l dx dy ..." paths -> polylines
  const out = []; let cur = null, cmd = '', x = 0, y = 0, nums = [];
  const toks = d.match(/[Mlz]|-?\d+(?:\.\d+)?/g) || [];
  for (const t of toks) {
    if (t === 'M' || t === 'l' || t === 'z') {
      if (t === 'z' && cur && cur.length) cur.push(cur[0]);
      cmd = t; nums = []; continue;
    }
    nums.push(+t);
    if (nums.length === 2) {
      if (cmd === 'M') { x = nums[0]; y = nums[1]; cur = [[x, y]]; out.push(cur); cmd = 'l'; }
      else { x += nums[0]; y += nums[1]; cur.push([x, y]); }
      nums = [];
    }
  }
  return out;
}
function nearestOnLines(lines, p) {
  let best = null, bd = Infinity;
  for (const L of lines) for (let i = 0; i < L.length - 1; i++) {
    const [ax, ay] = L[i], [bx, by] = L[i + 1];
    const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
    const t = l2 ? clamp(((p.x - ax) * dx + (p.y - ay) * dy) / l2, 0, 1) : 0;
    const qx = ax + t * dx, qy = ay + t * dy, d = Math.hypot(p.x - qx, p.y - qy);
    if (d < bd) { bd = d; best = { x: qx, y: qy, d }; }
  }
  if (!best && lines[0] && lines[0][0]) best = { x: lines[0][0][0], y: lines[0][0][1], d: Math.hypot(p.x - lines[0][0][0], p.y - lines[0][0][1]) };
  return best;
}
const DIR8 = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'];
const DIR8S = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
function bearing(a, b) { return (Math.atan2(b.x - a.x, -(b.y - a.y)) * 180 / Math.PI + 360) % 360; }
function dirName(a, b, four) {
  const br = bearing(a, b);
  if (four) return DIR8[(Math.round(br / 90) % 4) * 2];
  return DIR8[Math.round(br / 45) % 8];
}

/* ------------------------------------------------------------ world map projections */
// Gall-Peters (default, matches the build): equal-area, so every country is shown at its true size.
// Mercator (switchable): the map children usually see online and on many wall maps; it makes
// places near the poles look far too big. Functions keep their old names, rob/robInv.
const WR = D.world.R, WW = D.world.w, GH = D.world.h, C45 = Math.cos(Math.PI / 4);
const MR = WW / (2 * Math.PI), MLAT = 84, MH = 2 * MR * Math.log(Math.tan(Math.PI / 4 + MLAT * Math.PI / 360));
let PROJ = 'gp', WH = GH;
function gpF(lon, lat) { return { x: WW / 2 + WR * lon * Math.PI / 180 * C45, y: GH / 2 - WR * Math.sin(clamp(lat, -90, 90) * Math.PI / 180) / C45 }; }
function gpInv(x, y) {
  const s = (GH / 2 - y) * C45 / WR, lon = (x - WW / 2) / (WR * C45) * 180 / Math.PI;
  if (Math.abs(s) > 1 || Math.abs(lon) > 180) return null;
  return { lat: Math.asin(s) * 180 / Math.PI, lon };
}
function mcF(lon, lat) { const f = clamp(lat, -MLAT, MLAT) * Math.PI / 180; return { x: WW / 2 + MR * lon * Math.PI / 180, y: MH / 2 - MR * Math.log(Math.tan(Math.PI / 4 + f / 2)) }; }
function mcInv(x, y) {
  const lon = (x - WW / 2) / MR * 180 / Math.PI, lat = (2 * Math.atan(Math.exp((MH / 2 - y) / MR)) - Math.PI / 2) * 180 / Math.PI;
  if (Math.abs(lon) > 180 || Math.abs(lat) > MLAT + .01) return null;
  return { lat, lon };
}
// Globe: an orthographic view of the Earth that can be spun by dragging. GLOBE is the point at the centre.
const GLOBE = { lon: 0, lat: 20 }, GR = 2000, GC = 2060, GS = 4120, RAD = Math.PI / 180;
function orthoF(lon, lat) {
  const l = (lon - GLOBE.lon) * RAD, p = lat * RAD, p0 = GLOBE.lat * RAD;
  const cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
  let x = GR * Math.cos(p) * Math.sin(l), y = GR * (Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l));
  if (cosc < 0) { const d = Math.hypot(x, y) || 1; x = x / d * GR; y = y / d * GR; }     // far side: pin to the edge
  return { x: GC + x, y: GC - y, back: cosc < 0 };
}
function orthoInv(X, Y) {
  const x = X - GC, y = GC - Y, rho = Math.hypot(x, y);
  if (rho > GR) return null;
  if (rho < 1e-9) return { lat: GLOBE.lat, lon: GLOBE.lon };
  const c = Math.asin(rho / GR), p0 = GLOBE.lat * RAD;
  const lat = Math.asin(Math.cos(c) * Math.sin(p0) + y * Math.sin(c) * Math.cos(p0) / rho) / RAD;
  const lon = GLOBE.lon + Math.atan2(x * Math.sin(c), rho * Math.cos(c) * Math.cos(p0) - y * Math.sin(c) * Math.sin(p0)) / RAD;
  return { lat, lon: ((lon + 540) % 360) - 180 };
}
function rob(lon, lat) { return PROJ === 'globe' ? orthoF(lon, lat) : PROJ === 'merc' ? mcF(lon, lat) : gpF(lon, lat); }
function robInv(x, y) { return PROJ === 'globe' ? orthoInv(x, y) : PROJ === 'merc' ? mcInv(x, y) : gpInv(x, y); }
const onFront = (lon, lat) => PROJ !== 'globe' || !orthoF(lon, lat).back;
const gpToLL = (x, y) => { const sn = clamp((GH / 2 - y) * C45 / WR, -1, 1); return { lat: Math.asin(sn) / RAD, lon: clamp((x - WW / 2) / (WR * C45) / RAD, -180, 180) }; };
function llPath(ll) {                          // a line through [lon, lat] points; on the globe it stops at the edge
  let d = '', pen = false;
  for (const [lon, lat] of ll) {
    const p = rob(lon, lat);
    if (p.back) { pen = false; continue; }
    d += (pen ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1); pen = true;
  }
  return d;
}
const steps = (a, b, st) => { const o = []; for (let v = a; v <= b + 1e-9; v += st) o.push(v); return o; };
function fromGP(x, y) {                       // stored data is in Gall-Peters units; convert to the current projection
  if (PROJ === 'gp') return [x, y];
  const sn = clamp((GH / 2 - y) * C45 / WR, -1, 1), lon = clamp((x - WW / 2) / (WR * C45) * 180 / Math.PI, -180, 180);
  const p = rob(lon, Math.asin(sn) * 180 / Math.PI); return [p.x, p.y];
}
function reprojD(d) {
  if (PROJ === 'gp') return d;
  return parsePath(d).map(r => {
    if (PROJ === 'globe') {                    // polygons: far-side points are pinned to the edge; skip rings entirely out of sight
      let any = false; const pts = r.map(([x, y]) => { const ll = gpToLL(x, y), q = orthoF(ll.lon, ll.lat); if (!q.back) any = true; return q; });
      return any ? 'M' + pts.map(q => q.x.toFixed(1) + ' ' + q.y.toFixed(1)).join('L') + 'z' : '';
    }
    return 'M' + r.map(([x, y]) => fromGP(x, y).map(v => v.toFixed(1)).join(' ')).join('L') + 'z';
  }).join('');
}
function reprojLines(d) {
  if (PROJ === 'gp') return d;
  if (PROJ === 'globe') return parsePath(d).map(r => llPath(r.map(([x, y]) => { const q = gpToLL(x, y); return [q.lon, q.lat]; }))).join('');
  return parsePath(d).map(r => 'M' + r.map(([x, y]) => fromGP(x, y).map(v => v.toFixed(1)).join(' ')).join('L')).join('');
}
function reprojItems() {
  for (const it of ITEMS) if (it.m === 'world') {
    if (!it._gp) it._gp = { xy: it.xy, pts: it.pts };
    if (it._gp.xy) it.xy = fromGP(...it._gp.xy);
    if (it._gp.pts) it.pts = it._gp.pts.map(q => fromGP(...q));
  }
  for (const c of Object.values(D.world.countries)) if (c.l) { if (!c._l) c._l = c.l; c.l = fromGP(...c._l); }
}
// spin the globe so (lon, lat) is in the middle, then redraw everything
function centreOn(lon, lat) {
  if (PROJ !== 'globe') return;
  GLOBE.lon = lon; GLOBE.lat = clamp(lat, -70, 70);
  rebuildGlobe();
}
function rebuildGlobe() {
  const keep = [Q, GL].filter(x => x && x.pin).map(x => [x, robInv(x.pin.x, x.pin.y)]);
  svg.classList.remove('spinning');
  delete built['world:globe'];
  reprojItems();
  showMap('world', true);
  for (const [x, ll] of keep) if (ll && onFront(ll.lon, ll.lat)) { x.pin = rob(ll.lon, ll.lat); placePin(x.pin); } else x.pin = null;
}
let globeLL = null, spinRAF = 0;
function spinFast() {                         // quick redraw of just the land while dragging
  cancelAnimationFrame(spinRAF);
  spinRAF = requestAnimationFrame(() => {
    const m = cur(); if (!m) return;
    globeLL ||= D.world.parts.map(([, , d]) => parsePath(d).map(r => r.map(([x, y]) => gpToLL(x, y))));
    svg.classList.add('spinning');
    m.parts.forEach((el, i) => {
      let out = '';
      for (const r of globeLL[i]) {
        let any = false; const pts = r.map(q => { const o = orthoF(q.lon, q.lat); if (!o.back) any = true; return o; });
        if (any) out += 'M' + pts.map(o => o.x.toFixed(0) + ' ' + o.y.toFixed(0)).join('L') + 'z';
      }
      el.setAttribute('d', out);
    });
  });
}
function setProjKeep(p) {                     // like setProj('globe') but keeps the centre already set
  if (S.map !== 'world') return;
  PROJ = p; WH = GS; delete built['world:globe'];
  reprojItems(); showMap('world'); home(0); startMode();
}
function setProj(p) {
  if (p === PROJ || S.map !== 'world') return;
  const ll = robInv(V.cx, V.cy) || { lat: 20, lon: 0 }, rel = V.k / fitK(V.b.w, V.b.h);
  PROJ = p; WH = p === 'merc' ? MH : p === 'globe' ? GS : GH;
  if (p === 'globe') { GLOBE.lon = ll.lon; GLOBE.lat = clamp(ll.lat, -60, 60); delete built['world:globe']; }
  reprojItems();
  showMap('world');
  if (p === 'globe') home(0); else { const q = rob(ll.lon, ll.lat); goTo(q.x, q.y, rel * fitK(V.b.w, V.b.h), 0); }
  startMode();
  toast(p === 'merc' ? 'Mercator map: look how big Greenland, Russia and Antarctica have become!' : p === 'globe' ? 'Globe: drag to spin the Earth' : 'Gall-Peters map: every country at its true size', 3200);
}
function km(a, b) {                           // great-circle distance between {lat,lon}
  const r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

/* ------------------------------------------------------------ view (pan / zoom) */
const svg = $('#map'), layersG = $('#layers'), ov = $('#overlay');
const V = { cx: 0, cy: 0, k: 1, W: 1, H: 1, b: { x: 0, y: 0, w: 1, h: 1 }, minK: .05 };
const views = {};
function fitK(w, h) { return Math.max(w / V.W, h / V.H); }
function maxK() { return fitK(V.b.w, V.b.h) * 1.15; }
function clampView() {
  V.k = clamp(V.k, V.minK, maxK());
  const keep = (c, lo, len, half) => {        // never let the map slide away from the screen
    const slack = 60 * V.k;
    return len > 2 * half ? clamp(c, lo + half - slack, lo + len - half + slack) : clamp(c, lo + len - half - slack, lo + half + slack);
  };
  V.cx = keep(V.cx, V.b.x, V.b.w, V.W * V.k / 2);
  V.cy = keep(V.cy, V.b.y, V.b.h, V.H * V.k / 2);
}
function applyView() {
  clampView();
  const w = V.W * V.k, h = V.H * V.k;
  svg.setAttribute('viewBox', `${V.cx - w / 2} ${V.cy - h / 2} ${w} ${h}`);
  svg.style.setProperty('--k', V.k);
  // markers are smaller when zoomed out to the whole map, full size once zoomed in
  svg.style.setProperty('--ms', clamp(.5 + .25 * (fitK(V.b.w, V.b.h) / V.k - 1), .5, 1));
  views[S.map] = { cx: V.cx, cy: V.cy, k: V.k };
  onViewChange();
}
function resize() {
  const r = svg.getBoundingClientRect(); V.W = Math.max(r.width, 1); V.H = Math.max(r.height, 1);
  const c = $('#ink'); c.width = r.width * devicePixelRatio; c.height = r.height * devicePixelRatio; redrawInk();
  applyView();
}
function toMap(cx, cy) {
  const r = svg.getBoundingClientRect();
  return { x: V.cx + (cx - r.left - V.W / 2) * V.k, y: V.cy + (cy - r.top - V.H / 2) * V.k };
}
function zoomAt(cx, cy, f) {
  const r = svg.getBoundingClientRect(), p = toMap(cx, cy);
  V.k = clamp(V.k * f, V.minK, maxK());
  V.cx = p.x - (cx - r.left - V.W / 2) * V.k; V.cy = p.y - (cy - r.top - V.H / 2) * V.k;
  applyView();
}
let anim = 0;
function goTo(cx, cy, k, ms = 600) {
  cancelAnimationFrame(anim);
  const a = { cx: V.cx, cy: V.cy, k: V.k }, t0 = performance.now();
  k = clamp(k, V.minK, maxK());
  if (ms <= 0) { V.cx = cx; V.cy = cy; V.k = k; applyView(); return; }
  const step = now => {
    const t = Math.min(1, (now - t0) / ms), e = t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
    V.cx = a.cx + (cx - a.cx) * e; V.cy = a.cy + (cy - a.cy) * e;
    V.k = Math.exp(Math.log(a.k) + (Math.log(k) - Math.log(a.k)) * e);
    applyView();
    if (t < 1) anim = requestAnimationFrame(step);
  };
  anim = requestAnimationFrame(step);
}
function fitBox(x, y, w, h, pad = 1.2, ms) { goTo(x + w / 2, y + h / 2, fitK(Math.max(w, 1), Math.max(h, 1)) * pad, ms); }
function home(ms) {                          // whole map, leaving room for the buttons along the top
  const top = 64, k = Math.max(V.b.w / V.W, V.b.h / Math.max(100, V.H - top)) * 1.02;
  goTo(V.b.x + V.b.w / 2, V.b.y + V.b.h / 2 - top / 2 * k, k, ms);
}

// pointer handling: drag to pan, pinch / wheel to zoom, tap to interact
const ptrs = new Map(); let drag = null, pinch = null;
let ghostDrag = null;
svg.addEventListener('pointerdown', e => {
  if (ghost && e.target.classList && e.target.classList.contains('ghost')) {
    svg.setPointerCapture(e.pointerId);
    const p = toMap(e.clientX, e.clientY);
    ghostDrag = { id: e.pointerId, p0: p, x0: mercX(ghost.at.lon), y0: mercY(ghost.at.lat) };
    return;
  }
  svg.setPointerCapture(e.pointerId);
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  cancelAnimationFrame(anim);
  if (ptrs.size === 1) drag = { x0: e.clientX, y0: e.clientY, cx: V.cx, cy: V.cy, moved: false, glon: GLOBE.lon, glat: GLOBE.lat };
  else if (ptrs.size === 2) {
    const [a, b] = [...ptrs.values()];
    const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), k: V.k, p: toMap(mid.x, mid.y) };
    if (drag) drag.moved = true;
  }
});
svg.addEventListener('pointermove', e => {
  if (ghostDrag && e.pointerId === ghostDrag.id) {
    const p = toMap(e.clientX, e.clientY), ll = mercInv(ghostDrag.x0 + p.x - ghostDrag.p0.x, ghostDrag.y0 + p.y - ghostDrag.p0.y);
    ghost.at = { lat: clamp(ll.lat, -75, 78), lon: ll.lon }; drawGhost(); return;
  }
  if (!ptrs.has(e.pointerId)) return;
  ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (ptrs.size >= 2 && pinch) {
    const [a, b] = [...ptrs.values()], r = svg.getBoundingClientRect();
    const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    V.k = clamp(pinch.k * pinch.d / Math.max(10, Math.hypot(a.x - b.x, a.y - b.y)), V.minK, maxK());
    V.cx = pinch.p.x - (mid.x - r.left - V.W / 2) * V.k; V.cy = pinch.p.y - (mid.y - r.top - V.H / 2) * V.k;
    applyView();
  } else if (drag) {
    const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
    if (!drag.moved && Math.hypot(dx, dy) > 12) drag.moved = true;
    if (drag.moved && S.map === 'world' && PROJ === 'globe') {        // on the globe, dragging spins the Earth
      GLOBE.lon = ((drag.glon - dx * V.k / GR / RAD) + 540) % 360 - 180;
      GLOBE.lat = clamp(drag.glat + dy * V.k / GR / RAD, -75, 75);
      drag.spun = true; spinFast();
    } else if (drag.moved) { V.cx = drag.cx - dx * V.k; V.cy = drag.cy - dy * V.k; applyView(); }
  }
});
function endPtr(e) {
  if (ghostDrag && e.pointerId === ghostDrag.id) { ghostDrag = null; return; }
  if (!ptrs.has(e.pointerId)) return;
  ptrs.delete(e.pointerId);
  if (ptrs.size < 2) pinch = null;
  if (ptrs.size === 0) {
    if (drag && !drag.moved && e.type === 'pointerup') onTap(e.clientX, e.clientY);
    if (drag && drag.spun) rebuildGlobe();
    drag = null;
  } else if (ptrs.size === 1 && drag) {
    const [p] = [...ptrs.values()]; drag = { x0: p.x, y0: p.y, cx: V.cx, cy: V.cy, moved: true };
  }
}
svg.addEventListener('pointerup', endPtr);
svg.addEventListener('pointercancel', endPtr);
svg.addEventListener('wheel', e => { e.preventDefault(); zoomAt(e.clientX, e.clientY, Math.exp(e.deltaY * .0016)); }, { passive: false });
$('#zIn').onclick = () => { const r = svg.getBoundingClientRect(); zoomAt(r.left + V.W / 2, r.top + V.H / 2, 1 / 1.6); };
$('#zOut').onclick = () => { const r = svg.getBoundingClientRect(); zoomAt(r.left + V.W / 2, r.top + V.H / 2, 1.6); };
$('#zHome').onclick = () => home();

/* ------------------------------------------------------------ shared symbols */
const POI = {
  worship: 'Place of worship', school: 'School', univ: 'University', pub: 'Pub (public house)', po: 'Post office',
  parking: 'Parking', hospital: 'Hospital', bus: 'Bus station', fire: 'Fire station', police: 'Police station',
  station: 'Railway station', viewpoint: 'Viewpoint', museum: 'Museum', info: 'Information centre', picnic: 'Picnic site',
  golf: 'Golf course', tower: 'Tower', antiquity: 'Ancient site', peak: 'Summit (spot height)', trig: 'Trig point', attraction: 'Famous landmark',
};
const POI_SHORT = { worship: 'place of worship', school: 'school', univ: 'university', pub: 'pub', po: 'post office', parking: 'car park', hospital: 'hospital', bus: 'bus station', fire: 'fire station', police: 'police station', station: 'railway station', viewpoint: 'viewpoint', museum: 'museum', info: 'information centre', picnic: 'picnic site', golf: 'golf course', tower: 'tower', antiquity: 'ancient site', peak: 'summit', trig: 'trig point', attraction: 'landmark' };
function buildDefs() {
  const defs = $('#defs');
  const txt = (id, t, w) => {
    const g = E('g', { id: 'sym-' + id }, defs);
    E('rect', { x: -w / 2, y: -11, width: w, height: 22, rx: 4, fill: '#fff', opacity: .85 }, g);
    E('text', { 'text-anchor': 'middle', y: 7, 'font-size': 18, 'font-weight': 900, fill: '#111', 'font-family': 'Arial, sans-serif' }, g).textContent = t;
  };
  txt('school', 'Sch', 38); txt('pub', 'PH', 30); txt('po', 'PO', 30); txt('hospital', 'Hospl', 50);
  txt('fire', 'Fire Sta', 64); txt('police', 'Pol Sta', 62); txt('univ', 'Univ', 44);
  let g = E('g', { id: 'sym-worship' }, defs);
  E('circle', { r: 12, fill: '#fff', opacity: .85 }, g);
  E('path', { d: 'M-2.5-11h5v6.5h6.5v5h-6.5v11h-5v-11h-6.5v-5h6.5z', fill: '#111' }, g);
  const blue = (id, inner) => { const s = E('g', { id: 'sym-' + id }, defs); E('rect', { x: -12, y: -12, width: 24, height: 24, rx: 5, fill: '#1565c0', stroke: '#fff', 'stroke-width': 2 }, s); inner(s); };
  blue('parking', s => { E('text', { 'text-anchor': 'middle', y: 8, 'font-size': 20, 'font-weight': 900, fill: '#fff', 'font-family': 'Arial' }, s).textContent = 'P'; });
  blue('bus', s => { E('rect', { x: -8, y: -7, width: 16, height: 12, rx: 2, fill: '#fff' }, s); E('rect', { x: -6, y: -5, width: 12, height: 4, fill: '#1565c0' }, s); E('circle', { cx: -4, cy: 7, r: 2, fill: '#fff' }, s); E('circle', { cx: 4, cy: 7, r: 2, fill: '#fff' }, s); });
  blue('museum', s => { E('path', { d: 'M-9-2L0-9L9-2z', fill: '#fff' }, s); for (const x of [-7, -2, 3]) E('rect', { x, y: -1, width: 3, height: 8, fill: '#fff' }, s); E('rect', { x: -9, y: 7, width: 18, height: 2, fill: '#fff' }, s); });
  blue('info', s => { E('circle', { cy: -6, r: 2.4, fill: '#fff' }, s); E('rect', { x: -2, y: -2, width: 4, height: 11, fill: '#fff' }, s); });
  blue('picnic', s => { E('path', { d: 'M-9-3h18M-5-3l-4 11M5-3l4 11M-10 3h20', stroke: '#fff', 'stroke-width': 2.4, fill: 'none' }, s); });
  blue('golf', s => { E('path', { d: 'M-3 9V-9l9 4-9 4', stroke: '#fff', 'stroke-width': 2.2, fill: '#fff' }, s); });
  g = E('g', { id: 'sym-viewpoint' }, defs);
  E('path', { d: 'M-13 5A13 13 0 0 1 13 5z', fill: '#1565c0', stroke: '#fff', 'stroke-width': 1.5 }, g);
  for (const a of [-60, -30, 0, 30, 60]) { const r = a * Math.PI / 180; E('line', { x1: 0, y1: 5, x2: 13 * Math.sin(r), y2: 5 - 13 * Math.cos(r), stroke: '#fff', 'stroke-width': 1.6 }, g); }
  g = E('g', { id: 'sym-station' }, defs);
  E('circle', { r: 9, fill: '#d32f2f', stroke: '#111', 'stroke-width': 2.5 }, g);
  g = E('g', { id: 'sym-tower' }, defs);
  E('path', { d: 'M-6 11V-6h-2v-5h4v3h2v-3h4v3h2v-3h4v5h-2v17z', fill: '#111', stroke: '#fff', 'stroke-width': 1.2 }, g);
  g = E('g', { id: 'sym-antiquity' }, defs);
  E('circle', { r: 10, fill: '#fff', stroke: '#6d4c41', 'stroke-width': 2.5, opacity: .9 }, g);
  E('path', { d: 'M-5-5l10 10M5-5l-10 10', stroke: '#6d4c41', 'stroke-width': 2.5 }, g);
  g = E('g', { id: 'sym-peak' }, defs);
  E('circle', { r: 5, fill: '#111', stroke: '#fff', 'stroke-width': 2 }, g);
  g = E('g', { id: 'sym-attraction' }, defs);
  E('path', { d: 'M0-13l3.8 8 8.7 1.1-6.4 6 1.7 8.6L0 6.4-7.8 10.7l1.7-8.6-6.4-6 8.7-1.1z', fill: '#1565c0', stroke: '#fff', 'stroke-width': 2 }, g);
  g = E('g', { id: 'sym-trig' }, defs);
  E('path', { d: 'M0-11L10 7H-10z', fill: '#1565c0', stroke: '#fff', 'stroke-width': 2 }, g); E('circle', { cy: 1, r: 2.5, fill: '#fff' }, g);
  // pin used for answers
  g = E('g', { id: 'sym-pin' }, defs);
  E('path', { d: 'M0 0C-4-10-16-16-16-30A16 16 0 1 1 16-30C16-16 4-10 0 0z', fill: '#e53935', stroke: '#fff', 'stroke-width': 3 }, g);
  E('circle', { cy: -30, r: 6, fill: '#fff' }, g);
  // map patterns for the OS-style maps
  const pat = (id, w, h, inner) => { const p = E('pattern', { id, width: w, height: h, patternUnits: 'userSpaceOnUse' }, defs); inner(p); };
  pat('pWood', 46, 40, p => {
    E('rect', { width: 46, height: 40, fill: '#bfe0a6' }, p);
    for (const [x, y] of [[11, 14], [34, 34]]) { E('circle', { cx: x, cy: y - 4, r: 5, fill: 'none', stroke: '#3f8f3a', 'stroke-width': 1.6 }, p); E('line', { x1: x, y1: y + 1, x2: x, y2: y + 5, stroke: '#3f8f3a', 'stroke-width': 1.6 }, p); }
  });
  pat('pScrub', 30, 30, p => { E('rect', { width: 30, height: 30, fill: '#e6f1d6' }, p); E('circle', { cx: 8, cy: 8, r: 2.2, fill: '#6aa84f' }, p); E('circle', { cx: 23, cy: 22, r: 2.2, fill: '#6aa84f' }, p); });
  pat('pCem', 34, 34, p => { E('rect', { width: 34, height: 34, fill: '#dde9d4' }, p); E('path', { d: 'M17 9v12M12 13h10', stroke: '#5b6b55', 'stroke-width': 1.6 }, p); });
  pat('pMud', 24, 24, p => { E('rect', { width: 24, height: 24, fill: '#e9e1c8' }, p); E('circle', { cx: 6, cy: 6, r: 1.4, fill: '#9c8a5a' }, p); E('circle', { cx: 18, cy: 17, r: 1.4, fill: '#9c8a5a' }, p); });
}

/* ------------------------------------------------------------ items */
const ITEMS = D.items;
const byId = Object.fromEntries(ITEMS.map(i => [i.id, i]));
const KIND_TXT = {
  country: 'a country', ukcountry: 'a country in the UK', continent: 'a continent', ocean: 'an ocean or sea', sea: 'a sea or ocean',
  group: 'a group of countries', latline: 'an imaginary line', lonline: 'an imaginary line', pole: 'a point on the Earth',
  hemi: 'half of the Earth', region: 'a region of England', county: 'a county', river: 'a river or canal', line: 'a long feature', point: 'a place',
};
function kindText(it) {
  if (it.kt) return it.kt;
  if (it.k === 'point') return it.cap ? 'a capital city' : it.phys ? 'a physical feature' : it.res ? 'a place where natural resources are dug from the ground' : it.id === 'school' ? 'our school, WFA' : /city|ton$|ham$|ool$|eds$|ield$|stle$/.test(it.n) || ['bristol', 'exeter', 'bath', 'manchester', 'birmingham', 'liverpool', 'leeds', 'sheffield', 'newcastle', 'mumbai', 'newyork', 'rio', 'singapore', 'sydney'].includes(it.id) ? 'a city' : 'a landmark';
  if (it.k === 'line') return it.phys ? 'a mountain range or hills' : 'a landmark';
  return KIND_TXT[it.k] || 'a place';
}
function inYear(it) {
  if (!it.y || !it.y.length) return false;
  const y = yr(); if (!y) return true;
  return it.y.some(v => S.revision ? v <= y : v === y);
}
const mapKind = () => S.map.startsWith('local') ? 'local' : S.map;
const visibleItems = () => ITEMS.filter(it => it.m === mapKind() && inYear(it));

/* ------------------------------------------------------------ map builders */
const built = {};
const CONT_COL = { Africa: '#f5d48c', Asia: '#f2b9a6', Europe: '#bcdb93', 'North America': '#efc2d8', 'South America': '#c8b9e6', Oceania: '#9fd8cf', Antarctica: '#e4edf2', Islands: '#d8d8d0' };
const UKC_COL = { England: '#f6e6b4', Scotland: '#cde3b4', Wales: '#f3c9b8', 'Northern Ireland': '#c9dbef' };
const CONT_LABEL = { Africa: [8, 18], Asia: [48, 92], Europe: [53, 18], 'North America': [48, -102], 'South America': [-14, -60], Oceania: [-25, 134], Antarctica: [-82, 40] };
const WORLD_VIEWS = { World: null, Europe: [-25, 34, 45, 71], Africa: [-20, -36, 55, 38], Asia: [25, -12, 150, 78], 'North America': [-170, 7, -50, 83], 'South America': [-85, -57, -32, 14], Oceania: [110, -50, 180, 0] };
const bngToUk = (e, n) => ({ x: (e - D.uk.e0) / D.uk.s, y: (D.uk.n1 - n) / D.uk.s });
const UK_VIEWS = { 'Whole UK': null, 'South West': [80000, 0, 430000, 270000], 'South East': [380000, 70000, 660000, 270000], Wales: [160000, 160000, 360000, 400000], 'North of England': [290000, 360000, 480000, 620000], Scotland: [0, 520000, 470000, 1000000] };

function buildWorld() {
  const g = E('g'), W = D.world, globe = PROJ === 'globe';
  if (globe) E('circle', { cx: GC, cy: GC, r: GR, fill: '#cfe7f5', stroke: '#7fb2d2', 'stroke-width': 2.5, 'vector-effect': 'non-scaling-stroke' }, g);
  else {
    const outline = [];
    for (let lat = 90; lat >= -90; lat -= 5) outline.push(rob(180, lat));
    for (let lat = -90; lat <= 90; lat += 5) outline.push(rob(-180, lat));
    E('path', { d: 'M' + outline.map(p => p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join('L') + 'z', fill: '#cfe7f5', stroke: '#9cc6de', 'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke' }, g);
  }
  const land = E('g', { id: 'w-land' }, g);
  const parts = [];
  for (const [code, cont, d] of W.parts) parts.push(E('path', { d: reprojD(d), class: 'land', 'data-code': code, 'data-cont': cont }, land));
  E('path', { id: 'w-lakes', d: reprojD(W.lakes), fill: '#cfe7f5', stroke: '#8a8a7a', 'stroke-width': .6, 'vector-effect': 'non-scaling-stroke' }, g);
  // time zones (standard time, Natural Earth)
  const tz = E('g', { id: 'w-tz', 'pointer-events': 'none' }, g);
  const tzPaths = D.tz.map(z => E('path', { d: reprojD(z.d), fill: Math.abs(Math.round(z.z)) % 2 ? 'rgba(40,70,160,.16)' : 'rgba(255,255,255,0)', stroke: '#5c6fa8', 'stroke-width': .9, 'stroke-dasharray': '4 3', 'vector-effect': 'non-scaling-stroke', 'data-z': z.z }, tz));
  for (let z = -12; z <= 14; z++) {
    const lon = clamp(z * 15, -176, 176), lat = globe ? 0 : -57;
    if (!onFront(lon, lat)) continue;
    const p = rob(lon, lat);
    E('text', { 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 900, fill: '#26408b' }, cs(tz, p.x, p.y, 'lbl')).textContent = z === 0 ? 'GMT' : (z > 0 ? '+' + z : '−' + -z);
  }
  E('g', { id: 'w-biomes', 'pointer-events': 'none', opacity: .88 }, g);   // filled in when the layer is first switched on
  // climate zones (bands between the tropics and the polar circles)
  const clim = E('g', { id: 'w-climate', 'pointer-events': 'none' }, g);
  const band = (a, b, fill) => {
    const pts = [...steps(-180, 180, 3).map(lon => rob(lon, a)), ...steps(-180, 180, 3).reverse().map(lon => rob(lon, b))];
    E('path', { d: 'M' + pts.map(p => p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join('L') + 'z', fill }, clim);
  };
  if (!globe) {
    band(-23.44, 23.44, 'rgba(255,112,67,.22)'); band(23.44, 66.56, 'rgba(102,187,106,.18)'); band(-66.56, -23.44, 'rgba(102,187,106,.18)');
    band(66.56, 90, 'rgba(66,165,245,.25)'); band(-90, -66.56, 'rgba(66,165,245,.25)');
  }
  for (const [lat, t, col] of [[8, 'TROPICAL', '#bf360c'], [45, 'TEMPERATE', '#2e7d32'], [-45, 'TEMPERATE', '#2e7d32'], [76, 'POLAR', '#1565c0'], [-75, 'POLAR', '#1565c0']]) {
    const lon = globe ? GLOBE.lon - 35 : -150; if (!onFront(lon, lat)) continue;
    const q = rob(lon, lat); E('text', { 'font-size': 17, 'font-weight': 900, fill: col, 'letter-spacing': 2 }, cs(clim, q.x, q.y, 'lbl')).textContent = t;
  }
  // tectonic plate boundaries
  if (D.world.plates) E('path', { id: 'w-plates', d: reprojLines(D.world.plates), fill: 'none', stroke: '#c62828', 'stroke-width': 2.4, 'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke', 'pointer-events': 'none' }, g);
  // lines of latitude and longitude, every 10 degrees, drawn over the land
  const grat = E('g', { id: 'w-grat', stroke: '#4f86b8', 'stroke-width': .8, opacity: .75, fill: 'none' }, g);
  for (let lat = -80; lat <= 80; lat += 10) { if (PROJ === 'merc' && Math.abs(lat) > MLAT) continue; E('path', { d: llPath(steps(-180, 180, 3).map(lon => [lon, lat])), 'vector-effect': 'non-scaling-stroke' }, grat); }
  for (let lon = -180; lon <= 170; lon += 10) E('path', { d: llPath(steps(-90, 90, 3).map(lat => [lon, lat])), 'vector-effect': 'non-scaling-stroke' }, grat);
  if (!globe) E('path', { d: llPath(steps(-90, 90, 3).map(lat => [180, lat])), 'vector-effect': 'non-scaling-stroke' }, grat);
  const glab = E('g', { id: 'w-gratlab' }, g);
  const deg = (v, pos, neg) => v === 0 ? '0°' : Math.abs(v) + '°' + (v > 0 ? pos : neg);
  const latLabLons = globe ? [Math.round((GLOBE.lon - 5) / 10) * 10 + 5] : [-175, 175, -5];
  for (let lat = -80; lat <= 80; lat += 10) for (const lon of latLabLons) {
    if (!onFront(lon, lat)) continue;
    const p = rob(lon, lat); E('text', { 'text-anchor': lon > 0 && !globe ? 'end' : lon === -5 ? 'end' : 'start', y: -3, 'font-size': 13, 'font-weight': 900, fill: '#1f5f99', class: 'lbl' }, cs(glab, p.x, p.y, 'lbl' + (lat % 30 ? ' minor' : ''))).textContent = deg(lat, 'N', 'S');
  }
  for (let lon = -170; lon <= 180; lon += 10) for (const lat of globe ? [-1.5] : [-1.5, 61.5, -48.5]) {
    if (!onFront(lon, lat) || (lon === 180 && !globe)) continue;
    const p = rob(lon, lat); E('text', { 'text-anchor': 'middle', y: lat < 0 ? 14 : -4, 'font-size': 13, 'font-weight': 900, fill: '#1f5f99', class: 'lbl' }, cs(glab, p.x, p.y, 'lbl' + (lon % 30 ? ' minor' : ''))).textContent = lon === 180 ? '180°' : deg(lon, 'E', 'W');
  }
  const lines = E('g', { id: 'w-lines' }, g);
  const ln = (lat, col, dash, name) => {
    E('path', { d: llPath(steps(-180, 180, 2).map(lon => [lon, lat])), stroke: col, 'stroke-width': 2.6, 'stroke-dasharray': dash, 'vector-effect': 'non-scaling-stroke', fill: 'none' }, lines);
    const lon = globe ? GLOBE.lon + 20 : -168; if (!onFront(lon, lat)) return;
    const lp = rob(lon, lat); const lg = cs(lines, lp.x, lp.y, 'lbl wl-lab'); E('text', { y: -7, 'font-size': 15, fill: col, 'font-style': 'italic' }, lg).textContent = name;
  };
  ln(0, '#d32f2f', null, 'Equator'); ln(23.44, '#ef6c00', '8 6', 'Tropic of Cancer'); ln(-23.44, '#ef6c00', '8 6', 'Tropic of Capricorn');
  ln(66.56, '#1e88e5', '8 6', 'Arctic Circle'); ln(-66.56, '#1e88e5', '8 6', 'Antarctic Circle');
  E('path', { d: llPath(steps(-90, 90, 2).map(lat => [0, lat])), stroke: '#2e7d32', 'stroke-width': 2.2, 'stroke-dasharray': '3 5', 'vector-effect': 'non-scaling-stroke', fill: 'none' }, lines);
  const pmLat = globe ? clamp(GLOBE.lat - 25, -60, 60) : -50;
  if (onFront(0, pmLat)) { const pml = rob(0, pmLat); E('text', { y: 0, 'font-size': 15, fill: '#2e7d32', 'font-style': 'italic' }, cs(lines, pml.x + 6, pml.y, 'lbl wl-lab')).textContent = 'Prime Meridian'; }
  const names = E('g', { id: 'w-allnames', class: 'lbl' }, g);
  const dyn = E('g', { id: 'dyn' }, g);
  const res = { g, parts, tzPaths, b: globe ? { x: 0, y: 0, w: GS, h: GS } : { x: 0, y: 0, w: WW, h: WH }, minK: .25, dyn, names, sized: false };
  res.countryW = {};
  return res;
}
function styleWorld(m) {
  const L = S.layers.world;
  for (const p of m.parts) p.setAttribute('fill', L.colour ? (CONT_COL[p.dataset.cont] || '#ddd') : '#f1ece0');
  const grid = L.grid || (S.mode === 'globe' && ['read', 'plot'].includes(S.globeTask)), tzOn = L.tz || (S.mode === 'globe' && S.globeTask === 'time');
  m.g.querySelector('#w-grat').style.display = grid ? '' : 'none';
  m.g.querySelector('#w-gratlab').style.display = grid ? '' : 'none';
  m.g.querySelector('#w-tz').style.visibility = tzOn ? '' : 'hidden';
  m.g.querySelector('#w-climate').style.display = L.climate ? '' : 'none';
  m.g.querySelector('#w-biomes').style.display = L.biomes ? '' : 'none';
  if (L.biomes) loadBiomes(m);
  const pl = m.g.querySelector('#w-plates'); if (pl) pl.style.display = L.plates ? '' : 'none';
  m.g.querySelector('#w-lines').style.display = L.lines ? '' : 'none';
}

function buildUK() {
  const g = E('g'), U = D.uk;
  E('rect', { x: 0, y: 0, width: U.w, height: U.h, fill: '#cfe7f5' }, g);
  for (const c of U.context) E('path', { d: c.d, fill: '#ebeae4', stroke: '#a3a39a', 'stroke-width': .7, 'vector-effect': 'non-scaling-stroke', 'data-n': c.n }, g);
  const ctry = U.countries.map(c => E('path', { d: c.d, class: 'ukc land', fill: UKC_COL[c.n], 'data-n': c.n }, g));
  const regG = E('g', { id: 'uk-reg' }, g);
  const regs = U.regions.map(r => E('path', { d: r.d, class: 'ukr', fill: 'transparent', stroke: '#7b4fa0', 'stroke-width': 2, 'vector-effect': 'non-scaling-stroke', 'data-n': r.n }, regG));
  const ctyG = E('g', { id: 'uk-cty' }, g);
  const ctys = U.counties.map(r => E('path', { d: r.d, class: 'ukcty', fill: 'transparent', stroke: '#8d6e63', 'stroke-width': 1.2, 'vector-effect': 'non-scaling-stroke', 'data-n': r.n }, ctyG));
  const rivG = E('g', { id: 'uk-riv' }, g);
  const rivers = {};
  for (const k in U.rivers) rivers[k] = E('path', { d: U.rivers[k], class: 'feat-line', stroke: k === 'guc' ? '#0d47a1' : '#1e88e5', 'stroke-width': k === 'guc' ? 2.2 : 2.6, 'stroke-dasharray': k === 'guc' ? '6 3' : null, 'data-r': k }, rivG);
  const names = E('g', { id: 'uk-names', class: 'lbl' }, g);
  const dyn = E('g', { id: 'dyn' }, g);
  return { g, ctry, regs, ctys, rivers, names, dyn, b: { x: 0, y: 0, w: U.w, h: U.h }, minK: .06 };
}
function styleUK(m) {
  const L = S.layers.uk;
  m.g.querySelector('#uk-reg').style.visibility = L.regions ? '' : 'hidden';
  m.g.querySelector('#uk-cty').style.visibility = L.counties ? '' : 'hidden';
  m.g.querySelector('#uk-riv').style.display = L.rivers ? '' : 'none';
}

function buildLocal(id) {
  const Lm = D.local.find(l => l.id === id), W = Lm.e1 - Lm.e0, Hh = Lm.n1 - Lm.n0;
  const g = E('g');
  E('rect', { x: -400, y: -400, width: W + 800, height: Hh + 800, fill: '#eef3f6' }, g);
  E('rect', { x: 0, y: 0, width: W, height: Hh, fill: '#fbfaf3' }, g);
  const clip = E('clipPath', { id: 'clip-' + id }, g); E('rect', { x: 0, y: 0, width: W, height: Hh }, clip);
  const body = E('g', { 'clip-path': `url(#clip-${id})` }, g);
  const A = Lm.areas, area = (k, attrs) => { if (A[k]) E('path', Object.assign({ d: A[k] }, attrs), body); };
  area('farm', { fill: '#f6f3e2' });
  area('urban', { fill: '#f4e2d1' });
  area('park', { fill: '#dcefc8' });
  area('allot', { fill: '#e4eecd', stroke: '#9cb87c', 'stroke-width': 1 });
  area('golf', { fill: '#d4ecbd' });
  area('pitch', { fill: '#cbe8b3', stroke: '#7aa95c', 'stroke-width': 1.5 });
  area('cemetery', { fill: 'url(#pCem)' });
  area('scrub', { fill: 'url(#pScrub)' });
  area('wood', { fill: 'url(#pWood)' });
  area('rock', { fill: '#e2ddd5' });
  area('mud', { fill: 'url(#pMud)' });
  const line = (d, attrs) => { if (d) E('path', Object.assign({ d, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, attrs), body); };
  line(Lm.stream, { stroke: '#2f8fd8', 'stroke-width': 3 });
  line(Lm.canal, { stroke: '#2f8fd8', 'stroke-width': 9 });
  line(Lm.river, { stroke: '#2f8fd8', 'stroke-width': 7 });
  area('water', { fill: '#a9d8f5', stroke: '#2f8fd8', 'stroke-width': 2 });
  line(Lm.cliff, { stroke: '#6d4c41', 'stroke-width': 12, 'stroke-dasharray': '2 6', 'stroke-linecap': 'butt' });
  const R = Lm.roads;
  const RW = { mway: 28, a: 20, b: 16, minor: 12, street: 9 };
  const RC = { mway: '#3b78c4', a: '#e0473f', b: '#f39c2c', minor: '#fff15a', street: '#ffffff' };
  line(R.track, { stroke: '#8a7a64', 'stroke-width': 3, 'stroke-dasharray': '10 8', 'stroke-linecap': 'butt' });
  line(R.path, { stroke: '#555', 'stroke-width': 2.6, 'stroke-dasharray': '9 7', 'stroke-linecap': 'butt' });
  for (const c of ['street', 'minor', 'b', 'a', 'mway']) line(R[c], { stroke: '#4a4a4a', 'stroke-width': RW[c] + 4 });
  for (const c of ['street', 'minor', 'b', 'a', 'mway']) line(R[c], { stroke: RC[c], 'stroke-width': RW[c] });
  line(Lm.raildis, { stroke: '#9e9e9e', 'stroke-width': 3, 'stroke-dasharray': '12 8' });
  line(Lm.rail, { stroke: '#222', 'stroke-width': 7 });
  line(Lm.rail, { stroke: '#fff', 'stroke-width': 3, 'stroke-dasharray': '16 16', 'stroke-linecap': 'butt' });
  // contour lines (OS Terrain 50)
  const cont = E('g', { id: 'l-cont', fill: 'none', stroke: '#c27a3a' }, g);
  for (const c of Lm.contours || []) E('path', { d: c.d, 'stroke-width': c.i ? 2 : 1, opacity: c.i ? .95 : .8, 'vector-effect': 'non-scaling-stroke', 'data-h': c.h }, cont);
  const clab = E('g', { id: 'l-clab' }, cont);
  for (const c of Lm.clabels || []) { const lg = cs(clab, c.x, c.y); E('text', { 'text-anchor': 'middle', y: 5, 'font-size': 13, 'font-weight': 800, fill: '#a5571c', stroke: '#fbfaf3', 'stroke-width': 4, 'paint-order': 'stroke', transform: `rotate(${c.a})` }, lg).textContent = c.h; }
  // grid
  const grid = E('g', { id: 'l-grid' }, g), tenths = E('g', { id: 'l-tenths', style: 'display:none' }, g);
  for (let e = Math.ceil(Lm.e0 / 100) * 100; e <= Lm.e1; e += 100) {
    const x = e - Lm.e0, major = e % 1000 === 0;
    E('line', { x1: x, y1: 0, x2: x, y2: Hh, stroke: '#2c7fd6', 'stroke-width': major ? 1.6 : .8, opacity: major ? .95 : .45, 'vector-effect': 'non-scaling-stroke' }, major ? grid : tenths);
  }
  for (let n = Math.ceil(Lm.n0 / 100) * 100; n <= Lm.n1; n += 100) {
    const y = Lm.n1 - n, major = n % 1000 === 0;
    E('line', { x1: 0, y1: y, x2: W, y2: y, stroke: '#2c7fd6', 'stroke-width': major ? 1.6 : .8, opacity: major ? .95 : .45, 'vector-effect': 'non-scaling-stroke' }, major ? grid : tenths);
  }
  E('rect', { x: 0, y: 0, width: W, height: Hh, fill: 'none', stroke: '#1a3a5a', 'stroke-width': 3, 'vector-effect': 'non-scaling-stroke' }, g);
  // labels
  const labs = E('g', { id: 'l-names' }, g);
  for (const p of Lm.places) {
    const size = p.p === 'village' || p.p === 'suburb' || p.p === 'town' ? 19 : 15;
    E('text', { 'text-anchor': 'middle', 'font-size': size, 'font-weight': 900, fill: '#222', class: 'lbl', 'letter-spacing': size > 16 ? '1' : '0' }, cs(labs, p.x, p.y, 'lbl')).textContent = p.p === 'village' || p.p === 'suburb' || p.p === 'town' ? p.t.toUpperCase() : p.t;
  }
  for (const n of Lm.names) {
    const col = n.c === 'water' ? '#1565c0' : '#2e6b2e';
    E('text', { 'text-anchor': 'middle', 'font-size': 15, 'font-style': 'italic', 'font-weight': 800, fill: col }, cs(labs, n.x, n.y, 'lbl')).textContent = n.t;
  }
  for (const r of Lm.refs) {
    const gg = cs(labs, r.x, r.y);
    const w = r.t.length * 9 + 10;
    E('rect', { x: -w / 2, y: -11, width: w, height: 20, rx: 3, fill: r.t[0] === 'M' ? '#3b78c4' : r.t[0] === 'A' ? '#2e7d32' : '#fff', stroke: '#333', 'stroke-width': 1 }, gg);
    E('text', { 'text-anchor': 'middle', y: 4, 'font-size': 14, 'font-weight': 900, fill: r.t[0] === 'B' ? '#222' : '#fff' }, gg).textContent = r.t;
  }
  const poiG = E('g', { id: 'l-pois' }, g);
  Lm.pois.forEach((p, i) => {
    const gg = cs(poiG, p.x, p.y, 'poi');
    gg.dataset.i = i; gg.dataset.t = p.t;
    E('use', { href: '#sym-' + p.t }, gg);
    if (p.t === 'attraction') E('text', { x: 15, y: 6, 'font-size': 16, 'font-weight': 900, 'font-style': 'italic', fill: '#0d47a1', class: 'lbl' }, gg).textContent = p.n;
    if (p.t === 'peak') { E('text', { x: 8, y: 5, 'font-size': 15, 'font-weight': 900, fill: '#111', class: 'lbl' }, gg).textContent = p.h; if (p.n) E('text', { x: 8, y: -10, 'font-size': 14, 'font-weight': 800, 'font-style': 'italic', fill: '#333', class: 'lbl' }, gg).textContent = p.n; }
    if (p.ours) {
      E('circle', { cy: -34, r: 20, fill: '#fff', stroke: '#1798d3', 'stroke-width': 2.5 }, gg);
      E('image', { href: 'wfa-icon.png', x: -14, y: -50, width: 28, height: 32 }, gg);
      E('text', { y: 30, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 900, fill: '#0f6e9c', class: 'lbl' }, gg).textContent = 'WFA';
    }
  });
  const dyn = E('g', { id: 'dyn' }, g);
  return { g, L: Lm, pois: Lm.pois, poiG, labs, grid, tenths, cont, dyn, b: { x: 0, y: 0, w: W, h: Hh }, minK: .12 };
}
function styleLocal(m) {
  const L = S.layers.local;
  m.labs.style.display = L.names ? '' : 'none';
  m.poiG.style.display = L.symbols ? '' : 'none';
  m.cont.style.display = L.contours ? '' : 'none';
  const hide = new Set(L.hide || []);
  for (const g of m.poiG.children) g.style.display = hide.has(g.dataset.t) && !(m.force && m.force.has(+g.dataset.i)) ? 'none' : '';
  declutter();
}

const cacheKey = id => id === 'world' ? 'world:' + PROJ : id;
function cur() { return built[cacheKey(S.map)]; }
function ensureMap(id) {
  if (built[cacheKey(id)]) return built[cacheKey(id)];
  let m;
  if (id === 'world') m = buildWorld();
  else if (id === 'merc') m = buildMerc();
  else if (id === 'uk') m = buildUK();
  else m = buildLocal(id.split(':')[1]);
  built[cacheKey(id)] = m; return m;
}
function showMap(id, keepView) {
  S.map = id; if (id !== 'merc') save();
  const m = ensureMap(id);
  layersG.replaceChildren(m.g);
  ov.replaceChildren();
  V.b = m.b; V.minK = m.minK;
  restyle();
  if (id === 'world' && !m.sized) {     // measure each country once, for zoom-dependent names
    m.sized = true;
    const w = {};
    for (const p of m.parts) { const bb = p.getBBox(); const c = p.dataset.code; if (!w[c] || bb.width > w[c].w) w[c] = { w: bb.width }; }
    m.countryW = w;
  }
  $('#mapTxt').textContent = mapLabel(id);
  document.body.classList.toggle('has-rulers', id.startsWith('local'));
  $('#rulerB').hidden = $('#rulerL').hidden = !id.startsWith('local');
  if (!id.startsWith('local')) $('#zoomBar').style.left = '';
  $('#symBtn').textContent = id.startsWith('local') ? '📍 Symbols' : '📍 Places';
  $('#symBtn').hidden = $('#layerBtn').hidden = id === 'merc';
  $('#projBtn').hidden = id !== 'world';
  $('#projBtn').textContent = PROJ === 'merc' ? '🗺️ Mercator ▾' : PROJ === 'globe' ? '🌐 Globe ▾' : '🌍 Gall-Peters ▾';
  buildViewBar();
  const v = views[id];
  if (keepView && v) { V.cx = v.cx; V.cy = v.cy; V.k = v.k; applyView(); }
  else home(0);
  setAttrib();
  refreshDyn();
}
function restyle() {
  const m = cur(); if (!m) return;
  if (S.map === 'world') styleWorld(m); else if (S.map === 'uk') styleUK(m); else if (m.L) styleLocal(m);
}
function mapLabel(id) {
  if (id === 'world' || id === 'merc') return 'World';
  if (id === 'uk') return 'United Kingdom';
  return { school: 'OS: WFA', gorge: 'OS: Avon Gorge', penyfan: 'OS: Pen y Fan', london: 'OS: London' }[id.split(':')[1]] || 'OS map';
}
function setAttrib() {
  const a = S.map === 'world' ? (PROJ === 'globe' ? 'Map data: Natural Earth · Globe view (orthographic projection): drag to spin' : PROJ === 'merc' ? 'Map data: Natural Earth · Mercator projection (sizes near the poles look much too big)' : 'Map data: Natural Earth · Gall-Peters projection (true sizes)') : S.map === 'merc' ? 'Map data: Natural Earth · Mercator projection' :
    S.map === 'uk' ? 'Contains OS data © Crown copyright and database right 2024 · Source: Office for National Statistics (OGL) · Natural Earth' :
      `© OpenStreetMap contributors · Heights: OS Terrain 50 © Crown copyright · OS-style map, British National Grid square ${cur().L.sq || 'ST'}`;
  $('#attrib').textContent = a + ' · Version ' + VERSION;
}
function buildViewBar() {
  // one "Go to" button with a menu, instead of a row of buttons, so the top of the map stays clear
  const bar = $('#viewBar'); bar.replaceChildren();
  const opts = [];
  const add = (t, f) => opts.push([t, f]);
  if (S.map === 'world') {
    for (const [n, bb] of Object.entries(WORLD_VIEWS)) add(n === 'World' ? 'Whole world' : n, () => bb ? fitLL(bb) : home());
  } else if (S.map === 'merc') {
    const b = H('<button>⬅ Back to the world map</button>'); b.onclick = () => { S.globeTask = 'read'; save(); startMode(); }; bar.appendChild(b); return;
  } else if (S.map === 'uk') {
    for (const [n, bb] of Object.entries(UK_VIEWS)) add(n, () => bb ? fitBNG(bb) : home());
  } else {
    const m = cur();
    add('Whole map', () => home());
    const ours = m.pois.find(p => p.ours);
    if (ours) add('WFA', () => fitBox(ours.x - 700, ours.y - 700, 1400, 1400));
    for (const [n, [e, nn]] of Object.entries(m.L.views || {})) add(n, () => fitBox(e - m.L.e0 - 700, m.L.n1 - nn - 700, 1400, 1400));
  }
  const b = H('<button>🔎 Search / Go to ▾</button>');
  b.onclick = e => {
    openPop(e.currentTarget, `<input id="searchBox" type="search" placeholder="Search: country, county, city…" autocomplete="off" spellcheck="false">
      <div id="searchRes"></div>
      <h3 style="margin-top:6px">Go to</h3><div class="goto">${opts.map(([t], i) => `<button class="opt" data-v="${i}">${esc(t)}</button>`).join('')}</div>`,
    p => {
      p.querySelectorAll('[data-v]').forEach(x => x.onclick = () => { closePop(); opts[+x.dataset.v][1](); });
      const box = p.querySelector('#searchBox'), out = p.querySelector('#searchRes');
      let found = [];
      const show = () => {
        found = searchPlaces(box.value);
        out.innerHTML = box.value.trim() && !found.length ? '<p class="nores">No places found. Try a country, county, region, town or city.</p>'
          : found.map((r, i) => `<button class="opt sres" data-r="${i}">${r.flag ? `<img src="flags/${r.flag}.svg" alt="">` : '<span class="nf">📍</span>'}<span><b>${esc(r.n)}</b><small>${esc(r.sub)}</small></span></button>`).join('');
        out.querySelectorAll('[data-r]').forEach(x => x.onclick = () => { closePop(); cardTitle = 'You searched for…'; found[+x.dataset.r].act(); });
      };
      box.oninput = show;
      box.onkeydown = ev => { if (ev.key === 'Enter' && found[0]) { closePop(); cardTitle = 'You searched for…'; found[0].act(); } };
      setTimeout(() => box.focus(), 50);
    });
  };
  bar.appendChild(b);
}
function fitLL(bb, ms) {
  if (PROJ === 'globe' && S.map === 'world') {
    const [w, sth, e, n] = bb;
    centreOn((w + e) / 2, (sth + n) / 2);
    const span = Math.max(e - w, (n - sth) * 1.3);
    return goTo(GC, GC, (2 * GR * Math.sin(Math.min(90, span / 2 + 6) * RAD)) / Math.min(V.W, V.H - 64) * 1.05, ms);
  }
  const [w, s, e, n] = bb; const pts = [rob(w, n), rob(e, n), rob(w, s), rob(e, s), rob((w + e) / 2, n), rob((w + e) / 2, s)];
  const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
  const x0 = Math.min(...xs), y0 = Math.min(...ys), w0 = Math.max(...xs) - x0, h0 = Math.max(...ys) - y0;
  // leave room for the buttons along the top of the map
  const k = Math.max(w0 / V.W, h0 / Math.max(100, V.H - 64)) * 1.05;
  goTo(x0 + w0 / 2, y0 + h0 / 2 - 32 * k, k, ms);
}
function fitBNG(bb, ms) { const a = bngToUk(bb[0], bb[3]), b = bngToUk(bb[2], bb[1]); fitBox(a.x, a.y, b.x - a.x, b.y - a.y, 1.05, ms); }

/* ------------------------------------------------------------ dynamic layer: markers & labels */
function markerColour(it) { return it.id === 'school' ? '#1798d3' : it.cap ? '#d32f2f' : it.phys ? '#2e7d32' : it.res ? '#795548' : '#5e35b1'; }
function placeCat(it) { return it.k === 'river' ? 'river' : it.k === 'line' ? 'line' : it.cap ? 'cap' : it.phys ? 'phys' : it.res ? 'res' : 'place'; }
const PLACE_CATS = { cap: 'Capital cities', place: 'Cities and landmarks', phys: 'Physical features (mountains, hills, gorges)', res: 'Natural resources (mines and quarries)', line: 'Long features (mountain ranges, walls, faults)' };
function drawMarker(parent, it, opts = {}) {
  const [x, y] = it.xy;
  const g = cs(parent, x, y, 'mk' + (it.cap || it.id === 'school' ? ' capm' : '') + (opts.rev ? ' rev' : ''));
  g.dataset.id = it.id;
  E('circle', { r: 15, fill: 'transparent' }, g);
  const sg = E('g', { class: 'shape' }, g);
  sg.style.transform = `scale(calc(var(--ms, 1) * ${opts.rev ? .62 : 1}))`;          // earlier years' places are drawn smaller
  if (it.phys) E('path', { d: 'M0-13L12 9H-12z', fill: markerColour(it), stroke: '#fff', 'stroke-width': 2.5, class: 'dot' }, sg);
  else if (it.id === 'school') { E('circle', { r: 17, fill: '#fff', stroke: '#1798d3', 'stroke-width': 2.5 }, sg); E('image', { href: 'wfa-icon.png', x: -12, y: -14, width: 24, height: 27.5 }, sg); }
  else if (it.cap) E('rect', { x: -9, y: -9, width: 18, height: 18, fill: markerColour(it), stroke: '#fff', 'stroke-width': 2.5, transform: 'rotate(45)' }, sg);
  else if (it.res) E('rect', { x: -8, y: -8, width: 16, height: 16, rx: 3, fill: markerColour(it), stroke: '#fff', 'stroke-width': 2.5, class: 'dot' }, sg);
  else E('circle', { r: 9, fill: markerColour(it), class: 'dot' }, sg);
  if (opts.label) {
    const t = E('text', { x: opts.rev ? 10 : it.id === 'school' ? 21 : 15, y: opts.rev ? 5 : 6, 'font-size': opts.rev ? 15 : 18, opacity: opts.rev ? .85 : 1 }, g);
    t.textContent = it.n; t.style.transform = `translateX(calc((var(--ms, 1) - 1) * ${opts.rev ? 8 : 13}px))`;
  }
  return g;
}
function drawItemLine(parent, it, label) {
  const pts = it.pts;
  const g = E('g', { 'data-id': it.id, class: 'mkline' }, parent);
  const globeLine = it.m === 'world' && PROJ === 'globe' && it._gp;
  if (globeLine && !llPath(it._gp.pts.map(q => { const a = gpToLL(...q); return [a.lon, a.lat]; }))) { g.remove(); return g; }
  E('path', { d: globeLine ? llPath(it._gp.pts.map(q => { const a = gpToLL(...q); return [a.lon, a.lat]; })) : 'M' + pts.map(p => p.join(' ')).join('L'), class: 'feat-line', stroke: it.phys ? '#8d5524' : '#6d4c41', 'stroke-width': it.phys ? 6 : 4, 'stroke-dasharray': it.phys ? '1 9' : '10 5', opacity: .9 }, g);
  if (label) { const mid = pts[Math.floor(pts.length / 2)]; E('text', { x: 10, y: -8, 'font-size': 17, 'font-style': 'italic' }, cs(g, mid[0], mid[1], 'lbl')).textContent = it.n; }
  return g;
}
function refreshDyn() {
  const m = cur(); if (!m) return;
  m.dyn.replaceChildren();
  if (m.names) m.names.replaceChildren();
  const quiz = S.mode !== 'explore';
  if (S.map === 'world') m.g.querySelectorAll('.wl-lab').forEach(e => e.style.display = quiz ? 'none' : '');
  const names = S.mode === 'explore' && (S.map === 'world' ? S.layers.world.names : S.map === 'uk' ? S.layers.uk.names : S.layers.local.names);
  if (S.map.startsWith('local') || S.map === 'merc') { drawMapKey(); return; }
  const its = visibleItems();
  const showMk = S.map === 'world' ? S.layers.world.markers !== false : S.layers.uk.markers !== false;
  drawMapKey();
  if (!quiz && showMk) {
    const hideCats = new Set(S.layers[S.map].hideCats || []);
    for (const it of its) {
      if (hideCats.has(placeCat(it))) continue;
      const rev = yr() > 0 && !it.y.includes(yr());
      if (S.map === 'world' && PROJ === 'globe' && it.ll && !onFront(it.ll[1], it.ll[0]) && it.k === 'point') continue;
      if (it.k === 'point') drawMarker(m.dyn, it, { label: names, rev });
      else if (it.k === 'line') drawItemLine(m.dyn, it, names);
    }
  }
  if (!names) return;
  if (S.map === 'world') {
    for (const [c, ll] of Object.entries(CONT_LABEL)) { if (!onFront(ll[1], ll[0])) continue; const p = rob(ll[1], ll[0]); E('text', { class: 'pri', 'text-anchor': 'middle', 'font-size': 24, 'font-weight': 900, fill: '#3b3b3b', 'letter-spacing': 2, opacity: .8 }, cs(m.names, p.x, p.y, 'lbl')).textContent = c.toUpperCase(); }
    const seen = new Set();
    for (const [n, lat, lon] of D.world.anchors) {
      if (seen.has(n) || !onFront(lon, lat)) continue; seen.add(n);
      const p = rob(lon, lat); E('text', { 'text-anchor': 'middle', 'font-size': 19, 'font-style': 'italic', 'font-weight': 800, fill: '#1565c0' }, cs(m.names, p.x, p.y, 'lbl')).textContent = n;
    }
    m.cnames = [];
    const cur_ = new Set(its.filter(i => i.k === 'country').map(i => i.ref));
    for (const [code, c] of Object.entries(D.world.countries)) {
      if (!c.l) continue;
      if (PROJ === 'globe') { const q = gpToLL(...(c._l || c.l)); if (!onFront(q.lon, q.lat)) continue; }
      const t = E('text', { 'text-anchor': 'middle', 'font-size': cur_.has(code) ? 17 : 14, 'font-weight': cur_.has(code) ? 900 : 700, fill: cur_.has(code) ? '#111' : '#444' }, cs(m.names, c.l[0], c.l[1], 'lbl'));
      t.textContent = c.n; m.cnames.push({ t: t.parentNode, code, cur: cur_.has(code) });
    }
    zoomNames();
  } else if (S.map === 'uk') {
    for (const c of D.uk.countries) E('text', { class: 'pri', 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 900, fill: '#333', 'letter-spacing': 1.5 }, cs(m.names, c.l[0], c.l[1] + (c.n === 'England' ? -60 : 0), 'lbl')).textContent = c.n.toUpperCase();
    const seen = new Set();
    for (const [n, x, y] of D.uk.anchors) { if (seen.has(n)) continue; seen.add(n); E('text', { 'text-anchor': 'middle', 'font-size': 18, 'font-style': 'italic', 'font-weight': 800, fill: '#1565c0' }, cs(m.names, x, y, 'lbl')).textContent = n; }
    if (S.layers.uk.regions) for (const r of D.uk.regions) E('text', { 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 900, fill: '#6a3f8f' }, cs(m.names, r.l[0], r.l[1] + 30, 'lbl')).textContent = r.n;
    if (S.layers.uk.counties) {
      m.ctyNames = [];
      for (const r of D.uk.counties) { const t = cs(m.names, r.l[0], r.l[1], 'lbl'); E('text', { 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#6d4c41' }, t).textContent = r.n; m.ctyNames.push(t); }
    }
    if (S.layers.uk.rivers) for (const it of ITEMS.filter(i => i.k === 'river' && inYear(i))) {
      const lines = parsePath(D.uk.rivers[it.ref]); const L = lines.reduce((a, b) => b.length > a.length ? b : a, []);
      const mid = L[Math.floor(L.length / 2)]; if (mid) E('text', { 'font-size': 15, 'font-style': 'italic', 'font-weight': 800, fill: '#0d47a1', x: 8 }, cs(m.names, mid[0], mid[1], 'lbl')).textContent = it.n;
    }
    zoomNames();
  }
}
const POI_RANK = ['attraction', 'station', 'museum', 'hospital', 'univ', 'worship', 'school', 'tower', 'viewpoint', 'antiquity', 'info', 'golf', 'bus', 'fire', 'police', 'picnic', 'po', 'pub', 'parking'];
function poiRank(p) { return p.ours ? -1 : (POI_RANK.indexOf(p.t) + 1 || 99); }
function forcePoi(...idx) { const m = cur(); if (m && m.L) { m.force = new Set(idx); styleLocal(m); } }
let declT = 0;
function declutter() {                       // hide labels that would overlap, most important first
  cancelAnimationFrame(declT);
  declT = requestAnimationFrame(() => {
    const m = cur(); if (!m || !m.dyn) return;
    if (m.L) {                                 // OS-style map: thin symbols by importance, then labels
      const over = (r, list, pad) => list.some(o => r.left < o.right - pad && r.right > o.left + pad && r.top < o.bottom - pad && r.bottom > o.top + pad);
      const taken = [];
      if (S.layers.local.symbols) {
        if (!m.poiOrder) m.poiOrder = [...m.poiG.children].sort((a, b) => poiRank(m.pois[a.dataset.i]) - poiRank(m.pois[b.dataset.i]));
        const force = m.force || new Set();
        m.poiOrder.forEach(g => g.style.visibility = '');
        const rects = m.poiOrder.map(g => g.querySelector('use').getBoundingClientRect());
        m.poiOrder.forEach((g, i) => { if (force.has(+g.dataset.i)) taken.push(rects[i]); });
        const gap = clamp((V.k - 2) * -2.5, -14, 3);   // zoomed out: give each symbol more room, so fewer show
        m.poiOrder.forEach((g, i) => {
          if (force.has(+g.dataset.i)) return;
          if (over(rects[i], taken, gap)) g.style.visibility = 'hidden'; else taken.push(rects[i]);
        });
      }
      if (S.layers.local.symbols) m.poiG.querySelectorAll('text').forEach(t => taken.push(t.getBoundingClientRect()));
      if (!S.layers.local.names) return;
      const labs = [...m.labs.children];
      labs.forEach(g => g.style.visibility = '');
      labs.map(g => [g, g.getBoundingClientRect()]).forEach(([g, r]) => {
        if (!r.width) return;
        const hit = taken.some(o => r.left < o.right - 2 && r.right > o.left + 2 && r.top < o.bottom - 2 && r.bottom > o.top + 2);
        if (hit) g.style.visibility = 'hidden'; else taken.push(r);
      });
      return;
    }
    // 1. markers: where they pile up, keep the most important (this year's capitals first)
    const mks = [...m.dyn.querySelectorAll('.mk')];
    const rank = g => (g.classList.contains('rev') ? 2 : 0) + (g.classList.contains('capm') ? 0 : 1);
    mks.sort((a, b) => rank(a) - rank(b));
    mks.forEach(g => g.style.visibility = '');
    const taken = [], revShapes = [];
    for (const g of mks) {
      const r = g.querySelector('.shape').getBoundingClientRect();
      if (taken.some(o => r.left < o.right + 2 && r.right > o.left - 2 && r.top < o.bottom + 2 && r.bottom > o.top - 2)) g.style.visibility = 'hidden';
      else { taken.push(r); if (g.classList.contains('rev')) revShapes.push(r); }
    }
    // this year's labels may sit over small earlier-year markers, so leave those out until later
    const labelTaken = taken.filter(r => !revShapes.includes(r));
    // 2. labels
    const shown = t => { const mk = t.closest('.mk'); return !mk || mk.style.visibility !== 'hidden'; };
    const groups = [
      [...m.dyn.querySelectorAll('.capm:not(.rev) text')],
      [...(m.names ? m.names.querySelectorAll('text.pri') : [])],
      [...m.dyn.querySelectorAll('.mk:not(.capm):not(.rev) text, .mkline text')],
      [...m.dyn.querySelectorAll('.mk.rev text')],
      [...(m.names ? m.names.querySelectorAll('text:not(.pri)') : [])].filter(t => t.parentNode.style.display !== 'none'),
    ];
    const nMain = groups.slice(0, 3).flat().filter(shown).length;
    const all = groups.flat().filter(shown);
    all.forEach(t => t.style.visibility = '');
    const rects = all.map(t => t.getBoundingClientRect());
    const list = labelTaken;
    all.forEach((t, i) => {
      if (i === nMain) list.push(...revShapes);           // now the small markers count too
      const r = rects[i];
      if (!r.width) return;
      const hit = list.some(o => r.left < o.right - 1 && r.right > o.left + 1 && r.top < o.bottom - 1 && r.bottom > o.top + 1);
      if (hit) t.style.visibility = 'hidden'; else list.push(r);
    });
  });
}
function zoomNames() {
  const m = cur(); if (!m) return;
  declutter();
  if (S.map === 'world' && m.cnames) {
    for (const c of m.cnames) { const w = (m.countryW[c.code] || { w: 0 }).w / V.k; c.t.style.display = (c.cur ? w > 14 || V.k < 1.4 : w > 70) ? '' : 'none'; }
  }
  if (S.map === 'uk' && m.ctyNames) for (const t of m.ctyNames) t.style.display = V.k < .9 ? '' : 'none';
}

/* ------------------------------------------------------------ view change hooks: rulers, scale bar */
function onViewChange() {
  zoomNames();
  svg.classList.toggle('zoomed', V.k < 3.6);
  const m = cur();
  if (m && m.L) {
    m.tenths.style.display = tenthsOn() ? '' : 'none';
    drawRulers(m);
  }
  drawScale();
}
function drawRulers(m) {
  // grid numbers sit on strips that hug the edges of the map, not the edges of the screen
  const L = m.L, rb = $('#rulerB'), rl = $('#rulerL');
  const x0 = V.cx - V.W / 2 * V.k, y0 = V.cy - V.H / 2 * V.k;
  const sxL = -x0 / V.k, sxR = (m.b.w - x0) / V.k, syT = -y0 / V.k, syB = (m.b.h - y0) / V.k;
  const RW = 52, RH = 40;
  const lx = clamp(sxL - RW, 0, V.W - RW), by = clamp(syB, 0, V.H - RH);
  const lTop = Math.max(0, syT), lBot = Math.min(by, V.H - RH);
  const bLeft = lx, bRight = Math.min(V.W, Math.max(sxR, bLeft + RW + 10));
  Object.assign(rl.style, { left: lx + 'px', top: lTop + 'px', height: Math.max(0, lBot - lTop) + 'px', bottom: 'auto' });
  Object.assign(rb.style, { left: bLeft + 'px', top: by + 'px', width: Math.max(0, bRight - bLeft) + 'px', right: 'auto', bottom: 'auto' });
  let hb = '', hl = '';
  const showT = tenthsOn() && S.layers.local.tenthNums !== false;   // tenths numbers on the edge strips
  for (let e = Math.ceil(L.e0 / 100) * 100; e <= L.e1; e += 100) {
    const sx = (e - L.e0 - x0) / V.k;
    if (sx < lx + RW + 4 || sx > bRight - 8) continue;
    if (e % 1000 === 0) hb += `<span style="left:${sx - bLeft}px">${String(Math.floor(e / 1000) % 100).padStart(2, '0')}</span>`;
    else if (showT) hb += `<span class="t" style="left:${sx - bLeft}px">${(e / 100) % 10}</span>`;
  }
  for (let n = Math.ceil(L.n0 / 100) * 100; n <= L.n1; n += 100) {
    const sy = (L.n1 - n - y0) / V.k;
    if (sy < lTop + 8 || sy > lBot - 6) continue;
    if (n % 1000 === 0) hl += `<span style="top:${sy - lTop}px">${String(Math.floor(n / 1000) % 100).padStart(2, '0')}</span>`;
    else if (showT) hl += `<span class="t" style="top:${sy - lTop}px">${(n / 100) % 10}</span>`;
  }
  rb.innerHTML = hb; rl.innerHTML = hl;
  $('#zoomBar').style.left = (lx >= 100 ? lx - 86 : lx + RW + 14) + 'px';
}
function drawScale() {
  // a scale bar for maps where distance is the same everywhere (UK and OS maps)
  const el = $('#scaleBar');
  const mpp = S.map === 'uk' ? V.k * D.uk.s : S.map.startsWith('local') ? V.k : 0;   // metres per screen pixel
  if (!mpp) { el.hidden = true; return; }
  el.hidden = false;
  let best = 100;
  for (const v of [50, 100, 200, 250, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000]) if (Math.abs(v / mpp - 170) < Math.abs(best / mpp - 170)) best = v;
  const px = best / mpp, half = best / 2;
  const fmt = v => v >= 1000 ? (v / 1000) + ' km' : v + ' m';
  el.innerHTML = `<div class="sb-bar" style="width:${px}px"><i></i><i></i></div><div class="sb-lab"><span>0</span>${px >= 150 ? `<span style="left:${px / 2}px">${fmt(half)}</span>` : ''}<span style="left:${px}px">${fmt(best)}</span></div>`;
}

/* ------------------------------------------------------------ hit testing */
const DPt = (x, y) => new DOMPoint(x, y);
function inPaths(paths, p, slackPx = 0) {
  const pt = DPt(p.x, p.y);
  for (const el of paths) {
    if (el.isPointInFill(pt)) return true;
    if (slackPx) {                         // small countries: accept a near miss
      const bb = el.getBBox(), s = slackPx * V.k;
      if (bb.width / V.k < 30 && bb.height / V.k < 30 && p.x > bb.x - s && p.x < bb.x + bb.width + s && p.y > bb.y - s && p.y < bb.y + bb.height + s) return true;
    }
  }
  return false;
}
function worldLandAt(p) { const pt = DPt(p.x, p.y); return cur().parts.find(el => el.isPointInFill(pt)) || null; }
function worldOceanAt(p) {
  const ll = robInv(p.x, p.y); if (!ll) return null;
  if (ll.lat < -60) return 'Southern Ocean';
  let best = null, bd = Infinity;
  for (const [n, lat, lon] of D.world.anchors) { const d = km(ll, { lat, lon }); if (d < bd) { bd = d; best = n; } }
  return best;
}
function ukLandAt(p) {
  const m = built.uk, pt = DPt(p.x, p.y);
  return m.ctry.find(el => el.isPointInFill(pt)) || [...m.g.querySelectorAll('path[data-n]')].find(el => !el.classList.contains('ukr') && !el.classList.contains('ukcty') && el.isPointInFill(pt)) || null;
}
function ukSeaAt(p) {
  let best = null, bd = Infinity;
  for (const [n, x, y] of D.uk.anchors) { const d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; best = n; } }
  return best;
}
function distKm(it, a, b) {                // a, b in map units on the item's map
  if (it.m === 'world') { const A = robInv(a.x, a.y), B = robInv(b.x, b.y); return A && B ? km(A, B) : Infinity; }
  return Math.hypot(a.x - b.x, a.y - b.y) * D.uk.s / 1000;
}
function itemLines(it) { return it.k === 'river' ? (it._lines ||= parsePath(D.uk.rivers[it.ref])) : [it.pts]; }
function isHit(it, p) {
  const m = cur();
  switch (it.k) {
    case 'country': return inPaths(m.parts.filter(e => e.dataset.code === it.ref), p, 14);
    case 'group': return inPaths(m.parts.filter(e => it.refs.includes(e.dataset.code)), p, 14);
    case 'continent': return inPaths(m.parts.filter(e => e.dataset.cont === it.ref), p);
    case 'ocean': return !worldLandAt(p) && worldOceanAt(p) === it.ref;
    case 'latline': { const ll = robInv(p.x, p.y); return !!ll && Math.abs(ll.lat - it.lat) < 3.5; }
    case 'lonline': { const ll = robInv(p.x, p.y); return !!ll && Math.abs(ll.lon - it.lon) < 4; }
    case 'pole': { const ll = robInv(p.x, p.y); return !!ll && (it.lat > 0 ? ll.lat > 70 : ll.lat < -72); }
    case 'hemi': { const ll = robInv(p.x, p.y); if (!ll) return false; return { N: ll.lat > 0, S: ll.lat < 0, E: ll.lon > 0, W: ll.lon < 0 }[it.ref]; }
    case 'ukcountry': return inPaths(m.ctry.filter(e => e.dataset.n === it.ref), p);
    case 'region': return inPaths(m.regs.filter(e => e.dataset.n === it.ref), p);
    case 'county': return inPaths(m.ctys.filter(e => e.dataset.n === it.ref), p, 10);
    case 'sea': return !ukLandAt(p) && ukSeaAt(p) === it.ref;
    case 'point': { const t = { x: it.xy[0], y: it.xy[1] }; return distKm(it, p, t) <= it.tol || Math.hypot(p.x - t.x, p.y - t.y) / V.k < 30; }
    case 'line': case 'river': { const q = nearestOnLines(itemLines(it), p); return !!q && (distKm(it, p, q) <= (it.tol || 10) || q.d / V.k < 26); }
  }
  return false;
}
function targetPoint(it, from) {             // a sensible point on the target, for hints and arrows
  const m = cur();
  const bbC = els => { let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (const e of els) { const b = e.getBBox(); if (b.width * b.height < 1) continue; x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height); } return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, box: [x0, y0, x1 - x0, y1 - y0] }; };
  switch (it.k) {
    case 'point': return { x: it.xy[0], y: it.xy[1], box: [it.xy[0] - 1, it.xy[1] - 1, 2, 2] };
    case 'line': case 'river': { const L = itemLines(it), q = nearestOnLines(L, from || { x: L[0][0][0], y: L[0][0][1] }); const all = L.flat(); const xs = all.map(a => a[0]), ys = all.map(a => a[1]); return { x: q.x, y: q.y, box: [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)] }; }
    case 'country': { const c = D.world.countries[it.ref]; const b = bbC(m.parts.filter(e => e.dataset.code === it.ref)); return c && c.l ? { x: c.l[0], y: c.l[1], box: b.box } : b; }
    case 'group': return bbC(m.parts.filter(e => it.refs.includes(e.dataset.code)));
    case 'continent': { const ll = CONT_LABEL[it.ref], p = rob(ll[1], ll[0]); const b = bbC(m.parts.filter(e => e.dataset.cont === it.ref)); return { x: p.x, y: p.y, box: b.box }; }
    case 'ocean': case 'sea': {
      let best = null, bd = Infinity;
      const list = it.k === 'ocean' ? D.world.anchors.filter(([, lat, lon]) => onFront(lon, lat)).map(([n, lat, lon]) => [n, rob(lon, lat)]) : D.uk.anchors.map(([n, x, y]) => [n, { x, y }]);
      for (const [n, q] of list) if (n === it.ref) { const d = from ? Math.hypot(q.x - from.x, q.y - from.y) : 0; if (d < bd) { bd = d; best = q; } }
      return { x: best.x, y: best.y, box: [best.x - 300, best.y - 300, 600, 600] };
    }
    case 'latline': { if (PROJ === 'globe') { const q = rob(GLOBE.lon, it.lat); return { x: q.x, y: q.y, box: [q.x - 300, q.y - 200, 600, 400] }; } const y = rob(0, it.lat).y; return { x: from ? from.x : WW / 2, y, box: [0, y - 200, WW, 400] }; }
    case 'lonline': { const p = rob(0, PROJ === 'globe' ? GLOBE.lat : from ? (robInv(from.x, from.y) || { lat: 0 }).lat : 0); return { x: p.x, y: p.y, box: [WW / 2 - 300, 0, 600, WH] }; }
    case 'pole': { const p = rob(from ? clamp((robInv(from.x, from.y) || { lon: 0 }).lon, -170, 170) : 0, it.lat > 0 ? 88 : -88); return { x: p.x, y: p.y, box: [0, it.lat > 0 ? 0 : WH - 400, WW, 400] }; }
    case 'hemi': { const gl = PROJ === 'globe' ? GLOBE.lon : 0; const p = { N: rob(gl, 45), S: rob(gl, -45), E: rob(PROJ === 'globe' ? clamp(GLOBE.lon, 20, 160) : 90, 0), W: rob(PROJ === 'globe' ? clamp(GLOBE.lon, -160, -20) : -90, 0) }[it.ref]; return { x: p.x, y: p.y, box: [0, 0, WW, WH] }; }
    case 'ukcountry': { const c = D.uk.countries.find(c => c.n === it.ref); return { x: c.l[0], y: c.l[1], box: bbC(m.ctry.filter(e => e.dataset.n === it.ref)).box }; }
    case 'region': { const c = D.uk.regions.find(c => c.n === it.ref); return { x: c.l[0], y: c.l[1], box: bbC(m.regs.filter(e => e.dataset.n === it.ref)).box }; }
    case 'county': { const c = D.uk.counties.find(c => c.n === it.ref); return { x: c.l[0], y: c.l[1], box: bbC(m.ctys.filter(e => e.dataset.n === it.ref)).box }; }
  }
  return null;
}
function highlightItem(it, cls = 'hl') {
  const m = cur(); clearHL(cls);
  const add = els => els.forEach(e => e.classList.add(cls));
  if (it.k === 'country') add(m.parts.filter(e => e.dataset.code === it.ref));
  else if (it.k === 'group') add(m.parts.filter(e => it.refs.includes(e.dataset.code)));
  else if (it.k === 'continent') add(m.parts.filter(e => e.dataset.cont === it.ref));
  else if (it.k === 'ukcountry') add(m.ctry.filter(e => e.dataset.n === it.ref));
  else if (it.k === 'region') { $('#uk-reg').style.visibility = ''; add(m.regs.filter(e => e.dataset.n === it.ref)); }
  else if (it.k === 'county') { $('#uk-cty').style.visibility = ''; add(m.ctys.filter(e => e.dataset.n === it.ref)); }
  else {
    const g = E('g', { class: 'hlx' }, ov);
    if (it.k === 'point') { drawMarker(g, it, { label: true }); const pg = cs(g, it.xy[0], it.xy[1]); E('circle', { class: 'pulse', r: 16 }, pg); }
    else if (it.k === 'line' || it.k === 'river') {
      for (const L of itemLines(it)) E('path', { d: 'M' + L.map(p => p.join(' ')).join('L'), class: 'feat-line blink', stroke: '#ffb300', 'stroke-width': 9 }, g);
      const t = targetPoint(it); E('text', { x: 12, y: -10, 'font-size': 20 }, cs(g, t.x, t.y, 'lbl')).textContent = it.n;
    } else if (it.k === 'latline' || it.k === 'lonline') {
      const pts = []; if (it.k === 'latline') { pts.push(rob(-180, it.lat), rob(180, it.lat)); } else for (let lat = -90; lat <= 90; lat += 5) pts.push(rob(it.lon, lat));
      E('path', { d: 'M' + pts.map(p => p.x + ' ' + p.y).join('L'), class: 'feat-line blink', stroke: '#ffb300', 'stroke-width': 9 }, g);
    } else if (it.k === 'hemi') {
      const pts = [];
      if (it.ref === 'N' || it.ref === 'S') { const s = it.ref === 'N' ? 1 : -1; for (let lon = -180; lon <= 180; lon += 10) pts.push(rob(lon, 0)); for (let lat = 0; lat <= 90; lat += 5) pts.push(rob(180, s * lat)); for (let lat = 90; lat >= 0; lat -= 5) pts.push(rob(-180, s * lat)); }
      else { const s = it.ref === 'E' ? 1 : -1; for (let lat = -90; lat <= 90; lat += 5) pts.push(rob(0, lat)); for (let lat = 90; lat >= -90; lat -= 5) pts.push(rob(180 * s, lat)); }
      E('path', { d: 'M' + pts.map(p => p.x + ' ' + p.y).join('L') + 'z', fill: '#ffd54a', opacity: .45 }, g);
    } else if (it.k === 'pole') { const t = targetPoint(it); const pg = cs(g, t.x, t.y); E('circle', { class: 'pulse', r: 16 }, pg); E('circle', { r: 10, fill: '#ffb300', stroke: '#fff', 'stroke-width': 3 }, pg); }
    else if (it.k === 'ocean' || it.k === 'sea') {
      const anchors = it.k === 'ocean' ? D.world.anchors.filter(a => a[0] === it.ref).map(a => rob(a[2], a[1])) : D.uk.anchors.filter(a => a[0] === it.ref).map(a => ({ x: a[1], y: a[2] }));
      const a0 = anchors[0]; const lg = cs(g, a0.x, a0.y);
      E('circle', { class: 'pulse', r: 16 }, lg); E('text', { 'text-anchor': 'middle', y: 8, 'font-size': 26, 'font-weight': 900, fill: '#0d47a1', class: 'lbl' }, lg).textContent = it.n;
    }
  }
}
function clearHL(cls) {
  for (const c of cls ? [cls] : ['hl', 'sel']) document.querySelectorAll('.' + c).forEach(e => e.classList.remove(c));
  ov.querySelectorAll('.hlx').forEach(e => e.remove());
  const m = built.uk; if (m && S.map === 'uk') styleUK(m);
}

const THE = /^(Equator|Tropic|Prime|Arctic (Circle|Ocean)|Antarctic Circle|North Pole|South Pole|North Sea|Irish Sea|English Channel|(Northern|Southern|Eastern|Western) hemisphere|Southern (Ocean|Uplands)|River|Grand|Peak|Lake|Severn|Somerset Levels|Cotswold|Black|Grampian|Scottish|Mendip|Brecon|White|Angel|Eden|San Andreas|Atlas|Appalachian|British|Royal|Clifton|Avon Gorge|Alps|Andes|Himalayas|Pennines|Netherlands|United|Czech|Mediterranean|Pacific|Atlantic|Indian|South West|South East|North West|North East|East|West Midlands)/;
const cap1 = s => s[0].toUpperCase() + s.slice(1);
function theName(it) { const n = it.n || it; return n.startsWith('Our ') ? 'our ' + n.slice(4) : THE.test(n) ? 'the ' + n : n; }

/* ------------------------------------------------------------ panel helpers */
const panel = $('#panelBody');
function scrollEnd() { requestAnimationFrame(() => { panel.scrollTop = panel.scrollHeight; }); }
function setPanel(html) { panel.innerHTML = html; panel.scrollTop = 0; return panel; }
function factHTML(f) { return f ? `<div class="fact"><b>Did you know?</b>${esc(f)}</div>` : ''; }
const PRAISE = ['Brilliant!', 'Spot on!', 'Super geography!', 'Fantastic!', 'Great map skills!', 'Well done!', 'Superb!'];
const NEARLY = ['Not quite!', 'So close!', 'Good try!', 'Nearly!'];
function teamAwardHTML() {
  if (!S.teams) return '';
  return `<div><p class="ptitle">Give a point to</p><div class="chips">${teamList().map((t, i) => `<button class="chip" data-award="${i}" style="background:${t.c};color:#fff">${t.n}</button>`).join('')}</div></div>`;
}
function wireAward(root) { root.querySelectorAll('[data-award]').forEach(b => b.onclick = () => { S.scores[+b.dataset.award]++; save(); drawTeams(); root.querySelectorAll('[data-award]').forEach(x => x.disabled = true); b.textContent += ' ✓'; }); }
function progressHTML(Q) { return Q.n === Infinity ? `<div class="prog"><span>Question ${Q.idx + 1}</span><span>⭐ ${Q.score}</span></div>` : `<div class="prog"><span>Question ${Q.idx + 1} of ${Q.n}</span><span>⭐ ${Q.score}</span></div>`; }
function endHTML(Q, again) {
  const pct = Q.score / Math.max(1, Q.n);
  const msg = pct >= .9 ? 'Outstanding geographers!' : pct >= .7 ? 'Fantastic work!' : pct >= .5 ? 'Great effort — keep exploring!' : 'Good practice — let’s try some more!';
  return `<div class="qcard" style="text-align:center"><div style="font-size:64px">🏆</div><div class="big">${Q.score} out of ${Q.n}</div><p class="q">${msg}</p></div><button class="btn" id="again">${again || 'Play again'}</button>`;
}

/* ------------------------------------------------------------ tap dispatch */
function onTap(cx, cy) {
  if (tool) return;
  const p = toMap(cx, cy);
  if (S.mode === 'explore') exploreTap(p, cx, cy);
  else if (S.mode === 'find') findTap(p);
  else if (S.mode === 'grid') gridTap(p, cx, cy);
  else if (S.mode === 'globe') globeTap(p);
}

/* ------------------------------------------------------------ EXPLORE */
function exploreStart() {
  ov.replaceChildren(); clearHL();
  if (S.map.startsWith('local')) {
    setPanel(`<p class="ptitle">Explore</p><div class="qcard"><p class="q">Tap a symbol to find out what it is.</p><p class="hint">Tap anywhere else to see its grid square.</p></div>
      <button class="btn sec" id="tenthsBtn">▦ Tenths: ${TENTHS[tenthsMode()][0]} ▾</button>
      <button class="btn sec" id="keyBtn">🔑 Show the key</button>
      <button class="btn sec" id="printBtn">🖨️ Print a worksheet of this view</button>
      <p class="hint">Drag to move the map. Use ＋ and － to zoom in and out. Blue lines are grid lines, 1 km apart.</p>`);
    $('#keyBtn').onclick = showKey;
    $('#tenthsBtn').onclick = e => tenthsPicker(e.currentTarget, () => { exploreStart(); if (tenthsMode() !== 'none' && V.k >= 2.8) toast('Zoom in to see the 100 m lines'); });
    $('#printBtn').onclick = printSheet;
  } else {
    const its = visibleItems();
    setPanel(`<p class="ptitle">Explore</p><div class="qcard"><p class="q">Tap anything on the map to find out about it.</p><p class="hint">${S.map === 'world' ? 'Countries, oceans, cities and landmarks' : 'Countries, seas, cities, rivers and landmarks'} for ${yr() ? 'Year ' + yr() : 'all years'}: ${its.length} places to explore.</p></div>
      ${legendHTML()}
      <p class="hint">Drag to move the map. Pinch, scroll or use ＋ and － to zoom.</p>
      <button class="btn sec" id="printBtn">🖨️ Print a worksheet of this view</button>`);
    $('#printBtn').onclick = printSheet;
  }
}
function drawMapKey() {
  const el = $('#mapKey');
  const on = (S.map === 'world' || S.map === 'uk') && S.mode === 'explore' && S.layers[S.map].markers !== false && !S.mapKeyOff;
  el.hidden = !on; if (!on) return;
  const hc = new Set(S.layers[S.map].hideCats || []);
  const row = (svgInner, t) => `<div><svg width="22" height="22" viewBox="-14 -14 28 28">${svgInner}</svg>${t}</div>`;
  el.innerHTML = `<button id="mapKeyX" aria-label="Hide the key">×</button><b>Key</b>
    ${hc.has('cap') ? '' : row('<rect x="-8" y="-8" width="16" height="16" fill="#d32f2f" stroke="#fff" stroke-width="2" transform="rotate(45)"/>', 'Capital city')}
    ${hc.has('place') ? '' : row('<circle r="8" fill="#5e35b1" stroke="#fff" stroke-width="2"/>', 'City or landmark')}
    ${hc.has('phys') ? '' : row('<path d="M0-11L10 8H-10z" fill="#2e7d32" stroke="#fff" stroke-width="2"/>', 'Physical feature')}
    ${hc.has('res') || !visibleItems().some(i => i.res) ? '' : row('<rect x="-7" y="-7" width="14" height="14" rx="3" fill="#795548" stroke="#fff" stroke-width="2"/>', 'Natural resource')}
    ${hc.has('line') ? '' : row('<path d="M-12 0H12" stroke="#8d5524" stroke-width="4" stroke-dasharray="1 5" stroke-linecap="round"/>', 'Mountain range')}
    ${S.map === 'world' && S.layers.world.biomes ? Object.entries(BIOMES).map(([k, b]) => row(`<rect x="-11" y="-11" width="22" height="22" rx="3" fill="${b.c}" stroke="#999"/>`, b.n)).join('') : ''}
    ${S.map === 'world' && S.layers.world.plates ? row('<path d="M-12 0H12" stroke="#c62828" stroke-width="3"/>', 'Plate boundary') : ''}
    ${S.map === 'world' && S.layers.world.climate ? row('<rect x="-11" y="-11" width="22" height="22" fill="rgba(255,112,67,.45)"/>', 'Tropical zone') + row('<rect x="-11" y="-11" width="22" height="22" fill="rgba(102,187,106,.4)"/>', 'Temperate zone') + row('<rect x="-11" y="-11" width="22" height="22" fill="rgba(66,165,245,.5)"/>', 'Polar zone') : ''}
    ${S.map === 'uk' && S.layers.uk.rivers ? row('<path d="M-12 0H12" stroke="#1e88e5" stroke-width="4"/>', 'River') : ''}
    ${yr() && S.revision ? `<div class="small">Small symbols: earlier years</div>` : ''}
    ${S.map === 'world' && PROJ === 'merc' ? `<div class="small" style="color:#b0351f">Mercator map: sizes near the poles<br>look much too big</div>` : ''}`;
  $('#mapKeyX').onclick = () => { S.mapKeyOff = true; save(); drawMapKey(); toast('The key is in 📍 Places if you want it back'); };
}
const BIOMES = {
  rainforest: { n: 'Tropical rainforest', c: '#1e8a46', f: 'Tropical rainforests are hot and wet all year. They have tall trees and more kinds of plants and animals than anywhere else on Earth. The Amazon is the biggest.' },
  tropdry: { n: 'Tropical dry forest', c: '#9ccc65', f: 'Tropical dry forests are warm all year but have a long dry season, when many trees lose their leaves to save water.' },
  savanna: { n: 'Savanna', c: '#e8c95a', f: 'Savannas are hot grasslands with scattered trees. They have a wet season and a dry season. Lions, zebras and elephants live on the African savanna.' },
  desert: { n: 'Desert', c: '#f5e2b0', f: 'Deserts get very little rain. Days can be very hot and nights can be cold. The Sahara is the largest hot desert.' },
  med: { n: 'Mediterranean', c: '#c0a24a', f: 'Mediterranean places have hot, dry summers and mild, wet winters. Shrubs and small trees such as olives grow there, like on the east coast of Spain.' },
  tempforest: { n: 'Temperate forest', c: '#66bb6a', f: 'Temperate forests have four seasons, with mild summers and cool winters. Most of the UK would naturally be covered by this kind of forest.' },
  grassland: { n: 'Temperate grassland', c: '#d4e157', f: 'Temperate grasslands are huge open plains with few trees, warm summers and cold winters, such as the prairies of North America and the steppes of Asia.' },
  taiga: { n: 'Boreal forest (taiga)', c: '#2f6f62', f: 'Boreal forests (taiga) have long, very cold winters and short summers. They are huge forests of conifer trees across the north of Canada, Scandinavia and Russia.' },
  tundra: { n: 'Tundra', c: '#b8cbc5', f: 'Tundra is cold and has no trees. Under the surface, the ground stays frozen all year. Only small plants like mosses grow there.' },
  mountain: { n: 'Mountain grassland', c: '#a1887f', f: 'Mountain grasslands are high, cool and windy places with grasses and shrubs, such as the Andes and the plateau of Tibet.' },
  ice: { n: 'Ice sheet', c: '#f2f8fc', f: 'Ice sheets are land covered in thick ice all year round, like most of Antarctica and Greenland.' },
};
let biomeData = null, biomeLoading = false;
function loadBiomes(m) {
  const fill = () => {
    const g = m.g.querySelector('#w-biomes');
    if (g.childElementCount) return;
    for (const [k, d] of Object.entries(biomeData)) if (BIOMES[k]) E('path', { d: reprojD(d), fill: BIOMES[k].c, stroke: 'none', 'data-biome': k }, g);
  };
  if (biomeData) return fill();
  if (biomeLoading) return;
  biomeLoading = true;
  fetch('biomes.json?v=' + VERSION).then(r => r.json()).then(j => { biomeData = j; fill(); }).catch(() => toast('Could not load the biomes layer')).finally(() => { biomeLoading = false; });
}
function biomeAt(p) {
  const m = cur(); if (!m || S.map !== 'world' || !S.layers.world.biomes) return null;
  const pt = DPt(p.x, p.y);
  const e = [...m.g.querySelectorAll('#w-biomes path')].find(x => x.isPointInFill(pt));
  return e ? BIOMES[e.dataset.biome] : null;
}
function legendHTML() {
  const row = (svgInner, t) => `<div style="display:flex;align-items:center;gap:12px;font-weight:800;font-size:calc(18px*var(--fs))"><svg width="34" height="34" viewBox="-17 -17 34 34">${svgInner}</svg>${t}</div>`;
  return `<div style="display:flex;flex-direction:column;gap:6px">${row('<rect x="-9" y="-9" width="18" height="18" fill="#d32f2f" stroke="#fff" stroke-width="2.5" transform="rotate(45)"/>', 'Capital city')}${row('<circle r="9" fill="#5e35b1" stroke="#fff" stroke-width="2.5"/>', 'City or landmark')}${row('<path d="M0-13L12 9H-12z" fill="#2e7d32" stroke="#fff" stroke-width="2.5"/>', 'Physical feature')}${S.map === 'uk' ? row('<path d="M-14 0H14" stroke="#1e88e5" stroke-width="4"/>', 'River') : ''}</div>`;
}
function exploreTap(p, cx, cy) {
  clearHL(); ov.querySelectorAll('.tapdot').forEach(e => e.remove());
  if (S.map.startsWith('local')) return localExplore(p);
  // markers first
  const hit = document.elementsFromPoint(cx, cy).map(e => e.closest('[data-id]')).find(Boolean);
  if (hit) { const it = byId[hit.dataset.id]; showItemCard(it); highlightItem(it, 'sel'); return; }
  const m = cur();
  // lines (mountain ranges, rivers) near the tap
  // long features and rivers only win if the tap is almost on the line (so counties underneath still work)
  const mkOn = S.layers[S.map] && S.layers[S.map].markers !== false, hc = new Set((S.layers[S.map] || {}).hideCats || []);
  const lineItems = visibleItems().filter(i => (i.k === 'line' && mkOn && !hc.has('line')) || (i.k === 'river' && S.layers.uk.rivers));
  let bestLine = null, bestD = 9;
  for (const it of lineItems) { const q = nearestOnLines(itemLines(it), p); if (q && q.d / V.k < bestD) { bestD = q.d / V.k; bestLine = it; } }
  if (bestLine) { showItemCard(bestLine); highlightItem(bestLine, 'sel'); return; }
  if (S.map === 'world') {
    const part = worldLandAt(p);
    if (part) {
      const code = part.dataset.code, cont = part.dataset.cont, bio = biomeAt(p);
      if (PROJ === 'globe') {                 // spin the globe to bring the country to the front, then show it
        const c = D.world.countries[code], q = gpToLL(...(c._l || c.l));
        return spinTo(q.lon, q.lat, () => countryCard(code, cont, bio, true));
      }
      countryCard(code, cont, bio, false);
      return;
    }
    const ll = robInv(p.x, p.y); if (!ll) return;
    const o = worldOceanAt(p); const it = ITEMS.find(i => i.m === 'world' && i.k === 'ocean' && i.ref === o);
    showCard(o, o.includes('Sea') ? 'A sea' : 'An ocean', [['Hemisphere', (ll.lat >= 0 ? 'Northern' : 'Southern') + ' and ' + (ll.lon >= 0 ? 'eastern' : 'western')]], it && it.f);
    if (it) highlightItem(it, 'sel');
    return;
  }
  // UK
  const pt = DPt(p.x, p.y);
  const tryLayer = (els, label, kind) => {
    const e = els.find(x => x.isPointInFill(pt)); if (!e) return false;
    const n = e.dataset.n; const it = ITEMS.find(i => i.m === 'uk' && i.k === kind && i.ref === n);
    e.classList.add('sel');
    const country = m.ctry.find(x => x.isPointInFill(pt));
    showCard(kind === 'county' ? n.replace('Bristol', 'City of Bristol') : n, label, country ? [['Country', country.dataset.n]] : [], (it && it.f || '') + (kind === 'ukcountry' && n === 'Northern Ireland' ? ' ' + NI_NOTE : ''), kind === 'ukcountry' ? UK_FLAGS[n] : null);
    return true;
  };
  if (S.layers.uk.counties && tryLayer(m.ctys, 'A county in England', 'county')) return;
  if (S.layers.uk.regions && tryLayer(m.regs, 'A region of England', 'region')) return;
  if (tryLayer(m.ctry, 'A country in the United Kingdom', 'ukcountry')) return;
  const land = ukLandAt(p);
  if (land) { showCard(land.dataset.n, land.dataset.n === 'Isle of Man' ? 'An island in the Irish Sea (not part of the UK)' : 'A country near the United Kingdom', [], ''); return; }
  const sea = ukSeaAt(p); const it = ITEMS.find(i => i.m === 'uk' && i.k === 'sea' && i.ref === sea);
  showCard(sea, sea.includes('Ocean') ? 'An ocean' : sea.includes('Channel') ? 'A stretch of sea' : 'A sea', [], it && it.f);
  if (it) highlightItem(it, 'sel');
}
const UK_FLAGS = { England: 'gb-eng', Scotland: 'gb-sct', Wales: 'gb-wls', London: 'gb-eng', Cardiff: 'gb-wls', Edinburgh: 'gb-sct' };
function flagFor(it) {                        // flag code for an item or a country code
  if (typeof it === 'string') return (D.world.countries[it] || {}).f || null;
  if (it.k === 'country') return (D.world.countries[it.ref] || {}).f || null;
  if (it.k === 'ukcountry' || (it.m === 'uk' && it.cap)) return UK_FLAGS[it.ref || it.n] || null;
  if (it.m === 'world' && it.cap) { const c = Object.values(D.world.countries).find(c => c.cap && c.cap.split(' / ').includes(it.n)); return c ? c.f : null; }
  return null;
}
const flagImg = (f, h = 80, alt = '') => f ? `<img class="flag" src="flags/${f}.svg" alt="${esc(alt)}" style="height:${h}px">` : '';
const NI_NOTE = 'Northern Ireland does not have its own official flag. The Union Flag of the United Kingdom is used there.';
function countryCard(code, cont, bio, zoom) {
  const m = cur(), c = D.world.countries[code];
  const parts = m.parts.filter(e => e.dataset.code === code);
  parts.forEach(e => e.classList.add('sel'));
  if (zoom && parts.length) {
    const big = parts.reduce((a, b) => (b.getBBox().width * b.getBBox().height > a.getBBox().width * a.getBBox().height ? b : a)), bb = big.getBBox();
    const w = Math.max(bb.width, 700), h = Math.max(bb.height, 700);
    fitBox(bb.x + bb.width / 2 - w / 2, bb.y + bb.height / 2 - h / 2, w, h, 1.6);
  }
  const it = ITEMS.find(i => i.m === 'world' && i.k === 'country' && i.ref === code);
  if (bio) showCard(c.n, 'A country in ' + (cont === 'Islands' ? 'the ocean' : cont), [['Biome here', bio.n], ['Capital city', c.cap || '—']], bio.f, c.f);
  else showCard(c.n, code === 'RUS' ? 'A country in Europe and Asia' : code === 'GBR' ? 'Our country — in Europe' : 'A country in ' + (cont === 'Islands' ? 'the ocean' : cont), [['Continent', code === 'RUS' ? 'Europe and Asia' : cont], ['Capital city', c.cap || '—']], it && it.f, c.f);
  // a button to jump between the globe and the flat map, keeping this country selected
  const back = $('#backExplore'); if (!back) return;
  const contView = WORLD_VIEWS[cont] ? cont : null;
  const btn = PROJ === 'globe'
    ? H(`<button class="btn" id="projJump">🗺️ Show ${esc(contView || c.n)} on the flat map</button>`)
    : H(`<button class="btn" id="projJump">🌐 See ${esc(c.n)} on the globe</button>`);
  back.before(btn);
  btn.onclick = () => {
    if (PROJ === 'globe') {
      setProj('gp');
      if (contView) fitLL(WORLD_VIEWS[contView], 600);
      countryCard(code, cont, null, !contView);
    } else {
      const q = gpToLL(...(c._l || c.l));
      GLOBE.lon = q.lon; GLOBE.lat = clamp(q.lat, -60, 60);
      setProjKeep('globe');
      countryCard(code, cont, null, true);
    }
  };
}
let spinAnim = 0;
function spinTo(lon, lat, done, ms = 650) {   // smooth turn of the globe, then redraw everything
  cancelAnimationFrame(spinAnim);
  const a = { lon: GLOBE.lon, lat: GLOBE.lat }, t0 = performance.now();
  let dl = ((lon - a.lon + 540) % 360) - 180;
  const tl = clamp(lat, -60, 60);
  const step = now => {
    const t = Math.min(1, (now - t0) / ms), e = t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
    GLOBE.lon = ((a.lon + dl * e + 540) % 360) - 180; GLOBE.lat = a.lat + (tl - a.lat) * e;
    if (t < 1) { spinFast(); spinAnim = requestAnimationFrame(step); }
    else { cancelAnimationFrame(spinRAF); rebuildGlobe(); done && done(); }
  };
  spinAnim = requestAnimationFrame(step);
}
function showItemCard(it) {
  const rows = [];
  if (it.m === 'world' && it.ll) { const ll = Array.isArray(it.ll) ? it.ll : null; if (ll) rows.push(['Hemisphere', (ll[0] >= 0 ? 'Northern' : 'Southern') + ' and ' + (ll[1] >= 0 ? 'eastern' : 'western')]); }
  rows.push(['Year group', it.y.length ? 'Year ' + it.y.join(', ') : '—']);
  showCard(it.n, kindText(it)[0].toUpperCase() + kindText(it).slice(1), rows, it.f, flagFor(it));
}
let cardTitle = null;                         // set by search so the card says "You searched for…"
function showCard(title, sub, rows, fact, flag) {
  const head = cardTitle || 'You tapped…'; cardTitle = null;
  setPanel(`<div class="info"><p class="ptitle">${head}</p>${flag ? flagImg(flag, 90, 'Flag of ' + title) : ''}<h2>${esc(title)}</h2><div class="sub">${esc(sub)}</div>
    ${rows.length ? `<dl>${rows.map(([a, b]) => `<dt>${esc(a)}</dt><dd>${esc(b)}</dd>`).join('')}</dl>` : ''}</div>${factHTML(fact)}
    <button class="btn sec" id="backExplore">Back</button>`);
  $('#backExplore').onclick = () => { clearHL(); exploreStart(); };
}
function refOf(L, x, y, level) {
  const e = L.e0 + x, n = L.n1 - y;
  if (level === 4) return [String(Math.floor(e / 1000) % 100).padStart(2, '0'), String(Math.floor(n / 1000) % 100).padStart(2, '0')];
  return [String(Math.floor(e / 100) % 1000).padStart(3, '0'), String(Math.floor(n / 100) % 1000).padStart(3, '0')];
}
const tenthsOn = () => S.layers.local.tenths !== false && V.k < 2.8;     // 100 m lines showing?
// Tenths: 'all' = 100 m lines and 0-9 numbers, 'lines' = lines only, 'none' = estimate like a real OS map
function tenthsMode() { const L = S.layers.local; return L.tenths === false ? 'none' : L.tenthNums === false ? 'lines' : 'all'; }
const estimating = () => tenthsMode() !== 'all';
const TENTHS = { all: ['Lines and numbers', '100 m lines with 0–9 along the edges'], lines: ['Lines only', 'children count the 100 m lines'], none: ['Hidden (estimate)', 'like a real OS map — Years 5–6, Year 4 when ready'] };
function tenthsPicker(anchor, after) {
  openPop(anchor, `<h3>Tenths for 6-figure references</h3>${Object.entries(TENTHS).map(([k, [t, d]]) => `<button class="opt ${tenthsMode() === k ? 'on' : ''}" data-tm="${k}">${t}<small>${d}</small></button>`).join('')}
    <p style="margin:0;font-size:15px;font-weight:700;color:#4a6577;max-width:380px">When the numbers are hidden, an answer within one tenth (100 m) counts as a good estimate.</p>`,
  p => p.querySelectorAll('[data-tm]').forEach(b => b.onclick = () => {
    const k = b.dataset.tm; S.layers.local.tenths = k !== 'none'; S.layers.local.tenthNums = k === 'all'; save(); closePop(); onViewChange(); after && after();
  }));
}
function squareHighlight(g, L, x, y, small) {
  // yellow = the 1 km grid square; blue = the 100 m square inside it (6-figure)
  const E_ = L.e0 + x, N_ = L.n1 - y;
  const x0 = Math.floor(E_ / 1000) * 1000 - L.e0, y0 = L.n1 - (Math.floor(N_ / 1000) * 1000 + 1000);
  E('rect', { x: x0, y: y0, width: 1000, height: 1000, fill: '#ffd54a', opacity: .3, stroke: '#e6a100', 'stroke-width': 4, 'vector-effect': 'non-scaling-stroke' }, g);
  E('rect', { x: x0, y: y0, width: 1000, height: 1000, fill: 'none', stroke: '#e6a100', 'stroke-width': 4, 'vector-effect': 'non-scaling-stroke' }, g);
  if (small) {
    const sx = Math.floor(E_ / 100) * 100 - L.e0, sy = L.n1 - (Math.floor(N_ / 100) * 100 + 100);
    E('rect', { x: sx, y: sy, width: 100, height: 100, fill: '#1e88e5', opacity: .45 }, g);
    E('rect', { x: sx, y: sy, width: 100, height: 100, fill: 'none', stroke: '#0d47a1', 'stroke-width': 3.5, 'vector-effect': 'non-scaling-stroke' }, g);
  }
}
const swatch = (fill, stroke) => `<span style="display:inline-block;width:22px;height:22px;border-radius:5px;background:${fill};border:3px solid ${stroke};vertical-align:-4px;margin-right:8px"></span>`;
function refRowsHTML(r4, r6, show6) {
  return `<dl><dt>${swatch('#ffe48a', '#e6a100')}4-figure grid reference (1 km square)</dt><dd style="font-size:36px">${r4.join(' ')}</dd>
    ${show6 ? `<dt>${swatch('#8fc3f0', '#0d47a1')}6-figure grid reference (100 m square)</dt><dd style="font-size:36px">${r6.join(' ')}</dd>` : ''}</dl>`;
}
function localExplore(p) {
  const m = cur(), L = m.L;
  if (p.x < 0 || p.y < 0 || p.x > m.b.w || p.y > m.b.h) return;
  let best = null, bd = 28 * V.k;
  if (S.layers.local.symbols) m.pois.forEach((q, i) => { const d = Math.hypot(q.x - p.x, q.y - p.y); if (d < bd) { bd = d; best = i; } });
  const g = E('g', { class: 'tapdot hlx' }, ov);
  if (best != null) {
    const q = m.pois[best]; forcePoi(best);
    const r4 = refOf(L, q.x, q.y, 4), r6 = refOf(L, q.x, q.y, 6);
    const show6 = yr() === 0 || yr() >= 4 || tenthsOn();
    squareHighlight(g, L, q.x, q.y, show6 && tenthsOn());
    E('circle', { class: 'pulse', r: 16 }, cs(g, q.x, q.y));
    setPanel(`<div class="info"><p class="ptitle">You tapped…</p>
      <div style="display:flex;align-items:center;gap:14px"><svg width="70" height="56" viewBox="-35 -28 70 56"><use href="#sym-${q.t}" transform="scale(1.6)"/></svg><h2>${esc(POI[q.t])}</h2></div>
      ${q.n ? `<div class="sub">${esc(q.n)}</div>` : ''}
      ${refRowsHTML(r4, r6, show6)}</div>${q.item && byId[q.item] ? factHTML(byId[q.item].f) : ''}
      <p class="hint">Remember: along the corridor (eastings) first, then up the stairs (northings).</p>
      <button class="btn sec" id="backExplore">Back</button>`);
  } else {
    const r4 = refOf(L, p.x, p.y, 4), r6 = refOf(L, p.x, p.y, 6), small = tenthsOn();
    squareHighlight(g, L, p.x, p.y, small);
    setPanel(`<div class="info"><p class="ptitle">You tapped…</p>
      ${refRowsHTML(r4, r6, small)}
      <div class="sub" style="margin-top:8px">Eastings first (along), then northings (up).</div></div>
      <p class="hint">${small ? 'The yellow square is the 1 km grid square. The blue square is the 100 m square inside it: count tenths along, then up.' : 'A grid square is named by the lines at its bottom-left corner. Zoom in to see the 100 m lines for 6-figure references.'}</p>
      <button class="btn sec" id="backExplore">Back</button>`);
  }
  $('#backExplore').onclick = () => { ov.replaceChildren(); exploreStart(); };
}
function showKey() {
  const m = cur(); const present = [...new Set(m.pois.map(p => p.t))];
  const sym = t => `<svg viewBox="-28 -18 56 36"><use href="#sym-${t}"/></svg>`;
  const ln = (attrs, extra = '') => `<svg viewBox="0 0 56 36"><path d="M4 18H52" ${attrs}/>${extra}</svg>`;
  const ar = fill => `<svg viewBox="0 0 56 36"><rect x="6" y="6" width="44" height="24" rx="3" fill="${fill}" stroke="#888"/></svg>`;
  const rows = [
    [ln('stroke="#4a4a4a" stroke-width="12"', '<path d="M4 18H52" stroke="#3b78c4" stroke-width="8"/>'), 'Motorway'],
    [ln('stroke="#4a4a4a" stroke-width="11"', '<path d="M4 18H52" stroke="#e0473f" stroke-width="7"/>'), 'Main road (A road)'],
    [ln('stroke="#4a4a4a" stroke-width="10"', '<path d="M4 18H52" stroke="#f39c2c" stroke-width="6"/>'), 'B road'],
    [ln('stroke="#4a4a4a" stroke-width="9"', '<path d="M4 18H52" stroke="#fff15a" stroke-width="5"/>'), 'Minor road'],
    [ln('stroke="#4a4a4a" stroke-width="8"', '<path d="M4 18H52" stroke="#fff" stroke-width="4"/>'), 'Street'],
    [ln('stroke="#555" stroke-width="2.5" stroke-dasharray="6 4"'), 'Path or footpath'],
    [ln('stroke="#222" stroke-width="6"', '<path d="M4 18H52" stroke="#fff" stroke-width="2.4" stroke-dasharray="7 7"/>'), 'Railway'],
    [ln('stroke="#2f8fd8" stroke-width="4"'), 'River or stream'],
    [ar('#a9d8f5'), 'Water'], [ar('url(#pWood)'), 'Woodland'], [ar('#dcefc8'), 'Park or open space'], [ar('#f4e2d1'), 'Built-up area (houses and buildings)'],
    [ln('stroke="#2c7fd6" stroke-width="2"'), 'Grid line (1 km apart)'],
  ];
  if (m.L.cliff) rows.push([ln('stroke="#6d4c41" stroke-width="10" stroke-dasharray="2 5"'), 'Cliff']);
  setPanel(`<p class="ptitle">Map key</p><div class="key">${present.map(t => sym(t) + `<div>${POI[t]}</div>`).join('')}${rows.map(r => r[0] + `<div>${r[1]}</div>`).join('')}</div>
    <button class="btn sec" id="backExplore">Back</button>`);
  $('#backExplore').onclick = () => startMode();
}

/* ------------------------------------------------------------ FIND IT */
let Q = null;
const QUIZ_KINDS = { world: ['country', 'continent', 'ocean', 'group', 'point', 'line', 'latline', 'lonline', 'pole', 'hemi'], uk: ['ukcountry', 'region', 'county', 'sea', 'river', 'point', 'line'] };
function findStart() {
  ov.replaceChildren(); clearHL();
  if (S.map.startsWith('local')) {
    setPanel(`<p class="ptitle">Find it!</p><div class="qcard"><p class="q">Find it! uses the world map and the UK map.</p><p class="hint">On the OS maps, try Grid refs or Compass.</p></div>
      <button class="btn" id="toW">🌍 World map</button><button class="btn" id="toU">🇬🇧 UK map</button>`);
    $('#toW').onclick = () => { showMap('world'); startMode(); }; $('#toU').onclick = () => { showMap('uk'); startMode(); };
    return;
  }
  let pool = visibleItems().filter(i => QUIZ_KINDS[S.map].includes(i.k));
  if (S.findFlags) {
    pool = pool.filter(i => (i.k === 'country' || i.k === 'ukcountry') && flagFor(i));
    if (!pool.length) {
      setPanel(`<p class="ptitle">Find it!</p>${findChips()}<div class="qcard"><p class="q">There are no flags to find on this map for ${yr() ? 'Year ' + yr() : 'this year'}.</p><p class="hint">Flags appear for the countries in each year's curriculum. Try the ${S.map === 'world' ? 'UK' : 'world'} map, or another year.</p></div>`);
      wireFindChips(); return;
    }
  }
  if (!pool.length) {
    setPanel(`<p class="ptitle">Find it!</p><div class="qcard"><p class="q">There are no ${S.map === 'world' ? 'world' : 'UK'} places for ${yr() ? 'Year ' + yr() : 'this year'} yet.</p></div><button class="btn" id="toOther">Try the ${S.map === 'world' ? 'UK' : 'world'} map</button>`);
    $('#toOther').onclick = () => { showMap(S.map === 'world' ? 'uk' : 'world'); startMode(); };
    return;
  }
  const order = shuffle(pool.slice());
  Q = { order, idx: 0, n: S.count ? Math.min(S.count, order.length) : Infinity, score: 0 };
  if (Q.n === Infinity) Q.order = order;
  findAsk();
}
function findItem() { return Q.order[Q.idx % Q.order.length]; }
function findChips() { return `<div class="chips"><button class="chip ${S.findFlags ? '' : 'on'}" data-ff="0">🔤 Find by name</button><button class="chip ${S.findFlags ? 'on' : ''}" data-ff="1">🏳️ Find by flag</button></div>`; }
function wireFindChips() { panel.querySelectorAll('[data-ff]').forEach(b => b.onclick = () => { S.findFlags = b.dataset.ff === '1'; save(); findStart(); }); }
function findAsk() {
  ov.replaceChildren(); clearHL();
  Q.pin = null; Q.done = false; Q.tries = 0;
  const it = findItem();
  if (it.k === 'county') $('#uk-cty').style.visibility = '';
  if (it.k === 'region') $('#uk-reg').style.visibility = '';
  const byFlag = S.findFlags && flagFor(it);
  setPanel(`<p class="ptitle">Find it!</p>${findChips()}${progressHTML(Q)}
    ${byFlag ? `<div class="qcard" style="text-align:center"><p class="q">Can you find the country with this flag?</p>${flagImg(flagFor(it), 120, 'A flag to find')}</div>`
      : `<div class="qcard"><p class="q">Can you find…</p><div class="big">${esc(it.n)}</div><div class="kind">It is ${esc(kindText(it))}.</div></div>`}
    <div id="fbox"></div>
    <div class="row"><button class="btn go" id="check" disabled>Check</button></div>
    <div class="row"><button class="btn sec" id="skip">Skip</button><button class="btn sec" id="showme">Show me</button></div>
    <p class="hint" id="tapHint">Tap the map to put a pin where you think it is. Move the pin by tapping again.</p>`);
  $('#check').onclick = findCheck; $('#skip').onclick = findNext; $('#showme').onclick = () => findReveal(false);
  wireFindChips();
  if (S.autoZoom) autoZoomFor(it); else home();
}
function autoZoomFor(it) {
  if (it.m === 'world' && PROJ === 'globe') {
    const [lon, lat] = itemLL(it), off = (Math.random() < .5 ? -1 : 1) * (35 + Math.random() * 20);
    centreOn(lon + off, clamp(lat + (Math.random() - .5) * 30, -50, 50)); return home(0);
  }
  if (it.m === 'world') {
    const t = targetPoint(it); if (!t) return home();
    const ll = robInv(t.x, t.y);
    const smallKinds = ['country', 'point', 'group', 'line'];
    if (ll && smallKinds.includes(it.k) && (!t.box || t.box[2] < 1400)) {
      let best = null, ba = Infinity;
      for (const [n, bb] of Object.entries(WORLD_VIEWS)) if (bb && ll.lon >= bb[0] && ll.lon <= bb[2] && ll.lat >= bb[1] && ll.lat <= bb[3]) { const a = (bb[2] - bb[0]) * (bb[3] - bb[1]); if (a < ba) { ba = a; best = bb; } }
      if (best) return fitLL(best);
    }
    return home();
  }
  const t = targetPoint(it); if (!t) return home();
  const E_ = t.x * D.uk.s + D.uk.e0, N_ = D.uk.n1 - t.y * D.uk.s;
  if (['county', 'point', 'line', 'river'].includes(it.k) && !(it.k === 'river' && t.box[2] > 700)) {
    for (const n of ['South West', 'South East', 'Wales', 'North of England']) { const bb = UK_VIEWS[n]; if (E_ >= bb[0] && E_ <= bb[2] && N_ >= bb[1] && N_ <= bb[3] && (it.k === 'county' || it.tol < 30 || it.k === 'river')) return fitBNG(bb); }
  }
  home();
}
function placePin(p) {
  ov.querySelectorAll('.pin').forEach(e => e.remove());
  const g = cs(ov, p.x, p.y, 'pin'); E('use', { href: '#sym-pin' }, g);
}
function findTap(p) {
  if (!Q || Q.done) return;
  Q.pin = p; placePin(p);
  const c = $('#check'); if (c) c.disabled = false;
  const h = $('#tapHint'); if (h) h.textContent = 'Happy with your pin? Press Check.';
}
function findCheck() {
  if (!Q.pin) return;
  const it = findItem(), ok = isHit(it, Q.pin);
  Q.tries++;
  const fb = $('#fbox');
  if (ok) {
    Q.done = true; if (Q.tries === 1) Q.score++;
    highlightItem(it);
    fb.innerHTML = `<div class="fb good"><span class="em">${pick(PRAISE)} ✅</span>That's ${esc(theName(it))}.${flagFor(it) ? '<br>' + flagImg(flagFor(it), 60, 'Flag of ' + it.n) : ''}</div>${factHTML(it.f)}${teamAwardHTML()}`;
    wireAward(fb);
    findButtonsNext();
    scrollEnd();
  } else {
    const t = targetPoint(it, Q.pin);
    let msg;
    if (it.k === 'hemi') msg = `The ${it.n.toLowerCase()} is ${{ N: 'north of the Equator', S: 'south of the Equator', E: 'east of the Prime Meridian', W: 'west of the Prime Meridian' }[it.ref]}.`;
    else if (t) msg = `${esc(cap1(theName(it)))} is further ${dirName(Q.pin, t, fourPoint())}.`;
    else msg = 'Have another look.';
    if (it.k === 'ocean' || it.k === 'sea') { const onLand = it.k === 'ocean' ? worldLandAt(Q.pin) : ukLandAt(Q.pin); if (onLand) msg = 'That pin is on land. ' + msg; }
    fb.innerHTML = `<div class="fb bad"><span class="em">${pick(NEARLY)}</span>${msg} Tap the map to move your pin.</div>`;
    $('#check').disabled = true;
    if (Q.tries >= 3) findReveal(true);
  }
}
function findReveal(afterTries) {
  const it = findItem(); Q.done = true;
  highlightItem(it);
  const t = targetPoint(it, Q.pin);
  if (Q.pin && t) {
    drawArrow(Q.pin, t);
    const b = t.box || [t.x, t.y, 1, 1];
    const x0 = Math.min(Q.pin.x, b[0]), y0 = Math.min(Q.pin.y, b[1]), x1 = Math.max(Q.pin.x, b[0] + b[2]), y1 = Math.max(Q.pin.y, b[1] + b[3]);
    if (!['hemi', 'latline', 'lonline'].includes(it.k)) fitBox(x0, y0, x1 - x0, y1 - y0, 1.4);
  } else if (t && t.box && !['hemi'].includes(it.k)) fitBox(t.box[0], t.box[1], t.box[2], t.box[3], 1.6);
  scrollEnd();
  $('#fbox').innerHTML = `<div class="fb bad"><span class="em">Here it is!</span>${esc(cap1(theName(it)))} is highlighted on the map.${flagFor(it) ? '<br>' + flagImg(flagFor(it), 60, 'Flag of ' + it.n) : ''}</div>${factHTML(it.f)}`;
  findButtonsNext();
}
function findButtonsNext() {
  const last = Q.n !== Infinity && Q.idx + 1 >= Q.n;
  const c = $('#check'); c.disabled = false; c.textContent = last ? 'Finish' : 'Next ➜'; c.className = 'btn'; c.onclick = findNext;
  $('#skip').parentNode.style.display = 'none';
  $('#tapHint').textContent = '';
}
function findNext() {
  Q.idx++;
  if (Q.n !== Infinity && Q.idx >= Q.n) {
    ov.replaceChildren(); clearHL();
    setPanel(`<p class="ptitle">Find it!</p>${endHTML(Q)}`); $('#again').onclick = findStart; return;
  }
  findAsk();
}
function drawArrow(a, b, col = '#e53935', parent = ov) {
  const g = E('g', { class: 'hlx arrow' }, parent);
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  E('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: col, 'stroke-width': 5, 'stroke-dasharray': '12 8', 'vector-effect': 'non-scaling-stroke' }, g);
  const hg = cs(g, b.x, b.y); E('path', { d: 'M0 0L-22-11L-22 11z', fill: col, transform: `rotate(${ang * 180 / Math.PI})` }, hg);
  return g;
}

/* ------------------------------------------------------------ COMPASS */
let C = null;
function compassCandidates() {
  if (S.map.startsWith('local')) {
    const m = cur(); return m.pois.map((p, i) => ({ x: p.x, y: p.y, n: p.ours ? 'WFA' : 'the ' + POI_SHORT[p.t], t: p.t, i }));
  }
  const its = visibleItems().filter(i => !(S.map === 'world' && PROJ === 'globe' && i.ll && !onFront(i.ll[1], i.ll[0])));
  const pts = its.filter(i => i.k === 'point').map(i => ({ x: i.xy[0], y: i.xy[1], n: i.n, it: i }));
  if (pts.length < 6) {
    if (S.map === 'world') for (const i of its.filter(i => i.k === 'country')) { const c = D.world.countries[i.ref]; if (c && c.l) pts.push({ x: c.l[0], y: c.l[1], n: i.n, it: i }); }
    else for (const i of its.filter(i => ['ukcountry', 'county', 'region'].includes(i.k))) { const t = targetPoint(i); if (t) pts.push({ x: t.x, y: t.y, n: i.n, it: i }); }
  }
  if (S.map === 'world' && pts.length < 6) for (const i of its.filter(i => i.k === 'continent')) { const ll = CONT_LABEL[i.ref], p = rob(ll[1], ll[0]); pts.push({ x: p.x, y: p.y, n: i.n, it: i }); }
  return pts;
}
function compassStart() {
  ov.replaceChildren(); clearHL();
  const pts = compassCandidates();
  if (pts.length < 3) {
    setPanel(`<p class="ptitle">Compass</p><div class="qcard"><p class="q">Not enough places on this map for ${yr() ? 'Year ' + yr() : 'this year'}.</p></div><button class="btn" id="toU">Try the UK map</button>`);
    $('#toU').onclick = () => { showMap('uk'); startMode(); }; return;
  }
  C = { pts, idx: 0, n: S.count || Infinity, score: 0 };
  compassAsk();
}
function compassPair() {
  const pts = C.pts, four = fourPoint(), tol = four ? 14 : 10;
  const diag = Math.hypot(V.b.w, V.b.h);
  const local = S.map.startsWith('local');
  for (let tries = 0; tries < 600; tries++) {
    const a = pick(pts), b = pick(pts);
    if (a === b || a.n === b.n) continue;
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    if (local ? (d < 500 || d > 3200) : (d < diag * .05 || d > diag * .55)) continue;
    if (local && pts.filter(p => p.n === b.n && Math.hypot(p.x - a.x, p.y - a.y) < d * 1.2).length > 1 && tries < 400) continue;
    const br = bearing(a, b), step = four ? 90 : 45, k = Math.round(br / step) % (360 / step);
    const off = Math.abs(((br - k * step) + 540) % 360 - 180);
    if (off > tol) continue;
    return { a, b, ans: four ? k * 2 : k };
  }
  return null;
}
function compassAsk() {
  ov.replaceChildren(); clearHL();
  const pr = compassPair();
  if (!pr) { setPanel(`<p class="ptitle">Compass</p><div class="qcard"><p class="q">Zoom out a little and try again.</p></div><button class="btn" id="again">Try again</button>`); $('#again').onclick = compassStart; return; }
  C.cur = pr; C.done = false;
  if (pr.a.i != null) forcePoi(pr.a.i, pr.b.i);
  const { a, b } = pr;
  const mk = (p, letter, col) => { const g = cs(ov, p.x, p.y, 'hlx'); E('circle', { class: 'pulse', r: 16 }, g); E('circle', { r: 17, fill: col, stroke: '#fff', 'stroke-width': 3 }, g); E('text', { 'text-anchor': 'middle', y: 7, 'font-size': 20, 'font-weight': 900, fill: '#fff' }, g).textContent = letter; E('text', { x: 24, y: 7, 'font-size': 19, class: 'lbl' }, g).textContent = p.n.replace(/^the /, ''); };
  mk(a, 'A', '#2e7d32'); mk(b, 'B', '#c62828');
  const pad = S.map.startsWith('local') ? 500 : Math.hypot(V.b.w, V.b.h) * .04;
  fitBox(Math.min(a.x, b.x) - pad, Math.min(a.y, b.y) - pad, Math.abs(a.x - b.x) + 2 * pad, Math.abs(a.y - b.y) + 2 * pad, 1.25);
  const four = fourPoint();
  const q = S.map.startsWith('local') ? `Start at <b>A</b> (${esc(a.n)}). Which direction is <b>B</b> (${esc(b.n)})?` : `Which direction is <b>${esc(theName(b.n))}</b> from <b>${esc(theName(a.n))}</b>?`;
  const positions = DIR8S.map((d, i) => { const r = i * 45 * Math.PI / 180; return { d, i, x: 140 + 102 * Math.sin(r), y: 140 - 102 * Math.cos(r) }; });
  setPanel(`<p class="ptitle">Compass</p>${progressHTML({ idx: C.idx, n: C.n, score: C.score })}
    <div class="qcard"><p class="q" style="font-size:calc(25px*var(--fs))">${q}</p></div>
    <div class="rose">${positions.filter(p => !four || p.i % 2 === 0).map(p => `<button data-d="${p.i}" class="${p.i % 2 ? 'sm' : ''}" style="left:${p.x}px;top:${p.y}px">${p.d}</button>`).join('')}</div>
    <div id="fbox"></div>
    <div class="row"><button class="btn sec" id="skip">Skip</button></div>`);
  panel.querySelectorAll('.rose button').forEach(btn => btn.onclick = () => compassAnswer(+btn.dataset.d, btn));
  $('#skip').onclick = compassNext;
}
function compassAnswer(d, btn) {
  if (C.done) return;
  const { a, b, ans } = C.cur;
  C.done = true;
  const ok = d === ans;
  if (ok) C.score++;
  btn.classList.add('sel');
  panel.querySelector(`.rose button[data-d="${ans}"]`).classList.add('right');
  drawArrow(a, b, ok ? '#2e9e4f' : '#e53935');
  const word = DIR8[ans];
  const bn = esc(cap1(theName(b.n))), an = esc(theName(a.n));
  $('#fbox').innerHTML = ok ? `<div class="fb good"><span class="em">${pick(PRAISE)} ✅</span>${bn} is <b>${word}</b> of ${an}.</div>${teamAwardHTML()}`
    : `<div class="fb bad"><span class="em">${pick(NEARLY)}</span>${bn} is <b>${word}</b> of ${an}. Follow the arrow from A to B.</div>`;
  wireAward($('#fbox'));
  const last = C.n !== Infinity && C.idx + 1 >= C.n;
  const s = $('#skip'); s.textContent = last ? 'Finish' : 'Next ➜'; s.className = 'btn';
  scrollEnd();
}
function compassNext() {
  C.idx++;
  if (C.n !== Infinity && C.idx >= C.n) { ov.replaceChildren(); setPanel(`<p class="ptitle">Compass</p>${endHTML({ score: C.score, n: C.n })}`); $('#again').onclick = compassStart; return; }
  compassAsk();
}

/* ------------------------------------------------------------ GRID REFERENCES */
let G = null;
function gridStart() {
  ov.replaceChildren(); clearHL();
  if (!S.map.startsWith('local')) {
    setPanel(`<p class="ptitle">OS map skills</p><div class="qcard"><p class="q">Grid references, symbols, distance and height are practised on our OS-style maps.</p><p class="hint">They use the real Ordnance Survey grid, so they match paper OS maps. Pen y Fan is best for contours.</p></div>
      ${D.local.map(l => `<button class="btn" data-local="${l.id}">🗺️ ${esc(l.name)}</button>`).join('')}`);
    panel.querySelectorAll('[data-local]').forEach(b => b.onclick = () => { showMap('local:' + b.dataset.local); startMode(); });
    return;
  }
  if (S.gridTask === 'far' || S.gridTask === 'high') { G = { idx: 0, n: S.count || Infinity, score: 0, pois: osPois(), task: S.gridTask }; return gridAsk(); }
  const lvl = gridLevel();
  const pois = osPois().filter(p => {
    const e = cur().L.e0 + p.x, n = cur().L.n1 - p.y;
    if (p.x < 300 || p.y < 300 || p.x > cur().b.w - 300 || p.y > cur().b.h - 300) return false;
    if (lvl === 6) { const a = e % 100, b = n % 100; return a > 14 && a < 86 && b > 14 && b < 86; }
    const a = e % 1000, b = n % 1000; return a > 70 && a < 930 && b > 70 && b < 930;
  });
  G = { idx: 0, n: S.count || Infinity, score: 0, pois, lvl, task: S.gridTask };
  gridAsk();
}
function gridHeader() {
  const lvl = gridLevel();
  const pr = G ? `<span style="float:right;text-transform:none">${G.n === Infinity ? 'Q' + (G.idx + 1) : (G.idx + 1) + ' of ' + G.n} · ⭐ ${G.score}</span>` : '';
  return `<p class="ptitle">OS map skills${pr}</p>
    <div class="chips"><button class="chip on" id="taskPick">${GRID_TASKS[S.gridTask]} ▾</button>${['give', 'find'].includes(S.gridTask) ? `<button class="chip on" id="lvlPick">${lvl}-figure ▾</button>` : ''}${['give', 'find'].includes(S.gridTask) && lvl === 6 ? `<button class="chip ${estimating() ? 'on' : ''}" id="tenPick">Tenths: ${TENTHS[tenthsMode()][0]} ▾</button>` : ''}</div>`;
}
const GRID_TASKS = { give: 'Give the grid reference', find: 'Find the grid reference', symbols: 'Map symbols', far: 'How far? (scale)', high: 'How high? (contours)' };
const GRID_TASK_YEARS = { give: 'Years 3-6', find: 'Years 3-6', symbols: 'Years 3-6', far: 'Years 5-6', high: 'Year 6' };
function osPois() {
  const m = cur(), hide = new Set(S.layers.local.hide || []);
  const ps = m.pois.map((p, i) => Object.assign({ i }, p));
  const vis = S.layers.local.symbols ? ps.filter(p => !hide.has(p.t)) : [];
  return vis.length >= 4 ? vis : ps;
}
function wireGridHeader() {
  $('#taskPick').onclick = e => openPop(e.currentTarget, `<h3>Activity</h3>${Object.entries(GRID_TASKS).map(([k, t]) => `<button class="opt ${S.gridTask === k ? 'on' : ''}" data-task="${k}">${t}<small>${GRID_TASK_YEARS[k]}</small></button>`).join('')}`,
    p => p.querySelectorAll('[data-task]').forEach(b => b.onclick = () => { closePop(); S.gridTask = b.dataset.task; save(); gridStart(); }));
  const tp = $('#tenPick'); if (tp) tp.onclick = e => tenthsPicker(e.currentTarget, () => { const c = tp; c.textContent = `Tenths: ${TENTHS[tenthsMode()][0]} ▾`; c.classList.toggle('on', estimating()); });
  const lp = $('#lvlPick');
  if (lp) lp.onclick = e => openPop(e.currentTarget, `<h3>Grid references</h3>${[4, 6].map(l => `<button class="opt ${gridLevel() === l ? 'on' : ''}" data-lvl="${l}">${l}-figure<small>${l === 4 ? 'Year 3' : 'Years 4-6'}</small></button>`).join('')}`,
    p => p.querySelectorAll('[data-lvl]').forEach(b => b.onclick = () => { closePop(); S.gridLevel = +b.dataset.lvl; save(); gridStart(); }));
}
function gridAsk() {
  ov.replaceChildren();
  const m = cur(), L = m.L;
  G.done = false; G.tries = 0; G.entry = ''; G.pin = null;
  if (!G.pois.length) { setPanel(gridHeader() + '<div class="qcard"><p class="q">No places to ask about here.</p></div>'); wireGridHeader(); return; }
  if (S.gridTask === 'symbols') return symbolAsk();
  if (S.gridTask === 'far') return distanceAsk();
  if (S.gridTask === 'high') return heightAsk();
  const p = pick(G.pois); G.p = p;
  const ref = refOf(L, p.x, p.y, G.lvl); G.ref = ref;
  forcePoi(p.i);
  const span = G.lvl === 6 ? 1500 : 2600;
  if (S.gridTask === 'give') {
    const g = cs(ov, p.x, p.y, 'hlx'); E('circle', { class: 'pulse', r: 16 }, g); E('circle', { r: 24, fill: 'none', stroke: '#ff3d00', 'stroke-width': 4 }, g);
    // keep the place off-centre so children have to use the grid, not the middle of the screen
    fitBox(p.x - span / 2 + (Math.random() - .5) * span * .3, p.y - span / 2 + (Math.random() - .5) * span * .3, span, span, 1.05);
    setPanel(gridHeader() + `
      <div class="qcard"><p class="q">What is the ${G.lvl}-figure grid reference of ${p.ours ? 'WFA, our school' : 'the ' + esc(POI_SHORT[p.t])}?</p></div>
      <div class="refbox" id="refbox"></div>
      <div class="ref-legend"><span class="e">Eastings (along)</span><span class="n">Northings (up)</span></div>
      <div class="keypad" id="pad">${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(n => `<button data-k="${n}">${n}</button>`).join('')}<button data-k="back" class="wide">⌫</button><button data-k="ok" id="check" class="ok" disabled>Check</button></div>
      <div id="fbox"></div>
      <div class="row"><button class="btn sec" id="skip">Skip</button><button class="btn sec" id="showme">Show me how</button></div>`);
    wireGridHeader();
    drawRefBox();
    panel.querySelectorAll('[data-k]').forEach(b => b.onclick = () => keyIn(b.dataset.k));
  } else {
    if (G.lvl === 4) home();
    else { const cx = Math.floor((L.e0 + p.x) / 1000) * 1000 - L.e0 + 500, cy = L.n1 - Math.floor((L.n1 - p.y) / 1000) * 1000 - 500; const off = () => (Math.random() - .5) * 1200; fitBox(cx - 1300 + off(), cy - 1300 + off(), 2600, 2600, 1); }
    setPanel(gridHeader() + `
      <div class="qcard"><p class="q">Find this grid reference:</p><div class="big" style="font-size:calc(54px*var(--fs));letter-spacing:4px"><span style="color:#b0351f">${ref[0]}</span> <span style="color:#1a5fb4">${ref[1]}</span></div>
      <p class="hint">${G.lvl === 6 ? (estimating() ? 'Tap the spot. Estimate the tenths: split each square into ten in your head.' : 'Tap the exact spot. Zoom in to see the tenths.') : 'Tap inside the grid square.'}</p></div>
      <div id="fbox"></div>
      <div class="row"><button class="btn go" id="check" disabled>Check</button></div>
      <div class="row"><button class="btn sec" id="skip">Skip</button><button class="btn sec" id="showme">Show me how</button></div>`);
    wireGridHeader();
    $('#check').onclick = gridCheckFind;
  }
  $('#skip').onclick = gridNext;
  $('#showme').onclick = () => { G.done = true; explainRef(G.p, G.lvl); };
}
function drawRefBox() {
  const n = G.lvl, half = n / 2, box = $('#refbox'); if (!box) return;
  let h = '';
  for (let i = 0; i < n; i++) { if (i === half) h += '<i></i>'; h += `<span class="${i < half ? 'e' : 'n'} ${i === G.entry.length ? 'cur' : ''}">${G.entry[i] || ''}</span>`; }
  box.innerHTML = h;
  const c = $('#check'); if (c && !G.done) c.disabled = G.entry.length !== n;
}
function keyIn(k) {
  if (G.done || S.gridTask !== 'give') return;
  if (k === 'ok') { if (G.entry.length === G.lvl) gridCheckGive(); return; }
  if (k === 'back') G.entry = G.entry.slice(0, -1);
  else if (k === 'clr') G.entry = '';
  else if (G.entry.length < G.lvl) G.entry += k;
  drawRefBox();
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closePop(); closeModal(); }
  if (S.mode === 'grid' && G && S.gridTask === 'give' && $('#modal').hidden) {
    if (/^[0-9]$/.test(e.key)) keyIn(e.key);
    else if (e.key === 'Backspace') keyIn('back');
    else if (e.key === 'Enter' && $('#check') && !$('#check').disabled) $('#check').click();
  }
});
function closeEnough(got, want) {           // within one tenth (100 m) each way, when children are estimating
  if (G.lvl !== 6 || !estimating()) return false;
  const d = (a, b) => { const x = Math.abs(+a - +b) % 1000; return Math.min(x, 1000 - x); };
  return d(got[0], want[0]) <= 1 && d(got[1], want[1]) <= 1;
}
function gridCheckGive() {
  const want = G.ref.join(''), got = G.entry, h = G.lvl / 2;
  G.tries++;
  const fb = $('#fbox');
  const near = got !== want && closeEnough([got.slice(0, h), got.slice(h)], G.ref);
  if (got === want || near) {
    G.done = true; if (G.tries === 1) G.score++;
    fb.innerHTML = near ? `<div class="fb good"><span class="em">Good estimate! ✅</span>You said ${got.slice(0, h)} ${got.slice(h)}. The exact reference is ${want.slice(0, h)} ${want.slice(h)}.</div>${teamAwardHTML()}`
      : `<div class="fb good"><span class="em">${pick(PRAISE)} ✅</span>${want.slice(0, h)} ${want.slice(h)} is right.</div>${teamAwardHTML()}`;
    wireAward(fb); gridNextButtons();
  } else {
    const eOK = got.slice(0, h) === want.slice(0, h), nOK = got.slice(h) === want.slice(h);
    const swapped = got.slice(0, h) === want.slice(h) && got.slice(h) === want.slice(0, h);
    const msg = swapped ? 'You have the right numbers, but the wrong way round. Along the corridor first, then up the stairs!'
      : eOK ? 'Your eastings (along) are right. Check your northings (up).'
        : nOK ? 'Your northings (up) are right. Check your eastings (along).'
          : 'Check both parts. Start with the line to the left of the place, then the line below it.';
    G.entry = ''; drawRefBox();
    if (G.tries >= 3) { G.done = true; $('#pad').style.display = 'none'; fb.innerHTML = `<div class="fb bad">${msg}</div>`; explainRef(G.p, G.lvl); return; }
    $('#pad').style.display = 'none';
    fb.innerHTML = `<div class="fb bad"><span class="em">${pick(NEARLY)}</span>${msg}</div><button class="btn" id="tryAgain">Try again</button>`;
    $('#tryAgain').onclick = () => { fb.innerHTML = ''; $('#pad').style.display = ''; };
  }
}
function gridTap(p) {
  if (!G || G.done || S.gridTask !== 'find') return;
  if (p.x < 0 || p.y < 0 || p.x > cur().b.w || p.y > cur().b.h) return;
  G.pin = p; placePin(p); $('#check').disabled = false;
}
function gridCheckFind() {
  if (!G.pin) return;
  const L = cur().L, got = refOf(L, G.pin.x, G.pin.y, G.lvl), want = G.ref;
  G.tries++;
  const fb = $('#fbox'), p = G.p;
  const near = got.join('') !== want.join('') && closeEnough(got, want);
  if (got.join('') === want.join('') || near) {
    G.done = true; if (G.tries === 1) G.score++;
    if (near) toast(`Good estimate! The exact spot is ${want.join(' ')}`, 3000);
    const g = cs(ov, p.x, p.y, 'hlx'); E('circle', { class: 'pulse', r: 16 }, g); E('circle', { r: 24, fill: 'none', stroke: '#2e9e4f', 'stroke-width': 4 }, g);
    fb.innerHTML = `<div class="fb good"><span class="em">${pick(PRAISE)} ✅</span>You found it! ${p.ours ? 'That is WFA, our school!' : 'There is a ' + esc(POI_SHORT[p.t]) + ' there.'}</div>${teamAwardHTML()}`;
    wireAward(fb); gridNextButtons();
  } else {
    const msg = got[0] !== want[0] && got[1] !== want[1] ? `You tapped ${got.join(' ')}. Find ${want[0]} along the bottom first, then ${want[1]} up the side.`
      : got[0] !== want[0] ? `Your northings are right. Check the eastings: you tapped ${got[0]}, we need ${want[0]}.`
        : `Your eastings are right. Check the northings: you tapped ${got[1]}, we need ${want[1]}.`;
    fb.innerHTML = `<div class="fb bad"><span class="em">${pick(NEARLY)}</span>${msg}</div>`;
    $('#check').disabled = true;
    if (G.tries >= 3) { G.done = true; explainRef(p, G.lvl); }
  }
}
function gridNextButtons() {
  if ($('#nextBtn')) return;
  const last = G.n !== Infinity && G.idx + 1 >= G.n;
  const pad = $('#pad'); if (pad) pad.style.display = 'none';
  const c = $('#check'); if (c && !pad) c.style.display = 'none';
  const b = H(`<button class="btn" id="nextBtn">${last ? 'Finish' : 'Next ➜'}</button>`); b.onclick = gridNext;
  $('#fbox').appendChild(b);
  scrollEnd();
}
function gridNext() {
  G.idx++;
  if (G.n !== Infinity && G.idx >= G.n) { ov.replaceChildren(); setPanel(gridHeader() + endHTML({ score: G.score, n: G.n })); wireGridHeader(); $('#again').onclick = gridStart; return; }
  gridAsk();
}
function explainRef(p, lvl) {
  // "Along the corridor, up the stairs" walkthrough on the map
  const m = cur(), L = m.L;
  ov.querySelectorAll('.explain').forEach(e => e.remove());
  const g = E('g', { class: 'hlx explain' }, ov);
  const E_ = L.e0 + p.x, N_ = L.n1 - p.y;
  const sqE = Math.floor(E_ / 1000) * 1000, sqN = Math.floor(N_ / 1000) * 1000;
  const x0 = sqE - L.e0, y0 = L.n1 - sqN;            // bottom-left corner of the square (map units)
  const r4 = refOf(L, p.x, p.y, 4), r6 = refOf(L, p.x, p.y, 6);
  const steps = [];
  const fb = $('#fbox');
  let box = null;
  if (fb) { fb.querySelectorAll('.howto').forEach(e => e.remove()); box = H('<div class="fact howto"><b>How to find it</b></div>'); fb.prepend(box); const ta = $('#tryAgain'); if (ta) ta.remove(); }
  const say = h => { steps.push(h); if (box) box.appendChild(H(`<div style="margin-top:6px">${h}</div>`)); };
  const lab = (x, y, t, col, dx = 0, dy = 0) => { const lg = cs(g, x, y); E('text', { x: dx, y: dy, 'font-size': 24, 'font-weight': 900, fill: col, 'text-anchor': 'middle', class: 'lbl' }, lg).textContent = t; };
  const pt = cs(g, p.x, p.y); E('circle', { class: 'pulse', r: 16 }, pt); E('circle', { r: 24, fill: 'none', stroke: '#ff3d00', 'stroke-width': 4 }, pt);
  fitBox(x0 - 1100, y0 - 1900, 3200, 2800, 1.05);
  const T = [];
  const at = (ms, f) => T.push(setTimeout(() => { if (ov.contains(g)) f(); }, ms));
  at(700, () => {
    E('line', { x1: x0 - 1000, y1: y0 + 60, x2: x0, y2: y0 + 60, stroke: '#b0351f', 'stroke-width': 6, 'vector-effect': 'non-scaling-stroke', class: 'blink' }, g);
    E('line', { x1: x0, y1: y0 + 300, x2: x0, y2: y0 - 1000, stroke: '#b0351f', 'stroke-width': 6, 'vector-effect': 'non-scaling-stroke' }, g);
    lab(x0, y0 + 60, r4[0], '#b0351f', 0, 34);
    say(`<b style="color:#b0351f">1. Along the corridor:</b> the line on the left of the square is <b>${r4[0]}</b>.`);
  });
  at(2400, () => {
    E('line', { x1: x0 - 40, y1: y0 + 900, x2: x0 - 40, y2: y0, stroke: '#1a5fb4', 'stroke-width': 6, 'vector-effect': 'non-scaling-stroke', class: 'blink' }, g);
    E('line', { x1: x0 - 300, y1: y0, x2: x0 + 1000, y2: y0, stroke: '#1a5fb4', 'stroke-width': 6, 'vector-effect': 'non-scaling-stroke' }, g);
    lab(x0, y0, r4[1], '#1a5fb4', -34, 8);
    say(`<b style="color:#1a5fb4">2. Up the stairs:</b> the line along the bottom of the square is <b>${r4[1]}</b>.`);
  });
  at(4100, () => {
    E('rect', { x: x0, y: y0 - 1000, width: 1000, height: 1000, fill: '#ffd54a', opacity: .3, stroke: '#e6a100', 'stroke-width': 3, 'vector-effect': 'non-scaling-stroke' }, g);
    say(`<b>3.</b> So the 4-figure grid reference is <b style="font-size:1.3em">${r4[0]} ${r4[1]}</b>.`);
    if (lvl === 4) say('<b>Top tip:</b> always go along the corridor before you go up the stairs!');
  });
  if (lvl === 6) {
    at(6000, () => {
      fitBox(x0 - 250, y0 - 1150, 1500, 1500, 1.05);
      const tg = E('g', {}, g);
      for (let i = 1; i < 10; i++) {
        E('line', { x1: x0 + i * 100, y1: y0, x2: x0 + i * 100, y2: y0 + 40, stroke: '#b0351f', 'stroke-width': 3, 'vector-effect': 'non-scaling-stroke' }, tg);
        E('line', { x1: x0, y1: y0 - i * 100, x2: x0 - 40, y2: y0 - i * 100, stroke: '#1a5fb4', 'stroke-width': 3, 'vector-effect': 'non-scaling-stroke' }, tg);
      }
      for (let i = 0; i < 10; i++) { lab(x0 + i * 100 + 50, y0, String(i), '#b0351f', 0, 30); lab(x0, y0 - i * 100 - 50, String(i), '#1a5fb4', -26, 8); }
      say('<b>4.</b> Now split the square into tenths, numbered 0 to 9.');
    });
    at(8000, () => {
      const te = Math.floor((E_ - sqE) / 100);
      E('rect', { x: x0 + te * 100, y: y0 - 1000, width: 100, height: 1000, fill: '#b0351f', opacity: .18 }, g);
      say(`<b style="color:#b0351f">5.</b> Count tenths along: <b>${te}</b>. Eastings = <b>${r6[0]}</b>.`);
    });
    at(9800, () => {
      const tn = Math.floor((N_ - sqN) / 100);
      E('rect', { x: x0, y: y0 - tn * 100 - 100, width: 1000, height: 100, fill: '#1a5fb4', opacity: .18 }, g);
      say(`<b style="color:#1a5fb4">6.</b> Count tenths up: <b>${tn}</b>. Northings = <b>${r6[1]}</b>.`);
    });
    at(11500, () => {
      const te = Math.floor((E_ - sqE) / 100), tn = Math.floor((N_ - sqN) / 100);
      E('rect', { x: x0 + te * 100, y: y0 - tn * 100 - 100, width: 100, height: 100, fill: '#ffd54a', opacity: .7, stroke: '#e6a100', 'stroke-width': 3, 'vector-effect': 'non-scaling-stroke' }, g);
      say(`<b>7.</b> The 6-figure grid reference is <b style="font-size:1.3em">${r6[0]} ${r6[1]}</b>.`);
    });
  }
  if ($('#fbox')) setTimeout(gridNextButtons, 0);
}
function symbolAsk() {
  const m = cur();
  const types = [...new Set(m.pois.map(p => p.t))];
  const t = pick(types), choices = m.pois.filter(p => p.t === t), p = pick(choices);
  G.p = p; forcePoi(m.pois.indexOf(p));
  const others = [...shuffle(types.filter(x => x !== t)), ...shuffle(Object.keys(POI).filter(x => x !== t && !types.includes(x)))];
  const opts = shuffle([t, ...others.slice(0, 3)]);
  const g = cs(ov, p.x, p.y, 'hlx'); E('circle', { class: 'pulse', r: 16 }, g); E('circle', { r: 26, fill: 'none', stroke: '#ff3d00', 'stroke-width': 4 }, g);
  fitBox(p.x - 600, p.y - 600, 1200, 1200, 1);
  setPanel(gridHeader() + `
    <div class="qcard" style="text-align:center"><p class="q">What does this symbol mean?</p>
    <svg width="150" height="100" viewBox="-45 -30 90 60"><use href="#sym-${t}" transform="scale(2)"/></svg></div>
    <div class="answers">${opts.map(o => `<button class="btn sec" data-o="${o}">${POI[o]}</button>`).join('')}</div>
    <div id="fbox"></div>
    <div class="row"><button class="btn sec" id="skip">Skip</button></div>`);
  wireGridHeader();
  panel.querySelectorAll('[data-o]').forEach(b => b.onclick = () => {
    if (G.done) return; G.done = true;
    const ok = b.dataset.o === t; if (ok) G.score++;
    panel.querySelectorAll('[data-o]').forEach(x => x.classList.add(x.dataset.o === t ? 'right' : 'wrong'));
    $('#fbox').innerHTML = ok ? `<div class="fb good"><span class="em">${pick(PRAISE)} ✅</span>That symbol means ${POI[t].toLowerCase()}.</div>${teamAwardHTML()}` : `<div class="fb bad"><span class="em">${pick(NEARLY)}</span>That symbol means ${POI[t].toLowerCase()}.</div>`;
    wireAward($('#fbox'));
    const last = G.n !== Infinity && G.idx + 1 >= G.n; const s = $('#skip'); s.textContent = last ? 'Finish' : 'Next ➜'; s.className = 'btn';
  });
  $('#skip').onclick = gridNext;
}

/* ------------------------------------------------------------ OS MAPS: distance and height */
function abMark(p, letter, col, label) {
  const g = cs(ov, p.x, p.y, 'hlx');
  E('circle', { class: 'pulse', r: 16 }, g);
  E('circle', { r: 17, fill: col, stroke: '#fff', 'stroke-width': 3 }, g);
  E('text', { 'text-anchor': 'middle', y: 7, 'font-size': 20, 'font-weight': 900, fill: '#fff' }, g).textContent = letter;
  if (label) E('text', { x: 24, y: 7, 'font-size': 19, class: 'lbl' }, g).textContent = label;
  return g;
}
const fmtDist = v => v >= 1000 ? (v / 1000) + ' km' : v + ' m';
function choiceButtons(opts, fmt) { return `<div class="answers" id="answers">${opts.map((o, i) => `<button class="btn sec" data-o="${i}">${fmt(o)}</button>`).join('')}</div>`; }
function finishChoice(ok, rightIdx, html) {
  G.done = true; if (ok && G.tries === 0) G.score++;
  panel.querySelectorAll('#answers [data-o]').forEach(x => x.classList.add(+x.dataset.o === rightIdx ? 'right' : 'wrong'));
  $('#fbox').innerHTML = (ok ? `<div class="fb good"><span class="em">${pick(PRAISE)} ✅</span>${html}</div>${teamAwardHTML()}` : `<div class="fb bad"><span class="em">${pick(NEARLY)}</span>${html}</div>`);
  wireAward($('#fbox'));
  const s = $('#skip'), last = G.n !== Infinity && G.idx + 1 >= G.n; s.textContent = last ? 'Finish' : 'Next ➜'; s.className = 'btn';
  scrollEnd();
}
function distanceAsk() {
  const m = cur(), pts = G.pois.filter(p => p.x > 200 && p.y > 200 && p.x < m.b.w - 200 && p.y < m.b.h - 200);
  let a = null, b = null, d = 0;
  for (let t = 0; t < 800; t++) {
    const p = pick(pts), q = pick(pts);
    if (p === q) continue;
    d = Math.hypot(p.x - q.x, p.y - q.y);
    if (d >= 400 && d <= 3800) { a = p; b = q; break; }
  }
  if (!a) { setPanel(gridHeader() + '<div class="qcard"><p class="q">Not enough places on this map.</p></div>'); wireGridHeader(); return; }
  forcePoi(a.i, b.i);
  const step = d < 950 ? 100 : 500, ans = Math.round(d / step) * step;
  const ladder = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000];
  const ai = ladder.indexOf(ans);
  const others = shuffle([-4, -3, -2, 2, 3, 4, 5].map(k => ladder[ai + k]).filter(v => v && v !== ans)).slice(0, 3);
  const opts = [ans, ...others].sort((x, y) => x - y);
  G.cur = { a, b, d, ans };
  const na = a.ours ? 'WFA' : 'the ' + POI_SHORT[a.t], nb = b.ours ? 'WFA' : 'the ' + POI_SHORT[b.t];
  abMark(a, 'A', '#2e7d32', cap1(na.replace(/^the /, ''))); abMark(b, 'B', '#c62828', cap1(nb.replace(/^the /, '')));
  fitBox(Math.min(a.x, b.x) - 500, Math.min(a.y, b.y) - 500, Math.abs(a.x - b.x) + 1000, Math.abs(a.y - b.y) + 1000, 1.15);
  setPanel(gridHeader() + `
    <div class="qcard"><p class="q">About how far is it in a straight line from <b>A</b> (${esc(na)}) to <b>B</b> (${esc(nb)})?</p>
    <p class="hint" style="margin:0">Use the scale bar, or count grid squares: each square is 1 km across.</p></div>
    ${choiceButtons(opts, fmtDist)}<div id="fbox"></div>
    <div class="row"><button class="btn sec" id="skip">Skip</button></div>`);
  wireGridHeader();
  $('#skip').onclick = gridNext;
  panel.querySelectorAll('#answers [data-o]').forEach(btn => btn.onclick = () => {
    if (G.done) return;
    const v = opts[+btn.dataset.o], ok = v === ans;
    const g = E('g', { class: 'hlx' }, ov);
    E('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: '#111', 'stroke-width': 4, 'stroke-dasharray': '10 6', 'vector-effect': 'non-scaling-stroke' }, g);
    E('text', { 'text-anchor': 'middle', y: -10, 'font-size': 22, 'font-weight': 900, class: 'lbl' }, cs(g, (a.x + b.x) / 2, (a.y + b.y) / 2)).textContent = 'about ' + fmtDist(ans);
    finishChoice(ok, opts.indexOf(ans), `It is about <b>${fmtDist(ans)}</b> from A to B${d >= 1000 ? ` — that is about ${(d / 1000).toFixed(1)} grid squares` : ''}.`);
  });
}
function contourIndex(m) {
  if (m.cl) return m.cl;
  m.cl = (m.L.contours || []).map(c => ({ h: c.h, lines: parsePath(c.d) }));
  return m.cl;
}
function contourPoint(m, c) {
  const pts = c.lines.flat().filter(([x, y]) => x > 300 && y > 300 && x < m.b.w - 300 && y < m.b.h - 300);
  return pts.length ? (([x, y]) => ({ x, y, h: c.h }))(pick(pts)) : null;
}
function heightAsk() {
  const m = cur(), cl = contourIndex(m), ci = m.L.ci || 10;
  const hs = cl.map(c => c.h);
  if (cl.length < 3) {
    setPanel(gridHeader() + `<div class="qcard"><p class="q">This map is quite flat, so it has only a few contour lines.</p><p class="hint">Pen y Fan, in the Brecon Beacons, has lots of hills to practise with.</p></div><button class="btn" id="toPyf">⛰️ Open the Pen y Fan map</button>`);
    wireGridHeader(); $('#toPyf').onclick = () => { showMap('local:penyfan'); startMode(); }; return;
  }
  const kind = Math.random() < .5 ? 'which' : 'what';
  let A = null, B = null;
  for (let t = 0; t < 400 && !A; t++) {
    const a = contourPoint(m, pick(cl)); if (!a) continue;
    if (kind === 'what') { A = a; break; }
    const c2 = pick(cl.filter(c => Math.abs(c.h - a.h) >= 2 * ci)); if (!c2) continue;
    const b = contourPoint(m, c2); if (!b) continue;
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    if (d > 300 && d < 2000) { A = a; B = b; }
  }
  if (!A) return gridNext();
  G.cur = { A, B, kind };
  abMark(A, 'A', '#2e7d32'); if (B) abMark(B, 'B', '#c62828');
  const span = B ? Math.max(1400, Math.abs(A.x - B.x) + 900, Math.abs(A.y - B.y) + 900) : 1800;
  const cx = B ? (A.x + B.x) / 2 : A.x + (Math.random() - .5) * 400, cy = B ? (A.y + B.y) / 2 : A.y + (Math.random() - .5) * 400;
  fitBox(cx - span / 2, cy - span / 2, span, span, 1.05);
  let opts, ansIdx, q;
  if (kind === 'which') {
    opts = ['A', 'B']; ansIdx = A.h > B.h ? 0 : 1;
    q = 'Which point is <b>higher</b>, A or B?';
  } else {
    const ds = shuffle([-5, -3, -2, -1, 1, 2, 3, 5]).map(k => A.h + k * ci).filter(v => v > 0 && hs.includes(v) || v > 0).slice(0, 3);
    opts = [A.h, ...ds].sort((x, y) => x - y); ansIdx = opts.indexOf(A.h);
    q = 'Point A is on a contour line. <b>How high</b> is point A above sea level?';
  }
  setPanel(gridHeader() + `<div class="qcard"><p class="q">${q}</p>
    <p class="hint" style="margin:0">Contour lines join places of the same height. Every 5th line is thicker and has its height written on it. They are ${ci} m apart.</p></div>
    ${choiceButtons(opts, o => kind === 'which' ? 'Point ' + o : o + ' metres')}<div id="fbox"></div>
    <div class="row"><button class="btn sec" id="skip">Skip</button></div>`);
  wireGridHeader();
  $('#skip').onclick = gridNext;
  panel.querySelectorAll('#answers [data-o]').forEach(btn => btn.onclick = () => {
    if (G.done) return;
    const ok = +btn.dataset.o === ansIdx;
    const g = E('g', { class: 'hlx' }, ov);
    for (const P of [A, B].filter(Boolean)) {
      const c = cl.find(c => c.h === P.h);
      for (const L of c.lines) E('path', { d: 'M' + L.map(p => p.join(' ')).join('L'), fill: 'none', stroke: '#ff6f00', 'stroke-width': 5, 'vector-effect': 'non-scaling-stroke', class: 'blink' }, g);
      E('text', { x: 24, y: -16, 'font-size': 22, 'font-weight': 900, fill: '#a5571c', class: 'lbl' }, cs(g, P.x, P.y)).textContent = P.h + ' m';
    }
    finishChoice(ok, ansIdx, kind === 'which' ? `A is on the ${A.h} m contour and B is on the ${B.h} m contour, so <b>${A.h > B.h ? 'A' : 'B'}</b> is higher.` : `Point A is on the <b>${A.h} m</b> contour line.`);
  });
}

/* ------------------------------------------------------------ LAT & LONG: read, plot, time zones, true size */
let GL = null;
const GLOBE_TASKS = { read: 'Read latitude and longitude', plot: 'Plot latitude and longitude', time: 'Time zones', size: 'True size of countries' };
const GLOBE_YEARS = { read: 'Years 3-6', plot: 'Years 4-6', time: 'Years 3-6', size: 'Year 5' };
const deg = (v, pos, neg) => v === 0 ? '0°' : Math.abs(v) + '°' + (v > 0 ? pos : neg);
const fmtLL = (la, lo) => `${deg(la, 'N', 'S')}, ${deg(lo, 'E', 'W')}`;
const r10 = v => Math.round(v / 10) * 10;
function globePlaces() {
  const out = D.world.caps.map(([n, c, lat, lon]) => ({ n, c, lat, lon }));
  for (const it of ITEMS) if (it.m === 'world' && it.k === 'point' && !it.phys && !out.some(o => o.n === it.n)) out.push({ n: it.n, c: '', lat: it.ll[0], lon: it.ll[1] });
  return out.filter(o => !/Vatican|San Marino|Vaduz|Monaco|Andorra/.test(o.n));
}
function globeHeader() {
  const pr = GL ? `<span style="float:right;text-transform:none">${GL.n === Infinity ? 'Q' + (GL.idx + 1) : (GL.idx + 1) + ' of ' + GL.n} · ⭐ ${GL.score}</span>` : '';
  return `<p class="ptitle">Latitude and longitude${pr}</p><div class="chips"><button class="chip on" id="gtaskPick">${GLOBE_TASKS[S.globeTask]} ▾</button></div>`;
}
function wireGlobeHeader() {
  $('#gtaskPick').onclick = e => openPop(e.currentTarget, `<h3>Activity</h3>${Object.entries(GLOBE_TASKS).map(([k, t]) => `<button class="opt ${S.globeTask === k ? 'on' : ''}" data-gt="${k}">${t}<small>${GLOBE_YEARS[k]}</small></button>`).join('')}`,
    p => p.querySelectorAll('[data-gt]').forEach(b => b.onclick = () => { closePop(); S.globeTask = b.dataset.gt; save(); startMode(); }));
}
function globeStart() {
  ov.replaceChildren(); clearHL();
  if (S.globeTask === 'size') return sizeStart();
  if (S.map !== 'world') showMap('world');
  restyle(); refreshDyn();
  const all = globePlaces();
  let pool;
  if (S.globeTask === 'time') {
    const m = cur();
    pool = all.map(p => { const q = rob(p.lon, p.lat), pt = DPt(q.x, q.y); const z = m.tzPaths.find(e => e.isPointInFill(pt)); return Object.assign({ z: z ? +z.dataset.z : null }, p); })
      .filter(p => p.z !== null && Number.isInteger(p.z) && p.n !== 'London');
  } else pool = all.filter(p => Math.abs(p.lat - r10(p.lat)) <= 3 && Math.abs(p.lon - r10(p.lon)) <= 3 && Math.abs(p.lat) < 75 && Math.abs(r10(p.lon)) < 180);
  let order = shuffle(pool);
  if (S.globeTask === 'time') {                // spread questions across many time zones, not just Europe
    const byZ = {}; for (const p of order) (byZ[p.z] ||= []).push(p);
    const zs = shuffle(Object.keys(byZ)); order = [];
    for (let r = 0; order.length < pool.length; r++) for (const z of zs) if (byZ[z][r]) order.push(byZ[z][r]);
  }
  GL = { idx: 0, n: S.count || Infinity, score: 0, order };
  globeAsk();
}
function globeNext() {
  GL.idx++;
  if (GL.n !== Infinity && GL.idx >= GL.n) { ov.replaceChildren(); clearHL(); setPanel(globeHeader() + endHTML({ score: GL.score, n: GL.n })); wireGlobeHeader(); $('#again').onclick = globeStart; return; }
  globeAsk();
}
function globeFinish(ok, html) {
  GL.done = true; if (ok && GL.tries === 0) GL.score++;
  $('#fbox').innerHTML = ok ? `<div class="fb good"><span class="em">${pick(PRAISE)} ✅</span>${html}</div>${teamAwardHTML()}` : `<div class="fb bad"><span class="em">${pick(NEARLY)}</span>${html}</div>`;
  wireAward($('#fbox'));
  const s = $('#skip'), last = GL.n !== Infinity && GL.idx + 1 >= GL.n; s.textContent = last ? 'Finish' : 'Next ➜'; s.className = 'btn';
  scrollEnd();
}
function placeName(p) { return p.c && p.c !== p.n ? `${p.n}, ${p.c}` : p.n; }
function globeMark(p, label) {
  const q = rob(p.lon, p.lat), g = cs(ov, q.x, q.y, 'hlx');
  E('circle', { class: 'pulse', r: 16 }, g); E('circle', { r: 10, fill: '#e53935', stroke: '#fff', 'stroke-width': 3 }, g);
  if (label) E('text', { x: 16, y: 6, 'font-size': 19, class: 'lbl' }, g).textContent = label;
}
function llGuides(la, lo) {
  const g = E('g', { class: 'hlx' }, ov), a = rob(-180, la), b = rob(180, la), pts = [];
  E('path', { d: `M${a.x} ${a.y}H${b.x}`, stroke: '#ff6f00', 'stroke-width': 4, 'vector-effect': 'non-scaling-stroke' }, g);
  for (let lat = -90; lat <= 90; lat += 5) pts.push(rob(lo, lat));
  E('path', { d: 'M' + pts.map(p => p.x + ' ' + p.y).join('L'), fill: 'none', stroke: '#ff6f00', 'stroke-width': 4, 'vector-effect': 'non-scaling-stroke' }, g);
}
function globeAsk() {
  ov.replaceChildren(); clearHL();
  GL.done = false; GL.tries = 0; GL.pin = null;
  const p = GL.order[GL.idx % GL.order.length]; GL.p = p;
  if (!p) { setPanel(globeHeader() + '<div class="qcard"><p class="q">No places found.</p></div>'); wireGlobeHeader(); return; }
  if (S.globeTask === 'time') return timeAsk(p);
  const la = r10(p.lat), lo = r10(p.lon); GL.ans = [la, lo];
  fitLL([clamp(lo - 50, -180, 130), clamp(la - 30, -70, 40), clamp(lo + 50, -130, 180), clamp(la + 30, -40, 80)]);
  if (S.globeTask === 'read') {
    globeMark(p, p.n);
    const c = [la, lo], cand = [];
    if (la) cand.push([-la, lo]); if (lo) cand.push([la, -lo]);
    cand.push([la + 10, lo], [la - 10, lo], [la, lo + 10], [la, lo - 10], [la + 20, lo - 10]);
    if (Math.abs(lo) <= 80 && lo !== la) cand.push([lo, la]);
    const seen = new Set([c.join()]), opts = [c];
    for (const o of shuffle(cand)) { if (Math.abs(o[0]) > 80 || Math.abs(o[1]) > 180 || seen.has(o.join())) continue; seen.add(o.join()); opts.push(o); if (opts.length === 4) break; }
    shuffle(opts);
    setPanel(globeHeader() + `<div class="qcard"><p class="q">What are the latitude and longitude of <b>${esc(placeName(p))}</b>?</p><p class="hint" style="margin:0">To the nearest 10°. Latitude (north or south of the Equator) comes first.</p></div>
      <div class="answers" id="answers">${opts.map((o, i) => `<button class="btn sec" data-o="${i}">${fmtLL(o[0], o[1])}</button>`).join('')}</div><div id="fbox"></div>
      <div class="row"><button class="btn sec" id="skip">Skip</button></div>`);
    wireGlobeHeader(); $('#skip').onclick = globeNext;
    const right = opts.findIndex(o => o[0] === la && o[1] === lo);
    panel.querySelectorAll('#answers [data-o]').forEach(btn => btn.onclick = () => {
      if (GL.done) return;
      panel.querySelectorAll('#answers [data-o]').forEach(x => x.classList.add(+x.dataset.o === right ? 'right' : 'wrong'));
      llGuides(la, lo);
      globeFinish(+btn.dataset.o === right, `${esc(p.n)} is at about <b>${fmtLL(la, lo)}</b>: ${la ? Math.abs(la) + '° ' + (la > 0 ? 'north' : 'south') + ' of the Equator' : 'on the Equator'} and ${lo ? Math.abs(lo) + '° ' + (lo > 0 ? 'east' : 'west') + ' of the Prime Meridian' : 'on the Prime Meridian'}.`);
    });
  } else {
    setPanel(globeHeader() + `<div class="qcard"><p class="q">Put a pin at</p><div class="big" style="font-size:calc(46px*var(--fs))">${fmtLL(la, lo)}</div><p class="hint" style="margin:0">Find the latitude line first, then the longitude line. Tap where they cross.</p></div>
      <div id="fbox"></div><div class="row"><button class="btn go" id="check" disabled>Check</button></div>
      <div class="row"><button class="btn sec" id="skip">Skip</button><button class="btn sec" id="showme">Show me</button></div>`);
    wireGlobeHeader(); $('#skip').onclick = globeNext; $('#check').onclick = plotCheck; $('#showme').onclick = () => plotReveal();
  }
}
function globeTap(p) {
  if (!GL || GL.done || S.globeTask !== 'plot') return;
  if (!robInv(p.x, p.y)) return;
  GL.pin = p; placePin(p); $('#check').disabled = false;
}
function plotCheck() {
  const ll = robInv(GL.pin.x, GL.pin.y), [la, lo] = GL.ans;
  const dLa = ll.lat - la, dLo = ((ll.lon - lo + 540) % 360) - 180;
  GL.tries++;
  if (Math.abs(dLa) <= 5 && Math.abs(dLo) <= 5) {
    GL.tries--; $('#check').style.display = 'none'; $('#showme').style.display = 'none';
    llGuides(la, lo); globeMark(GL.p, GL.p.n);
    return globeFinish(true, `${fmtLL(la, lo)} is near <b>${esc(placeName(GL.p))}</b>.`);
  }
  const ns = Math.abs(dLa) > 5 ? (dLa > 0 ? 'south' : 'north') : '', ew = Math.abs(dLo) > 5 ? (dLo > 0 ? 'west' : 'east') : '';
  $('#fbox').innerHTML = `<div class="fb bad"><span class="em">${pick(NEARLY)}</span>Your pin is at about ${fmtLL(r10(ll.lat), r10(ll.lon))}. Move it further ${[ns, ew].filter(Boolean).join(' and ')}.</div>`;
  $('#check').disabled = true;
  if (GL.tries >= 3) plotReveal();
}
function plotReveal() {
  const [la, lo] = GL.ans; GL.done = true;
  llGuides(la, lo); globeMark(GL.p, GL.p.n);
  $('#check').style.display = 'none'; $('#showme').style.display = 'none';
  GL.tries = 1; globeFinish(false, `Here it is! The orange lines cross at ${fmtLL(la, lo)}, near ${esc(placeName(GL.p))}.`);
}
const fmtHour = h => { h = ((h % 24) + 24) % 24; return h === 0 ? '12 midnight' : h === 12 ? '12 noon' : h < 12 ? h + ' am' : (h - 12) + ' pm'; };
function timeAsk(p) {
  const base = pick([8, 9, 10, 12, 14, 15]), z = p.z, t = base + z;
  const day = t >= 24 ? ' (the next day)' : t < 0 ? ' (the day before)' : '';
  const cand = [base - z, t + 1, t - 1, base, t + 2, t - 3].filter(v => ((v % 24) + 24) % 24 !== ((t % 24) + 24) % 24);
  const opts = [t]; for (const c of shuffle(cand)) { if (!opts.some(o => ((o % 24) + 24) % 24 === ((c % 24) + 24) % 24)) opts.push(c); if (opts.length === 4) break; }
  shuffle(opts);
  const right = opts.indexOf(t);
  if (PROJ === 'globe') { const dl = ((p.lon + 540) % 360) - 180; centreOn(Math.abs(dl) < 110 ? dl / 2 : p.lon, (p.lat + 51.5) / 2); }
  home();
  const lon = rob(-0.13, 51.5); const lg = cs(ov, lon.x, lon.y, 'hlx'); E('circle', { r: 9, fill: '#1565c0', stroke: '#fff', 'stroke-width': 3 }, lg); E('text', { x: -14, y: 6, 'text-anchor': 'end', 'font-size': 18, class: 'lbl' }, lg).textContent = 'London';
  globeMark(p, p.n);
  setPanel(globeHeader() + `<div class="qcard"><p class="q">When it is <b>${fmtHour(base)}</b> in London, what time is it in <b>${esc(placeName(p))}</b>?</p><p class="hint" style="margin:0">Look at the time zone numbers near the bottom of the map. East of London is ahead (+), west is behind (−).</p></div>
    <div class="answers" id="answers">${opts.map((o, i) => `<button class="btn sec" data-o="${i}">${fmtHour(o)}</button>`).join('')}</div><div id="fbox"></div>
    <div class="row"><button class="btn sec" id="skip">Skip</button></div>`);
  wireGlobeHeader(); $('#skip').onclick = globeNext;
  panel.querySelectorAll('#answers [data-o]').forEach(btn => btn.onclick = () => {
    if (GL.done) return;
    panel.querySelectorAll('#answers [data-o]').forEach(x => x.classList.add(+x.dataset.o === right ? 'right' : 'wrong'));
    cur().tzPaths.filter(e => +e.dataset.z === z).forEach(e => { const c = e.cloneNode(); c.setAttribute('fill', 'rgba(255,193,7,.45)'); c.setAttribute('class', 'hlx'); ov.appendChild(c); });
    const how = z === 0 ? `${esc(p.n)} is in the same time zone as London, so it is <b>${fmtHour(t)}</b> there too.`
      : `${esc(p.n)} is in time zone GMT${z > 0 ? '+' + z : '−' + -z}, so it is ${Math.abs(z)} hour${Math.abs(z) > 1 ? 's' : ''} ${z > 0 ? 'ahead of' : 'behind'} London. ${fmtHour(base)} ${z > 0 ? '+' : '−'} ${Math.abs(z)} hours = <b>${fmtHour(t)}${day}</b>.`;
    globeFinish(+btn.dataset.o === right, how + '<br><small>We are using standard time. In summer, some countries move their clocks forward.</small>');
  });
}

/* --- true size: a Mercator map with a shape you can drag towards or away from the Equator */
const MW = 8000;
const mercY = lat => { const f = clamp(lat, -85, 85) * Math.PI / 180; return MW / 2 - MW / (2 * Math.PI) * Math.log(Math.tan(Math.PI / 4 + f / 2)); };
const mercX = lon => (lon + 180) / 360 * MW;
const mercInv = (x, y) => ({ lon: x / MW * 360 - 180, lat: (2 * Math.atan(Math.exp((MW / 2 - y) * 2 * Math.PI / MW)) - Math.PI / 2) * 180 / Math.PI });
function robInvClamped(x, y) {
  const sn = clamp((GH / 2 - y) * C45 / WR, -1, 1);
  return { lat: Math.asin(sn) * 180 / Math.PI, lon: clamp((x - WW / 2) / (WR * C45) * 180 / Math.PI, -180, 180) };
}
function buildMerc() {
  const g = E('g'), top = mercY(84), bot = mercY(-80);
  E('rect', { x: 0, y: top, width: MW, height: bot - top, fill: '#cfe7f5' }, g);
  const land = E('g', {}, g), parts = [];
  for (const [code, cont, d] of D.world.parts) {
    const rings = parsePath(d).map(r => r.map(([x, y]) => robInvClamped(x, y)));
    const dd = rings.map(r => 'M' + r.map(p => mercX(p.lon).toFixed(1) + ' ' + mercY(p.lat).toFixed(1)).join('L') + 'z').join('');
    E('path', { d: dd, class: 'land', fill: CONT_COL[cont] || '#ddd' }, land);
    parts.push({ code, cont, rings });
  }
  const grat = E('g', { stroke: '#4f86b8', 'stroke-width': .8, opacity: .6, fill: 'none' }, g);
  for (let lat = -80; lat <= 80; lat += 20) E('path', { d: `M0 ${mercY(lat)}H${MW}`, 'vector-effect': 'non-scaling-stroke', 'stroke-width': lat === 0 ? 2.4 : .8, stroke: lat === 0 ? '#d32f2f' : null }, grat);
  const lab = E('g', {}, g);
  for (let lat = -60; lat <= 80; lat += 20) E('text', { y: -4, x: 6, 'font-size': 13, 'font-weight': 900, fill: '#1f5f99' }, cs(lab, 20, mercY(lat), 'lbl')).textContent = lat === 0 ? 'Equator' : deg(lat, 'N', 'S');
  const dyn = E('g', { id: 'dyn' }, g);
  return { g, mparts: parts, dyn, b: { x: 0, y: top, w: MW, h: bot - top }, minK: .3 };
}
const SIZE_SHAPES = {
  GRL: ['Greenland', 2.17], AFRICA: ['Africa', 30.4], GBR: ['United Kingdom', 0.24], RUS: ['Russia', 17.1], BRA: ['Brazil', 8.5],
  AUS: ['Australia', 7.7], USA: ['United States', 9.8], IND: ['India', 3.3], CHN: ['China', 9.6], ATA: ['Antarctica', 14.2],
};
let ghost = null;
function sizeStart() {
  if (S.map !== 'merc') showMap('merc');
  ov.replaceChildren();
  ghost = null; GL = null;
  setPanel(globeHeader() + `<div class="qcard"><p class="q">Pick a shape, then <b>drag it</b> around the map.</p>
    <p class="hint" style="margin:0">This is a Mercator map, like many wall maps and online maps. (Our main world map uses the Gall-Peters projection, which shows every country at its true size.) It stretches places near the North and South Poles, so they look much bigger than they really are. As you drag a shape towards the Equator, it shrinks to its true size compared with the land there.</p></div>
    <div class="chips">${Object.entries(SIZE_SHAPES).map(([k, [n]]) => `<button class="chip" data-sh="${k}">${n}</button>`).join('')}</div>
    <div id="fbox"></div>`);
  wireGlobeHeader();
  panel.querySelectorAll('[data-sh]').forEach(b => b.onclick = () => { panel.querySelectorAll('[data-sh]').forEach(x => x.classList.toggle('on', x === b)); makeGhost(b.dataset.sh); });
  makeGhost('GRL');
  panel.querySelector('[data-sh="GRL"]').classList.add('on');
}
const toVec = p => { const a = p.lat * Math.PI / 180, b = p.lon * Math.PI / 180; return [Math.cos(a) * Math.cos(b), Math.cos(a) * Math.sin(b), Math.sin(a)]; };
const toLL = v => ({ lat: Math.asin(clamp(v[2], -1, 1)) * 180 / Math.PI, lon: Math.atan2(v[1], v[0]) * 180 / Math.PI });
function makeGhost(key) {
  const m = cur();
  const parts = m.mparts.filter(p => key === 'AFRICA' ? p.cont === 'Africa' : p.code === key);
  const rings = parts.flatMap(p => p.rings).filter(r => r.length > 3);
  const sum = [0, 0, 0]; let n = 0;
  for (const r of rings) for (const p of r) { const v = toVec(p); sum[0] += v[0]; sum[1] += v[1]; sum[2] += v[2]; n++; }
  const c0 = toLL(sum.map(x => x / n));
  ghost = { key, rings, c0, at: { lat: c0.lat, lon: c0.lon } };
  drawGhost();
  const [name, area] = SIZE_SHAPES[key];
  $('#fbox').innerHTML = `<div class="fact"><b>${esc(name)}</b>Real area: about ${area} million km².${key === 'GRL' ? ' Africa is about 14 times bigger than Greenland, even though they look a similar size on this map!' : key === 'ATA' ? ' Antarctica looks enormous on this map because it is at the South Pole.' : key === 'GBR' ? ' Try dragging the UK north, towards the Arctic, and watch it grow.' : ''}</div>
    <button class="btn sec" id="ghostHome">Put it back</button>`;
  $('#ghostHome').onclick = () => { ghost.at = { lat: ghost.c0.lat, lon: ghost.c0.lon }; drawGhost(); };
  const x = mercX(c0.lon), y = mercY(c0.lat);
  home();
}
function drawGhost() {
  ov.querySelectorAll('.ghost').forEach(e => e.remove());
  if (!ghost) return;
  const a = toVec(ghost.c0), b = toVec(ghost.at);
  let ax = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const sn = Math.hypot(...ax), cs_ = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const rot = v => {
    if (sn < 1e-9) return v;
    const k = ax.map(x => x / sn), th = Math.atan2(sn, cs_), c = Math.cos(th), s = Math.sin(th);
    const kv = k[0] * v[0] + k[1] * v[1] + k[2] * v[2];
    const cr = [k[1] * v[2] - k[2] * v[1], k[2] * v[0] - k[0] * v[2], k[0] * v[1] - k[1] * v[0]];
    return [0, 1, 2].map(i => v[i] * c + cr[i] * s + k[i] * kv * (1 - c));
  };
  let d = '';
  for (const r of ghost.rings) {
    let prev = null;
    const pts = r.map(p => { const q = toLL(rot(toVec(p))); if (prev !== null) { while (q.lon - prev > 180) q.lon -= 360; while (q.lon - prev < -180) q.lon += 360; } else { while (q.lon - ghost.at.lon > 180) q.lon -= 360; while (q.lon - ghost.at.lon < -180) q.lon += 360; } prev = q.lon; return q; });
    d += 'M' + pts.map(p => mercX(p.lon).toFixed(1) + ' ' + mercY(p.lat).toFixed(1)).join('L') + 'z';
  }
  E('path', { d, class: 'ghost', fill: 'rgba(229,57,53,.5)', stroke: '#b71c1c', 'stroke-width': 2.5, 'vector-effect': 'non-scaling-stroke', style: 'cursor:grab' }, ov);
}

/* ------------------------------------------------------------ printable worksheets */
function printSheet() {
  const m = cur(); if (!m || S.map === 'merc') return toast('Choose the world, UK or an OS map first');
  const vb = svg.getAttribute('viewBox').split(' ').map(Number);
  const clone = svg.cloneNode(true);
  clone.removeAttribute('id'); clone.setAttribute('class', 'print-map');
  clone.querySelector('#overlay').replaceChildren();
  const ovc = clone.querySelector('#overlay');
  const inView = (x, y) => x > vb[0] + vb[2] * .04 && x < vb[0] + vb[2] * .96 && y > vb[1] + vb[3] * .04 && y < vb[1] + vb[3] * .96;
  const letters = 'ABCDEFGH';
  let qs = [], ans = [], title;
  const markAt = (x, y, t) => { const g = cs(ovc, x, y); E('circle', { r: 13, fill: '#fff', stroke: '#111', 'stroke-width': 2.5 }, g); E('text', { 'text-anchor': 'middle', y: 6, 'font-size': 16, 'font-weight': 900 }, g).textContent = t; };
  if (m.L) {
    const L = m.L, lvl = gridLevel();
    title = `OS map skills: ${L.name}`;
    const shown = i => { const g = m.poiG.querySelector(`[data-i="${i}"]`); return g && g.style.display !== 'none' && g.style.visibility !== 'hidden' && S.layers.local.symbols; };
    const vis = osPois().filter(p => inView(p.x, p.y) && shown(p.i));
    const sq = p => refOf(L, p.x, p.y, 6).join('');
    const chosen = shuffle(vis.slice()).filter((p, i, a) => a.findIndex(q => q.t === p.t && Math.hypot(q.x - p.x, q.y - p.y) < 300) === i).slice(0, 6);
    chosen.forEach((p, i) => { markAt(p.x + 26 * V.k, p.y - 22 * V.k, letters[i]); const r = refOf(L, p.x, p.y, lvl); qs.push(`What is at <b>${letters[i]}</b>? ______________________ &nbsp; Its ${lvl}-figure grid reference: ____________`); ans.push(`${letters[i]}: ${POI[p.t]} — ${r.join(' ')}`); });
    const more = shuffle(vis.filter(p => !chosen.includes(p) && vis.filter(q => sq(q) === sq(p)).length === 1)).slice(0, 4);
    more.forEach(p => { const r = refOf(L, p.x, p.y, lvl); qs.push(`Which symbol is at grid reference <b>${r.join(' ')}</b>? ______________________`); ans.push(`${r.join(' ')}: ${POI[p.t]}`); });
    // grid numbers along the edges of the printed map
    const gl = E('g', {}, ovc);
    for (let e = Math.ceil((L.e0 + vb[0]) / 1000) * 1000; e < L.e0 + vb[0] + vb[2]; e += 1000) E('text', { 'text-anchor': 'middle', y: -4, 'font-size': 16, 'font-weight': 900, fill: '#1a5fb4' }, cs(gl, e - L.e0, vb[1] + vb[3], 'lbl')).textContent = String(Math.floor(e / 1000) % 100).padStart(2, '0');
    for (let n = Math.ceil((L.n1 - vb[1] - vb[3]) / 1000) * 1000; n < L.n1 - vb[1]; n += 1000) E('text', { x: 4, y: 6, 'font-size': 16, 'font-weight': 900, fill: '#1a5fb4' }, cs(gl, vb[0], L.n1 - n, 'lbl')).textContent = String(Math.floor(n / 1000) % 100).padStart(2, '0');
  } else {
    title = S.map === 'world' ? 'Name the places: world map' : 'Name the places: United Kingdom';
    clone.querySelectorAll('#dyn, #w-allnames, #uk-names, .wl-lab').forEach(e => e.remove());
    const kinds = ['point', 'country', 'ukcountry', 'continent'];
    if (S.map === 'uk' && S.layers.uk.counties) kinds.push('county');
    if (S.map === 'uk' && S.layers.uk.regions) kinds.push('region');
    const its = visibleItems().filter(it => kinds.includes(it.k)).map(it => [it, targetPoint(it)]).filter(([, t]) => t && inView(t.x, t.y));
    const chosen = [];
    for (const [it, t] of shuffle(its)) { if (chosen.every(([, u]) => Math.hypot(u.x - t.x, u.y - t.y) > 40 * V.k)) chosen.push([it, t]); if (chosen.length === 10) break; }
    chosen.forEach(([it, t], i) => { markAt(t.x, t.y, String(i + 1)); qs.push(`<b>${i + 1}.</b> ______________________________`); ans.push(`${i + 1}. ${it.n}`); });
    const bank = shuffle(chosen.map(([it]) => it.n));
    qs.push(`<div class="bank"><b>Word bank:</b> ${bank.map(esc).join(' · ')}</div>`);
  }
  const w = 180, h = Math.min(170, w * vb[3] / vb[2]);
  clone.setAttribute('width', w + 'mm'); clone.setAttribute('height', h + 'mm');
  clone.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  const div = document.createElement('div'); div.id = 'print';
  div.innerHTML = `<div class="ph"><img src="../logo.png" alt=""><div><h1>${esc(title)}</h1><p>Name: ________________________ &nbsp; Date: ______________</p></div></div>`;
  div.appendChild(clone);
  div.insertAdjacentHTML('beforeend', `<ol class="pq">${qs.map(q => q.startsWith('<div') ? q : `<li>${q}</li>`).join('')}</ol>
    <div class="pa"><h2>Answers</h2><ul>${ans.map(a => `<li>${esc(a)}</li>`).join('')}</ul><p class="pf">Map Explorer · Wallscourt Farm Academy · Version ${VERSION}</p></div>`);
  document.body.appendChild(div);
  const done = () => { div.remove(); window.removeEventListener('afterprint', done); };
  window.addEventListener('afterprint', done);
  setTimeout(() => window.print(), 150);
}

/* ------------------------------------------------------------ search for a place */
const norm = t => String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
let searchIndex = null;
function buildSearchIndex() {
  const out = [], add = (n, sub, rank, act, flag) => out.push({ n, sub, rank, act, flag, key: norm(n) });
  for (const [code, c] of Object.entries(D.world.countries)) add(c.n, 'Country · ' + (code === 'RUS' ? 'Europe and Asia' : c.c), 0, () => searchCountry(code), c.f);
  for (const it of ITEMS) {
    if (it.k === 'country' || it.k === 'ukcountry' || it.k === 'county' || it.k === 'region') continue;
    add(it.n, cap1(kindText(it).replace(/^an? /, '')) + (it.m === 'uk' ? ' · UK' : ''), it.k === 'continent' || it.k === 'ocean' ? 0 : 3, () => searchItem(it), flagFor(it));
  }
  const itemNames = new Set(ITEMS.map(i => norm(i.n)));
  for (const [n, cn, lat, lon] of D.world.caps) if (!itemNames.has(norm(n))) add(n, 'Capital city · ' + cn, 2, () => searchCity(n, cn, lat, lon, true));
  for (const [n, cn, lat, lon] of D.world.cities) if (!itemNames.has(norm(n))) add(n, 'City · ' + cn, 6, () => searchCity(n, cn, lat, lon, false));
  for (const c of D.uk.countries) add(c.n, 'Country in the United Kingdom', 0, () => searchUK('ukcountry', c.n), UK_FLAGS[c.n]);
  for (const r of D.uk.regions) add(r.n, 'Region of England', 1, () => searchUK('region', r.n));
  for (const c of D.uk.counties) add(c.n, 'County · England', 1, () => searchUK('county', c.n));
  for (const [n, x, y, city] of D.uk.towns) if (!itemNames.has(norm(n))) add(n, (city ? 'City' : 'Town') + ' · UK', city ? 2 : 4, () => searchTown(n, x, y, city));
  for (const L of D.local) {
    add(L.name, 'OS-style map', 5, () => { goMap('local:' + L.id); home(); exploreStart(); });
    for (const p of L.places) add(p.t, 'Place on the ' + L.name + ' OS map', 7, () => searchLocal(L.id, p.x, p.y));
    for (const p of L.names) add(p.t, 'On the ' + L.name + ' OS map', 8, () => searchLocal(L.id, p.x, p.y));
  }
  return out;
}
function searchPlaces(q) {
  const k = norm(q); if (!k) return [];
  searchIndex ||= buildSearchIndex();
  const res = [];
  for (const e of searchIndex) {
    let s = e.key === k ? 0 : e.key.startsWith(k) ? 1 : (' ' + e.key).includes(' ' + k) ? 2 : e.key.includes(k) ? 3 : -1;
    if (s >= 0) res.push([s * 10 + e.rank, e]);
  }
  res.sort((a, b) => a[0] - b[0] || a[1].n.length - b[1].n.length);
  const seen = new Set();
  return res.map(r => r[1]).filter(e => { const id = e.key + '|' + e.sub; if (seen.has(id)) return false; seen.add(id); return true; }).slice(0, 8);
}
function goMap(id) {
  if (S.mode !== 'explore') { S.mode = 'explore'; save(); document.querySelectorAll('#modeSeg button').forEach(b => b.classList.toggle('on', b.dataset.mode === 'explore')); }
  if (S.map !== id) showMap(id); else refreshDyn();
  ov.replaceChildren(); clearHL();
}
function zoomToBox(box, minSize) {
  let [x, y, w, h] = box; const c = [x + w / 2, y + h / 2];
  w = Math.max(w, minSize); h = Math.max(h, minSize);
  fitBox(c[0] - w / 2, c[1] - h / 2, w, h, 1.5);
}
function itemLL(it) {                        // rough [lon, lat] of a world item
  if (it.ll) return [it.ll[1], it.ll[0]];
  if (it.k === 'continent') { const c = CONT_LABEL[it.ref]; return [c[1], c[0]]; }
  if (it.k === 'ocean') { const a = D.world.anchors.find(a => a[0] === it.ref); return [a[2], it.ref === 'Arctic Ocean' ? 70 : a[1]]; }
  if (it.k === 'country' && D.world.countries[it.ref]) { const c = D.world.countries[it.ref], q = gpToLL(...(c._l || c.l)); return [q.lon, q.lat]; }
  if (it.k === 'group') { const c = D.world.countries[it.refs[0]], q = gpToLL(...(c._l || c.l)); return [q.lon, q.lat]; }
  if (it.k === 'latline') return [GLOBE.lon, it.lat];
  if (it.k === 'lonline') return [it.lon, 20];
  if (it.k === 'pole') return [GLOBE.lon, it.lat > 0 ? 70 : -70];
  if (it.k === 'hemi') return { N: [GLOBE.lon, 40], S: [GLOBE.lon, -40], E: [90, 10], W: [-90, 10] }[it.ref];
  return [GLOBE.lon, GLOBE.lat];
}
function searchCountry(code) {
  goMap('world');
  if (PROJ === 'globe') { const c = D.world.countries[code], q = gpToLL(...(c._l || c.l)); centreOn(q.lon, q.lat); }
  const m = cur(), parts = m.parts.filter(e => e.dataset.code === code), c = D.world.countries[code];
  parts.forEach(e => e.classList.add('sel'));
  const big = parts.reduce((a, b) => (b.getBBox().width * b.getBBox().height > a.getBBox().width * a.getBBox().height ? b : a));
  const bb = big.getBBox(); zoomToBox([bb.x, bb.y, bb.width, bb.height], 500);
  const it = ITEMS.find(i => i.m === 'world' && i.k === 'country' && i.ref === code), cont = parts[0].dataset.cont;
  showCard(c.n, code === 'RUS' ? 'A country in Europe and Asia' : 'A country in ' + (cont === 'Islands' ? 'the ocean' : cont), [['Continent', code === 'RUS' ? 'Europe and Asia' : c.c], ['Capital city', c.cap || '—']], it && it.f, c.f);
}
function searchItem(it) {
  goMap(it.m === 'uk' ? 'uk' : 'world');
  if (it.m === 'world' && PROJ === 'globe') centreOn(...itemLL(it));
  highlightItem(it, 'sel');
  const t = targetPoint(it, { x: V.b.w / 2, y: V.b.h / 2 });
  if (t && t.box && !['hemi', 'latline', 'lonline'].includes(it.k)) zoomToBox(t.box, it.m === 'uk' ? 240 : 700);
  showItemCard(it);
}
function searchCity(n, cn, lat, lon, cap) {
  goMap('world');
  centreOn(lon, lat);
  const q = rob(lon, lat), it = { id: '_s', n, k: 'point', m: 'world', xy: [q.x, q.y], cap, y: [] };
  const g = E('g', { class: 'hlx' }, ov); drawMarker(g, it, { label: true }); E('circle', { class: 'pulse', r: 16 }, cs(g, q.x, q.y));
  zoomToBox([q.x, q.y, 1, 1], 900);
  const code = Object.keys(D.world.countries).find(k => D.world.countries[k].n === cn);
  showCard(n, (cap ? 'The capital city of ' : 'A city in ') + cn, [['Country', cn], ['Hemisphere', (lat >= 0 ? 'Northern' : 'Southern') + ' and ' + (lon >= 0 ? 'eastern' : 'western')], ['Latitude and longitude', `about ${deg(Math.round(lat), 'N', 'S')}, ${deg(Math.round(lon), 'E', 'W')}`]], '', code ? D.world.countries[code].f : null);
}
function searchUK(kind, n) {
  goMap('uk');
  const it = { k: kind, ref: n, n, m: 'uk' };
  highlightItem(it, 'sel');
  const t = targetPoint(it); if (t && t.box) zoomToBox(t.box, 200);
  const real = ITEMS.find(i => i.m === 'uk' && i.k === kind && i.ref === n);
  const m = cur(), l = t ? DPt(t.x, t.y) : null, country = l && m.ctry.find(e => e.isPointInFill(l));
  showCard(n, kind === 'county' ? 'A county in England' : kind === 'region' ? 'A region of England' : 'A country in the United Kingdom',
    kind === 'ukcountry' ? [] : [['Country', country ? country.dataset.n : 'England']], (real && real.f || '') + (n === 'Northern Ireland' ? ' ' + NI_NOTE : ''), kind === 'ukcountry' ? UK_FLAGS[n] : null);
}
function searchTown(n, x, y, city) {
  goMap('uk');
  const it = { id: '_s', n, k: 'point', m: 'uk', xy: [x, y], y: [] };
  const g = E('g', { class: 'hlx' }, ov); drawMarker(g, it, { label: true }); E('circle', { class: 'pulse', r: 16 }, cs(g, x, y));
  zoomToBox([x, y, 1, 1], 260);
  const m = cur(), pt = DPt(x, y);
  const country = m.ctry.find(e => e.isPointInFill(pt)), county = m.ctys.find(e => e.isPointInFill(pt)), region = m.regs.find(e => e.isPointInFill(pt));
  const rows = [['Country', country ? country.dataset.n : 'United Kingdom']];
  if (region) rows.push(['Region', region.dataset.n]);
  if (county) rows.push(['County', county.dataset.n]);
  showCard(n, `A ${city ? 'city' : 'town'} in ${country ? country.dataset.n : 'the United Kingdom'}`, rows, '', country ? UK_FLAGS[country.dataset.n] : null);
}
function searchLocal(id, x, y) {
  goMap('local:' + id);
  goTo(x, y, Math.max(V.minK, 1500 / Math.min(V.W, V.H)), 0);
  localExplore({ x, y });
}
/* ------------------------------------------------------------ mode switching */
function startMode() {
  document.querySelectorAll('#modeSeg button').forEach(b => b.classList.toggle('on', b.dataset.mode === S.mode));
  Q = C = G = null;
  { const m = cur(); if (m && m.L) m.force = null; }
  refreshDyn();
  if (S.map === 'merc' && !(S.mode === 'globe' && S.globeTask === 'size')) showMap('world');
  restyle();
  ({ explore: exploreStart, find: findStart, compass: compassStart, grid: gridStart, globe: globeStart })[S.mode]();
}
document.querySelectorAll('#modeSeg button').forEach(b => b.onclick = () => { S.mode = b.dataset.mode; save(); startMode(); });

/* ------------------------------------------------------------ popovers, modals */
function openPop(anchor, html, wire) {
  const p = $('#pop'); p.innerHTML = html; p.hidden = false;
  const r = anchor.getBoundingClientRect();
  p.style.left = Math.min(r.left, innerWidth - p.offsetWidth - 10) + 'px';
  p.style.top = (r.bottom + 8) + 'px';
  if (r.bottom + 8 + p.offsetHeight > innerHeight) { p.style.top = Math.max(10, r.top - p.offsetHeight - 8) + 'px'; }
  wire && wire(p);
  setTimeout(() => document.addEventListener('pointerdown', popAway), 0);
}
function popAway(e) { if (!$('#pop').contains(e.target)) closePop(); }
function closePop() { $('#pop').hidden = true; document.removeEventListener('pointerdown', popAway); }
function openModal(html, wire) { $('#modalBody').innerHTML = html; $('#modal').hidden = false; wire && wire($('#modalBody')); }
function closeModal() { $('#modal').hidden = true; }
$('#modal').addEventListener('pointerdown', e => { if (e.target.id === 'modal' && S.year !== null) closeModal(); });

const YEAR_NOTES = { 1: 'UK countries & capitals', 2: 'Continents, oceans, regions', 3: 'Europe, South West, 4-figure', 4: 'South America, lines, 6-figure', 5: 'World cities, waterways', 6: 'Mountains, volcanoes, highlands', 0: 'Everything' };
function yearModal(first) {
  openModal(`<h2>${first ? 'Welcome to Map Explorer!' : 'Choose a year group'}</h2><p>Places and questions match the CLF geography curriculum for each year.</p>
    <div class="yeargrid">${[1, 2, 3, 4, 5, 6, 0].map(y => `<button data-y="${y}" class="${S.year === y ? 'on' : ''}">${y ? 'Year ' + y : 'All years'}<small>${YEAR_NOTES[y]}</small></button>`).join('')}</div>
    <div class="setrow" style="border:0"><span>Include earlier years as revision</span><div class="chips"><button class="chip ${S.revision ? 'on' : ''}" data-rev="1">Yes</button><button class="chip ${!S.revision ? 'on' : ''}" data-rev="0">No</button></div></div>`,
  b => {
    b.querySelectorAll('[data-rev]').forEach(x => x.onclick = () => { S.revision = x.dataset.rev === '1'; save(); b.querySelectorAll('[data-rev]').forEach(y => y.classList.toggle('on', y === x)); });
    b.querySelectorAll('[data-y]').forEach(x => x.onclick = () => {
      S.year = +x.dataset.y; save(); updateTop(); closeModal();
      if (first) { const def = S.year === 1 ? 'uk' : S.year === 2 ? 'world' : S.map; if (def !== S.map) showMap(def); }
      startMode();
    });
  });
}
function updateTop() { $('#yearTxt').textContent = S.year ? 'Year ' + S.year : 'All years'; }
$('#yearBtn').onclick = () => yearModal(false);
$('#mapBtn').onclick = e => openPop(e.currentTarget, `<h3>Choose a map</h3>
  <button class="opt ${S.map === 'world' ? 'on' : ''}" data-m="world">🌍 World</button>
  <button class="opt ${S.map === 'uk' ? 'on' : ''}" data-m="uk">🇬🇧 United Kingdom</button>
  ${D.local.map(l => `<button class="opt ${S.map === 'local:' + l.id ? 'on' : ''}" data-m="local:${l.id}">🗺️ ${esc(l.name)}<small>OS-style map</small></button>`).join('')}`,
p => p.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { closePop(); showMap(b.dataset.m); startMode(); }));
$('#layerBtn').onclick = e => {
  const key = mapKind(), L = S.layers[key];
  const opts = key === 'world' ? [['names', 'Names'], ['colour', 'Colour the continents'], ['lines', 'Equator, tropics and polar circles'], ['grid', 'Lines of latitude and longitude'], ['tz', 'Time zones'], ['biomes', 'Biomes (rainforest, desert, tundra…)'], ['climate', 'Climate zones (tropical, temperate, polar)'], ['plates', 'Tectonic plate boundaries']]
    : key === 'uk' ? [['names', 'Names'], ['rivers', 'Rivers and canals'], ['regions', 'Regions of England'], ['counties', 'Counties of England']]
      : [['names', 'Place names and labels'], ['symbols', 'Map symbols'], ['contours', 'Contour lines (height)'], ['tenths', '100 m grid lines (for 6-figure references, when zoomed in)'], ['tenthNums', 'Tenths numbers (0–9) along the edges']];
  openPop(e.currentTarget, `<h3>Show on the map</h3>${opts.map(([k, t]) => `<label class="tog"><input type="checkbox" data-l="${k}" ${L[k] ? 'checked' : ''}>${t}</label>`).join('')}${key === 'local' ? '<button class="opt" id="popKey">🔑 Map key</button>' : ''}`,
    p => {
      p.querySelectorAll('[data-l]').forEach(c => c.onchange = () => { L[c.dataset.l] = c.checked; save(); restyle(); refreshDyn(); onViewChange(); drawMapKey(); });
      const k = p.querySelector('#popKey'); if (k) k.onclick = () => { closePop(); showKey(); };
    });
  const r = e.currentTarget.getBoundingClientRect(), pp = $('#pop'); pp.style.left = (r.right - pp.offsetWidth) + 'px';
};
$('#symBtn').onclick = e => {
  const key = mapKind();
  if (key === 'local') {
    const m = cur(), L = S.layers.local, hide = new Set(L.hide || []);
    const types = [...new Set(m.pois.map(p => p.t))].sort((a, b) => POI_RANK.indexOf(a) - POI_RANK.indexOf(b));
    openPop(e.currentTarget, `<h3>Map symbols</h3>
      <label class="tog"><input type="checkbox" id="symAll" ${L.symbols ? 'checked' : ''}><b>Show symbols</b></label>
      <div class="chips" style="margin:2px 0 6px"><button class="chip" id="symEvery">Show all kinds</button><button class="chip" id="symFew">Fewer (hide pubs, parking, post offices)</button></div>
      ${types.map(t => `<label class="tog"><input type="checkbox" data-st="${t}" ${hide.has(t) ? '' : 'checked'}><svg width="44" height="30" viewBox="-30 -15 60 30"><use href="#sym-${t}"/></svg>${POI[t]}</label>`).join('')}`, p => {
      const apply = () => { save(); restyle(); };
      p.querySelector('#symAll').onchange = ev => { L.symbols = ev.target.checked; apply(); };
      p.querySelectorAll('[data-st]').forEach(c => c.onchange = () => { const h = new Set(L.hide || []); c.checked ? h.delete(c.dataset.st) : h.add(c.dataset.st); L.hide = [...h]; apply(); });
      p.querySelector('#symEvery').onclick = () => { L.hide = []; L.symbols = true; p.querySelectorAll('[data-st]').forEach(c => c.checked = true); p.querySelector('#symAll').checked = true; apply(); };
      p.querySelector('#symFew').onclick = () => { L.hide = ['pub', 'parking', 'po']; L.symbols = true; p.querySelectorAll('[data-st]').forEach(c => c.checked = !L.hide.includes(c.dataset.st)); p.querySelector('#symAll').checked = true; apply(); };
    });
  } else {
    const L = S.layers[key], hc = new Set(L.hideCats || []);
    openPop(e.currentTarget, `<h3>Places on the map</h3>
      <label class="tog"><input type="checkbox" data-l="markers" ${L.markers !== false ? 'checked' : ''}><b>Show places</b></label>
      ${Object.entries(PLACE_CATS).map(([k, t]) => `<label class="tog"><input type="checkbox" data-cat="${k}" ${hc.has(k) ? '' : 'checked'}>${t}</label>`).join('')}
      ${key === 'uk' ? `<label class="tog"><input type="checkbox" data-l="rivers" ${L.rivers ? 'checked' : ''}>Rivers and canals</label>` : ''}
      <label class="tog"><input type="checkbox" data-l="names" ${L.names ? 'checked' : ''}>Names</label>
      <label class="tog"><input type="checkbox" id="revTog" ${S.revision ? 'checked' : ''}>Include earlier years' places</label>
      <label class="tog"><input type="checkbox" id="keyTog" ${S.mapKeyOff ? '' : 'checked'}>Key on the map</label>
      <p style="margin:0;font-size:15px;color:#4a6577;font-weight:700">Earlier years' places are drawn smaller. Zoom in to see places hidden where they crowd together.</p>`,
    p => {
      p.querySelectorAll('[data-l]').forEach(c => c.onchange = () => { L[c.dataset.l] = c.checked; save(); restyle(); refreshDyn(); });
      p.querySelectorAll('[data-cat]').forEach(c => c.onchange = () => { const h = new Set(L.hideCats || []); c.checked ? h.delete(c.dataset.cat) : h.add(c.dataset.cat); L.hideCats = [...h]; save(); refreshDyn(); });
      p.querySelector('#revTog').onchange = ev => { S.revision = ev.target.checked; save(); refreshDyn(); };
      p.querySelector('#keyTog').onchange = ev => { S.mapKeyOff = !ev.target.checked; save(); drawMapKey(); };
    });
  }
  const r = e.currentTarget.getBoundingClientRect(), pp = $('#pop'); pp.style.left = Math.max(10, r.right - pp.offsetWidth) + 'px';
};
$('#projBtn').onclick = e => {
  openPop(e.currentTarget, `<h3>World map projection</h3>
    <p style="margin:0 0 4px;font-size:16px;font-weight:700;color:#4a6577;max-width:420px">A projection is a way of flattening the round Earth onto a flat map. Every flat map stretches something.</p>
    <button class="opt ${PROJ === 'gp' ? 'on' : ''}" data-proj="gp">🌍 Gall-Peters<small>true sizes</small></button>
    <button class="opt ${PROJ === 'merc' ? 'on' : ''}" data-proj="merc">🗺️ Mercator<small>like online maps</small></button>
    <button class="opt ${PROJ === 'globe' ? 'on' : ''}" data-proj="globe">🌐 Globe<small>drag to spin</small></button>
    <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#4a6577;max-width:420px">A globe is the only map with nothing stretched, but you can only see half the Earth at once. Gall-Peters shows every country at its true size, but stretches their shapes. Mercator keeps shapes but makes places near the poles look much too big: Greenland looks as big as Africa, but Africa is about 14 times bigger.</p>`,
  p => p.querySelectorAll('[data-proj]').forEach(b => b.onclick = () => { closePop(); setProj(b.dataset.proj); }));
  const r = e.currentTarget.getBoundingClientRect(), pp = $('#pop'); pp.style.left = Math.max(10, r.right - pp.offsetWidth) + 'px';
};
$('#setBtn').onclick = () => openModal(`<h2>Settings</h2>
  <div class="setrow"><span>Questions in a set</span><div class="chips">${[5, 10, 15, 20, 0].map(n => `<button class="chip ${S.count === n ? 'on' : ''}" data-c="${n}">${n || '∞'}</button>`).join('')}</div></div>
  <div class="setrow"><span>Include earlier years as revision</span><div class="chips"><button class="chip ${S.revision ? 'on' : ''}" data-rev="1">Yes</button><button class="chip ${!S.revision ? 'on' : ''}" data-rev="0">No</button></div></div>
  <div class="setrow"><span>Zoom to the right area for each question</span><div class="chips"><button class="chip ${S.autoZoom ? 'on' : ''}" data-az="1">Yes</button><button class="chip ${!S.autoZoom ? 'on' : ''}" data-az="0">No</button></div></div>
  <div class="setrow"><span>Extra-large text</span><div class="chips"><button class="chip ${S.big ? 'on' : ''}" data-big="1">Yes</button><button class="chip ${!S.big ? 'on' : ''}" data-big="0">No</button></div></div>
  <div class="setrow"><span>Grid references</span><div class="chips">${[[0, 'By year'], [4, '4-figure'], [6, '6-figure']].map(([v, t]) => `<button class="chip ${S.gridLevel === v ? 'on' : ''}" data-gl="${v}">${t}</button>`).join('')}</div></div>
  <p style="margin-top:18px;font-size:15px">Map Explorer · Version ${VERSION}. No pupil information is stored. Settings are saved on this computer only.<br>
  World map: Natural Earth. UK map: contains OS data © Crown copyright and database right 2024; Office for National Statistics (Open Government Licence). OS-style maps: © OpenStreetMap contributors, drawn in the style of Ordnance Survey maps using the British National Grid. Heights: OS Terrain 50 (OGL). Tectonic plates: Bird (2002), via Ahlenius &amp; Nordpil (ODC-BY). Flags: flag-icons (MIT). Biomes: RESOLVE Ecoregions 2017 (CC-BY 4.0).</p>
  <button class="btn" id="closeSet">Done</button>`, b => {
  const grp = (attr, f) => b.querySelectorAll(`[${attr}]`).forEach(x => x.onclick = () => { f(x.getAttribute(attr)); save(); b.querySelectorAll(`[${attr}]`).forEach(y => y.classList.toggle('on', y === x)); });
  grp('data-c', v => S.count = +v);
  grp('data-rev', v => S.revision = v === '1');
  grp('data-az', v => S.autoZoom = v === '1');
  grp('data-big', v => { S.big = v === '1'; document.body.classList.toggle('big', S.big); });
  grp('data-gl', v => S.gridLevel = +v);
  b.querySelector('#closeSet').onclick = () => { closeModal(); startMode(); };
});

/* ------------------------------------------------------------ teams */
const TEAM_COL = [['Red', '#e53935'], ['Blue', '#1e88e5'], ['Green', '#2e9e4f'], ['Yellow', '#e6a100'], ['Purple', '#8e24aa'], ['Orange', '#f4511e']];
const teamList = () => TEAM_COL.slice(0, S.teams).map(([n, c]) => ({ n, c }));
function drawTeams() {
  const st = $('#teamStrip');
  st.hidden = !S.teams;
  st.innerHTML = teamList().map((t, i) => `<div class="team" style="--c:${t.c}">${t.n}<b>${S.scores[i]}</b><button data-m="${i}">−</button><button data-p="${i}">＋</button></div>`).join('');
  st.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { S.scores[+b.dataset.p]++; save(); drawTeams(); });
  st.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { S.scores[+b.dataset.m] = Math.max(0, S.scores[+b.dataset.m] - 1); save(); drawTeams(); });
  $('#teamsBtn').classList.toggle('on', !!S.teams);
  requestAnimationFrame(resize);
}
$('#teamsBtn').onclick = () => openModal(`<h2>Teams</h2><p>Play in teams and give points for correct answers.</p>
  <div class="setrow"><span>Number of teams</span><div class="chips">${[0, 2, 3, 4, 5, 6].map(n => `<button class="chip ${S.teams === n ? 'on' : ''}" data-t="${n}">${n || 'Off'}</button>`).join('')}</div></div>
  <div class="row" style="margin-top:18px"><button class="btn sec" id="resetScores">Reset scores</button><button class="btn" id="closeT">Done</button></div>`, b => {
  b.querySelectorAll('[data-t]').forEach(x => x.onclick = () => { S.teams = +x.dataset.t; save(); drawTeams(); b.querySelectorAll('[data-t]').forEach(y => y.classList.toggle('on', y === x)); });
  b.querySelector('#resetScores').onclick = () => { S.scores = [0, 0, 0, 0, 0, 0]; save(); drawTeams(); toast('Scores reset'); };
  b.querySelector('#closeT').onclick = closeModal;
});

/* ------------------------------------------------------------ pen and spotlight */
let tool = null, inkCol = '#e53935', strokes = [], spot = null;
const ink = $('#ink'), ictx = ink.getContext('2d');
function redrawInk() {
  const dpr = devicePixelRatio; ictx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ictx.clearRect(0, 0, ink.width, ink.height);
  if (spot) {
    ictx.fillStyle = 'rgba(0,0,0,.62)'; ictx.fillRect(0, 0, ink.width, ink.height);
    ictx.globalCompositeOperation = 'destination-out'; ictx.beginPath(); ictx.arc(spot.x, spot.y, spot.r, 0, 7); ictx.fill(); ictx.globalCompositeOperation = 'source-over';
  }
  for (const s of strokes) {
    ictx.strokeStyle = s.c; ictx.lineWidth = 7; ictx.lineCap = ictx.lineJoin = 'round';
    ictx.beginPath(); s.p.forEach(([x, y], i) => i ? ictx.lineTo(x, y) : ictx.moveTo(x, y)); ictx.stroke();
  }
}
function setTool(t) {
  tool = tool === t ? null : t;
  ink.classList.toggle('active', !!tool);
  $('#penBtn').classList.toggle('on', tool === 'pen');
  $('#spotBtn').classList.toggle('on', tool === 'spot');
  $('#inkBar').hidden = !tool;
  $('#inkBar').querySelectorAll('.sw').forEach(b => b.style.display = tool === 'pen' ? '' : 'none');
  $('#inkClear').style.display = tool === 'pen' ? '' : 'none';
  if (tool === 'spot' && !spot) { const r = ink.getBoundingClientRect(); spot = { x: r.width / 2, y: r.height / 2, r: Math.min(r.width, r.height) * .2 }; }
  if (tool !== 'spot') spot = null;
  redrawInk();
}
$('#penBtn').onclick = () => setTool('pen');
$('#spotBtn').onclick = () => setTool('spot');
$('#inkDone').onclick = () => setTool(tool);
$('#inkClear').onclick = () => { strokes = []; redrawInk(); };
$('#inkBar').querySelectorAll('.sw').forEach(b => b.onclick = () => { inkCol = b.dataset.ink; $('#inkBar').querySelectorAll('.sw').forEach(x => x.classList.toggle('on', x === b)); });
$('#inkBar').querySelector('.sw').classList.add('on');
let inkDrag = null;
ink.addEventListener('pointerdown', e => {
  ink.setPointerCapture(e.pointerId);
  const r = ink.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
  if (tool === 'pen') { inkDrag = { c: inkCol, p: [[x, y]] }; strokes.push(inkDrag); }
  else if (tool === 'spot') { inkDrag = { x0: x, y0: y, sx: spot.x, sy: spot.y }; spot.x = x; spot.y = y; }
  redrawInk();
});
ink.addEventListener('pointermove', e => {
  if (!inkDrag) return;
  const r = ink.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
  if (tool === 'pen') inkDrag.p.push([x, y]); else if (tool === 'spot') { spot.x = x; spot.y = y; }
  redrawInk();
});
ink.addEventListener('pointerup', () => { inkDrag = null; });
ink.addEventListener('wheel', e => { if (tool === 'spot') { e.preventDefault(); spot.r = clamp(spot.r * Math.exp(-e.deltaY * .002), 60, 600); redrawInk(); } }, { passive: false });

/* ------------------------------------------------------------ panel toggle */
$('#panelToggle').onclick = () => { S.panelOpen = !S.panelOpen; save(); $('#panel').classList.toggle('closed', !S.panelOpen); setTimeout(resize, 220); };

/* ------------------------------------------------------------ start */
buildDefs();
document.body.classList.toggle('big', S.big);
$('#panel').classList.toggle('closed', !S.panelOpen);
updateTop(); drawTeams();
new ResizeObserver(() => resize()).observe($('#mapWrap'));
resize();
if (!['world', 'uk'].includes(S.map) && !D.local.some(l => 'local:' + l.id === S.map)) S.map = 'world';
if (!['explore', 'find', 'grid', 'compass', 'globe'].includes(S.mode)) S.mode = 'explore';
showMap(S.map);
startMode();
if (S.year === null) yearModal(true);
