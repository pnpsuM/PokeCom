import {
  BattleStream,
  CATEGORY_KO,
  FORMAT,
  OpponentSource,
  PROFILES,
  RandomTeamSource,
  SPARE_ITEMS,
  STATS,
  STATUS_KO,
  STAT_KO,
  STAT_SHORT,
  Teams,
  blankSet,
  calcStat,
  curatedLabel,
  curatedParties,
  dex,
  eul,
  eun,
  euro,
  exportTeam,
  getPlayerStreams,
  iga,
  importTeam,
  isPickable,
  josa,
  koAbility,
  koAbilityDesc,
  koEffect,
  koItem,
  koItemDesc,
  koMove,
  koMoveDesc,
  koNature,
  koProblem,
  koSpecies,
  koType,
  makeAgent,
  matchKo,
  sampleSets,
  statTotal,
  toID,
  validateSet,
  validateTeam
} from "./ai-HG555V4E.js";
import "./sim-7BOKNW7A.js";
import {
  MANIFEST
} from "./config-V2TQOUQL.js";
import "./data-ko-PWKFVYIN.js";
import "./data-sprites-QJGYGMEP.js";
import "./data-ratings-DXZ3FNTN.js";
import "./data-samples-BV6BN333.js";
import {
  __name
} from "./app-J5SB6L2L.js";

// src/ui/nav.ts
var app = document.getElementById("app");
var nav = {
  home: /* @__PURE__ */ __name(() => {
  }, "home"),
  teams: /* @__PURE__ */ __name(() => {
  }, "teams"),
  editTeam: /* @__PURE__ */ __name((_id, _index) => {
  }, "editTeam"),
  battle: /* @__PURE__ */ __name((_team, _opp) => {
  }, "battle")
};

// src/ui/dom.ts
function h(tag, attrs, ...children) {
  const el2 = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "on" && v) for (const [ev, fn] of Object.entries(v)) el2.addEventListener(ev, fn);
      else if (k === "class") el2.className = String(v);
      else if (k === "style" && typeof v === "string") el2.setAttribute("style", v);
      else if (k === "html") el2.innerHTML = String(v);
      else if (v === true) el2.setAttribute(k, "");
      else if (v !== false && v != null) {
        if (k in el2 && typeof v !== "string") el2[k] = v;
        else el2.setAttribute(k, String(v));
      }
    }
  }
  append(el2, children);
  return el2;
}
__name(h, "h");
function append(el2, children) {
  for (const c of children) {
    if (c == null || c === false) continue;
    if (Array.isArray(c)) append(el2, c);
    else el2.appendChild(typeof c === "object" ? c : document.createTextNode(String(c)));
  }
}
__name(append, "append");
function clear(el2) {
  while (el2.firstChild) el2.removeChild(el2.firstChild);
}
__name(clear, "clear");
function toast(text, ms = 2400) {
  const t = h("div", { class: "toast", role: "status" }, text);
  document.body.appendChild(t);
  setTimeout(() => t.remove(), ms);
}
__name(toast, "toast");
function sheet(build, opts = {}) {
  const overlay = h("div", { class: "overlay" + (opts.center ? " center" : "") + (opts.full ? " full" : ""), role: "dialog", "aria-modal": "true", "aria-label": opts.label ?? "" });
  const onKey = /* @__PURE__ */ __name((e) => {
    if (e.key === "Escape" && opts.dismissable !== false) close();
  }, "onKey");
  const close = /* @__PURE__ */ __name(() => {
    overlay.remove();
    document.removeEventListener("keydown", onKey);
  }, "close");
  const box = h("div", { class: "sheet" }, build(close));
  overlay.appendChild(box);
  if (opts.dismissable !== false) overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", onKey);
  document.body.appendChild(overlay);
  box.querySelector("button, [tabindex], input")?.focus({ preventScroll: true });
  return close;
}
__name(sheet, "sheet");
function confirmSheet(title, okLabel, onOk, danger = true) {
  sheet((close) => [
    h("h2", null, title),
    h(
      "div",
      { class: "row" },
      h("button", { class: `btn ${danger ? "danger" : "primary"} grow`, type: "button", on: { click: /* @__PURE__ */ __name(() => {
        close();
        onOk();
      }, "click") } }, okLabel),
      h("button", { class: "btn", type: "button", on: { click: close } }, "취소")
    )
  ], { center: true, label: title });
}
__name(confirmSheet, "confirmSheet");
var hsObserver = null;
function hsCheck(el2) {
  const over = el2.scrollWidth > el2.clientWidth + 1;
  el2.classList.toggle("ovf", over);
  el2.classList.toggle("end", !over || el2.scrollLeft + el2.clientWidth >= el2.scrollWidth - 2);
}
__name(hsCheck, "hsCheck");
function hscroll(el2) {
  el2.classList.add("hs");
  el2.addEventListener("scroll", () => hsCheck(el2), { passive: true });
  if (typeof ResizeObserver === "function") {
    hsObserver ??= new ResizeObserver((entries) => {
      for (const e of entries) hsCheck(e.target);
    });
    hsObserver.observe(el2);
  }
  return el2;
}
__name(hscroll, "hscroll");
function expandable(el2, label = "설명 펼치기") {
  el2.classList.add("xp");
  el2.setAttribute("role", "button");
  el2.setAttribute("tabindex", "0");
  el2.setAttribute("aria-expanded", "false");
  el2.setAttribute("aria-label", label);
  const toggle = /* @__PURE__ */ __name((e) => {
    e.stopPropagation();
    e.preventDefault();
    const open = !el2.classList.contains("open");
    el2.classList.toggle("open", open);
    el2.setAttribute("aria-expanded", String(open));
  }, "toggle");
  el2.addEventListener("click", toggle);
  el2.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") toggle(e);
  });
  return el2;
}
__name(expandable, "expandable");

// src/core/store.ts
var SKEY = MANIFEST.storage.settings;
var DEFAULTS = { spriteConsent: "unknown", spriteMode: "ondemand", spriteAllDone: false, speed: "normal", effects: "on", playerName: "나", activeTeam: "" };
function read(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    if (v) return JSON.parse(v);
  } catch {
  }
  return fallback;
}
__name(read, "read");
function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
__name(write, "write");
var settings = { ...DEFAULTS, ...read(SKEY, {}) };
function saveSettings() {
  write(SKEY, settings);
}
__name(saveSettings, "saveSettings");
var TKEY = MANIFEST.storage.teams;
var teams = read(TKEY, []);
function listTeams() {
  return [...teams].sort((a, b) => b.updated - a.updated);
}
__name(listTeams, "listTeams");
function getTeam(id) {
  return teams.find((t) => t.id === id);
}
__name(getTeam, "getTeam");
function saveTeam(t) {
  t.updated = Date.now();
  const i = teams.findIndex((x) => x.id === t.id);
  if (i >= 0) teams[i] = t;
  else teams.push(t);
  return write(TKEY, teams);
}
__name(saveTeam, "saveTeam");
function deleteTeam(id) {
  teams = teams.filter((t) => t.id !== id);
  if (settings.activeTeam === id) {
    settings.activeTeam = "";
    saveSettings();
  }
  write(TKEY, teams);
}
__name(deleteTeam, "deleteTeam");
function newTeamId() {
  return "t" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}
__name(newTeamId, "newTeamId");

// src/sprites.ts
var MAP_JSON = MANIFEST.data.spriteMap;
var MAP = MAP_JSON;
var RAW = MANIFEST.remote.sprites;
var urlOf = /* @__PURE__ */ __name((set, facing, name) => set === "bw" ? `${RAW}/versions/generation-v/black-white/animated/${facing === "back" ? "back/" : ""}${name}.gif` : set === "sd" ? `${RAW}/other/showdown/${facing === "back" ? "back/" : ""}${name}.gif` : `${RAW}/${facing === "back" ? "back/" : ""}${name}.png`, "urlOf");
var DB_NAME = MANIFEST.storage.spriteDb;
var dbp = null;
function db() {
  return dbp ??= new Promise((resolve) => {
    try {
      const req2 = indexedDB.open(DB_NAME, 2);
      req2.onupgradeneeded = () => {
        const d = req2.result;
        if (!d.objectStoreNames.contains("sprites")) d.createObjectStore("sprites");
        if (!d.objectStoreNames.contains("miss")) d.createObjectStore("miss");
      };
      req2.onsuccess = () => resolve(req2.result);
      req2.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}
__name(db, "db");
function tx(store, mode, fn) {
  return db().then((d) => new Promise((resolve) => {
    if (!d) return resolve(void 0);
    try {
      const t = d.transaction(store, mode);
      const r = fn(t.objectStore(store));
      t.oncomplete = () => resolve(r ? r.result : void 0);
      t.onerror = () => resolve(void 0);
      t.onabort = () => resolve(void 0);
    } catch {
      resolve(void 0);
    }
  }));
}
__name(tx, "tx");
var index = null;
var missIndex = null;
async function loadIndex() {
  if (index && missIndex) return;
  const keys = await tx("sprites", "readonly", (s) => s.getAllKeys()) ?? [];
  const miss = await tx("miss", "readonly", (s) => s.getAllKeys()) ?? [];
  index = new Set(keys.map(String));
  missIndex = new Set(miss.map(String));
}
__name(loadIndex, "loadIndex");
async function storedCount() {
  await loadIndex();
  return index.size;
}
__name(storedCount, "storedCount");
async function putSprites(items) {
  await loadIndex();
  await tx("sprites", "readwrite", (s) => {
    for (const it of items) s.put(it.blob, it.key);
  });
  for (const it of items) {
    index.add(it.key);
    missIndex.delete(it.key);
    urlCache.delete(it.key);
  }
}
__name(putSprites, "putSprites");
async function clearSprites() {
  await tx("sprites", "readwrite", (s) => s.clear());
  await tx("miss", "readwrite", (s) => s.clear());
  index = /* @__PURE__ */ new Set();
  missIndex = /* @__PURE__ */ new Set();
  urlCache.forEach((u) => URL.revokeObjectURL(u));
  urlCache.clear();
}
__name(clearSprites, "clearSprites");
function entryFor(id) {
  let e = MAP[id];
  if (!e) {
    const k = Object.keys(MAP).filter((k2) => id.startsWith(k2)).sort((a, b) => b.length - a.length)[0];
    e = k ? MAP[k] : void 0;
  }
  return e;
}
__name(entryFor, "entryFor");
function candidates(id, facing) {
  const e = entryFor(id);
  if (!e) return [];
  const out = [];
  for (const b of e.bw) out.push({ set: "bw", key: `bw/${facing}/${b}`, url: urlOf("bw", facing, b) });
  if (e.p && e.sd) out.push({ set: "sd", key: `sd/${facing}/${e.p}`, url: urlOf("sd", facing, String(e.p)) });
  if (e.p && e.png) out.push({ set: "png", key: `png/${facing}/${e.p}`, url: urlOf("png", facing, String(e.p)) });
  return out;
}
__name(candidates, "candidates");
var urlCache = /* @__PURE__ */ new Map();
var inflight = /* @__PURE__ */ new Map();
var netBlocked = false;
var networkBlocked = /* @__PURE__ */ __name(() => netBlocked, "networkBlocked");
async function download(c) {
  if (inflight.has(c.key)) return inflight.get(c.key);
  const p = (async () => {
    try {
      const res = await fetch(c.url, { mode: "cors" });
      if (res.status === 404) {
        await tx("miss", "readwrite", (s) => s.put(1, c.key));
        missIndex.add(c.key);
        return false;
      }
      if (!res.ok) return false;
      await putSprites([{ key: c.key, blob: await res.blob() }]);
      return true;
    } catch {
      netBlocked = true;
      return false;
    } finally {
      inflight.delete(c.key);
    }
  })();
  inflight.set(c.key, p);
  return p;
}
__name(download, "download");
var canDownload = /* @__PURE__ */ __name(() => settings.spriteConsent === "yes" && !netBlocked, "canDownload");
async function ensure(species, facing, allowDownload = true) {
  await loadIndex();
  const cs = candidates(toID(species), facing);
  for (const c of cs) if (index.has(c.key)) return { key: c.key, set: c.set };
  if (!allowDownload || !canDownload()) return null;
  for (const c of cs) {
    if (missIndex.has(c.key)) continue;
    if (await download(c)) return { key: c.key, set: c.set };
    if (netBlocked) return null;
  }
  return null;
}
__name(ensure, "ensure");
async function spriteURL(species, facing, allowDownload = true) {
  const hit = await ensure(species, facing, allowDownload);
  if (!hit) return null;
  if (urlCache.has(hit.key)) return { url: urlCache.get(hit.key), set: hit.set };
  const blob = await tx("sprites", "readonly", (s) => s.get(hit.key));
  if (!blob) return null;
  const url = URL.createObjectURL(blob);
  urlCache.set(hit.key, url);
  return { url, set: hit.set };
}
__name(spriteURL, "spriteURL");
async function prefetch(species, progress) {
  const jobs = [];
  for (const s of species) jobs.push([s, "front"], [s, "back"]);
  let done = 0;
  await runPool(jobs, 4, async ([s, f]) => {
    await ensure(s, f);
    progress?.(++done, jobs.length);
  });
}
__name(prefetch, "prefetch");
async function downloadAll(progress, ctl) {
  const jobs = [];
  for (const id of Object.keys(MAP)) jobs.push([id, "front"], [id, "back"]);
  let done = 0, got = 0;
  await runPool(jobs, 6, async ([id, f]) => {
    if (ctl.cancel) return;
    if (await ensure(id, f)) got++;
    progress(++done, jobs.length, got);
  });
  if (!ctl.cancel && !netBlocked) {
    settings.spriteAllDone = true;
    saveSettings();
  }
}
__name(downloadAll, "downloadAll");
var spriteTotal = /* @__PURE__ */ __name(() => Object.keys(MAP).length * 2, "spriteTotal");
async function runPool(items, n, fn) {
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(n, items.length) }, async () => {
    while (i < items.length) await fn(items[i++]);
  }));
}
__name(runPool, "runPool");
async function probeNetwork() {
  try {
    const res = await fetch(urlOf("bw", "front", "25"), { mode: "cors", cache: "no-store" });
    netBlocked = !res.ok;
    return res.ok;
  } catch {
    netBlocked = true;
    return false;
  }
}
__name(probeNetwork, "probeNetwork");
function keyForPath(p) {
  const s = p.replace(/\\/g, "/").toLowerCase();
  const m = s.match(/([^/]+)\.(gif|png)$/);
  if (!m || /(^|\/)(shiny|female)\//.test(s)) return null;
  const facing = /(^|\/)back\//.test(s) ? "back" : "front";
  if (s.includes("showdown")) return `sd/${facing}/${m[1]}`;
  if (s.includes("black-white") || /(^|\/)animated\//.test(s)) return `bw/${facing}/${m[1]}`;
  if (m[2] === "png" && /(^|\/)pokemon\/(back\/)?[0-9]+\.png$/.test(s)) return `png/${facing}/${m[1]}`;
  return null;
}
__name(keyForPath, "keyForPath");
async function importFiles(files, status) {
  let saved = 0;
  const loose = [];
  for (const f of files) {
    if (/\.zip$/i.test(f.name)) {
      status(`ZIP 여는 중… (${Math.round(f.size / 1048576)}MB)`);
      const { default: JSZip } = await import("./lib-M5ZVCOED.js");
      const zip = await JSZip.loadAsync(f);
      const entries = [];
      zip.forEach((path, e) => {
        const k = !e.dir && keyForPath(path);
        if (k) entries.push({ key: k, e, png: /\.png$/i.test(path) });
      });
      for (let i = 0; i < entries.length; i += 200) {
        const batch = await Promise.all(entries.slice(i, i + 200).map(async (x) => ({
          key: x.key,
          blob: new Blob([await x.e.async("arraybuffer")], { type: x.png ? "image/png" : "image/gif" })
        })));
        await putSprites(batch);
        saved += batch.length;
        status(`${saved} / ${entries.length}개 저장 중`);
      }
    } else {
      const k = keyForPath(f.webkitRelativePath || f.name);
      if (k) loose.push({ key: k, blob: f });
    }
  }
  for (let i = 0; i < loose.length; i += 200) {
    await putSprites(loose.slice(i, i + 200));
    saved += Math.min(200, loose.length - i);
    status(`${saved}개 저장 중`);
  }
  return saved;
}
__name(importFiles, "importFiles");

// src/core/typecalc.ts
function badgeFor(mult) {
  if (mult === 0) return { mult, label: "효과 없음 ×0", cls: "e0" };
  if (mult <= 0.25) return { mult, label: "매우 별로 ×¼", cls: "e14" };
  if (mult < 1) return { mult, label: "별로 ×½", cls: "e12" };
  if (mult === 1) return { mult, label: "보통", cls: "e1" };
  if (mult < 4) return { mult, label: "굉장 ×2", cls: "e2" };
  return { mult, label: "매우 굉장 ×4", cls: "e4" };
}
__name(badgeFor, "badgeFor");
function moveType(move) {
  const id = toID(move);
  if (id.startsWith("hiddenpower") && id.length > 11) {
    const t = id.slice(11).replace(/\d+$/, "");
    return t.charAt(0).toUpperCase() + t.slice(1);
  }
  return dex.moves.get(move).type;
}
__name(moveType, "moveType");
function effectiveness(move, targetSpecies, typeOverride, targetTypes) {
  const m = dex.moves.get(move);
  if (!m.exists || m.category === "Status") return null;
  const sp = dex.species.get(targetSpecies);
  if (!sp.exists) return null;
  const s = { types: targetTypes?.length ? targetTypes : sp.types };
  const type = typeOverride ?? moveType(move);
  if (!dex.getImmunity(type, s.types)) return m.id === "thousandarrows" ? 1 : 0;
  let e = dex.getEffectiveness(type, s.types);
  if (m.id === "freezedry" && s.types.includes("Water")) e += 2;
  if (m.id === "flyingpress") e += dex.getEffectiveness("Flying", s.types);
  return 2 ** e;
}
__name(effectiveness, "effectiveness");
function moveInfo(move) {
  const m = dex.moves.get(move);
  return {
    type: moveType(move),
    category: m.category,
    power: m.basePower,
    accuracy: m.accuracy === true ? null : m.accuracy,
    priority: m.priority,
    desc: m.shortDesc || m.desc,
    contact: !!m.flags.contact,
    pp: m.pp
  };
}
__name(moveInfo, "moveInfo");
var speciesTypes = /* @__PURE__ */ __name((s) => dex.species.get(s).types, "speciesTypes");

// src/ui/common.ts
var TYPE_COLOR = {
  Normal: "#9a9a7a",
  Fire: "#e8702c",
  Water: "#5a86e0",
  Electric: "#d9b41c",
  Grass: "#5fae3c",
  Ice: "#6cc4c4",
  Fighting: "#b8342c",
  Poison: "#9a44a0",
  Ground: "#c9a254",
  Flying: "#8f7fe0",
  Psychic: "#e8507a",
  Bug: "#98a81c",
  Rock: "#b09a3a",
  Ghost: "#6a5494",
  Dragon: "#6a3cf0",
  Dark: "#6a5444",
  Steel: "#9a9ab8",
  Fairy: "#e088a8",
  "???": "#6a8a84"
};
var TYPES = Object.keys(TYPE_COLOR).filter((t) => t !== "???");
function typeTag(t) {
  return h("span", { class: "type", style: `background:${TYPE_COLOR[t] ?? "#666"}` }, koType(t));
}
__name(typeTag, "typeTag");
function spriteInto(el2, species, facing, scale, opts = {}) {
  const token = String(Math.random());
  el2.dataset.token = token;
  const slot = /* @__PURE__ */ __name(() => {
    const size = opts.slotSize ?? (facing === "back" ? 120 : 84);
    clear(el2);
    el2.appendChild(h("div", { class: size < 70 ? "slotcard" : "slot", style: `width:${size}px;height:${size}px` }, size < 70 ? "" : koSpecies(species)));
  }, "slot");
  spriteURL(species, facing, opts.download !== false).then((hit) => {
    if (el2.dataset.token !== token) return;
    if (!hit) {
      if (opts.slotSize === 0) clear(el2);
      else slot();
      return;
    }
    const img = new Image();
    img.alt = `${koSpecies(species)} ${facing === "back" ? "뒷모습" : "앞모습"}`;
    img.decoding = "async";
    img.onload = () => {
      let s = scale;
      if (hit.set === "png") s *= 1.1;
      if (opts.maxH && img.naturalHeight * s > opts.maxH) s = opts.maxH / img.naturalHeight;
      img.style.width = Math.round(img.naturalWidth * s) + "px";
      img.style.height = Math.round(img.naturalHeight * s) + "px";
    };
    img.src = hit.url;
    clear(el2);
    el2.appendChild(img);
  });
}
__name(spriteInto, "spriteInto");
var io = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    io.unobserve(e.target);
    const el2 = e.target;
    const size = +el2.dataset.size;
    spriteInto(el2, el2.dataset.species, "front", 1, { download: settings.spriteConsent === "yes", maxH: size, slotSize: size - 4 });
  }
}, { rootMargin: "200px" }) : null;
function thumb(species, size = 48) {
  const el2 = h("div", { class: "thumb", style: `width:${size}px;height:${size}px` });
  el2.dataset.species = species;
  el2.dataset.size = String(size);
  el2.appendChild(h("div", { class: "slotcard", style: `width:${size - 4}px;height:${size - 4}px` }));
  if (io) io.observe(el2);
  else spriteInto(el2, species, "front", 1, { download: false, maxH: size, slotSize: size - 4 });
  return el2;
}
__name(thumb, "thumb");
function monRow(set, right, onClick) {
  const sub = [koItem(set.item), koAbility(set.ability)].filter(Boolean).join(" · ");
  const btn = h(
    "button",
    { class: "mon" + (onClick ? "" : " static"), type: "button", on: onClick ? { click: onClick } : void 0 },
    thumb(set.species),
    h(
      "div",
      null,
      h("div", { class: "nm" }, koSpecies(set.species), " ", ...speciesTypes(set.species).map(typeTag)),
      hscroll(h("div", { class: "sub" }, sub)),
      hscroll(h("div", { class: "sub" }, set.moves.map(koMove).join(" / ")))
    ),
    right ?? h("span")
  );
  if (!onClick) btn.tabIndex = -1;
  return btn;
}
__name(monRow, "monRow");
function statLine(set) {
  const sp = dex.species.get(set.species);
  return h("div", { class: "statline" }, STATS.map((s) => {
    const n = dex.natures.get(set.nature);
    const cls = n.plus === s ? "plus" : n.minus === s ? "minus" : "";
    return h("span", { class: cls }, STAT_SHORT[s], h("b", null, String(calcStat(s, sp.baseStats[s], set.evs[s] || 0, set.nature))));
  }));
}
__name(statLine, "statLine");
function setDetail(set) {
  const sp = dex.species.get(set.species);
  const n = dex.natures.get(set.nature);
  const total = STATS.reduce((a, s) => a + (set.evs[s] || 0), 0);
  const natDesc = n.plus ? `${STAT_SHORT[n.plus]}↑ ${STAT_SHORT[n.minus]}↓` : "보정 없음";
  const stone = dex.items.get(set.item).megaStone;
  const megaName = stone ? Object.values(stone)[0] : "";
  return h(
    "div",
    { style: "display:flex;flex-direction:column;gap:10px" },
    h(
      "div",
      { class: "edit-head" },
      thumb(set.species, 72),
      h(
        "div",
        { style: "display:flex;flex-direction:column;gap:4px;min-width:0" },
        h("b", { style: "font-size:18px" }, koSpecies(set.species)),
        h("div", null, ...speciesTypes(set.species).map(typeTag)),
        megaName ? h("div", { class: "muted" }, `메가진화 → ${koSpecies(megaName)} `, ...speciesTypes(megaName).map(typeTag)) : null
      )
    ),
    h(
      "table",
      { class: "stat-t" },
      h("thead", null, h("tr", null, h("th", null, ""), STATS.map((s) => h("th", { class: n.plus === s ? "plus" : n.minus === s ? "minus" : "" }, STAT_SHORT[s])))),
      h(
        "tbody",
        null,
        h("tr", null, h("th", null, "종족값"), STATS.map((s) => h("td", null, String(sp.baseStats[s])))),
        h("tr", null, h("th", null, "SP"), STATS.map((s) => h("td", { class: set.evs[s] ? "on" : "" }, String(set.evs[s] || 0)))),
        h("tr", { class: "real" }, h("th", null, "실수치"), STATS.map((s) => h("td", { class: n.plus === s ? "plus" : n.minus === s ? "minus" : "" }, String(calcStat(s, sp.baseStats[s], set.evs[s] || 0, set.nature)))))
      )
    ),
    h("div", { class: "muted", style: "font-size:12px" }, `SP 합계 ${total}/66 · Lv50 · 개체값은 Champions 규칙상 없음(항상 최대로 계산)`),
    h(
      "dl",
      { class: "kv" },
      h("dt", null, "특성"),
      h("dd", null, koAbility(set.ability), h("div", { class: "muted" }, koAbilityDesc(set.ability))),
      h("dt", null, "도구"),
      h("dd", null, koItem(set.item) || "없음", set.item ? h("div", { class: "muted" }, koItemDesc(set.item)) : null),
      h("dt", null, "성격"),
      h("dd", null, `${koNature(set.nature)} (${natDesc})`)
    ),
    h("h2", null, "기술", h("span", { class: "muted" }, `${set.moves.length}/4`)),
    h("div", { style: "display:flex;flex-direction:column;gap:6px" }, set.moves.length ? set.moves.map((m) => moveCard(m)) : h("div", { class: "muted" }, "기술 없음"))
  );
}
__name(setDetail, "setDetail");
function openSetDetail(set, onEdit) {
  sheet((close) => [
    h(
      "div",
      { class: "row", style: "justify-content:space-between" },
      h("h2", null, "포켓몬 상세"),
      h("button", { class: "btn small", type: "button", on: { click: close } }, "닫기")
    ),
    setDetail(set),
    h(
      "div",
      { class: "stickybar" },
      onEdit ? h("button", { class: "btn primary grow", type: "button", on: { click: /* @__PURE__ */ __name(() => {
        close();
        onEdit();
      }, "click") } }, "이 포켓몬 수정하기 →") : null,
      h("button", { class: "btn" + (onEdit ? "" : " grow"), type: "button", on: { click: close } }, "닫기")
    )
  ], { label: "포켓몬 상세" });
}
__name(openSetDetail, "openSetDetail");
function moveCard(move, pp, typeInfo) {
  const i = moveInfo(move);
  if (typeInfo) i.type = typeInfo.type;
  return h(
    "div",
    { class: "panel", style: "padding:10px;gap:4px" },
    h(
      "div",
      { class: "row", style: "justify-content:space-between" },
      h("b", null, koMove(move)),
      h("span", null, typeTag(i.type), " ", h("span", { class: "muted" }, CATEGORY_KO[i.category] ?? i.category))
    ),
    typeInfo?.note ? h("div", { class: "typenote" }, typeInfo.note) : null,
    h(
      "div",
      { class: "muted", style: "font-family:var(--pixel)" },
      `위력 ${i.power || "-"} · 명중 ${i.accuracy ?? "-"}${i.priority ? ` · 우선도 ${i.priority > 0 ? "+" : ""}${i.priority}` : ""}${pp ? ` · PP ${pp}` : ""}${i.contact ? " · 접촉" : ""}`
    ),
    h("div", { style: "font-size:13px" }, koMoveDesc(move) || i.desc)
  );
}
__name(moveCard, "moveCard");
function seg(label, options, value, onChange) {
  const box = h("div", { class: "seg", role: "group", "aria-label": label });
  const draw = /* @__PURE__ */ __name((v) => {
    clear(box);
    for (const [k, t] of options) box.appendChild(h("button", { type: "button", "aria-pressed": String(v === k), on: { click: /* @__PURE__ */ __name(() => {
      draw(k);
      onChange(k);
    }, "click") } }, t));
  }, "draw");
  draw(value);
  return box;
}
__name(seg, "seg");

// src/config/rating.ts
var RATING_POLICY = {
  /** 처음 시작 레이팅 */
  start: 1e3,
  /** 레이팅 최저값 */
  floor: 100,
  /** K (한 판 최대 변동): 배치 판 수 동안 크게, 이후 작게 */
  kPlacement: 32,
  kNormal: 20,
  placementGames: 20,
  /** 매칭: 내 레이팅 + [min, max] 범위에서 목표를 뽑아 가장 가까운 AI 를 고른다 (조금 센 쪽이 더 자주) */
  matchWindow: { min: -50, max: 100 },
  /** 무승부 점수 (승 1, 패 0) */
  tieScore: 0.5,
  /** 기권은 패배로 기록한다 */
  forfeitIsLoss: true
};
var GRADES = [
  { name: "몬스터볼", min: 0, color: "#e2685f" },
  { name: "슈퍼볼", min: 950, color: "#5a86e0" },
  { name: "하이퍼볼", min: 1100, color: "#e8c02e" },
  { name: "울트라볼", min: 1200, color: "#d9a520" },
  { name: "마스터볼", min: 1300, color: "#a06ce0" }
];
var PRACTICE_PROFILE = "L0";

// src/core/ladder.ts
var START_RATING = RATING_POLICY.start;
var FRESH = { rating: START_RATING, games: 0, wins: 0, losses: 0, ties: 0, streak: 0, bestStreak: 0, peak: START_RATING };
var MEASURED = MANIFEST.data.ratings.profiles;
var RATED = PROFILES.map((p) => ({ ...p, rating: MEASURED.find((m) => m.id === p.id)?.rating ?? 800 })).sort((a, b) => a.rating - b.rating);
function matchmake(rating, rng = Math.random) {
  const target = rating + RATING_POLICY.matchWindow.min + rng() * (RATING_POLICY.matchWindow.max - RATING_POLICY.matchWindow.min);
  let best = RATED[0];
  for (const p of RATED) if (Math.abs(p.rating - target) < Math.abs(best.rating - target)) best = p;
  return best;
}
__name(matchmake, "matchmake");
function kFactor(games) {
  return games < RATING_POLICY.placementGames ? RATING_POLICY.kPlacement : RATING_POLICY.kNormal;
}
__name(kFactor, "kFactor");
function expected(me, opp) {
  return 1 / (1 + Math.pow(10, (opp - me) / 400));
}
__name(expected, "expected");
function eloDelta(me, opp, score, games) {
  return Math.round(kFactor(games) * (score - expected(me, opp)));
}
__name(eloDelta, "eloDelta");
function gradeOf(r) {
  let g = GRADES[0];
  for (const x of GRADES) if (r >= x.min) g = x;
  return g;
}
__name(gradeOf, "gradeOf");
function nextGrade(r) {
  return GRADES.find((g) => g.min > r) ?? null;
}
__name(nextGrade, "nextGrade");
var DB = MANIFEST.storage.ladderDb;
var dbp2 = null;
function db2() {
  if (!dbp2) dbp2 = new Promise((res) => {
    try {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => {
        r.result.createObjectStore("games", { keyPath: "id", autoIncrement: true });
        r.result.createObjectStore("meta");
      };
      r.onsuccess = () => res(r.result);
      r.onerror = () => res(null);
    } catch {
      res(null);
    }
  });
  return dbp2;
}
__name(db2, "db");
function req(store, mode, fn) {
  return db2().then((d) => new Promise((res) => {
    if (!d) return res(void 0);
    try {
      const t = d.transaction(store, mode);
      const r = fn(t.objectStore(store));
      t.oncomplete = () => res(r ? r.result : void 0);
      t.onerror = () => res(void 0);
    } catch {
      res(void 0);
    }
  }));
}
__name(req, "req");
var memState = { ...FRESH };
var memGames = [];
async function loadState() {
  const s = await req("meta", "readonly", (st) => st.get("state"));
  if (s) memState = { ...FRESH, ...s };
  return { ...memState };
}
__name(loadState, "loadState");
async function loadGames() {
  const g = await req("games", "readonly", (st) => st.getAll());
  if (g) memGames = g;
  return [...memGames].sort((a, b) => a.at - b.at);
}
__name(loadGames, "loadGames");
async function recordGame(input) {
  const s = await loadState();
  const score = input.result === "W" ? 1 : input.result === "L" ? 0 : RATING_POLICY.tieScore;
  const delta = eloDelta(s.rating, input.opp.rating, score, s.games);
  const rec = { ...input, at: Date.now(), before: s.rating, after: Math.max(RATING_POLICY.floor, s.rating + delta), delta };
  rec.delta = rec.after - rec.before;
  s.rating = rec.after;
  s.games++;
  if (input.result === "W") {
    s.wins++;
    s.streak = s.streak > 0 ? s.streak + 1 : 1;
  } else if (input.result === "L") {
    s.losses++;
    s.streak = s.streak < 0 ? s.streak - 1 : -1;
  } else {
    s.ties++;
    s.streak = 0;
  }
  s.bestStreak = Math.max(s.bestStreak, s.streak);
  s.peak = Math.max(s.peak, s.rating);
  memState = s;
  memGames.push(rec);
  await req("games", "readwrite", (st) => st.add(rec));
  await req("meta", "readwrite", (st) => st.put(s, "state"));
  return { rec, state: { ...s } };
}
__name(recordGame, "recordGame");
async function resetLadder() {
  memState = { ...FRESH };
  memGames = [];
  await req("games", "readwrite", (st) => st.clear());
  await req("meta", "readwrite", (st) => st.put({ ...FRESH }, "state"));
}
__name(resetLadder, "resetLadder");
function preview(state, oppRating) {
  return {
    win: eloDelta(state.rating, oppRating, 1, state.games),
    lose: eloDelta(state.rating, oppRating, 0, state.games),
    winProb: expected(state.rating, oppRating)
  };
}
__name(preview, "preview");

// src/ui/chart.ts
var NS = "http://www.w3.org/2000/svg";
function el(tag, attrs) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  return e;
}
__name(el, "el");
function ratingChart(games) {
  const wrap = document.createElement("div");
  wrap.className = "chart";
  if (!games.length) {
    wrap.innerHTML = '<div class="muted" style="padding:24px 0;text-align:center">래더를 한 판 두면 여기에 추이가 그려진다</div>';
    return wrap;
  }
  const pts = [START_RATING, ...games.map((g) => g.after)];
  const W = 340, H = 170, L = 38, R = 10, T = 10, B = 22;
  let lo = Math.min(...pts), hi = Math.max(...pts);
  const pad = Math.max(20, (hi - lo) * 0.15);
  lo = Math.floor((lo - pad) / 50) * 50;
  hi = Math.ceil((hi + pad) / 50) * 50;
  const x = /* @__PURE__ */ __name((i) => L + (pts.length === 1 ? 0 : i / (pts.length - 1) * (W - L - R)), "x");
  const y = /* @__PURE__ */ __name((v) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B), "y");
  const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, width: "100%", role: "img", "aria-label": `레이팅 추이: 시작 ${START_RATING}, 현재 ${pts[pts.length - 1]}, ${games.length}판` });
  const step = hi - lo > 400 ? 100 : 50;
  for (let v = lo; v <= hi; v += step) {
    svg.append(el("line", { x1: L, x2: W - R, y1: y(v), y2: y(v), class: "grid" }));
    const t = el("text", { x: L - 6, y: y(v) + 4, "text-anchor": "end", class: "tick" });
    t.textContent = String(v);
    svg.append(t);
  }
  for (const g of GRADES) if (g.min > lo && g.min < hi) {
    svg.append(el("line", { x1: L, x2: W - R, y1: y(g.min), y2: y(g.min), class: "gradeline" }));
    const t = el("text", { x: W - R, y: y(g.min) - 3, "text-anchor": "end", class: "gradelabel" });
    t.textContent = g.name;
    svg.append(t);
  }
  const t0 = el("text", { x: L, y: H - 6, class: "tick" });
  t0.textContent = "0";
  svg.append(t0);
  const t1 = el("text", { x: W - R, y: H - 6, "text-anchor": "end", class: "tick" });
  t1.textContent = `${games.length}판`;
  svg.append(t1);
  const d = pts.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  svg.append(el("path", { d: `${d} L${x(pts.length - 1)},${H - B} L${x(0)},${H - B} Z`, class: "area" }));
  svg.append(el("path", { d, class: "line" }));
  svg.append(el("circle", { cx: x(pts.length - 1), cy: y(pts[pts.length - 1]), r: 4.5, class: "end" }));
  const cross = el("line", { y1: T, y2: H - B, class: "cross", visibility: "hidden" });
  const dot = el("circle", { r: 4, class: "hoverdot", visibility: "hidden" });
  svg.append(cross, dot);
  const tip = document.createElement("div");
  tip.className = "tip";
  tip.hidden = true;
  const hit = el("rect", { x: L, y: 0, width: W - L - R, height: H, fill: "transparent" });
  const show = /* @__PURE__ */ __name((clientX) => {
    const r = svg.getBoundingClientRect();
    const sx = (clientX - r.left) / r.width * W;
    const i = Math.max(0, Math.min(pts.length - 1, Math.round((sx - L) / (W - L - R) * (pts.length - 1))));
    cross.setAttribute("x1", String(x(i)));
    cross.setAttribute("x2", String(x(i)));
    cross.setAttribute("visibility", "visible");
    dot.setAttribute("cx", String(x(i)));
    dot.setAttribute("cy", String(y(pts[i])));
    dot.setAttribute("visibility", "visible");
    const g = games[i - 1];
    tip.textContent = g ? `${i}판째 · ${g.result === "W" ? "승" : g.result === "L" ? "패" : "무"} ${g.delta >= 0 ? "+" : ""}${g.delta} → ${g.after} · ${g.opp.label}` : `시작 ${START_RATING}`;
    tip.hidden = false;
  }, "show");
  hit.addEventListener("pointermove", (e) => show(e.clientX));
  hit.addEventListener("pointerdown", (e) => show(e.clientX));
  hit.addEventListener("pointerleave", () => {
    cross.setAttribute("visibility", "hidden");
    dot.setAttribute("visibility", "hidden");
    tip.hidden = true;
  });
  svg.append(hit);
  wrap.append(tip, svg);
  return wrap;
}
__name(ratingChart, "ratingChart");

// src/ui/ladder-ui.ts
function gradeBadge(r) {
  const g = gradeOf(r);
  return h("span", { class: "grade", style: `--g:${g.color}` }, h("i", { "aria-hidden": "true" }), g.name);
}
__name(gradeBadge, "gradeBadge");
function ladderCard(onLadder) {
  const box = h("section", { class: "panel ladder" }, h("div", { class: "muted" }, "레이팅 불러오는 중…"));
  const fill = /* @__PURE__ */ __name((st) => {
    clear(box);
    const nx = nextGrade(st.rating);
    const streak = st.streak > 1 ? `${st.streak}연승 중` : st.streak < -1 ? `${-st.streak}연패 중` : "";
    box.append(
      h(
        "div",
        { class: "row", style: "justify-content:space-between;align-items:flex-end" },
        h("div", null, h("div", { class: "eyebrow" }, "래더 레이팅"), h("div", { class: "rating" }, h("span", { class: "rating-num" }, String(st.rating)))),
        gradeBadge(st.rating)
      ),
      h(
        "div",
        { class: "muted" },
        `${st.wins}승 ${st.losses}패${st.ties ? ` ${st.ties}무` : ""} · 최고 ${st.peak}` + (streak ? ` · ${streak}` : "") + (nx ? ` · ${nx.name}까지 ${nx.min - st.rating}` : "") + (st.games < 20 ? ` · 배치 ${st.games}/20판 (변동 큼)` : "")
      ),
      h(
        "div",
        { class: "row" },
        h("button", { class: "btn primary grow", type: "button", style: "min-height:54px;font-size:17px", on: { click: onLadder } }, "래더 배틀"),
        h("button", { class: "btn", type: "button", style: "min-height:54px", on: { click: openRecords } }, "전적")
      )
    );
  }, "fill");
  loadState().then(fill);
  return box;
}
__name(ladderCard, "ladderCard");
function openRecords() {
  sheet((close) => {
    const body = h("div", { style: "display:flex;flex-direction:column;gap:12px" }, h("div", { class: "muted" }, "불러오는 중…"));
    Promise.all([loadState(), loadGames()]).then(([st, games]) => {
      clear(body);
      const rate = st.games ? Math.round(st.wins / st.games * 100) : 0;
      body.append(
        h(
          "div",
          { class: "stats" },
          h("div", null, h("b", { class: "rating-num" }, String(st.rating)), h("span", null, "현재")),
          h("div", null, h("b", { class: "rating-num" }, String(st.peak)), h("span", null, "최고")),
          h("div", null, h("b", null, `${rate}%`), h("span", null, `${st.wins}승 ${st.losses}패`)),
          h("div", null, h("b", null, String(st.bestStreak)), h("span", null, "최다 연승"))
        ),
        h("section", { class: "panel", style: "padding:10px" }, h("h2", null, "레이팅 추이", h("span", { class: "muted" }, `${st.games}판`)), ratingChart(games)),
        h("h2", null, "최근 전적"),
        games.length ? h("ol", { class: "games" }, [...games].reverse().slice(0, 30).map(gameRow)) : h("div", { class: "muted" }, "아직 래더 전적이 없다")
      );
    });
    return [h("div", { class: "row", style: "justify-content:space-between" }, h("h2", null, "전적"), h("button", { class: "btn small", type: "button", on: { click: close } }, "닫기")), body];
  }, { label: "전적" });
}
__name(openRecords, "openRecords");
function gameRow(g) {
  const d = new Date(g.at);
  const when = `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  return h(
    "li",
    { class: `g ${g.result}` },
    h("span", { class: "res" }, g.result === "W" ? "승" : g.result === "L" ? "패" : "무"),
    h(
      "div",
      null,
      h("div", null, `${g.opp.label} `, h("span", { class: "muted" }, `R${g.opp.rating}`)),
      hscroll(h("div", { class: "muted" }, `${g.myPicks.map(koSpecies).join("·")} vs ${g.oppTeam.map(koSpecies).join("·")}`))
    ),
    h("div", { class: "delta" }, h("b", { class: g.delta >= 0 ? "up" : "down" }, `${g.delta >= 0 ? "+" : ""}${g.delta}`), h("span", { class: "muted" }, `${g.after} · ${when}`))
  );
}
__name(gameRow, "gameRow");

// src/config/version.ts
var APP_VERSION = "1.5.1";
var CHANGELOG = [
  { version: "1.5.1", date: "2026-09-28", notes: ["영어로 나오던 이름 한국어로 (펌킨인 크기·비비용 무늬, 총대장·회복봉인 메시지)", "정보창에 능력 변화를 늘 표시하던 것 삭제 (배틀 정보 → 능력 변화 탭에서 확인)", "포켓몬 고르기: 모습만 다른 폼(비비용·마휘핑 등)은 하나로", "배틀 화면에 상대 남은 포켓몬 수와 이미 본 포켓몬 표시", "샘플 파티 15개 추가 (Game8·알테마·note 구축 기사, 총 21개)"] },
  { version: "1.5.0", date: "2026-09-26", notes: ["대타출동 인형 표시", "배틀 연출: 기술(물리 돌진·특수 구슬·변화 고리)·피격(상성별 흔들림·급소 번쩍)·능력 변화 화살표·상태이상·회복·메가진화·방어·날씨/필드 (설정에서 켜기/움직임 줄이기/끄기)", "정보창에 능력 변화(공↑2 등) 표시", "잘리는 글: 한 줄은 좌우로 밀어 보기, 기술 설명은 눌러서 펼치기", "구박사의 포켓몬 챔피언스 연구소 샘플 파티 6개(36세트): 샘플 세트·파티 불러오기·상대 파티(40%)"] },
  { version: "1.4.1", date: "2026-09-26", notes: ["배틀 화면에 필드 상태 막대 상시 표시 (날씨·필드·트릭룸·양쪽 벽·순풍·설치기, 경과 턴)", "레이팅 숫자 글꼴 Times New Roman, 본문보다 2px 크게", "변환자재·리베로: 기술 버튼에 바뀔 타입·자속 표시, 바뀐 타입을 상성·정보·AI 계산에 반영"] },
  { version: "1.4.0", date: "2026-09-26", notes: ["특성·기술 효과로 바뀌는 기술 타입을 버튼·설명·상성 배지에 반영 (메가진화 켜면 메가 특성 기준)", "글꼴을 둥근모꼴로"] },
  { version: "1.3.0", date: "2026-09-26", notes: ["모듈 분리: 레이팅 정책·대전 룰·AI 단계·버전별 데이터를 config/ 로", "빌드를 조각(시뮬레이터·데이터·앱)으로 나눠 바뀐 파일만 올리도록"] },
  { version: "1.2.0", date: "2026-09-26", notes: ["AI 판단 로직(초급·중급·상급)과 Elo 래더"] },
  { version: "1.1.0", date: "2026-09-26", notes: ["Champions 룰, 9세대, 파티 짜기"] }
];

// src/core/view.ts
function parseDetails(details) {
  const parts = details.split(", ");
  let level = 100, gender = "";
  for (const p of parts.slice(1)) {
    if (/^L\d+$/.test(p)) level = +p.slice(1);
    else if (p === "M" || p === "F") gender = p;
  }
  return { species: parts[0], level, gender };
}
__name(parseDetails, "parseDetails");
function parseHP(cond) {
  const [hpPart, status = ""] = cond.split(" ");
  if (hpPart === "0" || status === "fnt") return { hp: 0, maxhp: 0, status: "", fnt: true };
  const [hp, maxhp] = hpPart.split("/").map(Number);
  return { hp, maxhp: maxhp || 100, status, fnt: false };
}
__name(parseHP, "parseHP");
var pct = /* @__PURE__ */ __name((m) => m.maxhp ? Math.round(m.hp / m.maxhp * 100) : 0, "pct");
var WEATHER_START = {
  SunnyDay: "햇살이 강해졌다!",
  RainDance: "비가 내리기 시작했다!",
  Sandstorm: "모래바람이 불기 시작했다!",
  Hail: "싸라기눈이 내리기 시작했다!",
  Snowscape: "눈이 내리기 시작했다!",
  Snow: "눈이 내리기 시작했다!",
  DesolateLand: "햇살이 아주 강해졌다!",
  PrimordialSea: "강한 비가 내리기 시작했다!",
  DeltaStream: "수수께끼의 난기류가 비행 포켓몬을 지킨다!",
  none: "날씨가 원래대로 돌아왔다."
};
var WEATHER_KO = {
  SunnyDay: "쾌청",
  RainDance: "비",
  Sandstorm: "모래바람",
  Hail: "싸라기눈",
  Snowscape: "설경",
  Snow: "설경",
  DesolateLand: "끝의대지",
  PrimordialSea: "시작의바다",
  DeltaStream: "델타스트림"
};
var PROTECTS = ["protect", "kingsshield", "spikyshield", "banefulbunker", "detect", "silktrap", "burningbulwark", "obstruct", "maxguard"];
var BattleView = class {
  static {
    __name(this, "BattleView");
  }
  state;
  /** 각 편이 마지막으로 쓴 기술 (AI 판단용) */
  lastMove = { p1: "", p2: "" };
  constructor(p1Name, p2Name) {
    const side = /* @__PURE__ */ __name((id, name) => ({ id, name, team: [], active: null, boosts: {}, volatiles: [], conditions: [], types: null, proteanUsed: false }), "side");
    this.state = { turn: 0, weather: "", terrain: [], winner: null, ended: false, log: [], since: {}, layers: {}, sides: { p1: side("p1", p1Name), p2: side("p2", p2Name) } };
  }
  sideOf(ident) {
    return ident.slice(0, 2);
  }
  nickOf(ident) {
    const i = ident.indexOf(": ");
    return i >= 0 ? ident.slice(i + 2) : ident;
  }
  monOf(ident) {
    const side = this.state.sides[this.sideOf(ident)];
    const nick = this.nickOf(ident);
    if (/^p\da:/.test(ident) && side.active?.nick === nick) return side.active;
    return side.team.find((m) => m.nick === nick);
  }
  who(ident) {
    if (!ident) return "";
    const m = this.monOf(ident);
    const name = koSpecies(m ? m.species : this.nickOf(ident));
    return this.sideOf(ident) === "p2" ? `상대 ${name}` : name;
  }
  sideName(ident) {
    return ident.startsWith("p2") ? "상대" : "우리";
  }
  push(kind, text, side) {
    this.state.log.push({ kind, text, side });
  }
  /** 요청(request)에 담긴 내 파티 정보로 상태를 맞춘다 */
  setOwnTeam(pokemon) {
    const side = this.state.sides.p1;
    for (const p of pokemon) {
      const nick = this.nickOf(p.ident);
      const d = parseDetails(p.details);
      const hp = parseHP(p.condition);
      let m = side.team.find((x) => x.nick === nick);
      if (!m) {
        m = { nick, species: d.species, level: d.level, gender: d.gender, hp: 0, maxhp: 0, status: "", fainted: false, revealed: false, moves: [] };
        side.team.push(m);
      }
      m.species = d.species;
      m.hp = hp.hp;
      m.maxhp = hp.maxhp;
      m.status = hp.status;
      m.fainted = hp.fnt;
      m.item = p.item;
      m.ability = p.baseAbility;
      m.moves = p.moves;
    }
  }
  upsert(sideId, nick, details) {
    const side = this.state.sides[sideId];
    const d = parseDetails(details);
    let m = side.team.find((x) => x.nick === nick);
    if (!m) {
      m = side.team.find((x) => !x.revealed && (x.species === d.species || toID(x.species) === toID(d.species.split("-")[0]) || x.species.endsWith("-*") && d.species.startsWith(x.species.slice(0, -2))));
      if (m) m.nick = nick;
    }
    if (!m) {
      m = { nick, species: d.species, level: d.level, gender: d.gender, hp: 100, maxhp: 100, status: "", fainted: false, revealed: true, moves: [] };
      side.team.push(m);
    }
    m.species = d.species;
    m.level = d.level;
    m.gender = d.gender;
    m.revealed = true;
    return m;
  }
  setHP(ident, cond) {
    const m = this.monOf(ident);
    if (!m || !cond) return m;
    const hp = parseHP(cond);
    if (hp.fnt) {
      m.hp = 0;
      m.fainted = true;
      m.status = "";
    } else {
      m.hp = hp.hp;
      m.maxhp = hp.maxhp;
      m.status = hp.status;
    }
    return m;
  }
  add(line) {
    if (!line.startsWith("|")) {
      if (line.trim()) this.push("info", line);
      return;
    }
    const parts = line.slice(1).split("|");
    const cmd = parts[0];
    const args = parts.slice(1).filter((p) => !p.startsWith("["));
    const kw = {};
    for (const p of parts.slice(1)) {
      const m = p.match(/^\[(\w+)\]\s?(.*)$/);
      if (m) kw[m[1]] = m[2];
    }
    const st = this.state;
    const from = kw.from ? koEffect(kw.from) : "";
    const of = kw.of ? this.who(kw.of) : "";
    const pre = kw.from ? `[${from}] ` : "";
    if (kw.from && args[0] && /^p\d/.test(args[0])) {
      const fm = kw.from.match(/^(item|ability):\s*(.*)$/);
      if (fm) {
        const owner = fm[1] === "ability" && kw.of ? this.monOf(kw.of) : this.monOf(args[0]);
        if (owner) {
          if (fm[1] === "item") owner.item = fm[2];
          else owner.ability = fm[2];
        }
      }
    }
    if (cmd === "move" && args[0]) this.lastMove[this.sideOf(args[0])] = args[1];
    switch (cmd) {
      case "player":
        if (args[1]) st.sides[args[0]].name = args[1];
        break;
      case "poke": {
        const d = parseDetails(args[1]);
        st.sides[args[0]].team.push({ nick: d.species, species: d.species, level: d.level, gender: d.gender, hp: 100, maxhp: 100, status: "", fainted: false, revealed: false, moves: [] });
        break;
      }
      case "teampreview":
        this.push("info", "팀 프리뷰: 선출할 포켓몬을 고른다");
        break;
      case "start":
        this.push("major", "배틀 시작!");
        break;
      case "turn":
        st.turn = +args[0];
        this.push("turn", `${args[0]}턴`);
        break;
      case "switch":
      case "drag":
      case "replace": {
        const sid = this.sideOf(args[0]);
        const side = st.sides[sid];
        const m = this.upsert(sid, this.nickOf(args[0]), args[1]);
        side.active = m;
        side.boosts = {};
        side.volatiles = [];
        side.types = null;
        side.proteanUsed = false;
        if (args[2]) this.setHP(args[0], args[2]);
        const name = koSpecies(m.species);
        const opp = sid === "p2" ? "상대 " : "";
        if (cmd === "drag") this.push("text", `${opp}${iga(name)} 끌려 나왔다!`, sid);
        else if (cmd === "replace") this.push("text", `${opp}${name}의 정체가 드러났다!`, sid);
        else if (sid === "p1") this.push("major", `가랏! ${name}!`, "p1");
        else this.push("major", `${eun(side.name)} ${eul(name)} 내보냈다!`, "p2");
        break;
      }
      case "detailschange": {
        const m = this.monOf(args[0]);
        if (m) m.species = parseDetails(args[1]).species;
        st.sides[this.sideOf(args[0])].types = null;
        break;
      }
      case "-formechange": {
        const m = this.monOf(args[0]);
        if (m && args[1]) {
          m.species = args[1];
          if (!kw.silent) this.push("text", `${eun(this.who(args[0]))} ${euro(koSpecies(args[1]))} 모습을 바꿨다!`, this.sideOf(args[0]));
        }
        break;
      }
      case "faint": {
        const m = this.monOf(args[0]);
        if (m) {
          m.fainted = true;
          m.hp = 0;
        }
        this.push("major", `${eun(this.who(args[0]))} 쓰러졌다!`, this.sideOf(args[0]));
        break;
      }
      case "move": {
        const m = this.monOf(args[0]);
        if (m && this.sideOf(args[0]) === "p2" && !m.moves.includes(args[1]) && !kw.from) m.moves.push(args[1]);
        this.push("text", `${pre}${this.who(args[0])}의 ${koMove(args[1])}!`, this.sideOf(args[0]));
        break;
      }
      case "cant": {
        const w = this.who(args[0]);
        const reason = toID(args[1]);
        const msg = {
          par: `${eun(w)} 몸이 저려서 움직일 수 없다!`,
          slp: `${eun(w)} 쿨쿨 잠들어 있다.`,
          frz: `${eun(w)} 얼어 버려서 움직일 수 없다!`,
          flinch: `${eun(w)} 풀이 죽어 기술을 쓸 수 없다!`,
          recharge: `${eun(w)} 공격의 반동으로 움직일 수 없다!`,
          nopp: `${w}의 기술은 PP가 없다!`,
          taunt: `${eun(w)} 도발당해서 ${args[2] ? eul(koMove(args[2])) : "기술을"} 쓸 수 없다!`,
          disable: `${w}의 ${args[2] ? koMove(args[2]) : "기술"}은(는) 사용할 수 없다!`,
          focuspunch: `${eun(w)} 집중이 흐트러져 기술을 쓸 수 없다!`,
          truant: `${eun(w)} 게으름을 피우고 있다!`
        };
        this.push("text", msg[reason] ?? `${eun(w)} 움직일 수 없다! (${koEffect(args[1])})`, this.sideOf(args[0]));
        break;
      }
      case "-damage":
      case "-heal":
      case "-sethp": {
        const m = this.monOf(args[0]);
        const before = m ? pct(m) : 0;
        this.setHP(args[0], args[1]);
        const after = m ? pct(m) : 0;
        const w = this.who(args[0]);
        const sid = this.sideOf(args[0]);
        if (cmd === "-damage" && kw.from) {
          const src = toID(kw.from.replace(/^\w+:\s*/, ""));
          const msg = {
            brn: `${eun(w)} 화상 데미지를 입었다!`,
            psn: `${eun(w)} 독 데미지를 입었다!`,
            tox: `${eun(w)} 독 데미지를 입었다!`,
            recoil: `${eun(w)} 공격의 반동을 받았다!`,
            sandstorm: `모래바람이 ${eul(w)} 덮쳤다!`,
            hail: `싸라기눈이 ${eul(w)} 덮쳤다!`,
            lifeorb: `${eun(w)} 생명을 조금 깎았다!`,
            stealthrock: `뾰족한 바위가 ${w}에게 박혔다!`,
            spikes: `${eun(w)} 압정에 데미지를 입었다!`,
            confusion: "영문도 모른 채 자신을 공격했다!",
            leechseed: `씨뿌리기가 ${w}의 체력을 빼앗는다!`,
            roughskin: `${eun(w)} 상처를 입었다!`,
            ironbarbs: `${eun(w)} 상처를 입었다!`,
            rockyhelmet: `${eun(w)} 울퉁불퉁멧으로 데미지를 입었다!`,
            curse: `${eun(w)} 저주로 데미지를 입었다!`,
            partiallytrapped: `${eun(w)} 데미지를 입었다!`,
            saltcure: `${eun(w)} 소금절이 데미지를 입었다!`
          };
          this.push("text", msg[src] ?? `${eun(w)} ${euro(from)} 데미지를 입었다!`, sid);
        } else if (cmd === "-heal" && kw.from && toID(kw.from) === "drain") {
          this.push("text", `${of ? of + "의 " : ""}체력을 흡수했다!`, sid);
        } else if (cmd === "-heal" && kw.from) {
          this.push("text", `${eun(w)} ${euro(from)} 체력을 회복했다!`, sid);
        } else if (cmd === "-heal" && !kw.silent) {
          this.push("text", `${w}의 체력이 회복되었다!`, sid);
        }
        if (m && !kw.silent && before !== after) {
          const own = sid === "p1" ? ` (${m.hp}/${m.maxhp})` : "";
          const diff = after - before;
          this.push("hp", `${w} ${diff > 0 ? "+" : ""}${diff}% → ${after}%${own}`, sid);
        }
        break;
      }
      case "-supereffective":
        this.push("text", "효과가 굉장했다!");
        break;
      case "-resisted":
        this.push("text", "효과가 별로인 듯하다…");
        break;
      case "-immune":
        this.push("text", `${pre}${this.who(args[0])}에게는 효과가 없는 것 같다…`);
        break;
      case "-crit":
        this.push("text", "급소에 맞았다!");
        break;
      case "-miss":
        this.push("text", `${args[1] ? this.who(args[1]) : this.who(args[0])}에게는 맞지 않았다!`);
        break;
      case "-fail": {
        const what = toID(args[1] ?? "");
        if (what === "heal") this.push("text", `${this.who(args[0])}의 체력은 이미 가득 차 있다!`);
        else if (what === "unboost") this.push("text", `${this.who(args[0])}의 능력은 떨어지지 않는다!`);
        else this.push("text", `${pre}그러나 실패했다!`);
        break;
      }
      case "-notarget":
        this.push("text", "그러나 상대가 없다!");
        break;
      case "-hitcount":
        this.push("text", `${args[1]}번 맞았다!`);
        break;
      case "-ohko":
        this.push("text", "일격필살!");
        break;
      case "-status": {
        const m = this.monOf(args[0]);
        if (m) m.status = args[1];
        const w = this.who(args[0]);
        const msg = {
          brn: `${eun(w)} 화상을 입었다!`,
          par: `${eun(w)} 마비되어 기술이 나오기 어려워졌다!`,
          slp: `${eun(w)} 잠들어 버렸다!`,
          frz: `${eun(w)} 얼어붙었다!`,
          psn: `${eun(w)} 독에 걸렸다!`,
          tox: `${eun(w)} 맹독을 입었다!`
        };
        this.push("text", pre + (msg[args[1]] ?? `${w}: ${args[1]}`), this.sideOf(args[0]));
        break;
      }
      case "-curestatus": {
        const m = this.monOf(args[0]);
        if (m) m.status = "";
        if (!kw.silent) this.push("text", `${this.who(args[0])}의 ${iga(STATUS_KO[args[1]] ?? args[1])} 나았다!`, this.sideOf(args[0]));
        break;
      }
      case "-cureteam":
        for (const m of st.sides[this.sideOf(args[0])].team) m.status = "";
        this.push("text", `${this.sideName(args[0])} 편의 상태 이상이 모두 나았다!`);
        break;
      case "-boost":
      case "-unboost": {
        const sid = this.sideOf(args[0]);
        const delta = +args[2] * (cmd === "-boost" ? 1 : -1);
        const b = st.sides[sid].boosts;
        b[args[1]] = Math.max(-6, Math.min(6, (b[args[1]] ?? 0) + delta));
        if (!b[args[1]]) delete b[args[1]];
        const stat = STAT_KO[args[1]] ?? args[1];
        const w = this.who(args[0]);
        const n = Math.abs(+args[2]);
        const up = cmd === "-boost";
        if (n === 0) this.push("text", `${pre}${w}의 ${iga(stat)} 더 이상 ${up ? "올라가지" : "떨어지지"} 않는다!`, sid);
        else this.push("text", `${pre}${w}의 ${iga(stat)} ${n >= 3 ? "매우 크게 " : n === 2 ? "크게 " : ""}${up ? "올라갔다" : "떨어졌다"}!`, sid);
        break;
      }
      case "-setboost": {
        const sid = this.sideOf(args[0]);
        st.sides[sid].boosts[args[1]] = +args[2];
        this.push("text", `${this.who(args[0])}의 ${STAT_KO[args[1]] ?? args[1]} ${args[2]}단계!`, sid);
        break;
      }
      case "-clearboost":
        st.sides[this.sideOf(args[0])].boosts = {};
        this.push("text", `${this.who(args[0])}의 능력 변화가 원래대로 돌아왔다!`);
        break;
      case "-clearnegativeboost": {
        const b = st.sides[this.sideOf(args[0])].boosts;
        for (const k in b) if (b[k] < 0) delete b[k];
        break;
      }
      case "-clearallboost":
        st.sides.p1.boosts = {};
        st.sides.p2.boosts = {};
        this.push("text", "모든 능력 변화가 원래대로 돌아왔다!");
        break;
      case "-invertboost": {
        const b = st.sides[this.sideOf(args[0])].boosts;
        for (const k in b) b[k] = -b[k];
        break;
      }
      case "-copyboost":
        this.push("text", `${eun(this.who(args[0]))} ${this.who(args[1])}의 능력 변화를 복사했다!`);
        break;
      case "-swapboost":
        this.push("text", `${eun(this.who(args[0]))} 능력 변화를 바꿔 넣었다!`);
        break;
      case "-weather": {
        if (kw.upkeep !== void 0) break;
        const nw = args[0] === "none" ? "" : args[0];
        if (nw !== st.weather) {
          if (nw) st.since.weather = st.turn;
          else delete st.since.weather;
        }
        st.weather = nw;
        this.push("info", (kw.from ? `[${of ? of + "의 " : ""}${from}] ` : "") + (WEATHER_START[args[0]] ?? args[0]));
        break;
      }
      case "-fieldstart": {
        const name = koEffect(args[0]);
        if (/terrain/i.test(args[0])) st.terrain = st.terrain.filter((t) => !/terrain/i.test(t));
        if (/terrain/i.test(args[0])) {
          for (const k of Object.keys(st.since)) if (/^field:.*terrain/i.test(k)) delete st.since[k];
        }
        st.terrain.push(args[0].replace(/^move:\s*/, ""));
        st.since["field:" + args[0].replace(/^move:\s*/, "")] = st.turn;
        this.push("info", `${iga(name)} 펼쳐졌다!` + (of ? ` (${of})` : ""));
        break;
      }
      case "-fieldend": {
        const t = args[0].replace(/^move:\s*/, "");
        st.terrain = st.terrain.filter((x) => x !== t);
        delete st.since["field:" + t];
        this.push("info", `${iga(koEffect(args[0]))} 사라졌다.`);
        break;
      }
      case "-sidestart": {
        const sid = args[0].slice(0, 2);
        const c = args[1].replace(/^move:\s*/, "");
        if (!st.sides[sid].conditions.includes(c)) {
          st.sides[sid].conditions.push(c);
          st.since[`${sid}:${c}`] = st.turn;
          st.layers[`${sid}:${c}`] = 1;
        } else st.layers[`${sid}:${c}`] = (st.layers[`${sid}:${c}`] ?? 1) + 1;
        this.push("info", `${this.sideName(sid)} 편: ${koEffect(args[1])}!`);
        break;
      }
      case "-sideend": {
        const sid = args[0].slice(0, 2);
        const c = args[1].replace(/^move:\s*/, "");
        st.sides[sid].conditions = st.sides[sid].conditions.filter((x) => x !== c);
        delete st.since[`${sid}:${c}`];
        delete st.layers[`${sid}:${c}`];
        this.push("info", `${this.sideName(sid)} 편의 ${iga(koEffect(args[1]))} 사라졌다.`);
        break;
      }
      case "-start": {
        const sid = this.sideOf(args[0]);
        const w = this.who(args[0]);
        const eff = toID(args[1].replace(/^\w+:\s*/, ""));
        if (eff === "typechange") {
          const types = (args[2] ?? "").split("/").filter(Boolean);
          st.sides[sid].types = types.length ? types : null;
          const ab = toID((kw.from ?? "").replace(/^ability:\s*/, ""));
          if (ab === "protean" || ab === "libero") st.sides[sid].proteanUsed = true;
          this.push("text", `${pre}${eun(w)} ${types.map(koType).join("·")} 타입이 되었다!`, sid);
          break;
        }
        if (!st.sides[sid].volatiles.includes(eff)) st.sides[sid].volatiles.push(eff);
        const msg = {
          confusion: `${eun(w)} 혼란에 빠졌다!`,
          substitute: `${w}의 대타가 나타났다!`,
          taunt: `${eun(w)} 도발에 넘어갔다!`,
          leechseed: `${w}에게 씨앗을 심었다!`,
          encore: `${eun(w)} 앙코르를 받았다!`,
          perish3: `${w}: 멸망의노래 카운트 3`,
          perish2: `${w}: 멸망의노래 카운트 2`,
          perish1: `${w}: 멸망의노래 카운트 1`,
          perish0: `${w}: 멸망의노래 카운트 0`,
          yawn: `${eun(w)} 졸음이 몰려왔다!`,
          focusenergy: `${eun(w)} 기합이 들어갔다!`,
          disable: `${w}의 ${args[2] ? koMove(args[2]) : "기술"} 사용이 봉해졌다!`,
          flashfire: `${w}의 불꽃 위력이 올라갔다!`,
          slowstart: `${eun(w)} 제 컨디션을 발휘하지 못한다!`,
          curse: `${eun(w)} 저주를 받았다!`,
          torment: `${eun(w)} 트집을 잡혔다!`,
          attract: `${eun(w)} 헤롱헤롱해졌다!`,
          saltcure: `${eun(w)} 소금에 절여졌다!`,
          healblock: `${eun(w)} 회복이 봉인되었다!`,
          protosynthesis: `${w}의 ${iga(STAT_KO[toID(args[2] ?? "")] ?? "능력")} 올라갔다! (고대활성)`,
          quarkdrive: `${w}의 ${iga(STAT_KO[toID(args[2] ?? "")] ?? "능력")} 올라갔다! (쿼크차지)`
        };
        if (eff.startsWith("perish") && !msg[eff]) break;
        if (eff.startsWith("fallen")) {
          const n = +eff.slice(6);
          if (n > 0) this.push("text", `${pre}${w}에게 쓰러진 동료 ${n}마리의 힘이 모인다!`, sid);
          break;
        }
        this.push("text", pre + (msg[eff] ?? `${w}: ${koEffect(args[1])}`), sid);
        break;
      }
      case "-end": {
        const sid = this.sideOf(args[0]);
        const eff = toID(args[1].replace(/^\w+:\s*/, ""));
        st.sides[sid].volatiles = st.sides[sid].volatiles.filter((v) => v !== eff);
        if (eff === "typechange") st.sides[sid].types = null;
        const w = this.who(args[0]);
        const msg = {
          confusion: `${w}의 혼란이 풀렸다!`,
          substitute: `${w}의 대타는 사라져 버렸다…`,
          taunt: `${w}의 도발 효과가 풀렸다!`,
          encore: `${w}의 앙코르가 끝났다!`,
          disable: `${w}의 사슬묶기가 풀렸다!`,
          healblock: `${w}의 회복봉인이 풀렸다!`
        };
        if (!kw.silent && !eff.startsWith("fallen")) this.push("text", msg[eff] ?? `${w}: ${koEffect(args[1])} 종료`, sid);
        break;
      }
      case "-singleturn":
      case "-activate": {
        const w = args[0] ? this.who(args[0]) : "";
        const eff = toID(args[1].replace(/^\w+:\s*/, ""));
        if (cmd === "-activate" && PROTECTS.includes(eff)) {
          this.push("text", `${eun(w)} 공격으로부터 몸을 지켰다!`);
          break;
        }
        const msg = {
          protect: `${eun(w)} 방어 태세에 들어갔다!`,
          endure: `${eun(w)} 버티기 태세에 들어갔다!`,
          focuspunch: `${eun(w)} 집중력을 높이고 있다!`,
          substitute: `대타가 ${w} 대신 공격을 받았다!`,
          confusion: `${eun(w)} 혼란에 빠져 있다!`,
          sturdy: `${eun(w)} 공격을 버텼다!`,
          focussash: `${eun(w)} 기합의띠로 버텼다!`,
          disguise: "탈이 대신 공격을 받았다!",
          trick: `${eun(w)} 도구를 서로 바꿨다!`,
          switcheroo: `${eun(w)} 도구를 서로 바꿨다!`,
          magicbounce: `${eun(w)} 기술을 되받아쳤다!`
        };
        for (const p of PROTECTS) msg[p] ??= `${eun(w)} 방어 태세에 들어갔다!`;
        this.push("text", msg[eff] ?? `[${w ? w + " · " : ""}${koEffect(args[1])}]`);
        break;
      }
      case "-mega":
        this.push("major", `${eun(this.who(args[0]))} 메가진화했다!`, this.sideOf(args[0]));
        break;
      case "-primal":
        this.push("major", `${eun(this.who(args[0]))} 원시회귀했다!`);
        break;
      case "-zbroken":
        this.push("text", `${eun(this.who(args[0]))} 방어를 뚫고 공격받았다!`);
        break;
      case "-ability": {
        const m = this.monOf(args[0]);
        if (m) m.ability = args[1];
        this.push("text", `[${this.who(args[0])}의 특성: ${koAbility(args[1])}]`, this.sideOf(args[0]));
        break;
      }
      case "-endability":
        this.push("text", `${this.who(args[0])}의 특성이 효과를 잃었다!`);
        break;
      case "-item": {
        const m = this.monOf(args[0]);
        if (m) m.item = args[1];
        const it = koItem(args[1]);
        if (kw.from && /Frisk/i.test(kw.from)) this.push("text", `${eun(of || "")} ${this.who(args[0])}의 ${eul(it)} 통찰했다!`);
        else if (kw.from) this.push("text", `${eun(this.who(args[0]))} ${eul(it)} 얻었다! [${from}]`);
        else this.push("text", `${eun(this.who(args[0]))} ${eul(it)} 지니고 있다!`);
        break;
      }
      case "-enditem": {
        const m = this.monOf(args[0]);
        if (m) m.item = "";
        const it = koItem(args[1]);
        const w = this.who(args[0]);
        if (kw.eat !== void 0) this.push("text", `${eun(w)} ${eul(it)} 먹었다!`);
        else if (kw.from && /stealeat|bugbite|pluck/i.test(toID(kw.from))) this.push("text", `${w}의 ${iga(it)} 먹혀 버렸다!`);
        else if (kw.from) this.push("text", `${w}의 ${iga(it)} 없어졌다! [${from}]`);
        else this.push("text", `${w}의 ${iga(it)} 사라졌다!`);
        break;
      }
      case "-transform":
        this.push("text", `${eun(this.who(args[0]))} ${euro(koSpecies(args[1].replace(/^p\da: /, "")))} 변신했다!`);
        break;
      case "-prepare":
        this.push("text", `${eun(this.who(args[0]))} ${koMove(args[1])} 준비 중이다!`);
        break;
      case "-nothing":
        this.push("text", "그러나 아무 일도 일어나지 않았다!");
        break;
      case "-message":
      case "message":
        this.push("info", args.join(" "));
        break;
      case "win":
        st.winner = args[0];
        st.ended = true;
        this.push("win", `${josa(args[0], "의", "의")} 승리!`);
        break;
      case "tie":
        st.ended = true;
        this.push("win", "무승부!");
        break;
      case "-singlemove":
        this.push("text", `${eun(this.who(args[0]))} ${koMove(args[1])} 태세다!`);
        break;
      case "-fieldactivate":
        this.push("info", `[${koEffect(args[0])}]`);
        break;
      case "-block":
        this.push("text", `${eun(this.who(args[0]))} ${args[1] ? koEffect(args[1]) + "(으)로 " : ""}공격을 막았다!`);
        break;
      case "swapsideconditions": {
        const a = st.sides.p1.conditions;
        st.sides.p1.conditions = st.sides.p2.conditions;
        st.sides.p2.conditions = a;
        for (const m of [st.since, st.layers]) {
          const sw = {};
          for (const [k, v] of Object.entries(m)) sw[k.replace(/^p1:/, "#").replace(/^p2:/, "p1:").replace(/^#/, "p2:")] = v;
          for (const k of Object.keys(m)) delete m[k];
          Object.assign(m, sw);
        }
        this.push("info", "서로의 필드 효과가 바뀌었다!");
        break;
      }
      case "-mustrecharge":
      case "-waiting":
      case "-combine":
      case "-hint":
      case "-center":
      case "upkeep":
      case "":
      case "t:":
      case "gametype":
      case "gen":
      case "tier":
      case "rule":
      case "clearpoke":
      case "teamsize":
      case "j":
      case "J":
      case "l":
      case "init":
      case "title":
      case "split":
      case "rated":
      case "-anim":
      case "seed":
      case "debug":
      case "inactive":
      case "inactiveoff":
      case "timestamp":
      case "chat":
      case "bigerror":
      case "uhtml":
      case "html":
      case "raw":
        break;
      default:
        if (cmd.startsWith("-")) this.push("info", `(${cmd.slice(1)} ${args.join(" ")})`);
    }
  }
};

// src/core/movetype.ts
var TYPE_SHIFT_ABILITIES = ["protean", "libero"];
function typeShift(pokemon, move, abilityId, used, currentTypes) {
  if (!TYPE_SHIFT_ABILITIES.includes(abilityId) || used) return void 0;
  if (move.callsMove || move.flags?.futuremove || !move.type || move.type === "???") return void 0;
  if (currentTypes.join() === move.type) return void 0;
  void pokemon;
  return { abilityId, type: move.type, stab: move.category !== "Status" && !currentTypes.includes(move.type) };
}
__name(typeShift, "typeShift");
function resolveMoveType(battle, pokemon, target, moveId, abilityOverride) {
  const base = battle.dex.moves.get(moveId);
  const out = { id: base.id, type: base.type, baseType: base.type, cause: "" };
  const ability = toID(abilityOverride ?? pokemon.ability);
  const used = abilityOverride && toID(abilityOverride) !== toID(pokemon.ability) ? false : !!pokemon.abilityState?.[ability];
  if (base.category === "Status") {
    out.becomes = typeShift(pokemon, base, ability, used, pokemon.getTypes());
    return out;
  }
  const logLen = battle.log.length;
  const savedAbility = pokemon.ability;
  try {
    if (abilityOverride) pokemon.ability = toID(abilityOverride);
    const move = battle.dex.getActiveMove(base.id);
    battle.singleEvent("ModifyType", move, null, pokemon, target, move, move);
    const afterMove = move.type;
    battle.runEvent("ModifyType", pokemon, target, move, move);
    out.type = move.type;
    if (move.type !== base.type) {
      if (move.type !== afterMove) {
        out.cause = "ability";
        out.abilityId = toID(pokemon.ability);
      } else out.cause = "move";
    }
    out.becomes = typeShift(pokemon, move, ability, used, pokemon.getTypes());
  } catch {
  } finally {
    pokemon.ability = savedAbility;
    battle.log.length = logLen;
  }
  return out;
}
__name(resolveMoveType, "resolveMoveType");

// src/core/session.ts
function debounce(fn) {
  let t = null;
  return () => {
    if (t) clearTimeout(t);
    t = setTimeout(() => {
      t = null;
      fn();
    }, 0);
  };
}
__name(debounce, "debounce");
var BattleSession = class {
  constructor(opts, ev) {
    this.opts = opts;
    this.ev = ev;
    this.format = opts.format;
    this.p2View = new BattleView(opts.p1.name, opts.p2.name);
    const stream = new BattleStream();
    this.stream = stream;
    this.streams = getPlayerStreams(stream);
    this.readP1();
    this.readP2();
    this.readOmni();
    const start = { formatid: opts.format.id };
    if (opts.seed) start.seed = opts.seed;
    this.streams.omniscient.write(
      `>start ${JSON.stringify(start)}
>player p1 ${JSON.stringify({ name: opts.p1.name, team: Teams.pack(opts.p1.team) })}
>player p2 ${JSON.stringify({ name: opts.p2.name, team: Teams.pack(opts.p2.team) })}`
    );
  }
  opts;
  ev;
  static {
    __name(this, "BattleSession");
  }
  streams;
  stream;
  p1Pending = null;
  p2Pending = null;
  lastP1Req = null;
  p1Log = [];
  p2Log = [];
  p2View;
  ended = false;
  winner = null;
  format;
  flushP1 = debounce(() => {
    this.ev.onFlush?.();
    if (this.ended) return;
    const req2 = this.p1Pending;
    this.p1Pending = null;
    if (req2 && !req2.wait) {
      this.lastP1Req = req2;
      this.ev.onRequest(req2);
    }
  });
  flushP2 = debounce(async () => {
    if (this.ended) return;
    const req2 = this.p2Pending;
    this.p2Pending = null;
    if (!req2 || req2.wait) return;
    const rng = this.opts.rng ?? Math.random;
    let choice;
    try {
      choice = await this.opts.p2.agent.choose(req2, { format: this.format, log: this.p2Log, rng, view: this.p2View, team: this.opts.p2.team });
    } catch (e) {
      console.warn("[AI 판단 오류]", e);
      choice = "default";
    }
    this.streams.p2.write(choice);
  });
  /** 내(p1) 싸우는 포켓몬의 기술 타입 (특성·기술 효과 반영). mega: 메가진화 후 특성으로 미리 보기 */
  previewMoveTypes(mega = false) {
    const b = this.stream?.battle;
    const p = b?.p1?.active?.[0];
    if (!b || !p) return null;
    let ability;
    if (mega && p.canMegaEvo) ability = b.dex.species.get(p.canMegaEvo).abilities["0"];
    return p.moveSlots.map((s) => resolveMoveType(b, p, b.p2.active[0], s.id, ability));
  }
  choose(choice) {
    if (!this.ended) this.streams.p1.write(choice);
  }
  forfeit() {
    if (!this.ended) this.streams.omniscient.write(">forcelose p1");
  }
  async readP1() {
    for await (const chunk of this.streams.p1) {
      for (const line of chunk.split("\n")) {
        if (line.startsWith("|request|")) {
          const j = line.slice(9);
          if (j) this.p1Pending = JSON.parse(j);
          continue;
        }
        if (line.startsWith("|error|")) {
          this.ev.onError?.(line.slice(7));
          if (this.lastP1Req && !line.includes("[Unavailable choice]")) this.p1Pending = this.lastP1Req;
          continue;
        }
        if (line.startsWith("|win|")) this.winner = line.slice(5);
        if (line === "|tie") this.winner = null;
        this.p1Log.push(line);
        this.ev.onLine(line);
        if (line.startsWith("|win|") || line === "|tie") this.finish();
      }
      this.flushP1();
    }
  }
  async readP2() {
    for await (const chunk of this.streams.p2) {
      for (const line of chunk.split("\n")) {
        if (line.startsWith("|request|")) {
          const j = line.slice(9);
          if (j) this.p2Pending = JSON.parse(j);
          continue;
        }
        if (line.startsWith("|error|")) {
          console.warn("[AI 선택 오류]", line);
          continue;
        }
        this.p2Log.push(line);
        this.p2View.add(line);
      }
      this.flushP2();
    }
  }
  async readOmni() {
    for await (const _ of this.streams.omniscient) {
    }
  }
  finish() {
    if (this.ended) return;
    this.ended = true;
    setTimeout(() => {
      this.ev.onFlush?.();
      this.ev.onEnd(this.winner);
    }, 0);
  }
};

// src/ui/fx.ts
var STATUS_COLOR = { brn: "#ff7a2e", par: "#f2cf1d", psn: "#b05ad0", tox: "#8a2fb0", slp: "#9aa3b5", frz: "#7fe0f0" };
var WEATHER_COLOR = {
  sunnyday: "#ffb13b",
  desolateland: "#ff7a1a",
  raindance: "#3f7fe0",
  primordialsea: "#2a5fc0",
  sandstorm: "#c9a254",
  snowscape: "#e8f4ff",
  snow: "#e8f4ff",
  hail: "#e8f4ff",
  deltastream: "#9ad0e0"
};
var TERRAIN_COLOR = { electricterrain: "#f2cf1d", grassyterrain: "#5fae3c", mistyterrain: "#f0a8d0", psychicterrain: "#c070e0" };
var toID2 = /* @__PURE__ */ __name((s) => (s ?? "").toLowerCase().replace(/[^a-z0-9]/g, ""), "toID");
var sideOf = /* @__PURE__ */ __name((ident) => /^p1/.test(ident) ? "p1" : /^p2/.test(ident) ? "p2" : null, "sideOf");
var BattleFx = class {
  constructor(inner, spr) {
    this.inner = inner;
    this.spr = spr;
    this.subEl = { p1: this.doll("p1"), p2: this.doll("p2") };
  }
  inner;
  spr;
  static {
    __name(this, "BattleFx");
  }
  anims = /* @__PURE__ */ new Set();
  temps = /* @__PURE__ */ new Set();
  pending = {};
  /** 사라지는 중인 대타 인형 (연출이 끝날 때까지 숨기지 않는다) */
  leaving = {};
  subEl;
  motionQuery = typeof matchMedia === "function" ? matchMedia("(prefers-reduced-motion: reduce)") : null;
  /** 연출을 틀지 (끔·즉시 속도면 안 튼다) */
  get on() {
    return settings.effects !== "off" && settings.speed !== "instant";
  }
  /** 움직임 줄이기: 이동·흔들림 없이 색만 */
  get reduced() {
    return settings.effects === "reduced" || !!this.motionQuery?.matches;
  }
  /** 속도 설정에 맞춘 시간 배율 */
  get k() {
    return { slow: 1.15, normal: 1, fast: 0.6, instant: 0 }[settings.speed] ?? 1;
  }
  /** 진행 중인 연출을 모두 끝낸다 (화면 누름 = 건너뛰기) */
  finishAll() {
    for (const a of this.anims) {
      try {
        a.finish();
      } catch {
      }
    }
    this.anims.clear();
    for (const el2 of this.temps) el2.remove();
    this.temps.clear();
  }
  /** 프로토콜 한 줄 → 연출. view.add 전에 부른다 */
  play(line) {
    if (!line.startsWith("|")) return;
    const parts = line.slice(1).split("|");
    const cmd = parts[0];
    const args = parts.slice(1).filter((p) => !p.startsWith("["));
    const kw = new Set(parts.slice(1).filter((p) => p.startsWith("[")).map((p) => p.replace(/\].*$/, "]")));
    const from = parts.find((p) => p.startsWith("[from]"));
    const s = sideOf(args[0] ?? "");
    if (s && (cmd === "-crit" || cmd === "-supereffective" || cmd === "-resisted")) {
      const p = this.pending[s] ??= {};
      if (cmd === "-crit") p.crit = true;
      else p.eff = cmd === "-supereffective" ? 2 : 0.5;
      return;
    }
    if (!this.on) {
      if (cmd === "-damage" && s) delete this.pending[s];
      return;
    }
    switch (cmd) {
      case "move": {
        const t = sideOf(args[2] ?? "");
        if (!s || kw.has("[still]")) return;
        this.moveUse(s, t && t !== s ? t : null, args[1]);
        break;
      }
      case "-damage": {
        if (!s) return;
        const p = this.pending[s];
        delete this.pending[s];
        if (from) return;
        this.hit(s, p?.eff ?? 1, !!p?.crit);
        break;
      }
      case "-boost":
      case "-unboost": {
        if (!s) return;
        const n = Math.max(0, Math.min(3, parseInt(args[2] ?? "1", 10) || 0));
        if (n) this.stat(s, cmd === "-boost", n);
        break;
      }
      case "-status":
        if (s) this.tint(s, STATUS_COLOR[args[1]] ?? "#fff");
        break;
      case "-heal":
        if (s && !kw.has("[silent]")) this.sparkle(s, "#6fe08a");
        break;
      case "-mega":
        if (s) this.mega(s);
        break;
      case "-activate":
      case "-singleturn": {
        const eff = toID2((args[1] ?? "").replace(/^move:\s*/, ""));
        if (s && ["protect", "detect", "kingsshield", "spikyshield", "banefulbunker", "silktrap", "burningbulwark", "obstruct", "endure"].includes(eff)) this.shield(s);
        break;
      }
      case "-weather": {
        const w = toID2(args[0]);
        if (w && w !== "none" && !kw.has("[upkeep]")) this.screenTint(WEATHER_COLOR[w] ?? "#ffffff");
        break;
      }
      case "-fieldstart": {
        const f = toID2((args[0] ?? "").replace(/^move:\s*/, ""));
        this.screenTint(TERRAIN_COLOR[f] ?? "#b08aff", true);
        break;
      }
      case "switch":
      case "drag":
      case "replace":
        if (s) this.enter(s);
        break;
      case "-start": {
        if (s && toID2((args[1] ?? "").replace(/^move:\s*/, "")) === "substitute") this.dollIn(s);
        break;
      }
      case "-end": {
        if (s && toID2((args[1] ?? "").replace(/^move:\s*/, "")) === "substitute") this.dollOut(s);
        break;
      }
    }
  }
  // ---------------------------------------------------------------- 계속 남는 표시: 대타출동 인형
  /** 대타 상태를 화면에 맞춘다 (renderScene 에서 매번) */
  syncSubstitute(side, on) {
    const d = this.subEl[side], sp = this.spr[side];
    if (!on && this.leaving[side]) return;
    d.hidden = !on;
    sp.classList.toggle("behind-sub", on);
    if (on) this.placeDoll(side);
  }
  doll(side) {
    const svg = `<svg viewBox="0 0 64 72" width="100%" height="100%" aria-hidden="true">
			<ellipse cx="32" cy="68" rx="20" ry="3.5" fill="#0003"/>
			<path d="M14 64 Q10 40 18 26 Q22 12 32 10 Q42 12 46 26 Q54 40 50 64 Z" fill="#f2e3c4" stroke="#8a6a3a" stroke-width="2.5"/>
			<path d="M32 12 L32 64" stroke="#8a6a3a" stroke-width="1.5" stroke-dasharray="3 3" fill="none"/>
			<path d="M18 30 Q12 36 11 44" stroke="#8a6a3a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
			<path d="M46 30 Q52 36 53 44" stroke="#8a6a3a" stroke-width="2.5" fill="none" stroke-linecap="round"/>
			<circle cx="25" cy="26" r="3.2" fill="#3a3a48"/><circle cx="39" cy="26" r="3.2" fill="#3a3a48"/>
			<circle cx="24" cy="25" r="1" fill="#fff"/><circle cx="38" cy="25" r="1" fill="#fff"/>
			<path d="M27 34 Q32 37 37 34" stroke="#8a6a3a" stroke-width="2" fill="none" stroke-linecap="round"/>
			<rect x="20" y="44" width="24" height="11" rx="3" fill="#e05a4a" stroke="#8a3a2a" stroke-width="1.5"/>
			<rect x="38" y="54" width="9" height="7" rx="1.5" fill="#c9b48a" stroke="#8a6a3a" stroke-width="1" transform="rotate(-12 42 57)"/>
		</svg>`;
    const el2 = h("div", { class: "subdoll", "aria-label": "대타출동 인형", role: "img" }, h("b", null, "대타"));
    el2.insertAdjacentHTML("afterbegin", svg);
    el2.hidden = true;
    el2.dataset.side = side;
    this.inner.appendChild(el2);
    return el2;
  }
  placeDoll(side) {
    const sp = this.spr[side], d = this.subEl[side];
    const size = side === "p1" ? 80 : 60;
    const top = (parseFloat(sp.style.top) || 0) - (side === "p1" ? 12 : 2);
    d.style.cssText = `left:${sp.style.left};top:${top}px;width:${size}px;height:${size * 1.1}px`;
  }
  dollIn(side) {
    this.placeDoll(side);
    const d = this.subEl[side];
    d.hidden = false;
    if (!this.reduced) this.run(d, [{ translate: "0 -24px", opacity: 0 }, { translate: "0 3px", opacity: 1, offset: 0.7 }, { translate: "0 0", opacity: 1 }], 320);
  }
  dollOut(side) {
    const d = this.subEl[side];
    if (d.hidden) return;
    const a = this.run(d, [{ scale: "1", opacity: 1 }, { scale: this.reduced ? "1" : "1.25", opacity: 0 }], 260);
    if (!a) return;
    this.leaving[side] = true;
    const done = /* @__PURE__ */ __name(() => {
      this.leaving[side] = false;
      d.hidden = true;
      this.spr[side].classList.remove("behind-sub");
    }, "done");
    a.finished.then(done).catch(done);
  }
  // ---------------------------------------------------------------- 연출 조각
  run(el2, frames, ms, easing = "ease-out") {
    const d = Math.round(Math.min(600, ms) * this.k);
    if (!d || typeof el2.animate !== "function") return null;
    const a = el2.animate(frames, { duration: d, easing });
    this.anims.add(a);
    a.finished.then(() => this.anims.delete(a)).catch(() => this.anims.delete(a));
    return a;
  }
  temp(cls, style, parent = this.inner) {
    const el2 = h("div", { class: `fx ${cls}`, style, "aria-hidden": "true" });
    parent.appendChild(el2);
    this.temps.add(el2);
    return el2;
  }
  drop(el2, a) {
    if (!a) {
      el2.remove();
      this.temps.delete(el2);
      return;
    }
    a.finished.then(() => {
      el2.remove();
      this.temps.delete(el2);
    }).catch(() => {
      el2.remove();
      this.temps.delete(el2);
    });
  }
  /** 포켓몬 몸 가운데 (inner 좌표) */
  center(side) {
    const sp = this.spr[side];
    const x = parseFloat(sp.style.left) || (side === "p1" ? 96 : 262);
    const bottom = parseFloat(sp.style.top) || (side === "p1" ? 252 : 122);
    const hgt = sp.offsetHeight || (side === "p1" ? 120 : 84);
    return { x, y: bottom - hgt / 2, h: hgt };
  }
  moveUse(user, target, moveName) {
    const mv = dex.moves.get(moveName);
    const color = TYPE_COLOR[mv.type] ?? "#fff";
    const u = this.center(user);
    if (mv.category === "Status" || !target) {
      const at = target && mv.category === "Status" && mv.target !== "self" ? this.center(target) : u;
      const r = this.temp("ring", `left:${at.x}px;top:${at.y}px;border-color:${color}`);
      this.drop(r, this.run(r, [{ scale: "0.3", opacity: 0.9 }, { scale: "1.6", opacity: 0 }], 420));
      return;
    }
    const t = this.center(target);
    if (mv.category === "Physical" && !this.reduced) {
      const dx = (t.x - u.x) * 0.16, dy = (t.y - u.y) * 0.16;
      this.run(this.spr[user], [{ translate: "0 0" }, { translate: `${dx}px ${dy}px`, offset: 0.4 }, { translate: "0 0" }], 280, "ease-in-out");
    } else if (mv.category === "Special") {
      const b = this.temp("orb", `left:${u.x}px;top:${u.y}px;background:${color};box-shadow:0 0 10px ${color}`);
      const frames = this.reduced ? [{ opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 0 }] : [{ translate: "0 0", scale: "0.6" }, { translate: `${t.x - u.x}px ${t.y - u.y}px`, scale: "1.2" }];
      this.drop(b, this.run(b, frames, 300, "ease-in"));
    }
  }
  hit(side, eff, crit) {
    const sp = this.spr[side];
    const amp = eff >= 2 ? 9 : eff < 1 ? 3 : 6;
    if (!this.reduced) this.run(sp, [0, amp, -amp, amp * 0.6, -amp * 0.4, 0].map((x) => ({ translate: `${x}px 0` })), eff >= 2 ? 360 : 260, "linear");
    this.run(sp, [{ filter: "brightness(1)" }, { filter: `brightness(${eff >= 2 ? 2.2 : 1.7})` }, { filter: "brightness(1)" }], 220);
    if (crit) {
      const f = this.temp("flash", "inset:0;background:#fff");
      this.drop(f, this.run(f, [{ opacity: 0.75 }, { opacity: 0 }], 180));
    }
  }
  stat(side, up, n) {
    const c = this.center(side);
    const color = up ? "#4aa8ff" : "#ff5a4a";
    for (let wave = 0; wave < n; wave++) {
      for (let i = 0; i < 5; i++) {
        const x = c.x + (i - 2) * 12 + (wave % 2 ? 6 : 0);
        const y0 = up ? c.y + c.h * 0.3 : c.y - c.h * 0.35;
        const p = this.temp(up ? "pt up" : "pt down", `left:${x}px;top:${y0}px;background:${color}`);
        const dy = up ? -c.h * 0.55 : c.h * 0.55;
        const a = this.reduced ? this.run(p, [{ opacity: 0 }, { opacity: 0.9 }, { opacity: 0 }], 360) : p.animate(
          [{ translate: "0 0", opacity: 0 }, { opacity: 1, offset: 0.25 }, { translate: `0 ${dy}px`, opacity: 0 }],
          { duration: Math.round(360 * this.k), delay: Math.round((wave * 110 + i * 25) * this.k), easing: "ease-out", fill: "backwards" }
        );
        if (a && !this.anims.has(a)) {
          this.anims.add(a);
          a.finished.then(() => this.anims.delete(a)).catch(() => this.anims.delete(a));
        }
        this.drop(p, a);
      }
    }
    this.run(this.spr[side], [{ filter: "none" }, { filter: `drop-shadow(0 0 6px ${color})` }, { filter: "none" }], 420);
  }
  tint(side, color) {
    this.run(this.spr[side], [{ filter: "none" }, { filter: `drop-shadow(0 0 8px ${color}) saturate(1.4)` }, { filter: "none" }], 450);
  }
  sparkle(side, color) {
    const c = this.center(side);
    for (let i = 0; i < 6; i++) {
      const p = this.temp("pt spark", `left:${c.x + (i - 2.5) * 11}px;top:${c.y + c.h * 0.25}px;background:${color}`);
      const a = this.reduced ? this.run(p, [{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], 380) : p.animate(
        [{ translate: "0 0", opacity: 0, scale: "0.5" }, { opacity: 1, offset: 0.3 }, { translate: `0 ${-c.h * 0.5}px`, opacity: 0, scale: "1" }],
        { duration: Math.round(420 * this.k), delay: Math.round(i * 30 * this.k), easing: "ease-out", fill: "backwards" }
      );
      if (a && !this.anims.has(a)) {
        this.anims.add(a);
        a.finished.then(() => this.anims.delete(a)).catch(() => this.anims.delete(a));
      }
      this.drop(p, a);
    }
  }
  mega(side) {
    const c = this.center(side);
    const r = this.temp("ring mega", `left:${c.x}px;top:${c.y}px`);
    this.drop(r, this.run(r, [{ scale: "0.2", opacity: 1 }, { scale: "2.2", opacity: 0 }], 520));
    this.run(this.spr[side], [{ filter: "brightness(1)" }, { filter: "brightness(2.6) saturate(0.4)", offset: 0.45 }, { filter: "brightness(1)" }], 520);
  }
  shield(side) {
    const c = this.center(side);
    const r = this.temp("shield", `left:${c.x}px;top:${c.y}px;width:${c.h * 1.15}px;height:${c.h * 1.15}px`);
    this.drop(r, this.run(r, [{ opacity: 0, scale: "0.85" }, { opacity: 1, scale: "1", offset: 0.35 }, { opacity: 0, scale: "1.05" }], 500));
  }
  screenTint(color, ground = false) {
    const f = this.temp("flash", ground ? `left:0;right:0;top:96px;bottom:0;background:${color}` : `inset:0;background:${color}`);
    this.drop(f, this.run(f, [{ opacity: 0 }, { opacity: 0.45, offset: 0.35 }, { opacity: 0 }], 520));
  }
  enter(side) {
    if (this.reduced) {
      this.run(this.spr[side], [{ opacity: 0 }, { opacity: 1 }], 220);
      return;
    }
    this.run(this.spr[side], [{ scale: "0.5", opacity: 0, filter: "brightness(3)" }, { scale: "1", opacity: 1, filter: "brightness(1)" }], 280);
  }
};

// src/ui/battle.ts
function typeNote(t) {
  const why = t.cause === "ability" && t.abilityId ? koAbility(t.abilityId) : `${koMove(t.id)} 효과`;
  return `${euro(why)} ${koType(t.baseType)} → ${koType(t.type)}`;
}
__name(typeNote, "typeNote");
function shiftNote(b) {
  return `${koAbility(b.abilityId)}: 쓰면 ${koType(b.type)} 타입이 된다${b.stab ? " (자속 보정 1.5배)" : ""}`;
}
__name(shiftNote, "shiftNote");
var PRACTICE = { ...RATED.find((p) => p.id === PRACTICE_PROFILE) ?? RATED[0], label: `${RATED.find((p) => p.id === PRACTICE_PROFILE)?.label ?? "랜덤"} (연습)` };
function startBattle(team, opts = {}) {
  const o = Array.isArray(opts) ? { opp: opts } : opts;
  const gen = o.opp ? { team: o.opp, party: o.oppParty ?? null } : OpponentSource.generate();
  const c = new BattleController(team, gen.team, o.profile ?? PRACTICE, !!o.ranked);
  c.oppParty = gen.party;
  c.start();
}
__name(startBattle, "startBattle");
async function startLadder(team) {
  const st = await loadState();
  startBattle(team, { profile: matchmake(st.rating), ranked: true });
}
__name(startLadder, "startLadder");
var BattleController = class {
  constructor(team, oppTeam, profile, ranked) {
    this.team = team;
    this.oppTeam = oppTeam;
    this.profile = profile;
    this.ranked = ranked;
    this.view = new BattleView(settings.playerName, "컴퓨터");
    if (ranked) loadState().then((s) => this.ladder = s);
  }
  team;
  oppTeam;
  profile;
  ranked;
  static {
    __name(this, "BattleController");
  }
  view;
  session;
  queue = [];
  live = false;
  pumping = false;
  skip = false;
  pendingReq = null;
  ended = false;
  megaOn = false;
  logEl;
  cmdEl;
  innerEl;
  fieldEl;
  oppPartyEl;
  fx;
  sprEl = {};
  infoEl = {};
  shown = { p1: "", p2: "" };
  picks = [];
  recorded = false;
  ladder = null;
  /** 상대가 샘플 파티를 들고 나왔으면 그 정보 (끝난 뒤 공개) */
  oppParty = null;
  start() {
    this.session = new BattleSession({
      format: FORMAT,
      p1: { name: settings.playerName, team: this.team },
      p2: { name: "컴퓨터", team: this.oppTeam, agent: makeAgent(this.profile) }
    }, {
      onLine: /* @__PURE__ */ __name((line) => {
        if (this.live) {
          this.queue.push(line);
          this.pump();
        } else this.view.add(line);
      }, "onLine"),
      onRequest: /* @__PURE__ */ __name((req2) => {
        if (req2.teamPreview) {
          this.view.setOwnTeam(req2.side.pokemon);
          this.renderPreview(req2);
          return;
        }
        this.pendingReq = req2;
        this.pump();
      }, "onRequest"),
      onEnd: /* @__PURE__ */ __name(() => {
        this.ended = true;
        this.pump();
      }, "onEnd"),
      onError: /* @__PURE__ */ __name((msg) => {
        if (!msg.includes("Unavailable choice")) toast("선택 오류: " + msg);
      }, "onError")
    });
  }
  setFor(details, i) {
    const sp = details.split(",")[0];
    return this.team.find((s) => koSpecies(s.species) === koSpecies(sp)) ?? this.team[i];
  }
  renderPreview(req2) {
    clear(app);
    const order = [];
    const btn = h("button", { class: "btn primary", type: "button", disabled: true, style: "min-height:54px;font-size:17px" }, `선출 확정 (0/${FORMAT.pickSize})`);
    const rows = [];
    const refresh = /* @__PURE__ */ __name(() => {
      rows.forEach((el2, i) => {
        const k = order.indexOf(i + 1);
        el2.classList.toggle("picked", k >= 0);
        el2.querySelector(".order").textContent = k >= 0 ? String(k + 1) : "";
        el2.setAttribute("aria-pressed", String(k >= 0));
      });
      btn.disabled = order.length !== FORMAT.pickSize;
      btn.textContent = `선출 확정 (${order.length}/${FORMAT.pickSize})`;
    }, "refresh");
    req2.side.pokemon.forEach((p, i) => {
      const set = this.setFor(p.details, i);
      rows.push(monRow(set, h("span", { class: "order", "aria-hidden": "true" }), () => {
        const k = order.indexOf(i + 1);
        if (k >= 0) order.splice(k, 1);
        else if (order.length < FORMAT.pickSize) order.push(i + 1);
        refresh();
      }));
    });
    const oppGrid = h("div", { class: "opp-grid" }, this.view.state.sides.p2.team.map((m) => {
      const t = h("div", { class: "thumb" });
      spriteInto(t, m.species, "front", 1, { download: false, maxH: 64, slotSize: 56 });
      return h("div", { class: "cell" }, t, koSpecies(m.species), h("div", null, ...speciesTypes(m.species).map(typeTag)));
    }));
    const status = h("div", { class: "muted", role: "status" });
    btn.addEventListener("click", async () => {
      btn.disabled = true;
      if (settings.spriteConsent === "yes") {
        status.textContent = "스프라이트 준비 중…";
        const names = [...this.team.map((s) => s.species), ...this.view.state.sides.p2.team.map((m) => m.species)];
        for (const s of [...this.team, ...this.oppTeam]) {
          const stone = dex.items.get(s.item).megaStone;
          if (stone) names.push(...Object.values(stone));
        }
        await Promise.race([
          prefetch(names, (d, t) => status.textContent = `스프라이트 받는 중 ${d}/${t}`),
          new Promise((r) => setTimeout(r, 12e3))
        ]);
      }
      this.picks = order.map((i) => req2.side.pokemon[i - 1].details.split(",")[0]);
      this.mountBattle();
      this.session.choose(`team ${order.join("")}`);
    });
    app.appendChild(h(
      "div",
      { class: "page" },
      h("div", { class: "eyebrow" }, this.ranked ? "LADDER · TEAM PREVIEW" : "PRACTICE · TEAM PREVIEW"),
      h(
        "section",
        { class: "panel" },
        h("h2", null, "상대 파티", h("span", { class: "muted" }, `${this.profile.label}${this.ranked ? ` · R${this.profile.rating}` : ""}`)),
        this.ranked && this.ladder ? (() => {
          const pv = preview(this.ladder, this.profile.rating);
          return h("div", { class: "muted" }, `이기면 ${pv.win >= 0 ? "+" : ""}${pv.win} · 지면 ${pv.lose} · 예상 승률 ${Math.round(pv.winProb * 100)}% (K=${kFactor(this.ladder.games)})`);
        })() : null,
        oppGrid
      ),
      h("section", { class: "panel" }, h("h2", null, `선출할 ${FORMAT.pickSize}마리`, h("span", { class: "muted" }, "누른 순서 = 나오는 순서")), h("div", { class: "mons" }, rows)),
      btn,
      status,
      h("button", { class: "btn ghost", type: "button", on: { click: nav.home } }, "그만두기")
    ));
    rows[0]?.focus();
  }
  mountBattle() {
    clear(app);
    this.live = true;
    for (const s of ["p1", "p2"]) {
      this.sprEl[s] = h("div", { class: "spr" });
      this.infoEl[s] = h("div", { class: "info" });
    }
    this.sprEl.p2.style.cssText = "left:262px;top:122px";
    this.sprEl.p1.style.cssText = "left:96px;top:252px";
    this.infoEl.p2.style.cssText = "left:8px;top:8px;border-radius:4px 14px 4px 4px";
    this.infoEl.p1.style.cssText = "left:180px;bottom:8px;border-radius:14px 4px 4px 4px";
    this.fieldEl = h("div", { class: "fieldbar", role: "status", "aria-label": "필드 상태" });
    this.oppPartyEl = h("div", { class: "oppparty", role: "status" });
    this.innerEl = h(
      "div",
      { class: "inner" },
      h("div", { class: "ground" }),
      h("div", { class: "stripe", style: "top:120px" }),
      h("div", { class: "stripe", style: "top:150px" }),
      h("div", { class: "plat", style: "left:192px;top:100px;width:140px;height:40px" }),
      h("div", { class: "plat", style: "left:-24px;top:226px;width:220px;height:60px" }),
      this.sprEl.p2,
      this.sprEl.p1,
      this.infoEl.p2,
      this.infoEl.p1,
      this.oppPartyEl
    );
    this.fx = new BattleFx(this.innerEl, this.sprEl);
    const skip = /* @__PURE__ */ __name(() => {
      this.skip = true;
      this.fx.finishAll();
    }, "skip");
    const screen = h("div", { class: "screen", on: { click: skip } }, this.innerEl);
    this.logEl = h("div", { class: "log", role: "log", "aria-live": "polite", on: { click: skip } });
    this.cmdEl = h("div", { class: "cmd" });
    app.appendChild(h("div", { class: "battle" }, screen, this.fieldEl, this.logEl, this.cmdEl));
    const fit = /* @__PURE__ */ __name(() => {
      this.innerEl.style.transform = `scale(${screen.clientWidth / 360})`;
    }, "fit");
    new ResizeObserver(fit).observe(screen);
    fit();
    for (const e of this.view.state.log) this.appendLog([e]);
    this.renderScene();
    this.cmdWaiting("배틀 준비 중…");
  }
  delayFor(entries) {
    if (this.skip || settings.speed === "instant") return 0;
    const base = { slow: 900, normal: 520, fast: 260, instant: 0 }[settings.speed];
    let d = 0;
    for (const e of entries) d = Math.max(d, e.kind === "hp" ? base * 0.6 : e.kind === "turn" ? base * 0.3 : base);
    return d;
  }
  async pump() {
    if (this.pumping || !this.live) return;
    this.pumping = true;
    if (this.queue.length) this.cmdWaiting("▶ 화면을 누르면 빨리 넘긴다", true);
    while (this.queue.length) {
      const line = this.queue.shift();
      const before = this.view.state.log.length;
      if (!this.skip) this.fx.play(line);
      this.view.add(line);
      const added = this.view.state.log.slice(before);
      if (added.length) {
        this.renderScene();
        this.appendLog(added);
        const d = this.delayFor(added);
        if (d) await new Promise((r) => setTimeout(r, d));
      }
    }
    this.pumping = false;
    this.skip = false;
    this.renderScene();
    if (this.ended) {
      this.showEnd();
      return;
    }
    if (this.pendingReq) {
      const r = this.pendingReq;
      this.pendingReq = null;
      this.showCommands(r);
    }
  }
  appendLog(entries) {
    for (const e of entries) this.logEl.appendChild(h("p", { class: e.kind + (e.side === "p2" && e.kind !== "hp" ? " p2" : "") }, e.text));
    this.logEl.scrollTop = this.logEl.scrollHeight;
  }
  renderScene() {
    const st = this.view.state;
    for (const sid of ["p1", "p2"]) {
      const m = st.sides[sid].active;
      const info = this.infoEl[sid], spr = this.sprEl[sid];
      if (!m) {
        info.hidden = true;
        spr.hidden = true;
        continue;
      }
      info.hidden = false;
      spr.hidden = false;
      const p = m.maxhp ? Math.max(0, Math.round(m.hp / m.maxhp * 100)) : 0;
      const bar = h("i", { class: p <= 20 ? "low" : p <= 50 ? "mid" : "", style: `width:${p}%` });
      const prev = info.querySelector(".hpbar i");
      clear(info);
      info.append(
        h("div", { class: "nm" }, h("b", null, koSpecies(m.species)), h("span", null, `${m.gender === "M" ? "♂" : m.gender === "F" ? "♀" : ""} Lv${m.level}`)),
        h("div", { class: "hpbar" }, h("em", null, "HP"), h("div", null, bar)),
        h("div", { class: "meta" }, m.status ? h("span", { class: `st ${m.status}` }, STATUS_KO[m.status] ?? m.status) : h("span"), h("span", null, sid === "p1" ? `${m.hp}/${m.maxhp}` : `${p}%`))
      );
      this.fx.syncSubstitute(sid, !m.fainted && st.sides[sid].volatiles.includes("substitute"));
      if (prev) {
        bar.style.width = prev.style.width;
        requestAnimationFrame(() => requestAnimationFrame(() => bar.style.width = `${p}%`));
      }
      const key = m.nick + "|" + m.species;
      if (this.shown[sid] !== key) {
        this.shown[sid] = key;
        spr.classList.remove("faint");
        spriteInto(spr, m.species, sid === "p1" ? "back" : "front", sid === "p1" ? 2 : 1.5, { maxH: sid === "p1" ? 170 : 120 });
      }
      spr.classList.toggle("faint", m.fainted);
    }
    this.renderFieldBar();
    this.renderOppParty();
  }
  /** 상대 선출: 남은 수 + 이미 본 포켓몬 (못 본 칸은 ?) */
  renderOppParty() {
    const side = this.view.state.sides.p2;
    const seen = side.team.filter((m) => m.revealed);
    const total = Math.max(FORMAT.pickSize, seen.length);
    const left = total - seen.filter((m) => m.fainted).length;
    clear(this.oppPartyEl);
    const cells = seen.map((m) => {
      const name = koSpecies(m.species);
      const hp = m.fainted ? "기절" : m.maxhp ? `${Math.round(m.hp / m.maxhp * 100)}%` : "";
      return h("span", { class: "pm" + (m.fainted ? " fnt" : "") + (m === side.active ? " now" : ""), title: `${name} ${hp}` }, name);
    });
    for (let i = seen.length; i < total; i++) cells.push(h("span", { class: "pm unk" }, "?"));
    this.oppPartyEl.append(h("b", { class: "cnt" }, `${left}/${total}`), ...cells);
    this.oppPartyEl.setAttribute("aria-label", `상대 남은 포켓몬 ${left}/${total}. 본 포켓몬: ${seen.map((m) => koSpecies(m.species) + (m.fainted ? "(기절)" : "")).join(", ") || "없음"}`);
  }
  /** 필드 상태 막대 (상시 표시): 날씨·필드·트릭룸 / 우리 편 / 상대 편, 시작 후 몇 턴째인지 */
  renderFieldBar() {
    const st = this.view.state;
    const age = /* @__PURE__ */ __name((key) => {
      const t0 = st.since[key];
      if (t0 === void 0) return "";
      const n = st.turn - t0;
      return n > 0 ? `${n}턴 지남` : "방금";
    }, "age");
    const chip = /* @__PURE__ */ __name((cls, name, key) => {
      const layers = st.layers[key] > 1 ? ` ×${st.layers[key]}` : "";
      return h("span", { class: `fchip ${cls}` }, h("b", null, name + layers), age(key) ? h("i", null, age(key)) : null);
    }, "chip");
    const all = [];
    if (st.weather) all.push(chip("weather", WEATHER_KO[st.weather] ?? koEffect(st.weather), "weather"));
    for (const t of st.terrain) all.push(chip(/terrain/i.test(t) ? "terrain" : "room", koMove(t), "field:" + t));
    const mine = st.sides.p1.conditions.map((c) => chip("mine", koMove(c), "p1:" + c));
    const theirs = st.sides.p2.conditions.map((c) => chip("theirs", koMove(c), "p2:" + c));
    clear(this.fieldEl);
    if (!all.length && !mine.length && !theirs.length) {
      this.fieldEl.appendChild(h("span", { class: "fnone" }, "필드 효과 없음"));
      return;
    }
    if (all.length) this.fieldEl.appendChild(h("div", { class: "fgroup" }, h("span", { class: "flabel" }, "전체"), ...all));
    if (mine.length) this.fieldEl.appendChild(h("div", { class: "fgroup" }, h("span", { class: "flabel" }, "우리"), ...mine));
    if (theirs.length) this.fieldEl.appendChild(h("div", { class: "fgroup" }, h("span", { class: "flabel" }, "상대"), ...theirs));
  }
  cmdWaiting(text, clickable = false) {
    clear(this.cmdEl);
    this.cmdEl.appendChild(h("div", { class: "prompt muted", on: clickable ? { click: /* @__PURE__ */ __name(() => this.skip = true, "click") } : void 0 }, text));
  }
  showCommands(req2) {
    this.view.setOwnTeam(req2.side.pokemon);
    this.renderScene();
    if (req2.forceSwitch) {
      this.showSwitch(req2, true);
      return;
    }
    const act = req2.active?.[0];
    if (!act) {
      this.session.choose("default");
      return;
    }
    const me = req2.side.pokemon.find((p) => p.active);
    const foe = this.view.state.sides.p2.active?.species;
    if (!act.canMegaEvo) this.megaOn = false;
    clear(this.cmdEl);
    const name = koSpecies(me.details.split(",")[0]);
    const preview2 = this.session.previewMoveTypes(this.megaOn) ?? [];
    const moves = h("div", { class: "moves" }, act.moves.map((m, i) => {
      const ti = preview2.find((x) => x.id === toID(m.id)) ?? preview2[i];
      const type = ti?.type ?? moveType(m.id);
      const note = [ti && ti.type !== ti.baseType ? typeNote(ti) : "", ti?.becomes ? shiftNote(ti.becomes) : ""].filter(Boolean).join(" · ");
      const eff = foe ? effectiveness(m.id, foe, type, this.view.state.sides.p2.types) : null;
      const stabTag = ti?.becomes?.stab ? h("span", { class: "eff stab" }, "자속↑") : null;
      const noPP = m.pp <= 0 && m.maxpp > 0;
      const choice = `move ${i + 1}${this.megaOn ? " mega" : ""}`;
      const b = h(
        "button",
        {
          class: "mv",
          type: "button",
          disabled: !!m.disabled || noPP,
          style: `background:${TYPE_COLOR[type] ?? "#666"}`,
          "aria-label": `${koMove(m.move)}, ${koType(type)} 타입${note ? ` (${note})` : ""}, PP ${m.pp}/${m.maxpp}${eff == null ? "" : ", " + badgeFor(eff).label}`,
          on: { click: /* @__PURE__ */ __name(() => this.send(choice), "click") }
        },
        h("b", null, koMove(m.move)),
        h("small", null, `${koType(type)}${note ? "*" : ""} · ${m.maxpp ? `${m.pp}/${m.maxpp}` : "-"}`, eff == null ? null : h("span", { class: `eff ${badgeFor(eff).cls}` }, badgeFor(eff).label), stabTag)
      );
      b.style.flex = "1";
      return h(
        "div",
        { style: "position:relative;display:flex" },
        b,
        h("button", {
          class: "ib",
          type: "button",
          "aria-label": `${koMove(m.move)} 설명`,
          on: { click: /* @__PURE__ */ __name((e) => {
            e.stopPropagation();
            sheet((close) => [moveCard(m.move, `${m.pp}/${m.maxpp}`, { type, note }), h("button", { class: "btn", type: "button", on: { click: close } }, "닫기")], { label: "기술 정보" });
          }, "click") }
        }, "i")
      );
    }));
    const toggles = h(
      "div",
      { class: "toggles" },
      act.canMegaEvo ? h("button", {
        class: "toggle" + (this.megaOn ? " on" : ""),
        type: "button",
        "aria-pressed": String(this.megaOn),
        on: { click: /* @__PURE__ */ __name(() => {
          this.megaOn = !this.megaOn;
          this.showCommands(req2);
        }, "click") }
      }, "메가진화") : null,
      h("button", { class: "toggle", type: "button", disabled: !!act.trapped, on: { click: /* @__PURE__ */ __name(() => this.showSwitch(req2, false), "click") } }, act.trapped ? "교체 불가" : "교체"),
      h("button", { class: "toggle", type: "button", on: { click: /* @__PURE__ */ __name(() => this.openInfo(req2), "click") } }, "정보")
    );
    this.cmdEl.append(h("div", { class: "prompt" }, `${eun(name)} 무엇을 할까?`), moves, toggles);
  }
  showSwitch(req2, forced) {
    clear(this.cmdEl);
    const reviving = forced && req2.side.pokemon.some((p) => p.reviving);
    const list = h("div", { class: "sw-list" }, req2.side.pokemon.map((p, i) => {
      const sp = p.details.split(",")[0];
      const [hp, status] = p.condition.split(" ");
      const fnt = status === "fnt" || hp === "0";
      const [cur, max] = hp.split("/").map(Number);
      const set = this.team.find((s) => koSpecies(s.species) === koSpecies(sp));
      const off = p.active || (reviving ? !fnt : fnt);
      return h(
        "button",
        {
          class: "mon",
          type: "button",
          disabled: off,
          style: off ? "opacity:.5" : "",
          on: { click: /* @__PURE__ */ __name(() => this.send(`switch ${i + 1}`), "click") }
        },
        thumb(sp),
        h(
          "div",
          null,
          h("div", { class: "nm" }, koSpecies(sp), " ", status && status !== "fnt" ? h("span", { class: `st ${status}` }, STATUS_KO[status] ?? status) : null),
          h("div", { class: "sub" }, fnt ? "기절" : `HP ${cur}/${max}${p.active ? " · 싸우는 중" : ""}`),
          set ? h("div", { class: "sub" }, set.moves.map(koMove).join(" / ")) : null
        ),
        h("span")
      );
    }));
    this.cmdEl.append(h("div", { class: "prompt" }, reviving ? "되살릴 포켓몬을 고른다" : forced ? "다음 포켓몬을 고른다" : "교체할 포켓몬"), list);
    if (!forced) this.cmdEl.append(h("button", { class: "btn small", type: "button", on: { click: /* @__PURE__ */ __name(() => this.showCommands(req2), "click") } }, "돌아가기"));
  }
  send(choice) {
    this.megaOn = false;
    this.cmdWaiting(this.profile.level === 3 ? "상대가 생각하는 중… (최대 5초)" : "상대를 기다리는 중…");
    this.session.choose(choice);
  }
  openInfo(req2) {
    const st = this.view.state;
    const me = req2.side.pokemon.find((p) => p.active);
    const foe = st.sides.p2.active;
    let tab = "moves";
    sheet((close) => {
      const body = h("div", { style: "display:flex;flex-direction:column;gap:10px" });
      const tabs = h("div", { class: "tabs", role: "tablist" });
      const draw = /* @__PURE__ */ __name(() => {
        clear(tabs);
        clear(body);
        for (const [k, t] of [["moves", "기술"], ["ability", "특성·도구"], ["boosts", "능력 변화"]]) {
          tabs.appendChild(h("button", { type: "button", role: "tab", "aria-selected": String(tab === k), on: { click: /* @__PURE__ */ __name(() => {
            tab = k;
            draw();
          }, "click") } }, t));
        }
        const foeName = foe ? koSpecies(foe.species) : "-";
        const myName = me ? koSpecies(me.details.split(",")[0]) : "-";
        if (tab === "moves") {
          body.append(h("h2", null, `내 ${myName}`));
          req2.active?.[0]?.moves.forEach((m) => body.appendChild(moveCard(m.move, `${m.pp}/${m.maxpp}`)));
          body.append(h("h2", null, `상대 ${foeName}`, h("span", { class: "muted" }, "지금까지 쓴 기술")));
          if (foe?.moves.length) foe.moves.forEach((m) => body.appendChild(moveCard(m)));
          else body.append(h("div", { class: "muted" }, "아직 공개된 기술이 없다"));
        } else if (tab === "ability") {
          if (me) body.append(h("h2", null, `내 ${myName}`), h(
            "dl",
            { class: "kv" },
            h("dt", null, "특성"),
            h("dd", null, koAbility(me.ability ?? me.baseAbility), h("div", { class: "muted" }, koAbilityDesc(me.ability ?? me.baseAbility))),
            h("dt", null, "도구"),
            h("dd", null, me.item ? koItem(me.item) : "없음", h("div", { class: "muted" }, me.item ? koItemDesc(me.item) : ""))
          ));
          if (foe) {
            const sp = dex.species.get(foe.species);
            const possible = [...new Set(Object.values(sp.abilities))].map(koAbility).join(" / ");
            body.append(h("h2", null, `상대 ${foeName}`), h(
              "dl",
              { class: "kv" },
              h("dt", null, "타입"),
              h("dd", null, ...(st.sides.p2.types ?? speciesTypes(foe.species)).map(typeTag), st.sides.p2.types ? h("div", { class: "muted" }, `바뀐 타입 (원래 ${speciesTypes(foe.species).map(koType).join("·")})`) : null),
              h("dt", null, "특성"),
              h("dd", null, foe.ability ? koAbility(foe.ability) : `미공개 (가능: ${possible})`, foe.ability ? h("div", { class: "muted" }, koAbilityDesc(foe.ability)) : null),
              h("dt", null, "도구"),
              h("dd", null, foe.item === void 0 ? "미공개" : foe.item ? koItem(foe.item) : "없음")
            ));
          }
        } else {
          for (const sid of ["p1", "p2"]) {
            const side = st.sides[sid];
            const a = side.active;
            body.append(h("h2", null, `${sid === "p1" ? "내" : "상대"} ${a ? koSpecies(a.species) : "-"}`, a?.status ? h("span", { class: `st ${a.status}` }, STATUS_KO[a.status]) : null));
            body.append(h("div", { class: "boosts" }, ["atk", "def", "spa", "spd", "spe", "accuracy", "evasion"].map((s) => {
              const v = side.boosts[s] ?? 0;
              return h("div", { class: v > 0 ? "up" : v < 0 ? "down" : "" }, STAT_KO[s], h("b", null, v > 0 ? `+${v}` : String(v)));
            })));
            const vols = [...side.volatiles.map((v) => koMove(v)), ...side.conditions.map((c) => koMove(c))];
            if (vols.length) body.append(h("div", { class: "muted" }, "상태: " + vols.join(", ")));
          }
          body.append(h("button", { class: "btn small danger", type: "button", on: { click: /* @__PURE__ */ __name(() => {
            close();
            confirmSheet("기권할까?", "기권", () => this.session.forfeit());
          }, "click") } }, "기권"));
        }
      }, "draw");
      draw();
      return [h("div", { class: "row", style: "justify-content:space-between" }, h("h2", null, "배틀 정보"), h("button", { class: "btn small", type: "button", on: { click: close } }, "닫기")), tabs, body];
    }, { label: "배틀 정보" });
  }
  async showEnd() {
    const winner = this.view.state.winner;
    const result = winner === settings.playerName ? "W" : winner ? "L" : "T";
    clear(this.cmdEl);
    const rateEl = h("div", { class: "rate-change", role: "status" });
    this.cmdEl.append(
      h("div", { class: "result", style: `color:${result === "W" ? "var(--accent)" : result === "L" ? "var(--bad)" : "var(--muted)"}` }, result === "W" ? "승리!" : result === "L" ? "패배…" : "무승부"),
      rateEl
    );
    if (this.ranked && !this.recorded) {
      this.recorded = true;
      const { rec } = await recordGame({
        result,
        opp: { id: this.profile.id, label: this.profile.label, rating: this.profile.rating },
        myPicks: this.picks,
        oppTeam: this.view.state.sides.p2.team.map((m) => m.species),
        turns: this.view.state.turn
      });
      const before = gradeOf(rec.before), after = gradeOf(rec.after);
      rateEl.append(h("b", { class: rec.delta >= 0 ? "up" : "down" }, `${rec.delta >= 0 ? "+" : ""}${rec.delta}`), h("span", null, " ", h("span", { class: "rating-num" }, String(rec.before)), " → ", h("span", { class: "rating-num" }, String(rec.after))), " ", gradeBadge(rec.after));
      if (before.name !== after.name) rateEl.append(h("div", { class: "muted" }, rec.after > rec.before ? `${after.name}로 승급!` : `${after.name}로 강등`));
    } else if (!this.ranked) rateEl.append(h("span", { class: "muted" }, "연습 배틀이라 레이팅이 바뀌지 않는다"));
    if (this.oppParty) this.cmdEl.append(h("div", { class: "muted", style: "font-size:12px" }, `상대 파티: ${this.oppParty.short} 샘플 · ${curatedLabel(this.oppParty)}`));
    this.cmdEl.append(
      h(
        "div",
        { class: "row" },
        h("button", { class: "btn primary grow", type: "button", on: { click: /* @__PURE__ */ __name(() => this.ranked ? startLadder(this.team) : startBattle(this.team), "click") } }, this.ranked ? "다음 래더 배틀" : "새 상대"),
        h("button", { class: "btn grow", type: "button", on: { click: /* @__PURE__ */ __name(() => startBattle(this.team, { opp: this.oppTeam, oppParty: this.oppParty, profile: this.profile, ranked: this.ranked }), "click") } }, "같은 상대로 다시")
      ),
      h("button", { class: "btn ghost", type: "button", on: { click: nav.home } }, "홈으로")
    );
  }
};

// src/ui/settings.ts
function askConsent(after) {
  sheet((close) => [
    h("h2", null, "스프라이트 받기"),
    h("p", { style: "margin:0" }, "배틀 화면과 파티 짜기에 포켓몬 그림을 띄우려면 GitHub의 PokeAPI/sprites 저장소에서 이미지를 받아 이 기기에 저장한다. 기본은 필요할 때만(선출 확정 시 양측 6마리) 받는다."),
    h("p", { class: "muted", style: "margin:0" }, '받지 않으면 그림 대신 슬롯 카드로 표시한다. 인터넷 없이 쓰려면 설정에서 "전체 미리 받기"를 한 번 실행해 둔다.'),
    h(
      "div",
      { class: "row" },
      h("button", {
        class: "btn primary grow",
        type: "button",
        on: {
          click: /* @__PURE__ */ __name(async () => {
            settings.spriteConsent = "yes";
            saveSettings();
            close();
            if (!await probeNetwork()) toast("GitHub에 연결하지 못했다. 슬롯 카드로 표시하고, 설정에서 ZIP으로 불러올 수 있다", 4200);
            after?.();
          }, "click")
        }
      }, "받기"),
      h("button", { class: "btn ghost", type: "button", on: { click: /* @__PURE__ */ __name(() => {
        settings.spriteConsent = "no";
        saveSettings();
        close();
        after?.();
      }, "click") } }, "받지 않기")
    )
  ], { center: true, label: "스프라이트 받기 동의", dismissable: false });
}
__name(askConsent, "askConsent");
function openSettings(onClose) {
  sheet((close) => {
    const count = h("b", null, "…");
    storedCount().then((n) => count.textContent = String(n));
    const status = h("div", { class: "muted", role: "status" });
    const bar = h("div");
    const progress = h("div", { class: "progress", hidden: true }, bar);
    let ctl = { cancel: false };
    const startBtn = h("button", { class: "btn", type: "button" }, settings.spriteAllDone ? "전체 다시 확인" : "전체 받기 시작");
    const stopBtn = h("button", { class: "btn ghost", type: "button", hidden: true }, "멈추기");
    const consentBox = h("div");
    const drawConsent = /* @__PURE__ */ __name(() => {
      clear(consentBox);
      consentBox.appendChild(seg("GitHub에서 받기", [["yes", "GitHub에서 받기"], ["no", "받지 않기"]], settings.spriteConsent === "yes" ? "yes" : "no", (v) => {
        settings.spriteConsent = v;
        saveSettings();
      }));
    }, "drawConsent");
    drawConsent();
    startBtn.addEventListener("click", async () => {
      if (settings.spriteConsent !== "yes") {
        settings.spriteConsent = "yes";
        saveSettings();
        drawConsent();
      }
      if (!await probeNetwork()) {
        status.textContent = "GitHub에 연결하지 못했다. ZIP 불러오기를 쓸 것";
        return;
      }
      ctl = { cancel: false };
      startBtn.disabled = true;
      stopBtn.hidden = false;
      progress.hidden = false;
      await downloadAll((d, t, got) => {
        bar.style.width = `${d / t * 100}%`;
        status.textContent = `${d} / ${t} 확인 · ${got}장 확보`;
      }, ctl);
      startBtn.disabled = false;
      stopBtn.hidden = true;
      status.textContent += ctl.cancel ? " · 멈춤" : networkBlocked() ? " · 연결 끊김" : " · 완료";
      count.textContent = String(await storedCount());
    });
    stopBtn.addEventListener("click", () => {
      ctl.cancel = true;
    });
    const modeInfo = h(
      "div",
      { style: "display:flex;flex-direction:column;gap:8px" },
      h("div", { class: "muted" }, `Champions 에 나오는 모든 포켓몬(폼·메가 포함)의 앞·뒤 모습. 약 ${spriteTotal()}장, 수십 MB.`),
      h("div", { class: "row" }, startBtn, stopBtn),
      progress
    );
    const modeBox = seg("받는 시점", [["ondemand", "필요할 때만"], ["all", "전체 미리 받기"]], settings.spriteMode, (v) => {
      settings.spriteMode = v;
      saveSettings();
      modeInfo.hidden = v !== "all";
    });
    modeInfo.hidden = settings.spriteMode !== "all";
    const fileIn = h("input", { type: "file", multiple: true, accept: ".zip,.gif,.png" });
    const dirIn = h("input", { type: "file", multiple: true });
    dirIn.setAttribute("webkitdirectory", "");
    const onFiles = /* @__PURE__ */ __name(async (input) => {
      const files = Array.from(input.files ?? []);
      input.value = "";
      if (!files.length) return;
      try {
        status.textContent = `${await importFiles(files, (s) => status.textContent = s)}장 저장 완료`;
      } catch (e) {
        status.textContent = "불러오기 실패: " + e.message;
      }
      count.textContent = String(await storedCount());
    }, "onFiles");
    fileIn.addEventListener("change", () => onFiles(fileIn));
    dirIn.addEventListener("change", () => onFiles(dirIn));
    const confirmClear = h(
      "div",
      { class: "row", hidden: true },
      h("span", { class: "grow" }, "저장된 스프라이트를 모두 지울까?"),
      h("button", {
        class: "btn small danger",
        type: "button",
        on: {
          click: /* @__PURE__ */ __name(async () => {
            await clearSprites();
            settings.spriteAllDone = false;
            saveSettings();
            count.textContent = "0";
            confirmClear.hidden = true;
            status.textContent = "모두 지웠다";
          }, "click")
        }
      }, "지우기"),
      h("button", { class: "btn small", type: "button", on: { click: /* @__PURE__ */ __name(() => confirmClear.hidden = true, "click") } }, "취소")
    );
    const resetBox = h(
      "div",
      { class: "row", hidden: true },
      h("span", { class: "grow" }, "레이팅을 1000으로 되돌리고 전적을 모두 지울까? 되돌릴 수 없다."),
      h("button", { class: "btn small danger", type: "button", on: { click: /* @__PURE__ */ __name(async () => {
        await resetLadder();
        resetBox.hidden = true;
        toast("레이팅과 전적을 초기화했다");
      }, "click") } }, "초기화"),
      h("button", { class: "btn small", type: "button", on: { click: /* @__PURE__ */ __name(() => resetBox.hidden = true, "click") } }, "취소")
    );
    const nameIn = h("input", { class: "text", value: settings.playerName, maxlength: 12, "aria-label": "내 이름", on: { change: /* @__PURE__ */ __name(() => {
      settings.playerName = nameIn.value.trim() || "나";
      saveSettings();
    }, "change") } });
    return [
      h("h2", null, "설정", h("button", { class: "btn small", type: "button", on: { click: /* @__PURE__ */ __name(() => {
        close();
        onClose?.();
      }, "click") } }, "닫기")),
      h(
        "section",
        { class: "panel" },
        h("h2", null, "스프라이트", h("span", { class: "muted" }, "저장됨 ", count, "장")),
        consentBox,
        modeBox,
        modeInfo,
        h("div", { class: "muted" }, "받기가 막힌 환경이면 PC에서 받은 sprites 폴더를 ZIP으로 묶어 불러온다."),
        h(
          "div",
          { class: "row" },
          h("label", { class: "btn small filebtn" }, "ZIP·파일 불러오기", fileIn),
          h("label", { class: "btn small filebtn" }, "폴더 불러오기", dirIn),
          h("button", { class: "btn small danger", type: "button", on: { click: /* @__PURE__ */ __name(() => confirmClear.hidden = false, "click") } }, "지우기")
        ),
        confirmClear,
        status
      ),
      h(
        "section",
        { class: "panel" },
        h("h2", null, "메시지 속도"),
        seg("메시지 속도", [["slow", "느리게"], ["normal", "보통"], ["fast", "빠르게"], ["instant", "즉시"]], settings.speed, (v) => {
          settings.speed = v;
          saveSettings();
        })
      ),
      h(
        "section",
        { class: "panel" },
        h("h2", null, "배틀 연출"),
        seg("배틀 연출", [["on", "켜기"], ["reduced", "움직임 줄이기"], ["off", "끄기"]], settings.effects ?? "on", (v) => {
          settings.effects = v;
          saveSettings();
        }),
        h("div", { class: "muted", style: "font-size:12px" }, "기술·피격·능력 변화·상태이상·회복·메가진화·방어·날씨 연출. 화면을 누르면 바로 넘어간다. 메시지 속도가 즉시면 연출도 없다.")
      ),
      h("section", { class: "panel" }, h("h2", null, "내 이름"), nameIn),
      h(
        "section",
        { class: "panel" },
        h("h2", null, "래더"),
        h("div", { class: "muted" }, `상대 AI ${RATED.length}단계 (레이팅 ${RATED[0]?.rating}~${RATED[RATED.length - 1]?.rating}, AI끼리 자동 대전으로 측정). 기록은 이 기기에만 저장된다.`),
        h("div", { class: "row" }, h("button", { class: "btn small danger", type: "button", on: { click: /* @__PURE__ */ __name(() => resetBox.hidden = false, "click") } }, "레이팅·전적 초기화")),
        resetBox
      ),
      h(
        "section",
        { class: "panel" },
        h("h2", null, "버전 정보", h("span", { class: "muted" }, `v${APP_VERSION}`)),
        h(
          "dl",
          { class: "kv" },
          h("dt", null, "대전 룰"),
          h("dd", null, MANIFEST.rules.label),
          h("dt", null, "시뮬레이터"),
          h("dd", null, `Pokémon Showdown ${MANIFEST.sim.commit.slice(0, 7)}`),
          h("dt", null, "AI 레이팅 측정"),
          h("dd", null, MANIFEST.data.ratings.measuredAt ?? "-")
        ),
        ...CHANGELOG.slice(0, 3).map((c) => h("div", { class: "muted" }, `v${c.version} (${c.date}) · ${c.notes.join(" / ")}`))
      )
    ];
  }, { label: "설정" });
}
__name(openSettings, "openSettings");

// src/ui/home.ts
var randomTeam = null;
function saveRandomAndEdit(team, i) {
  return () => {
    const t = { id: newTeamId(), name: "무작위에서 만든 파티", sets: team.map((s) => ({ ...s, evs: { ...s.evs }, ivs: { ...s.ivs }, moves: [...s.moves] })), updated: 0 };
    saveTeam(t);
    settings.activeTeam = t.id;
    saveSettings();
    randomTeam = null;
    nav.editTeam(t.id, i);
  };
}
__name(saveRandomAndEdit, "saveRandomAndEdit");
function renderHome() {
  clear(app);
  const saved = settings.activeTeam ? getTeam(settings.activeTeam) : void 0;
  const usable = saved && saved.sets.length === FORMAT.teamSize && !validateTeam(saved.sets);
  let team;
  let label;
  if (usable) {
    team = saved.sets;
    label = saved.name;
  } else {
    randomTeam ??= RandomTeamSource.generate();
    team = randomTeam;
    label = "무작위 파티";
  }
  const count = listTeams().length;
  app.appendChild(h(
    "div",
    { class: "page" },
    h(
      "header",
      { class: "row", style: "justify-content:space-between;align-items:flex-end" },
      h("div", null, h("div", { class: "eyebrow" }, `POKECOM · v${APP_VERSION}`), h("h1", null, "컴까기")),
      h("button", { class: "btn small", type: "button", "aria-label": "설정", on: { click: /* @__PURE__ */ __name(() => openSettings(renderHome), "click") } }, "설정")
    ),
    ladderCard(() => startLadder(team)),
    h(
      "section",
      { class: "panel" },
      h("h2", null, "내 파티", h("span", { class: "muted" }, FORMAT.label)),
      h("div", { class: "muted", style: "margin-top:-6px" }, usable ? `${label} (파티 짜기에서 고름)` : "무작위 파티 · 파티 짜기에서 내 파티를 만들 수 있다"),
      h("div", { class: "mons" }, team.map((s, i) => monRow(s, null, () => openSetDetail(s, usable ? () => nav.editTeam(saved.id, i) : saveRandomAndEdit(team, i))))),
      h("div", { class: "muted", style: "font-size:12px" }, "포켓몬을 누르면 능력치·도구·기술·특성을 확인하고 수정 화면으로 갈 수 있다"),
      h(
        "div",
        { class: "row" },
        h("button", { class: "btn primary grow", type: "button", on: { click: nav.teams } }, count ? `파티 짜기 · 고르기 (${count})` : "파티 짜기"),
        !usable ? h("button", { class: "btn", type: "button", on: { click: /* @__PURE__ */ __name(() => {
          randomTeam = RandomTeamSource.generate();
          renderHome();
        }, "click") } }, "다시 뽑기") : null
      )
    ),
    h(
      "section",
      { class: "panel" },
      h("h2", null, "상대"),
      h("div", { class: "muted" }, `파티: ${OpponentSource.label} (Showdown Champions 랜덤 배틀 데이터 + 역할별 SP 배분) · AI: 래더는 내 레이팅에 맞는 단계(초급~상급), 연습은 랜덤 AI`),
      h("button", { class: "btn ghost", type: "button", on: { click: /* @__PURE__ */ __name(() => nav.battle(team), "click") } }, "연습 배틀 (랜덤 AI, 레이팅 없음)")
    ),
    h(
      "footer",
      { class: "credit" },
      "개인 플레이 전용. 배틀 엔진 Pokémon Showdown (Champions Reg M-C 규칙). 스프라이트 PokeAPI/sprites, 한국어 Showdown·PokeAPI. Pokémon © Nintendo · Creatures · GAME FREAK."
    )
  ));
}
__name(renderHome, "renderHome");

// src/ui/builder.ts
var clone = /* @__PURE__ */ __name((s) => ({ ...s, evs: { ...s.evs }, ivs: { ...s.ivs }, moves: [...s.moves] }), "clone");
function renderTeams() {
  clear(app);
  const list = h("div", { class: "teams" });
  const draw = /* @__PURE__ */ __name(() => {
    clear(list);
    const teams2 = listTeams();
    if (!teams2.length) list.appendChild(h("div", { class: "muted" }, "아직 저장한 파티가 없다. 새 파티를 만들어 보자."));
    for (const t of teams2) {
      const problems = t.sets.length === FORMAT.teamSize ? validateTeam(t.sets) : ["6마리 미만"];
      const active = settings.activeTeam === t.id;
      list.appendChild(h(
        "div",
        { class: "teamcard" + (active ? " active" : "") },
        h(
          "button",
          { type: "button", style: "all:unset;cursor:pointer;display:flex;flex-direction:column;gap:4px;min-width:0", on: { click: /* @__PURE__ */ __name(() => nav.editTeam(t.id), "click") } },
          h("div", { class: "nm" }, t.name || "이름 없는 파티", " ", h("span", { class: "muted" }, problems ? `· 확인 필요` : "· 사용 가능")),
          h("div", { class: "muted", style: "font-size:12px" }, "포켓몬을 누르면 상세 · 이름을 누르면 파티 편집")
        ),
        h("div", { class: "mini", style: "grid-column:1/-1" }, t.sets.map((s, i) => h("button", {
          class: "minibtn",
          type: "button",
          "aria-label": `${koSpecies(s.species)} 상세`,
          on: { click: /* @__PURE__ */ __name(() => openSetDetail(s, () => nav.editTeam(t.id, i)), "click") }
        }, thumb(s.species, 44), h("span", null, koSpecies(s.species))))),
        h(
          "div",
          { class: "row", style: "gap:6px" },
          h("button", {
            class: "btn small" + (active ? " primary" : ""),
            type: "button",
            disabled: !!problems,
            on: { click: /* @__PURE__ */ __name(() => {
              settings.activeTeam = active ? "" : t.id;
              saveSettings();
              draw();
            }, "click") }
          }, active ? "사용 중" : "사용")
        )
      ));
    }
  }, "draw");
  draw();
  app.appendChild(h(
    "div",
    { class: "page" },
    h(
      "div",
      { class: "topbar" },
      h("button", { class: "btn small back", type: "button", "aria-label": "홈으로", on: { click: nav.home } }, "←"),
      h("h2", null, "내 파티")
    ),
    h(
      "section",
      { class: "panel" },
      h("div", { class: "muted" }, `${FORMAT.label} · 6마리 · 같은 포켓몬·같은 도구 금지 · 메가진화만`),
      list,
      h(
        "div",
        { class: "row" },
        h("button", { class: "btn primary grow", type: "button", on: { click: /* @__PURE__ */ __name(() => nav.editTeam(null), "click") } }, "＋ 새 파티"),
        h("button", { class: "btn", type: "button", on: { click: /* @__PURE__ */ __name(() => importDialog(null), "click") } }, "텍스트로 가져오기")
      )
    )
  ));
}
__name(renderTeams, "renderTeams");
function importDialog(team, onDone) {
  sheet((close) => {
    const ta = h("textarea", { class: "text", placeholder: "Showdown 팀 텍스트를 붙여넣는다\n\nGarchomp @ Garchompite\nAbility: Rough Skin\nEVs: 32 Atk / 32 Spe / 2 HP\nJolly Nature\n- Earthquake\n…" });
    const msg = h("div", { class: "muted", role: "status" });
    return [
      h("h2", null, "텍스트로 가져오기", h("button", { class: "btn small", type: "button", on: { click: close } }, "닫기")),
      h("div", { class: "muted" }, "영어 이름(Showdown 형식)만 읽는다. EVs 칸은 SP로 읽는다."),
      ta,
      msg,
      h("button", {
        class: "btn primary",
        type: "button",
        on: {
          click: /* @__PURE__ */ __name(() => {
            const sets = importTeam(ta.value);
            if (!sets) {
              msg.textContent = "읽을 수 있는 포켓몬이 없다";
              return;
            }
            const trimmed = sets.slice(0, FORMAT.teamSize).map((s) => ({ ...s, level: FORMAT.level }));
            close();
            if (onDone) {
              onDone(trimmed);
              return;
            }
            const t = { id: newTeamId(), name: "가져온 파티", sets: trimmed, updated: 0 };
            saveTeam(t);
            nav.editTeam(t.id);
          }, "click")
        }
      }, "가져오기")
    ];
  }, { label: "텍스트로 가져오기" });
}
__name(importDialog, "importDialog");
function renderTeamEditor(id, openIndex) {
  const existing = id ? getTeam(id) : void 0;
  const team = existing ? { ...existing, sets: existing.sets.map(clone) } : { id: newTeamId(), name: `파티 ${listTeams().length + 1}`, sets: [], updated: 0 };
  let dirty = !existing;
  clear(app);
  const nameIn = h("input", { class: "text", value: team.name, maxlength: 20, "aria-label": "파티 이름", on: { input: /* @__PURE__ */ __name(() => {
    team.name = nameIn.value;
    dirty = true;
  }, "input") } });
  const slots = h("div", { class: "slots" });
  const status = h("div");
  const draw = /* @__PURE__ */ __name(() => {
    clear(slots);
    team.sets.forEach((s, i) => {
      slots.appendChild(monRow(s, h("span", { class: "muted", style: "font-family:var(--pixel)" }, String(i + 1)), () => editSlot(i)));
    });
    if (team.sets.length < FORMAT.teamSize) {
      slots.appendChild(h("button", {
        class: "slot-empty",
        type: "button",
        on: {
          click: /* @__PURE__ */ __name(async () => {
            const sp = await pickSpecies(team.sets.map((s) => s.species));
            if (!sp) return;
            const res = await editSet(firstSample(sp, team.sets), team.sets, team.sets.length, true);
            if (res && res !== "delete") {
              team.sets.push(res);
              dirty = true;
              draw();
            }
          }, "click")
        }
      }, `＋ 포켓몬 추가 (${team.sets.length}/${FORMAT.teamSize})`));
    }
    clear(status);
    const problems = team.sets.length ? validateTeam(team.sets) : null;
    if (team.sets.length < FORMAT.teamSize) status.appendChild(h("div", { class: "problems" }, `${FORMAT.teamSize - team.sets.length}마리 더 넣어야 배틀할 수 있다`));
    else if (problems?.length) status.appendChild(h("div", { class: "problems" }, "확인할 점", h("ul", null, problems.map((p) => h("li", null, koProblem(p))))));
    else status.appendChild(h("div", { class: "problems ok" }, "사용 가능한 파티"));
  }, "draw");
  async function editSlot(i) {
    const res = await editSet(team.sets[i], team.sets, i);
    if (res === "delete") team.sets.splice(i, 1);
    else if (res) team.sets[i] = res;
    else return;
    dirty = true;
    draw();
  }
  __name(editSlot, "editSlot");
  const save = /* @__PURE__ */ __name(() => {
    if (!team.name.trim()) team.name = "이름 없는 파티";
    if (!saveTeam(team)) {
      toast("저장하지 못했다 (저장 공간 확인)");
      return false;
    }
    dirty = false;
    toast("저장했다");
    return true;
  }, "save");
  const leave = /* @__PURE__ */ __name(() => {
    if (!dirty) {
      nav.teams();
      return;
    }
    sheet((close) => [
      h("h2", null, "저장하지 않은 변경이 있다"),
      h(
        "div",
        { class: "row" },
        h("button", { class: "btn primary grow", type: "button", on: { click: /* @__PURE__ */ __name(() => {
          close();
          if (save()) nav.teams();
        }, "click") } }, "저장하고 나가기"),
        h("button", { class: "btn danger", type: "button", on: { click: /* @__PURE__ */ __name(() => {
          close();
          nav.teams();
        }, "click") } }, "버리기")
      )
    ], { center: true, label: "저장 확인" });
  }, "leave");
  draw();
  app.appendChild(h(
    "div",
    { class: "page" },
    h(
      "div",
      { class: "topbar" },
      h("button", { class: "btn small back", type: "button", "aria-label": "파티 목록으로", on: { click: leave } }, "←"),
      h("h2", null, existing ? "파티 편집" : "새 파티"),
      h("button", { class: "btn small primary", type: "button", on: { click: save } }, "저장")
    ),
    nameIn,
    h("section", { class: "panel" }, h("h2", null, "포켓몬", h("span", { class: "muted" }, "눌러서 편집")), slots, status),
    h(
      "section",
      { class: "panel" },
      h(
        "div",
        { class: "row" },
        h("button", {
          class: "btn grow",
          type: "button",
          on: {
            click: /* @__PURE__ */ __name(() => {
              const problems = team.sets.length === FORMAT.teamSize ? validateTeam(team.sets) : ["부족"];
              if (problems) {
                toast("사용 가능한 파티가 아니다");
                return;
              }
              if (dirty) save();
              settings.activeTeam = team.id;
              saveSettings();
              nav.battle(team.sets.map(clone));
            }, "click")
          }
        }, "이 파티로 배틀"),
        h("button", { class: "btn", type: "button", on: { click: /* @__PURE__ */ __name(() => exportDialog(team.sets), "click") } }, "내보내기")
      ),
      h(
        "div",
        { class: "row" },
        h("button", { class: "btn small", type: "button", on: { click: /* @__PURE__ */ __name(() => importDialog(team, (sets) => {
          team.sets = sets;
          dirty = true;
          draw();
        }), "click") } }, "텍스트로 덮어쓰기"),
        h("button", {
          class: "btn small",
          type: "button",
          on: {
            click: /* @__PURE__ */ __name(() => confirmSheet("샘플 세트로 6마리를 무작위로 채울까?", "채우기", () => {
              team.sets = RandomTeamSource.generate();
              dirty = true;
              draw();
            }, false), "click")
          }
        }, "무작위로 채우기"),
        h("button", { class: "btn small", type: "button", on: { click: /* @__PURE__ */ __name(() => curatedDialog((p) => {
          team.sets = p.sets.map(clone);
          if (!existing && (!team.name.trim() || team.name === "새 파티")) team.name = `${p.title} (${p.short})`;
          dirty = true;
          draw();
          nameIn.value = team.name;
        }), "click") } }, "샘플 파티 불러오기"),
        existing ? h("button", {
          class: "btn small danger",
          type: "button",
          on: {
            click: /* @__PURE__ */ __name(() => confirmSheet(`'${team.name}' 파티를 지울까?`, "지우기", () => {
              deleteTeam(team.id);
              nav.teams();
            }), "click")
          }
        }, "파티 지우기") : null
      )
    )
  ));
  if (openIndex != null && team.sets[openIndex]) editSlot(openIndex);
}
__name(renderTeamEditor, "renderTeamEditor");
function curatedDialog(onPick) {
  sheet((close) => {
    const parties = curatedParties();
    return [
      h("div", { class: "row", style: "justify-content:space-between" }, h("h2", null, `샘플 파티 ${parties.length}개`), h("button", { class: "btn small", type: "button", on: { click: close } }, "닫기")),
      h("div", { class: "muted", style: "font-size:12px" }, "유튜브 “구박사의 포켓몬 챔피언스 연구소” 영상과 Game8·알테마·note 구축 기사에서 옮겼다. 누르면 지금 파티 6마리를 바꾼다."),
      h("div", { class: "curated" }, parties.map((p) => h(
        "div",
        { class: "panel", style: "padding:10px;gap:6px" },
        h(
          "div",
          { class: "row", style: "justify-content:space-between;align-items:flex-start" },
          h("div", null, h("b", null, p.title), h("div", { class: "muted", style: "font-size:12px" }, `${p.short} · ${curatedLabel(p).replace(p.title, "").trim()}`)),
          h("a", { class: "btn small ghost", href: p.url, target: "_blank", rel: "noopener" }, p.linkLabel)
        ),
        h("div", { class: "thumbs" }, p.sets.map((s) => thumb(s.species))),
        h("div", { style: "font-size:13px" }, p.sets.map((s) => koSpecies(s.species)).join(" · ")),
        h("button", { class: "btn primary small", type: "button", on: { click: /* @__PURE__ */ __name(() => confirmSheet(`'${p.title}' 파티로 6마리를 바꿀까?`, "바꾸기", () => {
          close();
          onPick(p);
          toast("샘플 파티를 불러왔다");
        }, false), "click") } }, "이 파티 쓰기")
      )))
    ];
  }, { label: "샘플 파티" });
}
__name(curatedDialog, "curatedDialog");
function exportDialog(sets) {
  sheet((close) => {
    const ta = h("textarea", { class: "text", readonly: true }, exportTeam(sets));
    return [
      h("h2", null, "텍스트로 내보내기", h("button", { class: "btn small", type: "button", on: { click: close } }, "닫기")),
      h("div", { class: "muted" }, "Showdown 형식. EVs 칸이 SP다."),
      ta,
      h("button", {
        class: "btn primary",
        type: "button",
        on: {
          click: /* @__PURE__ */ __name(async () => {
            try {
              await navigator.clipboard.writeText(ta.value);
              toast("복사했다");
            } catch {
              ta.select();
              toast("길게 눌러 복사");
            }
          }, "click")
        }
      }, "복사")
    ];
  }, { label: "텍스트로 내보내기" });
}
__name(exportDialog, "exportDialog");
function firstSample(species, others = []) {
  const used = new Set(others.map((s) => toID(s.item)).filter(Boolean));
  const samples = sampleSets(species);
  const ok = samples.find((s) => !used.has(toID(s.set.item)));
  if (ok) return clone(ok.set);
  const set = samples[0] ? clone(samples[0].set) : blankSet(species);
  if (used.has(toID(set.item))) set.item = SPARE_ITEMS.find((i) => !used.has(toID(i))) ?? "";
  return set;
}
__name(firstSample, "firstSample");
var GEN_RANGES = [0, 151, 251, 386, 493, 649, 721, 809, 905, 1025];
var genOf = /* @__PURE__ */ __name((num) => GEN_RANGES.findIndex((max, i) => i > 0 && num <= max) || 9, "genOf");
var dexRows = null;
function allPickable() {
  if (dexRows) return dexRows;
  const stones = dex.items.all().filter((i) => !i.isNonstandard && i.megaStone);
  const megaBases = /* @__PURE__ */ new Set();
  for (const st of stones) for (const b of Object.keys(st.megaStone)) megaBases.add(toID(b));
  dexRows = dex.species.all().filter(isPickable).map((s) => ({ name: s.name, ko: koSpecies(s.name), num: s.num, gen: genOf(s.num), types: s.types, mega: megaBases.has(s.id) })).sort((a, b) => a.num - b.num || a.name.localeCompare(b.name));
  const seen = /* @__PURE__ */ new Set();
  dexRows = dexRows.filter((r) => {
    const sp = dex.species.get(r.name);
    const key = [sp.baseSpecies, sp.types.join("/"), Object.values(sp.baseStats).join(","), Object.values(sp.abilities).sort().join("/")].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return dexRows;
}
__name(allPickable, "allPickable");
var lastFilter = { gen: 0, types: [], mega: false, q: "" };
function pickSpecies(taken, current) {
  return new Promise((resolve) => {
    let done = false;
    const close = sheet((closeSheet) => {
      const f = lastFilter;
      const grid = h("div", { class: "dexgrid" });
      const count = h("span", { class: "grid-count" });
      const q = h("input", { class: "text", type: "search", placeholder: "이름 검색 (초성 가능: ㄹㅈㅁ)", value: f.q, "aria-label": "포켓몬 이름 검색" });
      const takenIds = new Set(taken.map((t) => dex.species.get(t).baseSpecies).filter((b) => b !== (current && dex.species.get(current).baseSpecies)));
      const draw = /* @__PURE__ */ __name(() => {
        clear(grid);
        const rows = allPickable().filter((r) => (!f.gen || r.gen === f.gen) && f.types.every((t) => r.types.includes(t)) && (!f.mega || r.mega) && matchKo(r.ko, f.q));
        count.textContent = `${rows.length}마리`;
        for (const r of rows.slice(0, 400)) {
          const blocked = takenIds.has(dex.species.get(r.name).baseSpecies);
          const cell = h(
            "button",
            {
              class: "dexcell" + (current === r.name ? " sel" : ""),
              type: "button",
              disabled: blocked,
              "aria-label": `${r.ko} ${r.types.map(koType).join("/")}${blocked ? " (이미 파티에 있음)" : ""}`,
              on: { click: /* @__PURE__ */ __name(() => {
                done = true;
                closeSheet();
                resolve(r.name);
              }, "click") }
            },
            thumb(r.name, 44),
            h("span", { class: "nm" }, r.ko),
            h("span", { class: "tt" }, r.types.map((t) => h("i", { style: `background:${TYPE_COLOR[t]}` }))),
            r.mega ? h("span", { class: "mega" }, "MEGA") : h("span", { class: "no" }, `No.${r.num}`)
          );
          grid.appendChild(cell);
        }
      }, "draw");
      q.addEventListener("input", () => {
        f.q = q.value;
        draw();
      });
      const genChips = h("div", { class: "chips", role: "group", "aria-label": "세대" });
      const drawGen = /* @__PURE__ */ __name(() => {
        clear(genChips);
        for (let g = 0; g <= 9; g++) genChips.appendChild(h("button", { class: "chip", type: "button", "aria-pressed": String(f.gen === g), on: { click: /* @__PURE__ */ __name(() => {
          f.gen = g;
          drawGen();
          draw();
        }, "click") } }, g ? `${g}세대` : "전체"));
        genChips.appendChild(h("button", { class: "chip", type: "button", "aria-pressed": String(f.mega), on: { click: /* @__PURE__ */ __name(() => {
          f.mega = !f.mega;
          drawGen();
          draw();
        }, "click") } }, "메가 가능"));
      }, "drawGen");
      const typeChips = h("div", { class: "chips", role: "group", "aria-label": "타입" });
      const drawTypes = /* @__PURE__ */ __name(() => {
        clear(typeChips);
        for (const t of TYPES) typeChips.appendChild(h("button", {
          class: "chip type",
          type: "button",
          style: `background:${TYPE_COLOR[t]}`,
          "aria-pressed": String(f.types.includes(t)),
          on: { click: /* @__PURE__ */ __name(() => {
            f.types = f.types.includes(t) ? f.types.filter((x) => x !== t) : [...f.types, t].slice(-2);
            drawTypes();
            draw();
          }, "click") }
        }, koType(t)));
      }, "drawTypes");
      drawGen();
      drawTypes();
      draw();
      return [
        h(
          "div",
          { class: "topbar" },
          h("button", { class: "btn small back", type: "button", on: { click: closeSheet } }, "←"),
          h("h2", null, "포켓몬 고르기"),
          count
        ),
        q,
        genChips,
        typeChips,
        grid
      ];
    }, { full: true, label: "포켓몬 고르기" });
    const obs = new MutationObserver(() => {
      if (!document.querySelector('.overlay.full[aria-label="포켓몬 고르기"]')) {
        obs.disconnect();
        if (!done) resolve(null);
      }
    });
    obs.observe(document.body, { childList: true });
    void close;
  });
}
__name(pickSpecies, "pickSpecies");
function editSet(original, teamSets, index2, isNew = false) {
  return new Promise((resolve) => {
    let set = clone(original);
    let result = null;
    const label = "세트 편집";
    const body = h("div", { style: "display:flex;flex-direction:column;gap:14px" });
    const otherSets = teamSets.filter((_, i) => i !== index2);
    const draw = /* @__PURE__ */ __name(() => {
      clear(body);
      const sp = dex.species.get(set.species);
      body.appendChild(h(
        "div",
        { class: "edit-head" },
        thumb(set.species, 72),
        h(
          "div",
          { style: "display:flex;flex-direction:column;gap:6px;min-width:0" },
          h("div", { class: "row", style: "gap:6px" }, h("b", { style: "font-size:18px" }, koSpecies(set.species)), ...speciesTypes(set.species).map(typeTag)),
          h("button", {
            class: "btn small",
            type: "button",
            on: {
              click: /* @__PURE__ */ __name(async () => {
                const ns = await pickSpecies(otherSets.map((s) => s.species), set.species);
                if (ns && ns !== set.species) {
                  set = firstSample(ns, otherSets);
                  draw();
                }
              }, "click")
            }
          }, "포켓몬 바꾸기")
        )
      ));
      body.appendChild(statLine(set));
      const samples = sampleSets(set.species);
      if (samples.length) {
        body.appendChild(h(
          "section",
          { style: "display:flex;flex-direction:column;gap:6px" },
          h("h2", null, "샘플 세트", h("span", { class: "muted" }, "눌러서 적용")),
          h("div", { class: "samples" }, samples.map((s) => h(
            "button",
            {
              class: "sample",
              type: "button",
              on: { click: /* @__PURE__ */ __name(() => {
                set = clone(s.set);
                draw();
                toast(`${s.role} 세트를 적용했다`);
              }, "click") }
            },
            h("b", null, s.role),
            h("span", null, `${koItem(s.set.item) || "도구 없음"} · ${koAbility(s.set.ability)} · ${koNature(s.set.nature)}`),
            h("span", { style: "color:var(--ink)" }, s.set.moves.map(koMove).join(" / "))
          )))
        ));
      }
      body.appendChild(h(
        "div",
        { class: "field" },
        h("span", null, "도구"),
        h(
          "button",
          { class: "pick" + (set.item ? "" : " empty"), type: "button", on: { click: /* @__PURE__ */ __name(async () => {
            const it = await pickItem(set, otherSets);
            if (it !== null) {
              set.item = it;
              draw();
            }
          }, "click") } },
          h("div", null, koItem(set.item) || "없음", set.item ? h("div", null, h("small", null, koItemDesc(set.item))) : null),
          "›"
        )
      ));
      const abil = h("div", { class: "abil", role: "group", "aria-label": "특성" });
      for (const a of [...new Set(Object.values(sp.abilities))]) {
        abil.appendChild(h(
          "button",
          { type: "button", "aria-pressed": String(toID(a) === toID(set.ability)), on: { click: /* @__PURE__ */ __name(() => {
            set.ability = a;
            draw();
          }, "click") } },
          h("b", null, koAbility(a)),
          h("span", null, koAbilityDesc(a))
        ));
      }
      body.appendChild(h("div", { class: "field", style: "align-items:start" }, h("span", { style: "padding-top:10px" }, "특성"), abil));
      const ms = h("div", { class: "moveslots" });
      for (let i = 0; i < 4; i++) {
        const m = set.moves[i];
        if (m) {
          const info = moveInfo(m);
          ms.appendChild(h("button", {
            class: "moveslot",
            type: "button",
            style: `background:${TYPE_COLOR[info.type] ?? "#666"}`,
            on: { click: /* @__PURE__ */ __name(async () => {
              const nm = await pickMove(set, i);
              if (nm !== null) {
                if (nm) set.moves[i] = nm;
                else set.moves.splice(i, 1);
                draw();
              }
            }, "click") }
          }, koMove(m), h("small", null, `${CATEGORY_KO[info.category]} · ${info.power || "-"} · ${info.accuracy ?? "-"}`)));
        } else {
          ms.appendChild(h("button", {
            class: "moveslot empty",
            type: "button",
            on: { click: /* @__PURE__ */ __name(async () => {
              const nm = await pickMove(set, set.moves.length);
              if (nm) {
                set.moves.push(nm);
                draw();
              }
            }, "click") }
          }, "＋ 기술"));
          break;
        }
      }
      body.appendChild(h("section", { style: "display:flex;flex-direction:column;gap:6px" }, h("h2", null, "기술", h("span", { class: "muted" }, `${set.moves.length}/4`)), ms));
      body.appendChild(h(
        "section",
        { style: "display:flex;flex-direction:column;gap:6px" },
        h("h2", null, "성격", h("span", { class: "muted" }, `${koNature(set.nature)} · 세로 ↑ / 가로 ↓`)),
        natureTable(set.nature, (n) => {
          set.nature = n;
          draw();
        })
      ));
      body.appendChild(spEditor(set, () => draw()));
      const probs = validateSet(set);
      if (probs?.length) body.appendChild(h("div", { class: "problems" }, h("ul", null, probs.map((p) => h("li", null, koProblem(p))))));
    }, "draw");
    const closeFn = sheet((close) => {
      draw();
      return [
        h(
          "div",
          { class: "topbar" },
          h("button", { class: "btn small back", type: "button", "aria-label": "취소", on: { click: close } }, "←"),
          h("h2", null, isNew ? "포켓몬 추가" : "포켓몬 편집"),
          h("button", { class: "btn small primary", type: "button", on: { click: /* @__PURE__ */ __name(() => {
            result = set;
            close();
          }, "click") } }, "완료")
        ),
        body,
        h(
          "div",
          { class: "stickybar" },
          h("button", { class: "btn primary grow", type: "button", on: { click: /* @__PURE__ */ __name(() => {
            result = set;
            close();
          }, "click") } }, "완료"),
          !isNew ? h("button", { class: "btn danger", type: "button", on: { click: /* @__PURE__ */ __name(() => {
            result = "delete";
            close();
          }, "click") } }, "파티에서 빼기") : null
        )
      ];
    }, { full: true, label });
    const obs = new MutationObserver(() => {
      if (!document.querySelector(`.overlay.full[aria-label="${label}"]`)) {
        obs.disconnect();
        resolve(result);
      }
    });
    obs.observe(document.body, { childList: true });
    void closeFn;
  });
}
__name(editSet, "editSet");
var NAT_STATS = ["atk", "def", "spa", "spd", "spe"];
function natureTable(current, onPick) {
  const natures = dex.natures.all();
  const find = /* @__PURE__ */ __name((plus, minus) => natures.find((n) => plus === minus ? !n.plus && n.name === NEUTRAL[plus] : n.plus === plus && n.minus === minus), "find");
  const NEUTRAL = { atk: "Hardy", def: "Docile", spa: "Serious", spd: "Bashful", spe: "Quirky" };
  return h(
    "table",
    { class: "nature" },
    h("thead", null, h("tr", null, h("th", null, ""), NAT_STATS.map((s) => h("th", { class: "minus" }, `${STAT_SHORT[s]}↓`)))),
    h("tbody", null, NAT_STATS.map((plus) => h(
      "tr",
      null,
      h("th", { class: "plus" }, `${STAT_SHORT[plus]}↑`),
      NAT_STATS.map((minus) => {
        const n = find(plus, minus);
        if (!n) return h("td");
        const sel = toID(current) === n.id;
        return h("td", null, h("button", { type: "button", class: plus === minus ? "neutral" : "", "aria-pressed": String(sel), on: { click: /* @__PURE__ */ __name(() => onPick(n.name), "click") } }, koNature(n.name)));
      })
    )))
  );
}
__name(natureTable, "natureTable");
function spEditor(set, redraw) {
  const sp = dex.species.get(set.species);
  const box = h("section", { class: "sp" });
  const left = h("span", { class: "sp-left" });
  const rows = {};
  const update = /* @__PURE__ */ __name(() => {
    const total = statTotal(set);
    left.textContent = `남은 SP ${FORMAT.spTotal - total} / ${FORMAT.spTotal}`;
    left.classList.toggle("over", total > FORMAT.spTotal);
    for (const s of STATS) {
      rows[s].range.value = String(set.evs[s]);
      rows[s].v.textContent = String(set.evs[s]);
      rows[s].tot.textContent = String(calcStat(s, sp.baseStats[s], set.evs[s], set.nature));
    }
  }, "update");
  const setSP = /* @__PURE__ */ __name((s, v) => {
    const others = statTotal(set) - set.evs[s];
    set.evs[s] = Math.max(0, Math.min(FORMAT.spPerStat, v, FORMAT.spTotal - others));
    update();
  }, "setSP");
  const n = dex.natures.get(set.nature);
  box.appendChild(h("h2", null, "능력 포인트 (SP)", left));
  for (const s of STATS) {
    const range = h("input", { type: "range", min: 0, max: FORMAT.spPerStat, step: 1, "aria-label": `${STAT_SHORT[s]} SP`, on: { input: /* @__PURE__ */ __name(() => setSP(s, +range.value), "input") } });
    const v = h("span", { class: "v" });
    const tot = h("span", { class: "tot" });
    rows[s] = { range, v, tot };
    box.appendChild(h(
      "div",
      { class: "sprow" },
      h("span", { class: "nm" + (n.plus === s ? " plus" : n.minus === s ? " minus" : "") }, STAT_SHORT[s]),
      h("span", { class: "base", title: "종족값" }, String(sp.baseStats[s])),
      range,
      h("button", { type: "button", "aria-label": `${STAT_SHORT[s]} 최대`, on: { click: /* @__PURE__ */ __name(() => setSP(s, set.evs[s] >= FORMAT.spPerStat ? 0 : FORMAT.spPerStat), "click") } }, "M"),
      v,
      tot
    ));
  }
  box.appendChild(h(
    "div",
    { class: "row" },
    h("span", { class: "muted grow" }, "가운데 숫자 = 종족값 · 오른쪽 = Lv50 실수치"),
    h("button", { class: "btn small", type: "button", on: { click: /* @__PURE__ */ __name(() => {
      for (const s of STATS) set.evs[s] = 0;
      update();
    }, "click") } }, "초기화")
  ));
  update();
  void redraw;
  return box;
}
__name(spEditor, "spEditor");
var moveFilter = { type: "", cat: "all", q: "", sort: "power" };
function pickMove(set, slot) {
  return new Promise((resolve) => {
    let result = null;
    const label = "기술 고르기";
    sheet((close) => {
      const f = moveFilter;
      const pool = [...dex.species.getMovePool(dex.species.get(set.species).id)].map((id) => dex.moves.get(id)).filter((m) => m.exists && !m.isNonstandard);
      const current = set.moves[slot];
      const others = new Set(set.moves.filter((_, i) => i !== slot).map(toID));
      const tbody = h("tbody");
      const count = h("span", { class: "grid-count" });
      const q = h("input", { class: "text", type: "search", placeholder: "기술 이름 검색", value: f.q, "aria-label": "기술 검색" });
      const draw = /* @__PURE__ */ __name(() => {
        clear(tbody);
        let rows = pool.filter((m) => (!f.type || m.type === f.type) && (f.cat === "all" || m.category === f.cat) && matchKo(koMove(m.name), f.q));
        rows = rows.sort((a, b) => f.sort === "name" ? koMove(a.name).localeCompare(koMove(b.name), "ko") : f.sort === "type" ? a.type.localeCompare(b.type) || b.basePower - a.basePower : b.basePower - a.basePower || koMove(a.name).localeCompare(koMove(b.name), "ko"));
        count.textContent = `${rows.length}개`;
        for (const m of rows) {
          const dup = others.has(m.id);
          tbody.appendChild(h(
            "tr",
            {
              class: (toID(current) === m.id ? "sel" : "") + (dup ? " dim" : ""),
              tabindex: 0,
              on: {
                click: /* @__PURE__ */ __name(() => {
                  if (dup) {
                    toast("이미 넣은 기술");
                    return;
                  }
                  result = m.name;
                  close();
                }, "click"),
                keydown: /* @__PURE__ */ __name((e) => {
                  if (e.key === "Enter" && !dup) {
                    result = m.name;
                    close();
                  }
                }, "keydown")
              }
            },
            h("td", null, koMove(m.name), expandable(h("div", { class: "movedesc" }, koMoveDesc(m.name) || ""), `${koMove(m.name)} 설명 펼치기`)),
            h("td", null, typeTag(m.type)),
            h("td", null, CATEGORY_KO[m.category]),
            h("td", { class: "num" }, m.basePower || "-"),
            h("td", { class: "num" }, m.accuracy === true ? "-" : m.accuracy)
          ));
        }
      }, "draw");
      q.addEventListener("input", () => {
        f.q = q.value;
        draw();
      });
      const typeChips = h("div", { class: "chips" });
      const drawTypes = /* @__PURE__ */ __name(() => {
        clear(typeChips);
        const present = new Set(pool.map((m) => m.type));
        for (const t of TYPES.filter((t2) => present.has(t2))) typeChips.appendChild(h("button", {
          class: "chip type",
          type: "button",
          style: `background:${TYPE_COLOR[t]}`,
          "aria-pressed": String(f.type === t),
          on: { click: /* @__PURE__ */ __name(() => {
            f.type = f.type === t ? "" : t;
            drawTypes();
            draw();
          }, "click") }
        }, koType(t)));
      }, "drawTypes");
      drawTypes();
      draw();
      return [
        h(
          "div",
          { class: "topbar" },
          h("button", { class: "btn small back", type: "button", on: { click: close } }, "←"),
          h("h2", null, `기술 ${slot + 1}`),
          count,
          current ? h("button", { class: "btn small danger", type: "button", on: { click: /* @__PURE__ */ __name(() => {
            result = "";
            close();
          }, "click") } }, "비우기") : null
        ),
        q,
        seg("분류", [["all", "전체"], ["Physical", "물리"], ["Special", "특수"], ["Status", "변화"]], f.cat, (v) => {
          f.cat = v;
          draw();
        }),
        typeChips,
        seg("정렬", [["power", "위력순"], ["type", "타입순"], ["name", "이름순"]], f.sort, (v) => {
          f.sort = v;
          draw();
        }),
        h(
          "table",
          { class: "moves-t" },
          h("thead", null, h("tr", null, h("th", null, "기술"), h("th", null, "타입"), h("th", null, "분류"), h("th", { style: "text-align:right" }, "위력"), h("th", { style: "text-align:right;padding-right:8px" }, "명중"))),
          tbody
        )
      ];
    }, { full: true, label });
    const obs = new MutationObserver(() => {
      if (!document.querySelector(`.overlay.full[aria-label="${label}"]`)) {
        obs.disconnect();
        resolve(result);
      }
    });
    obs.observe(document.body, { childList: true });
  });
}
__name(pickMove, "pickMove");
var POPULAR = [
  "Focus Sash",
  "Sitrus Berry",
  "Leftovers",
  "Choice Scarf",
  "Choice Specs",
  "Choice Band",
  "Life Orb",
  "Assault Vest",
  "Rocky Helmet",
  "Lum Berry",
  "Mental Herb",
  "White Herb",
  "Quick Claw",
  "Kings Rock",
  "Expert Belt",
  "Black Sludge",
  "Shell Bell",
  "Bright Powder",
  "Scope Lens"
];
var itemTab = "popular";
function pickItem(set, otherSets) {
  return new Promise((resolve) => {
    let result = null;
    const label = "도구 고르기";
    sheet((close) => {
      const all = dex.items.all().filter((i) => !i.isNonstandard);
      const used = new Set(otherSets.map((s) => toID(s.item)).filter(Boolean));
      const species = dex.species.get(set.species);
      const grid = h("div", { class: "itemgrid" });
      const q = h("input", { class: "text", type: "search", placeholder: "도구 이름 검색", "aria-label": "도구 검색" });
      const draw = /* @__PURE__ */ __name(() => {
        clear(grid);
        let rows;
        const query = q.value;
        if (query) rows = all.filter((i) => matchKo(koItem(i.name), query));
        else if (itemTab === "mega") rows = all.filter((i) => i.megaStone && Object.keys(i.megaStone).some((b) => toID(b) === species.id));
        else if (itemTab === "berry") rows = all.filter((i) => i.isBerry);
        else if (itemTab === "popular") rows = POPULAR.map((n) => all.find((i) => i.name.replace(/'/g, "") === n.replace(/'/g, ""))).filter(Boolean);
        else rows = all.filter((i) => !i.megaStone).sort((a, b) => koItem(a.name).localeCompare(koItem(b.name), "ko"));
        if (itemTab === "mega" && !query && !rows.length) grid.appendChild(h("div", { class: "muted", style: "grid-column:1/-1" }, "이 포켓몬은 메가진화하지 않는다"));
        for (const i of rows) {
          const dup = used.has(i.id);
          const wrongMega = i.megaStone && !Object.keys(i.megaStone).some((b) => toID(b) === species.id);
          grid.appendChild(h("button", {
            class: "itemcell" + (toID(set.item) === i.id ? " sel" : "") + (i.megaStone ? " mega" : ""),
            type: "button",
            disabled: dup || wrongMega,
            style: dup || wrongMega ? "opacity:.35" : "",
            title: koItemDesc(i.name),
            on: { click: /* @__PURE__ */ __name(() => {
              result = i.name;
              close();
            }, "click") }
          }, koItem(i.name)));
        }
      }, "draw");
      q.addEventListener("input", draw);
      draw();
      return [
        h(
          "div",
          { class: "topbar" },
          h("button", { class: "btn small back", type: "button", on: { click: close } }, "←"),
          h("h2", null, "도구"),
          set.item ? h("button", { class: "btn small danger", type: "button", on: { click: /* @__PURE__ */ __name(() => {
            result = "";
            close();
          }, "click") } }, "빼기") : null
        ),
        q,
        seg("분류", [["popular", "자주 씀"], ["mega", "메가스톤"], ["berry", "나무열매"], ["all", "전체"]], itemTab, (v) => {
          itemTab = v;
          q.value = "";
          draw();
        }),
        h("div", { class: "muted" }, "흐린 칸: 다른 포켓몬이 이미 든 도구"),
        grid
      ];
    }, { full: true, label });
    const obs = new MutationObserver(() => {
      if (!document.querySelector(`.overlay.full[aria-label="${label}"]`)) {
        obs.disconnect();
        resolve(result);
      }
    });
    obs.observe(document.body, { childList: true });
  });
}
__name(pickItem, "pickItem");

// src/main.ts
nav.home = renderHome;
nav.teams = renderTeams;
nav.editTeam = renderTeamEditor;
nav.battle = startBattle;
renderHome();
if (settings.spriteConsent === "unknown") askConsent(renderHome);
else if (settings.spriteConsent === "yes") probeNetwork();
if ("serviceWorker" in navigator && true) {
  addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {
  }));
}
