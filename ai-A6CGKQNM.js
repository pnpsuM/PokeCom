import {
  $s,
  H,
  J,
  Ut,
  X,
  Xe,
  Zt,
  ae,
  oe,
  w
} from "./sim-7BOKNW7A.js";
import {
  MANIFEST,
  simFormatId
} from "./config-MVQNM3DK.js";
import {
  __name
} from "./app-J5SB6L2L.js";

// src/core/agents.ts
function legalChoices(req) {
  const team = req.side.pokemon;
  if (req.teamPreview) return [];
  if (req.forceSwitch && team.some((p) => p.reviving)) {
    const fainted = team.map((p, i) => ({ p, i: i + 1 })).filter(({ p }) => !p.active && p.condition.endsWith(" fnt")).map(({ i }) => `switch ${i}`);
    return fainted.length ? fainted : ["pass"];
  }
  const switches = team.map((p, i) => ({ p, i: i + 1 })).filter(({ p }) => !p.active && !p.condition.endsWith(" fnt")).map(({ i }) => `switch ${i}`);
  if (req.forceSwitch) return switches.length ? switches : ["pass"];
  const active = req.active?.[0];
  if (!active) return ["default"];
  const moves = [];
  active.moves.forEach((m, i) => {
    if (m.disabled || m.pp <= 0 && m.maxpp > 0) return;
    moves.push(`move ${i + 1}`);
    if (active.canMegaEvo) moves.push(`move ${i + 1} mega`);
  });
  if (!moves.length) moves.push("move 1");
  return active.trapped ? moves : [...moves, ...switches];
}
__name(legalChoices, "legalChoices");
var RandomAgent = {
  id: "random",
  label: "랜덤 AI",
  choose(req, ctx) {
    const rng = ctx.rng;
    if (req.teamPreview) {
      const n = req.side.pokemon.length;
      const order2 = Array.from({ length: n }, (_, i) => i + 1);
      for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [order2[i], order2[j]] = [order2[j], order2[i]];
      }
      return `team ${order2.slice(0, ctx.format.pickSize).join("")}`;
    }
    const all = legalChoices(req);
    const moves = all.filter((c) => c.startsWith("move"));
    const switches = all.filter((c) => c.startsWith("switch"));
    const megas = moves.filter((c) => c.endsWith("mega"));
    const pool = moves.length && (!switches.length || rng() < 0.85) ? megas.length ? megas : moves : switches.length ? switches : ["default"];
    return pool[Math.floor(rng() * pool.length)];
  }
};

// src/sim.ts
var Dex = H;
var toID = w;
var BattleStream = Xe;
var getPlayerStreams = $s;
var Teams = J;
var TeamValidator = Ut;
var PRNG = X;
var RandomChampionsTeams = Zt;
var Battle = oe;
var State = ae;

// src/core/format.ts
function toFormat(r) {
  return {
    id: simFormatId(r),
    key: r.key,
    label: r.label,
    gen: r.gen,
    gameType: r.gameType,
    teamSize: r.teamSize,
    pickSize: r.pickSize,
    level: r.level,
    spPerStat: r.spPerStat,
    spTotal: r.spTotal,
    gimmicks: r.gimmicks
  };
}
__name(toFormat, "toFormat");
var FORMAT = toFormat(MANIFEST.rules);
var dex = Dex.forFormat(Dex.formats.get(FORMAT.id, true));
var STATS = ["hp", "atk", "def", "spa", "spd", "spe"];
function calcStat(stat, base, sp, nature) {
  if (stat === "hp") return base === 1 ? 1 : base + sp + 75;
  let v = base + sp + 20;
  const n = dex.natures.get(nature);
  if (n.plus === stat) v = Math.floor(v * 110 / 100);
  else if (n.minus === stat) v = Math.floor(v * 90 / 100);
  return v;
}
__name(calcStat, "calcStat");
function isPickable(s) {
  return s.exists && !s.isNonstandard && s.tier !== "Illegal" && !s.battleOnly && !s.isMega && !s.cosmeticFormes?.includes?.(s.name);
}
__name(isPickable, "isPickable");

// src/core/ko.ts
var KO = MANIFEST.data.ko;
var K = KO;
var koSpecies = /* @__PURE__ */ __name((s) => K.species[toID(s)] ?? s, "koSpecies");
var koMove = /* @__PURE__ */ __name((s) => {
  const id = toID(s);
  return K.moves[id] ?? s;
}, "koMove");
var koAbility = /* @__PURE__ */ __name((s) => K.abilities[toID(s)] ?? s, "koAbility");
var koItem = /* @__PURE__ */ __name((s) => s ? K.items[toID(s)] ?? s : "", "koItem");
var koType = /* @__PURE__ */ __name((s) => K.types[toID(s)] ?? s, "koType");
var koNature = /* @__PURE__ */ __name((s) => K.natures[toID(s)] ?? s, "koNature");
var koMoveDesc = /* @__PURE__ */ __name((s) => K.moveDesc[toID(s)] ?? "", "koMoveDesc");
var koAbilityDesc = /* @__PURE__ */ __name((s) => K.abilityDesc[toID(s)] ?? "", "koAbilityDesc");
var koItemDesc = /* @__PURE__ */ __name((s) => {
  const id = toID(s);
  if (K.itemDesc[id]) return K.itemDesc[id];
  const it = Dex.items.get(s);
  if (it?.megaStone) {
    const base = Object.keys(it.megaStone)[0];
    return `${eul(koSpecies(base))} 메가진화시키는 메가스톤. 지닌 채 배틀에 나가면 한 번 메가진화할 수 있다.`;
  }
  return ITEM_DESC_EXTRA[id] ?? "";
}, "koItemDesc");
var ITEM_DESC_EXTRA = {
  fairyfeather: "지니게 하면 페어리 타입 기술의 위력이 1.2배가 된다."
};
var STAT_KO = {
  hp: "HP",
  atk: "공격",
  def: "방어",
  spa: "특수공격",
  spd: "특수방어",
  spe: "스피드",
  accuracy: "명중률",
  evasion: "회피율"
};
var STAT_SHORT = { hp: "HP", atk: "공격", def: "방어", spa: "특공", spd: "특방", spe: "스피드" };
var STATUS_KO = { brn: "화상", par: "마비", slp: "잠듦", frz: "얼음", psn: "독", tox: "맹독" };
var CATEGORY_KO = { Physical: "물리", Special: "특수", Status: "변화" };
function josa(word, withFinal, withoutFinal) {
  const w2 = word.replace(/[\s)\]」』]+$/, "");
  const code = w2.charCodeAt(w2.length - 1);
  if (code >= 44032 && code <= 55203) {
    const jong = (code - 44032) % 28;
    if (withFinal === "으로" && jong === 8) return word + withoutFinal;
    return word + (jong ? withFinal : withoutFinal);
  }
  return /[013678LMNR]$/i.test(w2) ? word + withFinal : word + withoutFinal;
}
__name(josa, "josa");
var eun = /* @__PURE__ */ __name((w2) => josa(w2, "은", "는"), "eun");
var iga = /* @__PURE__ */ __name((w2) => josa(w2, "이", "가"), "iga");
var eul = /* @__PURE__ */ __name((w2) => josa(w2, "을", "를"), "eul");
var euro = /* @__PURE__ */ __name((w2) => josa(w2, "으로", "로"), "euro");
var EFFECT_KO = {
  confusion: "혼란",
  substitute: "대타출동",
  sandstorm: "모래바람",
  hail: "싸라기눈",
  snowscape: "설경",
  snow: "설경",
  raindance: "비",
  sunnyday: "쾌청",
  desolateland: "끝의대지",
  primordialsea: "시작의바다",
  deltastream: "델타스트림",
  brn: "화상",
  psn: "독",
  tox: "맹독",
  par: "마비",
  slp: "잠듦",
  frz: "얼음",
  recoil: "반동",
  trapped: "도망칠 수 없음",
  perishsong: "멸망의노래",
  leechseed: "씨뿌리기",
  curse: "저주",
  typechange: "타입 변화",
  stockpile: "비축",
  focusenergy: "기합",
  mustrecharge: "반동",
  partiallytrapped: "조이기",
  lockedmove: "폭주",
  futuresight: "미래예지",
  saltcure: "소금절이",
  protosynthesis: "고대활성",
  quarkdrive: "쿼크차지",
  healblock: "회복봉인",
  supremeoverlord: "총대장"
};
function koEffect(e) {
  if (!e) return "";
  const m = e.match(/^(move|ability|item|pokemon):\s*(.*)$/);
  if (m) {
    const [, kind, name] = m;
    return kind === "move" ? koMove(name) : kind === "ability" ? koAbility(name) : kind === "item" ? koItem(name) : koSpecies(name);
  }
  const id = toID(e);
  return EFFECT_KO[id] ?? K.moves[id] ?? K.abilities[id] ?? K.items[id] ?? e;
}
__name(koEffect, "koEffect");
var CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";
function choseong(s) {
  let out = "";
  for (const ch of s) {
    const c = ch.charCodeAt(0);
    out += c >= 44032 && c <= 55203 ? CHO[Math.floor((c - 44032) / 588)] : ch;
  }
  return out;
}
__name(choseong, "choseong");
function matchKo(name, query) {
  const q = query.replace(/\s+/g, "").toLowerCase();
  if (!q) return true;
  const n = name.replace(/\s+/g, "").toLowerCase();
  if (n.includes(q)) return true;
  return /^[ㄱ-ㅎ]+$/.test(q) && choseong(n).includes(q);
}
__name(matchKo, "matchKo");

// src/core/store.ts
var SKEY = MANIFEST.storage.settings;
var DEFAULTS = { spriteConsent: "unknown", spriteMode: "ondemand", spriteAllDone: false, speed: "normal", effects: "on", playerName: "나", activeTeam: "", damageHint: false };
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

// src/core/usage.ts
function usageFile() {
  const files = MANIFEST.data.usage;
  return files.find((f) => f.format === FORMAT.id.split("@@@")[0]) ?? files[0] ?? null;
}
__name(usageFile, "usageFile");
var hasUsage = /* @__PURE__ */ __name(() => !!usageFile()?.species.length, "hasUsage");
var usageLabel = /* @__PURE__ */ __name(() => {
  const u = usageFile();
  return u ? `${u.month} ${u.cutoff}+ 통계` : "";
}, "usageLabel");
function pick(list, rng, skip) {
  const ok = list.filter(([x, w2]) => w2 > 0 && !skip?.(x));
  const total = ok.reduce((a, [, w2]) => a + w2, 0);
  if (!total) return null;
  let r = rng() * total;
  for (const [x, w2] of ok) {
    r -= w2;
    if (r <= 0) return x;
  }
  return ok[ok.length - 1][0];
}
__name(pick, "pick");
var validator = null;
function canLearn(move, species) {
  validator ??= TeamValidator.get(FORMAT.id);
  try {
    return !validator.checkCanLearn(dex.moves.get(move), dex.species.get(species));
  } catch {
    return true;
  }
}
__name(canLearn, "canLearn");
var entryOf = /* @__PURE__ */ __name((name) => usageFile()?.species.find((s) => toID(s.name) === toID(name)) ?? null, "entryOf");
function usageSet(e, rng, usedItems = /* @__PURE__ */ new Set(), allowMega = true) {
  const mega = dex.species.get(e.name);
  if (!mega.exists) return null;
  const sp = mega.isMega ? dex.species.get(mega.battleOnly || mega.baseSpecies) : mega;
  if (mega.isMega && !allowMega) return null;
  const item = pick(e.items, rng, (it) => usedItems.has(toID(it)) || !allowMega && !!dex.items.get(it).megaStone || !dex.items.get(it).exists) ?? "";
  const baseAbilities = mega.isMega ? entryOf(sp.name)?.abilities ?? [] : e.abilities;
  const ability = pick(baseAbilities, rng, (a) => !Object.values(sp.abilities).map((x) => toID(x)).includes(toID(a))) ?? sp.abilities["0"];
  const spread = pick(e.spreads.map(([n, s, w2]) => [[n, s], w2]), rng);
  const moves = [];
  for (let i = 0; i < 4; i++) {
    const m = pick(e.moves, rng, (x) => moves.some((y) => toID(y) === toID(x)) || !dex.moves.get(x).exists || toID(x) === "nothing" || !canLearn(x, sp.name));
    if (!m) break;
    moves.push(dex.moves.get(m).name);
  }
  const evs = Object.fromEntries(STATS.map((k, i) => [k, Math.min(FORMAT.spPerStat, spread?.[1][i] ?? 0)]));
  return {
    name: "",
    species: sp.name,
    item: item ? dex.items.get(item).name : "",
    ability: dex.abilities.get(ability).name,
    nature: spread?.[0] || "Serious",
    evs,
    ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
    moves,
    level: FORMAT.level,
    gender: ""
  };
}
__name(usageSet, "usageSet");
function usageTeam(rng = Math.random) {
  const u = usageFile();
  if (!u?.species.length) return null;
  const pool = u.species.filter((s) => dex.species.get(s.name).exists);
  const team = [];
  const picked = [];
  const bases = /* @__PURE__ */ new Set();
  const items = /* @__PURE__ */ new Set();
  let megas = 0;
  for (let guard = 0; team.length < FORMAT.teamSize && guard < 60; guard++) {
    const weights = pool.map((s) => {
      if (bases.has(dex.species.get(s.name).baseSpecies)) return [s, 0];
      if (megas >= 2 && dex.species.get(s.name).isMega) return [s, 0];
      let w2 = s.usage;
      for (const t of picked) {
        const tm = t.teammates.find(([n]) => toID(n) === toID(s.name));
        if (tm) w2 *= 1 + Math.max(0, tm[1]) * 4;
      }
      return [s, w2];
    });
    const e = pick(weights, rng);
    if (!e) break;
    const set = usageSet(e, rng, items, megas < 2);
    if (!set || set.moves.length < 1) {
      bases.add(dex.species.get(e.name).baseSpecies);
      continue;
    }
    team.push(set);
    picked.push(e);
    bases.add(dex.species.get(set.species).baseSpecies);
    if (set.item) items.add(toID(set.item));
    if (dex.items.get(set.item).megaStone) megas++;
  }
  return team.length === FORMAT.teamSize ? team : null;
}
__name(usageTeam, "usageTeam");
function usageSetsFor(speciesName, n = 2) {
  const sp = dex.species.get(speciesName);
  const base = sp.isMega ? dex.species.get(sp.battleOnly || sp.baseSpecies).name : sp.name;
  const entries = (usageFile()?.species ?? []).filter((x) => {
    const d = dex.species.get(x.name);
    return d.exists && (d.name === base || d.isMega && (d.battleOnly || d.baseSpecies) === base);
  }).sort((a, b) => b.usage - a.usage);
  if (!entries.length) return [];
  if (entries.length > 1) {
    const out = [];
    for (const x of entries) for (const s of usageSetsFrom(x, n)) if (out.length < n + 1) out.push(s);
    return out;
  }
  return usageSetsFrom(entries[0], n);
}
__name(usageSetsFor, "usageSetsFor");
function usageSetsFrom(e, n) {
  const top = /* @__PURE__ */ __name((list, k = 1) => [...list].sort((a, b) => b[1] - a[1]).slice(0, k), "top");
  const out = [];
  const first = usageSet({ ...e, items: top(e.items), abilities: top(e.abilities), spreads: [...e.spreads].sort((a, b) => b[2] - a[2]).slice(0, 1), moves: top(e.moves, 4) }, () => 0.5);
  if (first) out.push(first);
  let seed = 1;
  const rng = /* @__PURE__ */ __name(() => {
    seed = seed * 16807 % 2147483647;
    return seed / 2147483647;
  }, "rng");
  for (let i = 0; out.length < n && i < n * 4; i++) {
    const s = usageSet(e, rng);
    if (s && !out.some((o) => o.item === s.item && [...o.moves].sort().join() === [...s.moves].sort().join())) out.push(s);
  }
  return out;
}
__name(usageSetsFrom, "usageSetsFrom");

// src/core/teams.ts
var fmt = Dex.formats.get(FORMAT.id);
var gen = null;
function generator() {
  if (!gen) gen = new RandomChampionsTeams(fmt, PRNG.generateSeed());
  return gen;
}
__name(generator, "generator");
var validator2 = null;
function getValidator() {
  if (!validator2) validator2 = TeamValidator.get(FORMAT.id);
  return validator2;
}
__name(getValidator, "getValidator");
var ROLE_KO = {
  "Bulky Attacker": "내구형 어태커",
  "Bulky Support": "내구형 서포터",
  "Bulky Setup": "내구형 랭크업",
  "Fast Attacker": "고속 어태커",
  "Fast Support": "고속 서포터",
  "Fast Bulky Setup": "고속 내구 랭크업",
  "Setup Sweeper": "랭크업 스위퍼",
  Wallbreaker: "월브레이커",
  "AV Pivot": "돌격조끼 피벗",
  "Tera Blast user": "테라버스트",
  Doubles: "더블",
  "Choice Item user": "구애 도구",
  Offensive: "공격형",
  Support: "서포터"
};
var emptyStats = /* @__PURE__ */ __name((v) => ({ hp: v, atk: v, def: v, spa: v, spd: v, spe: v }), "emptyStats");
function normalize(set) {
  return {
    name: "",
    species: set.species,
    item: set.item ?? "",
    ability: set.ability ?? "",
    nature: set.nature || "Serious",
    evs: { ...emptyStats(0), ...set.evs ?? {} },
    ivs: emptyStats(31),
    moves: [...set.moves ?? []].map((m) => dex.moves.get(m).name || m),
    level: FORMAT.level,
    gender: set.gender ?? ""
  };
}
__name(normalize, "normalize");
function optimizeSpread(set, role = "") {
  const sp = dex.species.get(set.species);
  const bs = sp.baseStats;
  const moves = set.moves.map((m) => dex.moves.get(m));
  const phys = moves.filter((m) => m.category === "Physical" && m.id !== "bodypress" && m.id !== "foulplay").length;
  const spec = moves.filter((m) => m.category === "Special").length;
  const bodyPress = moves.some((m) => m.id === "bodypress");
  const trickRoom = moves.some((m) => m.id === "trickroom" || m.id === "gyroball");
  const attacks = phys + spec + (bodyPress ? 1 : 0);
  const main = phys >= spec ? "atk" : "spa";
  const other = main === "atk" ? "spa" : "atk";
  const bulky = /Bulky|Pivot/.test(role) || /Support/.test(role) && !/Fast/.test(role) || attacks <= 1;
  const evs = emptyStats(0);
  let nature = "Serious";
  const NAT = {
    "atk+spa-": "Adamant",
    "spa+atk-": "Modest",
    "spe+spa-": "Jolly",
    "spe+atk-": "Timid",
    "atk+spe-": "Brave",
    "spa+spe-": "Quiet",
    "def+atk-": "Bold",
    "spd+atk-": "Calm",
    "def+spa-": "Impish",
    "spd+spa-": "Careful",
    "atk+def-": "Lonely",
    "spa+def-": "Mild",
    "spe+def-": "Hasty",
    "def+spe-": "Relaxed",
    "spd+spe-": "Sassy"
  };
  const nat = /* @__PURE__ */ __name((plus, minus) => NAT[`${plus}+${minus}-`] ?? "Serious", "nat");
  if (trickRoom) {
    evs.hp = 32;
    evs[main] = 32;
    evs.def = 2;
    nature = nat(main, "spe");
  } else if (bulky && attacks <= 2) {
    const defStat = bodyPress || bs.def <= bs.spd ? "def" : "spd";
    evs.hp = 32;
    evs[defStat] = 32;
    evs.spe = 2;
    const minus = phys && !spec ? "spa" : spec && !phys ? "atk" : "atk";
    nature = bodyPress ? "Bold" : nat(defStat, minus === other ? minus : "atk");
  } else if (bulky) {
    evs.hp = 32;
    evs[main] = 32;
    evs.spe = 2;
    nature = phys && spec ? nat(main, "def") : nat(main, other);
  } else {
    evs[main] = 32;
    evs.spe = 32;
    evs.hp = 2;
    const fast = bs.spe >= 80;
    if (phys && spec) nature = fast ? "Hasty" : nat(main, "def");
    else nature = fast ? nat("spe", other) : nat(main, other);
  }
  return { ...set, evs, nature };
}
__name(optimizeSpread, "optimizeSpread");
var SPARE_ITEMS = [
  "Sitrus Berry",
  "Leftovers",
  "Focus Sash",
  "Lum Berry",
  "Choice Scarf",
  "Life Orb",
  "Choice Specs",
  "Choice Band",
  "Assault Vest",
  "Rocky Helmet",
  "Shell Bell",
  "Quick Claw",
  "Kings Rock",
  "Bright Powder",
  "White Herb",
  "Mental Herb",
  "Expert Belt",
  "Black Sludge"
].filter((i) => dex.items.get(i).exists && !dex.items.get(i).isNonstandard);
function fixItemClause(team) {
  const seen = /* @__PURE__ */ new Set();
  const spare = SPARE_ITEMS;
  for (const s of team) {
    const id = toID(s.item);
    if (!id) continue;
    if (!seen.has(id)) {
      seen.add(id);
      continue;
    }
    const alt = spare.find((i) => !seen.has(toID(i)));
    if (!alt) return false;
    s.item = alt;
    seen.add(toID(alt));
  }
  return true;
}
__name(fixItemClause, "fixItemClause");
var RandomTeamSource = {
  id: "champions-random",
  label: "Champions 랜덤 세트",
  generate(format = FORMAT) {
    for (let tries = 0; tries < 30; tries++) {
      const raw = generator().randomTeam();
      const team = raw.slice(0, format.teamSize).map((s) => optimizeSpread(normalize(s), s.role));
      if (!fixItemClause(team)) continue;
      if (!validateTeam(team)) return team;
    }
    throw new Error("유효한 파티를 만들지 못했다");
  }
};
var curatedCache = null;
function curatedParties() {
  curatedCache ??= MANIFEST.data.curated.flatMap((f) => f.parties.map((p) => ({
    id: p.id,
    title: p.title,
    season: p.season,
    rank: p.rank,
    url: p.url,
    source: f.source,
    short: f.short ?? f.source,
    linkLabel: f.linkLabel ?? "출처",
    sets: p.sets.map((s) => normalize({ ...s, evs: Object.fromEntries(STATS.map((k, i) => [k, s.sp[i] ?? 0])) }))
  }))).filter((p) => !validateTeam(p.sets));
  return curatedCache;
}
__name(curatedParties, "curatedParties");
var curatedLabel = /* @__PURE__ */ __name((p) => `${p.season}${p.rank ? " " + p.rank : ""} ${p.title}`, "curatedLabel");
var cloneSet = /* @__PURE__ */ __name((s) => ({ ...s, evs: { ...s.evs }, ivs: { ...s.ivs }, moves: [...s.moves] }), "cloneSet");
var CuratedTeamSource = {
  id: "curated",
  label: "샘플 파티",
  pick(id) {
    const all = curatedParties();
    const list = id ? all.filter((p) => p.id === id) : all;
    return list.length ? list[Math.floor(Math.random() * list.length)] : null;
  },
  generate() {
    const p = this.pick();
    return p ? p.sets.map(cloneSet) : RandomTeamSource.generate();
  }
};
function customOpponents() {
  return listTeams().filter((t) => t.opponent && t.sets.length >= FORMAT.teamSize && !validateTeam(t.sets));
}
__name(customOpponents, "customOpponents");
var OpponentSource = {
  get label() {
    const m = MANIFEST.data.opponentMix;
    return `${hasUsage() ? usageLabel() : "랜덤 세트"} ${Math.round(m.usage * 100)}% · 샘플 파티 ${Math.round(m.curated * 100)}% · 내가 추가한 상대 ${Math.round(m.custom * 100)}%`;
  },
  generate() {
    const m = MANIFEST.data.opponentMix;
    const customs = customOpponents();
    const w2 = [
      ["usage", m.usage],
      ["curated", curatedParties().length ? m.curated : 0],
      ["custom", customs.length ? m.custom : 0]
    ];
    const total = w2.reduce((a, [, x]) => a + x, 0) || 1;
    let r = Math.random() * total, kind = "usage";
    for (const [k, x] of w2) {
      r -= x;
      if (r <= 0) {
        kind = k;
        break;
      }
    }
    if (kind === "curated") {
      const p = CuratedTeamSource.pick();
      return { team: p.sets.map(cloneSet), party: p, kind };
    }
    if (kind === "custom") {
      const t = customs[Math.floor(Math.random() * customs.length)];
      return { team: t.sets.map(cloneSet), party: null, kind, customName: t.name };
    }
    for (let i = 0; i < 20 && hasUsage(); i++) {
      const team = usageTeam();
      if (team && fixItemClause(team) && !validateTeam(team)) return { team, party: null, kind: "usage" };
    }
    return { team: RandomTeamSource.generate(), party: null, kind: "random" };
  }
};
function sampleSets(speciesName, max = 4) {
  const g = generator();
  const species = dex.species.get(speciesName);
  const curated = [];
  const cseen = /* @__PURE__ */ new Set();
  for (const p of curatedParties()) for (const s of p.sets) {
    if (dex.species.get(s.species).id !== species.id) continue;
    const sig = [...s.moves].sort().join(",") + "|" + s.item + "|" + s.nature + "|" + STATS.map((k) => s.evs[k]).join("/");
    if (cseen.has(sig)) continue;
    cseen.add(sig);
    curated.push({ role: `${p.short} · ${curatedLabel(p)}`, set: cloneSet(s) });
  }
  const keys = [species.id, ...(species.otherFormes ?? []).map((f) => toID(f)).filter((id) => /mega/.test(id))];
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  for (const key of keys) {
    if (!g.randomSets[key]) continue;
    const target = dex.species.get(key);
    for (let i = 0; i < 16 && out.length < max; i++) {
      let raw;
      try {
        raw = g.randomSet(target, {}, false, false);
      } catch {
        continue;
      }
      const role = raw.role ?? "";
      const set = optimizeSpread(normalize(raw), role);
      const sig = role + "|" + [...set.moves].sort().join(",") + "|" + set.item;
      if (seen.has(sig)) continue;
      seen.add(sig);
      if (validateSet(set)) continue;
      out.push({ role: (target.isMega ? "메가 · " : "") + (ROLE_KO[role] ?? role), set });
    }
  }
  const usage = usageSetsFor(species.name, 2).filter((s) => !validateSet(s)).map((set) => ({ role: `${usageLabel()} · 자주 쓰는 세트`, set }));
  return [...curated, ...usage, ...out];
}
__name(sampleSets, "sampleSets");
function blankSet(speciesName) {
  const s = dex.species.get(speciesName);
  return {
    name: "",
    species: s.name,
    item: "",
    ability: s.abilities["0"],
    nature: "Serious",
    evs: emptyStats(0),
    ivs: emptyStats(31),
    moves: [],
    level: FORMAT.level,
    gender: ""
  };
}
__name(blankSet, "blankSet");
var MSG = [
  [/You are limited to 1 of each item by Item Clause/, () => "같은 도구는 한 개만 들 수 있다 (도구 클로즈)"],
  [/^\(?You have more than 1 (.+?)\)?$/, (m) => `${koItem(m[1])} 중복`],
  [/You are limited to one of each Pokémon by Species Clause/, () => "같은 포켓몬은 한 마리만 넣을 수 있다"],
  [/^\(?You have more than one (.+?)\)?$/, (m) => `${koSpecies(m[1])} 중복`],
  [/^(.+?) can't learn (.+?)\.?$/, (m) => `${koSpecies(m[1])}은(는) ${koMove(m[2])}을(를) 배울 수 없다`],
  [/^(.+?) has no moves/, (m) => `${koSpecies(m[1])}: 기술이 없다`],
  [/^(.+?) is banned/, (m) => `${koSpecies(m[1])}은(는) 이 룰에서 쓸 수 없다`],
  [/^(.+?) is not available in/, (m) => `${koSpecies(m[1])}은(는) 이 룰에서 쓸 수 없다`],
  [/You must bring at least (\d+) Pokémon/, (m) => `포켓몬을 최소 ${m[1]}마리 넣어야 한다`],
  [/^(.+?)'s item (.+?) is/, (m) => `${koSpecies(m[1])}의 도구 ${koItem(m[2])}은(는) 쓸 수 없다`],
  [/^(.+?) can't have (.+)/, (m) => `${koSpecies(m[1])}은(는) ${m[2]}을(를) 가질 수 없다`],
  [/has (\d+) total Stat Points, which is more than this format's limit of (\d+)/, (m) => `SP 합계 ${m[1]} (최대 ${m[2]})`],
  [/Stat Points? .* (\d+)/, (m) => `SP 초과 (한 능력치 최대 ${m[1]})`]
];
function koProblem(p) {
  for (const [re, fn] of MSG) {
    const m = p.match(re);
    if (m) return fn(m);
  }
  return p;
}
__name(koProblem, "koProblem");
function validateTeam(team) {
  const copy = team.map((s) => ({ ...s, evs: { ...s.evs }, ivs: { ...s.ivs }, moves: [...s.moves] }));
  return getValidator().validateTeam(copy);
}
__name(validateTeam, "validateTeam");
function validateSet(set) {
  const copy = { ...set, evs: { ...set.evs }, ivs: { ...set.ivs }, moves: [...set.moves] };
  return getValidator().validateSet(copy, {});
}
__name(validateSet, "validateSet");
function exportTeam(team) {
  return Teams.export(team);
}
__name(exportTeam, "exportTeam");
function importTeam(text) {
  const t = Teams.import(text);
  if (!t?.length) return null;
  return t.map((s) => ({ ...normalize(s), nature: s.nature || "Serious", evs: { ...emptyStats(0), ...s.evs ?? {} } }));
}
__name(importTeam, "importTeam");
var statTotal = /* @__PURE__ */ __name((set) => STATS.reduce((a, s) => a + (set.evs[s] || 0), 0), "statTotal");

// src/core/ai/mech.ts
var TYPE_SHIFT = ["protean", "libero"];
var ROLL_AVG = 7;
var ROLL_MIN = 15;
var Mech = class {
  static {
    __name(this, "Mech");
  }
  b;
  byKey = /* @__PURE__ */ new Map();
  cache = /* @__PURE__ */ new Map();
  roll = ROLL_AVG;
  constructor(sides) {
    const b = new Battle({ formatid: FORMAT.id });
    const pack = /* @__PURE__ */ __name((ms) => Teams.pack(ms.map((m) => ({ ...m.set, name: m.key, evs: { ...m.set.evs }, ivs: { ...m.set.ivs }, moves: [...m.set.moves] }))), "pack");
    b.setPlayer("p1", { name: "A", team: pack(sides[0]) });
    b.setPlayer("p2", { name: "B", team: pack(sides[1]) });
    b.randomChance = () => false;
    b.randomizer = (d) => Math.trunc(Math.trunc(d * (100 - this.roll)) / 100);
    for (const side of [b.p1, b.p2]) for (const p of side.pokemon) this.byKey.set(`${side.id}:${p.name}`, p);
    this.b = b;
  }
  sync(sideIdx, s) {
    const side = sideIdx === 0 ? this.b.p1 : this.b.p2;
    const p = this.byKey.get(`${side.id}:${s.key}`);
    if (!p) return null;
    if (p.species.name !== s.species) {
      try {
        p.formeChange(s.species, null, true);
      } catch {
      }
    }
    if (side.active[0] !== p) {
      if (side.active[0]) side.active[0].isActive = false;
      side.active[0] = p;
      p.isActive = true;
      p.position = 0;
    }
    p.hp = Math.max(1, Math.round(p.maxhp * s.hp / 100));
    p.status = s.status || "";
    p.boosts = { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0, ...s.boosts };
    p.item = s.itemGone ? "" : toID(s.item ?? p.set.item);
    p.types = s.types?.length ? [...s.types] : [...p.species.types];
    p.addedType = "";
    return p;
  }
  syncField(f, defSide) {
    const field = this.b.field;
    const w2 = toID(f.weather);
    const t = toID(f.terrain);
    if (field.weather !== w2) {
      field.weather = w2;
      field.weatherState = { id: w2 };
    }
    if (field.terrain !== t) {
      field.terrain = t;
      field.terrainState = { id: t };
    }
    for (const si of [0, 1]) {
      const side = si === 0 ? this.b.p1 : this.b.p2;
      for (const k of ["reflect", "lightscreen", "auroraveil", "tailwind"]) {
        const on = (f.screens[si][k] ?? 0) > 0 && (k === "tailwind" || defSide === null || defSide === si);
        if (on && !side.sideConditions[k]) side.sideConditions[k] = { id: k, target: side, duration: 3 };
        else if (!on && side.sideConditions[k]) delete side.sideConditions[k];
      }
    }
  }
  /** att 가 move 로 def 에게 주는 데미지 (def 최대 HP 대비 %) */
  damage(att, def, attSide, move, f) {
    const key = `${attSide}|${att.key}|${att.species}|${att.types?.join() ?? ""}|${att.shiftUsed ? 1 : 0}|${def.types?.join() ?? ""}|${JSON.stringify(att.boosts)}|${att.status}|${att.itemGone ? 1 : 0}|${att.item ?? ""}|${Math.round(att.hp / 10)}|${def.key}|${def.species}|${JSON.stringify(def.boosts)}|${def.status}|${def.itemGone ? 1 : 0}|${def.item ?? ""}|${Math.round(def.hp / 10)}|${move}|${f.weather}|${f.terrain}|${JSON.stringify(f.screens[1 - attSide])}`;
    const hit = this.cache.get(key);
    if (hit) return hit;
    let out = { avg: 0, min: 0 };
    try {
      this.syncField(f, 1 - attSide);
      const a = this.sync(attSide, att);
      const d = this.sync(1 - attSide, def);
      if (a && d) {
        const mv = this.b.dex.getActiveMove(toID(move));
        const hits = typeof mv.multihit === "number" ? mv.multihit : Array.isArray(mv.multihit) ? a.hasAbility?.("skilllink") ? mv.multihit[1] : 3.1 : 1;
        const typed = /* @__PURE__ */ __name(() => {
          const m = this.b.dex.getActiveMove(toID(move));
          this.b.singleEvent("ModifyType", m, null, a, d, m, m);
          this.b.runEvent("ModifyType", a, d, m, m);
          return m;
        }, "typed");
        if (!att.shiftUsed && TYPE_SHIFT.includes(toID(att.ability ?? ""))) {
          const t = typed().type;
          if (t && t !== "???") a.types = [t];
        }
        this.roll = ROLL_AVG;
        const avg = this.b.actions.getDamage(a, d, typed(), true);
        this.roll = ROLL_MIN;
        const min = this.b.actions.getDamage(a, d, typed(), true);
        this.roll = ROLL_AVG;
        const toPct = /* @__PURE__ */ __name((x) => typeof x === "number" && x > 0 ? x * hits / d.maxhp * 100 : 0, "toPct");
        out = { avg: toPct(avg), min: toPct(min) };
      }
    } catch {
    }
    this.b.log.length = 0;
    if (this.cache.size > 3e4) this.cache.clear();
    this.cache.set(key, out);
    return out;
  }
  /** 데미지 범위 (최소 난수 85% ~ 최대 100%, 급소 없음) — 화면 힌트용. def 최대 HP 대비 % */
  range(att, def, attSide, move, f) {
    let out = { min: 0, max: 0 };
    try {
      this.syncField(f, 1 - attSide);
      const a = this.sync(attSide, att);
      const d = this.sync(1 - attSide, def);
      if (a && d) {
        const mv0 = this.b.dex.getActiveMove(toID(move));
        const hits = typeof mv0.multihit === "number" ? mv0.multihit : Array.isArray(mv0.multihit) ? a.hasAbility?.("skilllink") ? mv0.multihit[1] : 3 : 1;
        const typed = /* @__PURE__ */ __name(() => {
          const m = this.b.dex.getActiveMove(toID(move));
          this.b.singleEvent("ModifyType", m, null, a, d, m, m);
          this.b.runEvent("ModifyType", a, d, m, m);
          return m;
        }, "typed");
        if (!att.shiftUsed && TYPE_SHIFT.includes(toID(att.ability ?? ""))) {
          const t = typed().type;
          if (t && t !== "???") a.types = [t];
        }
        const pct = /* @__PURE__ */ __name((x) => typeof x === "number" && x > 0 ? x * hits / d.maxhp * 100 : 0, "pct");
        this.roll = ROLL_MIN;
        const lo = this.b.actions.getDamage(a, d, typed(), true);
        this.roll = 0;
        const hi = this.b.actions.getDamage(a, d, typed(), true);
        this.roll = ROLL_AVG;
        out = { min: pct(lo), max: pct(hi) };
      }
    } catch {
    }
    this.roll = ROLL_AVG;
    this.b.log.length = 0;
    return out;
  }
  /** att 가 move 를 쓸 때의 실제 타입 (특성·기술 효과 반영) */
  moveType(att, attSide, move, f) {
    let t = "";
    try {
      this.syncField(f, null);
      const a = this.sync(attSide, att);
      const side = attSide === 0 ? this.b.p2 : this.b.p1;
      const m = this.b.dex.getActiveMove(toID(move));
      if (a) {
        this.b.singleEvent("ModifyType", m, null, a, side.active[0], m, m);
        this.b.runEvent("ModifyType", a, side.active[0], m, m);
      }
      t = m.type;
    } catch {
    }
    this.b.log.length = 0;
    return t;
  }
  /** 행동 스피드 (랭크·도구·특성·마비·순풍·날씨 반영) */
  speed(s, sideIdx, f) {
    try {
      this.syncField(f, null);
      const p = this.sync(sideIdx, s);
      return p ? p.getStat("spe") : 0;
    } catch {
      return 0;
    }
  }
  /** 최대 HP 실수치 (%, 회복량 계산 등) */
  maxhp(sideIdx, key) {
    const side = sideIdx === 0 ? this.b.p1 : this.b.p2;
    return this.byKey.get(`${side.id}:${key}`)?.maxhp ?? 100;
  }
};

// src/core/ai/belief.ts
var setCache = /* @__PURE__ */ new Map();
function setsFor(species) {
  const base = dex.species.get(species);
  const id = toID(base.baseSpecies && base.isMega ? base.baseSpecies : base.name);
  let v = setCache.get(id);
  if (!v) {
    try {
      v = sampleSets(base.isMega ? base.baseSpecies : base.name, 6).map((x) => x.set);
    } catch {
      v = [];
    }
    setCache.set(id, v);
  }
  return v;
}
__name(setsFor, "setsFor");
function genericSet(species) {
  const sp = dex.species.get(species);
  const phys = sp.baseStats.atk >= sp.baseStats.spa;
  const moves = [];
  for (const m of dex.moves.all()) {
    if (moves.length >= 3) break;
    if (m.isNonstandard || m.category === "Status" || !sp.types.includes(m.type) || m.basePower < 70 || m.basePower > 100) continue;
    if (m.category === "Physical" !== phys) continue;
    moves.push(m.name);
  }
  const stat = phys ? "atk" : "spa";
  return {
    name: "",
    species: sp.name,
    item: "",
    ability: sp.abilities["0"],
    nature: phys ? "Adamant" : "Modest",
    evs: { hp: 32, atk: 0, def: 0, spa: 0, spd: 0, spe: 2, [stat]: 32 },
    ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
    moves,
    level: FORMAT.level,
    gender: ""
  };
}
__name(genericSet, "genericSet");
function candidates(mon) {
  const sp = dex.species.get(mon.species);
  const known = mon.moves.map((m) => toID(m));
  const itemId = mon.item === void 0 ? null : toID(mon.item);
  const abilityId = mon.ability ? toID(mon.ability) : null;
  const fit = setsFor(mon.species).filter((s) => {
    const mv = s.moves.map((m) => toID(m));
    if (!known.every((k) => mv.includes(k))) return false;
    if (itemId && toID(s.item) !== itemId) return false;
    if (abilityId && !sp.isMega && toID(s.ability) !== abilityId) return false;
    if (sp.isMega && !dex.items.get(s.item).megaStone) return false;
    return true;
  });
  const base = fit.length ? fit : [(() => {
    const g = setsFor(mon.species)[0] ? { ...setsFor(mon.species)[0], moves: [...setsFor(mon.species)[0].moves] } : genericSet(mon.species);
    for (const k of mon.moves) if (!g.moves.map((m) => toID(m)).includes(toID(k))) {
      if (g.moves.length >= 4) g.moves.pop();
      g.moves.unshift(dex.moves.get(k).name);
    }
    if (mon.item) g.item = mon.item;
    if (mon.ability && !sp.isMega) g.ability = mon.ability;
    return g;
  })()];
  return base.map((s) => ({
    ...s,
    species: sp.isMega ? sp.name : dex.species.get(s.species).isMega ? dex.species.get(s.species).baseSpecies : sp.name,
    item: mon.item === "" ? "" : mon.item || s.item
  }));
}
__name(candidates, "candidates");
function hpPct(cond) {
  const [hp] = cond.split(" ");
  if (hp === "0") return 0;
  const [a, b] = hp.split("/").map(Number);
  return b ? a / b * 100 : 0;
}
__name(hpPct, "hpPct");
function statusOf(cond) {
  const s = cond.split(" ")[1] ?? "";
  return s === "fnt" ? "" : s;
}
__name(statusOf, "statusOf");
function ownSet(team, p) {
  const species = p.details.split(",")[0];
  const num = dex.species.get(species).num;
  const set = team?.find((s) => dex.species.get(s.species).num === num);
  const base = set ?? genericSet(species);
  return {
    ...base,
    species,
    item: p.item ? dex.items.get(p.item).name : "",
    ability: dex.abilities.get(p.ability ?? p.baseAbility).name || base.ability,
    moves: p.moves.map((m) => dex.moves.get(m).name || m)
  };
}
__name(ownSet, "ownSet");
var HAZ = ["stealthrock", "spikes", "toxicspikes", "stickyweb"];
var SCR = ["reflect", "lightscreen", "auroraveil", "tailwind"];
function sideConds(view, id) {
  const c = (view?.state.sides[id].conditions ?? []).map((x) => toID(x));
  const hazards = { stealthrock: 0, spikes: 0, toxicspikes: 0, stickyweb: 0 };
  const screens = { reflect: 0, lightscreen: 0, auroraveil: 0, tailwind: 0 };
  for (const k of HAZ) if (c.includes(k)) hazards[k] = 1;
  for (const k of SCR) if (c.includes(k)) screens[k] = 3;
  return { hazards, screens };
}
__name(sideConds, "sideConds");
function vols(view, id) {
  const v = {};
  for (const x of view?.state.sides[id].volatiles ?? []) if (["substitute", "taunt", "leechseed", "yawn", "curse", "encore"].includes(x)) v[x] = x === "taunt" ? 2 : 1;
  if (view?.state.sides[id].proteanUsed) v.protean = 1;
  return v;
}
__name(vols, "vols");
function sampleWorlds(req, view, team, n, rng) {
  const meId = req.side.id;
  const opId = meId === "p1" ? "p2" : "p1";
  const turn = view?.state.turn ?? 0;
  const reqMons = req.side.pokemon;
  const mine = reqMons.map((p, i) => {
    const set = ownSet(team, p);
    const orig = team?.find((s) => dex.species.get(s.species).num === dex.species.get(set.species).num);
    return {
      key: `m${i}`,
      set,
      hp: hpPct(p.condition),
      status: statusOf(p.condition),
      alive: !p.condition.endsWith(" fnt") && !p.condition.startsWith("0"),
      boosts: p.active ? { ...view?.state.sides[meId].boosts ?? {} } : {},
      vol: p.active ? vols(view, meId) : {},
      itemGone: !!orig?.item && !p.item,
      lastMove: p.active ? toID(view?.lastMove[meId] ?? "") : void 0,
      activeTurns: p.active && turn > 1 ? 1 : 0,
      types: p.active ? view?.state.sides[meId].types ?? void 0 : void 0
    };
  });
  const myActive = Math.max(0, reqMons.findIndex((p) => p.active));
  const a0 = req.active?.[0];
  const myMega = reqMons.some((p) => /-Mega/.test(p.details)) || !!a0 && !a0.canMegaEvo && !!dex.items.get(mine[myActive]?.set.item ?? "").megaStone;
  const opTeam = view?.state.sides[opId].team ?? [];
  const revealed = opTeam.filter((m) => m.revealed);
  const hidden = opTeam.filter((m) => !m.revealed);
  const opActiveView = view?.state.sides[opId].active ?? null;
  const worlds = [];
  for (let k = 0; k < n; k++) {
    const pool = [...hidden];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const brought = [...revealed, ...pool.slice(0, Math.max(0, FORMAT.pickSize - revealed.length))];
    const theirs = brought.map((mv, i) => {
      const c = candidates(mv);
      const set = k === 0 ? c[0] : c[Math.floor(rng() * c.length)];
      const isActive = mv === opActiveView;
      return {
        key: `o${i}`,
        set,
        hp: mv.maxhp ? mv.hp / mv.maxhp * 100 : 100,
        status: mv.status,
        alive: !mv.fainted,
        boosts: isActive ? { ...view?.state.sides[opId].boosts ?? {} } : {},
        vol: isActive ? vols(view, opId) : {},
        itemGone: mv.item === "",
        lastMove: isActive ? toID(view?.lastMove[opId] ?? "") : void 0,
        activeTurns: isActive && turn > 1 ? 1 : 0,
        types: isActive ? view?.state.sides[opId].types ?? void 0 : void 0
      };
    });
    const mech = new Mech([mine.map((m) => ({ key: m.key, set: m.set })), theirs.map((m) => ({ key: m.key, set: m.set }))]);
    worlds.push({
      sides: [
        { mons: mine.map((m) => ({ ...m, boosts: { ...m.boosts }, vol: { ...m.vol } })), active: myActive, ...sideConds(view, meId), megaUsed: myMega, zUsed: true },
        { mons: theirs, active: Math.max(0, brought.findIndex((m) => m === opActiveView)), ...sideConds(view, opId), megaUsed: brought.some((m) => dex.species.get(m.species).isMega), zUsed: true }
      ],
      weather: view?.state.weather ?? "",
      weatherTurns: 3,
      terrain: view?.state.terrain.find((t) => /Terrain/.test(t)) ?? "",
      terrainTurns: 3,
      trickRoom: view?.state.terrain.some((t) => toID(t) === "trickroom") ? 3 : 0,
      turn,
      mech
    });
  }
  return worlds;
}
__name(sampleWorlds, "sampleWorlds");
function previewWorld(req, view, team) {
  const meId = req.side.id;
  const opId = meId === "p1" ? "p2" : "p1";
  const mk = /* @__PURE__ */ __name((key, set) => ({ key, set, hp: 100, status: "", alive: true, boosts: {}, vol: {}, activeTurns: 0 }), "mk");
  const mine = req.side.pokemon.map((p, i) => mk(`m${i}`, ownSet(team, p)));
  const theirs = (view?.state.sides[opId].team ?? []).map((m, i) => mk(`o${i}`, candidates(m)[0]));
  const mech = new Mech([mine.map((m) => ({ key: m.key, set: m.set })), theirs.map((m) => ({ key: m.key, set: m.set }))]);
  const empty = /* @__PURE__ */ __name(() => ({ hazards: { stealthrock: 0, spikes: 0, toxicspikes: 0, stickyweb: 0 }, screens: { reflect: 0, lightscreen: 0, auroraveil: 0, tailwind: 0 }, megaUsed: false, zUsed: true }), "empty");
  return { sides: [{ mons: mine, active: 0, ...empty() }, { mons: theirs, active: 0, ...empty() }], weather: "", weatherTurns: 0, terrain: "", terrainTurns: 0, trickRoom: 0, turn: 0, mech };
}
__name(previewWorld, "previewWorld");

// src/core/ai/movefx.ts
var EXCEPTIONS = {
  moonlight: { heal: 0.5, special: "weatherheal" },
  synthesis: { heal: 0.5, special: "weatherheal" },
  morningsun: { heal: 0.5, special: "weatherheal" },
  shoreup: { heal: 0.5 },
  rest: { special: "rest" },
  painsplit: { special: "painsplit" },
  bellydrum: { special: "bellydrum" },
  curse: { special: "curse" },
  defog: { special: "defog" },
  rapidspin: { special: "rapidspin" },
  knockoff: { special: "knockoff" },
  partingshot: { foeBoosts: { atk: -1, spa: -1 } },
  fakeout: { special: "firstturn" },
  firstimpression: { special: "firstturn" },
  trick: { special: "trick" },
  switcheroo: { special: "trick" },
  yawn: { special: "yawn" },
  haze: { special: "haze" },
  clearsmog: { special: "clearfoe" },
  suckerpunch: { special: "sucker" },
  focuspunch: { special: "focuspunch" },
  wish: { heal: 0.5 },
  strengthsap: { heal: 0.4, foeBoosts: { atk: -1 } }
};
var cache = /* @__PURE__ */ new Map();
function moveFx(name) {
  const id = toID(name);
  const hit = cache.get(id);
  if (hit) return hit;
  const m = dex.moves.get(id);
  const fx = {
    id: m.id,
    name: m.name,
    type: m.type,
    category: m.category,
    priority: m.priority,
    acc: m.accuracy === true ? 1 : (m.accuracy || 100) / 100,
    targetsFoe: !["self", "allySide", "all", "foeSide", "allyTeam", "adjacentAlly", "adjacentAllyOrSelf"].includes(m.target)
  };
  if (m.id.startsWith("hiddenpower") && m.id.length > 11) {
    const t = m.id.slice(11).replace(/\d+$/, "");
    fx.type = t.charAt(0).toUpperCase() + t.slice(1);
  }
  if (m.boosts) {
    if (m.target === "self" || m.target === "adjacentAllyOrSelf") fx.selfBoosts = m.boosts;
    else fx.foeBoosts = m.boosts;
  }
  if (m.self?.boosts) fx.selfBoosts = m.self.boosts;
  if (m.status) fx.status = m.status;
  const sec = m.secondary;
  if (sec?.status) fx.secondaryStatus = { status: sec.status, chance: (sec.chance ?? 100) / 100 };
  if (sec?.volatileStatus === "flinch") fx.flinchChance = (sec.chance ?? 100) / 100;
  if (m.volatileStatus) fx.volatile = m.volatileStatus;
  if (m.stallingMove) fx.protect = true;
  if (m.heal) fx.heal = m.heal[0] / m.heal[1];
  if (m.drain) fx.drain = m.drain[0] / m.drain[1];
  if (m.recoil) fx.recoil = m.recoil[0] / m.recoil[1];
  if (m.selfdestruct) fx.selfdestruct = true;
  if (m.sideCondition) {
    fx.sideCondition = m.sideCondition;
    fx.sideTarget = m.target === "foeSide" ? "foe" : "self";
  }
  if (m.weather) fx.weather = m.weather;
  if (m.terrain) fx.terrain = m.terrain;
  if (m.pseudoWeather) fx.pseudoWeather = m.pseudoWeather;
  if (m.selfSwitch) fx.selfSwitch = true;
  if (m.forceSwitch) fx.forceSwitch = true;
  Object.assign(fx, EXCEPTIONS[m.id] ?? {});
  cache.set(id, fx);
  return fx;
}
__name(moveFx, "moveFx");
function statusImmune(status, types, moveId = "") {
  if (status === "brn") return types.includes("Fire");
  if (status === "par") return types.includes("Electric") || moveId === "thunderwave" && types.includes("Ground");
  if (status === "psn" || status === "tox") return types.includes("Poison") || types.includes("Steel");
  if (status === "frz") return types.includes("Ice");
  if (status === "slp" && ["spore", "sleeppowder"].includes(moveId)) return types.includes("Grass");
  return false;
}
__name(statusImmune, "statusImmune");

// src/core/ai/world.ts
function cloneWorld(w2) {
  return {
    ...w2,
    sides: w2.sides.map((s) => ({
      ...s,
      hazards: { ...s.hazards },
      screens: { ...s.screens },
      mons: s.mons.map((m) => ({ ...m, boosts: { ...m.boosts }, vol: { ...m.vol }, set: m.set }))
    }))
  };
}
__name(cloneWorld, "cloneWorld");
var activeOf = /* @__PURE__ */ __name((s) => s.mons[s.active], "activeOf");
var aliveCount = /* @__PURE__ */ __name((s) => s.mons.filter((m) => m.alive).length, "aliveCount");
function typesOf(m) {
  return m.types?.length ? m.types : dex.species.get(m.set.species).types;
}
__name(typesOf, "typesOf");
function abilityOf(m) {
  const sp = dex.species.get(m.set.species);
  return toID(sp.isMega ? sp.abilities[0] : m.set.ability);
}
__name(abilityOf, "abilityOf");
var TYPE_SHIFT2 = ["protean", "libero"];
function typeShift(w2, u, me, move) {
  if (me.vol.protean || !TYPE_SHIFT2.includes(abilityOf(me))) return;
  const t = w2.mech.moveType(mechState(me), u, move, fieldOf(w2));
  if (!t || typesOf(me).join() === t) return;
  me.types = [t];
  me.vol.protean = 1;
}
__name(typeShift, "typeShift");
function mechState(m) {
  return { key: m.key, species: m.set.species, hp: m.hp, status: m.status, boosts: m.boosts, itemGone: m.itemGone, item: m.set.item, types: m.types, ability: abilityOf(m), shiftUsed: !!m.vol.protean };
}
__name(mechState, "mechState");
function fieldOf(w2) {
  return { weather: w2.weather, terrain: w2.terrain, screens: [w2.sides[0].screens, w2.sides[1].screens] };
}
__name(fieldOf, "fieldOf");
function expectedDamage(w2, attSide, move, _z = false) {
  const A = w2.sides[attSide], D = w2.sides[1 - attSide];
  const a = activeOf(A), d = activeOf(D);
  if (!a?.alive || !d?.alive) return { avg: 0, min: 0 };
  const fx = moveFx(move);
  if (fx.category === "Status") return { avg: 0, min: 0 };
  const r = w2.mech.damage(mechState(a), mechState(d), attSide, move, fieldOf(w2));
  return { avg: r.avg * fx.acc, min: r.min };
}
__name(expectedDamage, "expectedDamage");
function bestDamage(w2, attSide) {
  const a = activeOf(w2.sides[attSide]);
  if (!a?.alive) return 0;
  let best = 0;
  for (const mv of a.set.moves) best = Math.max(best, expectedDamage(w2, attSide, mv).avg);
  return best;
}
__name(bestDamage, "bestDamage");
function speed(w2, side) {
  const m = activeOf(w2.sides[side]);
  if (!m?.alive) return 0;
  return w2.mech.speed(mechState(m), side, fieldOf(w2));
}
__name(speed, "speed");
function order(w2, pri0, pri1) {
  if (pri0 !== pri1) return pri0 > pri1 ? 1 : -1;
  let a = speed(w2, 0), b = speed(w2, 1);
  if (w2.trickRoom > 0) {
    a = -a;
    b = -b;
  }
  return a === b ? w2.turn % 2 ? 1 : -1 : a > b ? 1 : -1;
}
__name(order, "order");
function effRock(types) {
  return Math.pow(2, dex.getEffectiveness("Rock", types));
}
__name(effRock, "effRock");
function switchIn(w2, sideIdx, to) {
  const s = w2.sides[sideIdx];
  const out = activeOf(s);
  if (out) {
    out.boosts = {};
    out.vol = {};
    out.activeTurns = 0;
    out.types = void 0;
    if (toID(out.set.ability) === "regenerator" && out.alive) out.hp = Math.min(100, out.hp + 33);
    if (toID(out.set.ability) === "naturalcure") out.status = "";
  }
  s.active = to;
  const m = activeOf(s);
  m.activeTurns = 0;
  const types = typesOf(m);
  const grounded = !types.includes("Flying") && toID(m.set.ability) !== "levitate" && toID(m.set.item) !== "airballoon";
  if (toID(m.set.item) !== "heavydutyboots") {
    if (s.hazards.stealthrock) m.hp -= 12.5 * effRock(types);
    if (grounded && s.hazards.spikes) m.hp -= [0, 12.5, 16.7, 25][Math.min(3, s.hazards.spikes)];
    if (grounded && s.hazards.toxicspikes && !m.status && !statusImmune("psn", types)) {
      if (types.includes("Poison")) s.hazards.toxicspikes = 0;
      else m.status = s.hazards.toxicspikes >= 2 ? "tox" : "psn";
    }
    if (grounded && s.hazards.stickyweb) m.boosts.spe = (m.boosts.spe ?? 0) - 1;
  }
  if (m.hp <= 0) {
    m.hp = 0;
    m.alive = false;
    return;
  }
  const ab = toID(m.set.ability);
  const foe = activeOf(w2.sides[1 - sideIdx]);
  if (ab === "intimidate" && foe?.alive && !["clearbody", "hypercutter", "whitesmoke", "fullmetalbody"].includes(toID(foe.set.ability))) foe.boosts.atk = Math.max(-6, (foe.boosts.atk ?? 0) - 1);
  const wx = { drizzle: "RainDance", drought: "SunnyDay", sandstream: "Sandstorm", snowwarning: "Hail" };
  if (wx[ab]) {
    w2.weather = wx[ab];
    w2.weatherTurns = 5;
  }
  const tx = { electricsurge: "Electric Terrain", psychicsurge: "Psychic Terrain", grassysurge: "Grassy Terrain", mistysurge: "Misty Terrain" };
  if (tx[ab]) {
    w2.terrain = tx[ab];
    w2.terrainTurns = 5;
  }
}
__name(switchIn, "switchIn");
function bestReplacement(w2, sideIdx) {
  const s = w2.sides[sideIdx];
  let best = -1, bestScore = -Infinity;
  s.mons.forEach((m, i) => {
    if (!m.alive || i === s.active) return;
    const t = cloneWorld(w2);
    t.sides[sideIdx].active = i;
    const sc = bestDamage(t, sideIdx) - bestDamage(t, 1 - sideIdx) + m.hp * 0.2;
    if (sc > bestScore) {
      bestScore = sc;
      best = i;
    }
  });
  return best;
}
__name(bestReplacement, "bestReplacement");
var BOOST_KEYS = ["atk", "def", "spa", "spd", "spe", "accuracy", "evasion"];
function applyBoosts(m, b, mult = 1) {
  if (!b) return;
  const contrary = toID(m.set.ability) === "contrary";
  for (const k of BOOST_KEYS) {
    const v = b[k];
    if (!v) continue;
    m.boosts[k] = Math.max(-6, Math.min(6, (m.boosts[k] ?? 0) + Math.round(v * mult * (contrary ? -1 : 1))));
  }
}
__name(applyBoosts, "applyBoosts");
function useMove(w2, u, act, protectedFoe, flinched) {
  const U = w2.sides[u], T = w2.sides[1 - u];
  const me = activeOf(U), foe = activeOf(T);
  if (!me?.alive) return;
  const fx = moveFx(act.move);
  me.lastMove = fx.id;
  if (flinched) return;
  if (me.status === "slp") {
    me.vol.sleepTurns = (me.vol.sleepTurns ?? 0) + 1;
    if (me.vol.sleepTurns < 2) return;
    me.status = "";
    me.vol.sleepTurns = 0;
  }
  if (me.status === "frz") return;
  let eff = me.status === "par" ? 0.75 : 1;
  if (me.vol.taunt && fx.category === "Status") return;
  if (fx.special === "firstturn" && me.activeTurns > 0) return;
  typeShift(w2, u, me, act.move);
  if (fx.protect) {
    return;
  }
  if (fx.targetsFoe && protectedFoe) return;
  const acc = fx.acc * eff;
  const foeTypes = foe ? typesOf(foe) : [];
  if (fx.category !== "Status" && foe?.alive) {
    const d = expectedDamage(w2, u, act.move, act.z);
    let dealt = Math.min(foe.hp, d.avg * eff);
    if (foe.vol.substitute && !act.z) {
      foe.vol.substitute = 0;
      dealt = 0;
    }
    foe.hp -= dealt;
    if (fx.drain) me.hp = Math.min(100, me.hp + dealt * fx.drain);
    if (fx.recoil) me.hp -= dealt * fx.recoil;
    if (!me.itemGone && toID(me.set.item) === "lifeorb" && dealt > 0) me.hp -= 10;
    if (fx.special === "knockoff" && dealt > 0) foe.itemGone = true;
    if (fx.secondaryStatus && !foe.status && foe.hp > 0 && fx.secondaryStatus.chance * acc >= 0.5 && !statusImmune(fx.secondaryStatus.status, foeTypes)) foe.status = fx.secondaryStatus.status;
    applyBoosts(me, fx.selfBoosts, acc >= 0.5 ? 1 : 0);
    if (fx.foeBoosts && foe.hp > 0) applyBoosts(foe, fx.foeBoosts, acc);
  } else {
    if (fx.status && foe?.alive && !foe.status && !foe.vol.substitute && acc >= 0.7 && !statusImmune(fx.status, foeTypes, fx.id)) {
      if (fx.status === "slp" && w2.sides[1 - u].mons.some((m) => m.status === "slp")) {
      } else foe.status = fx.status;
    }
    if (fx.selfBoosts) applyBoosts(me, fx.selfBoosts);
    if (fx.foeBoosts && foe?.alive && !foe.vol.substitute && acc >= 0.5) applyBoosts(foe, fx.foeBoosts);
    if (fx.heal) {
      let h = fx.heal * 100;
      if (fx.special === "weatherheal") h = /sunny/i.test(w2.weather) ? 66.7 : w2.weather ? 25 : 50;
      me.hp = Math.min(100, me.hp + h);
    }
    switch (fx.special) {
      case "rest":
        if (me.hp < 100) {
          me.hp = 100;
          me.status = "slp";
          me.vol.sleepTurns = 0;
        }
        break;
      case "painsplit":
        if (foe?.alive) {
          const avg = (me.hp + foe.hp) / 2;
          me.hp = avg;
          foe.hp = avg;
        }
        break;
      case "bellydrum":
        if (me.hp > 50) {
          me.hp -= 50;
          me.boosts.atk = 6;
        }
        break;
      case "curse":
        if (typesOf(me).includes("Ghost")) {
          me.hp -= 50;
          if (foe) foe.vol.curse = 1;
        } else applyBoosts(me, { atk: 1, def: 1, spe: -1 });
        break;
      case "defog":
        T.hazards = { stealthrock: 0, spikes: 0, toxicspikes: 0, stickyweb: 0 };
        U.hazards = { stealthrock: 0, spikes: 0, toxicspikes: 0, stickyweb: 0 };
        T.screens.reflect = T.screens.lightscreen = T.screens.auroraveil = 0;
        break;
      case "haze":
        for (const s of w2.sides) {
          const a = activeOf(s);
          if (a) a.boosts = {};
        }
        break;
      case "yawn":
        if (foe && !foe.status) foe.vol.yawn = 2;
        break;
      case "trick":
        if (foe) {
          const x = me.set.item;
          me.set = { ...me.set, item: foe.set.item };
          foe.set = { ...foe.set, item: x };
        }
        break;
    }
    if (fx.volatile && fx.volatile !== "protect") {
      if (fx.volatile === "substitute") {
        if (me.hp > 25 && !me.vol.substitute) {
          me.hp -= 25;
          me.vol.substitute = 1;
        }
      } else if (foe && fx.targetsFoe && acc >= 0.7) {
        if (!(fx.volatile === "leechseed" && foeTypes.includes("Grass"))) foe.vol[fx.volatile] = fx.volatile === "taunt" ? 3 : 1;
      }
    }
    if (fx.sideCondition) {
      const side = fx.sideTarget === "foe" ? T : U;
      const sc = fx.sideCondition;
      if (sc in side.hazards) {
        const k = sc;
        const max = k === "spikes" ? 3 : k === "toxicspikes" ? 2 : 1;
        side.hazards[k] = Math.min(max, side.hazards[k] + 1);
      } else if (sc in side.screens) {
        const k = sc;
        if (!side.screens[k]) side.screens[k] = k === "tailwind" ? 4 : toID(me.set.item) === "lightclay" ? 8 : 5;
      }
    }
    if (fx.weather) {
      w2.weather = fx.weather;
      w2.weatherTurns = 5;
    }
    if (fx.terrain) {
      w2.terrain = dex.moves.get(fx.terrain).name || fx.terrain;
      w2.terrainTurns = 5;
    }
    if (fx.pseudoWeather === "trickroom") w2.trickRoom = w2.trickRoom ? 0 : 5;
  }
  if (fx.special === "rapidspin") {
    U.hazards = { stealthrock: 0, spikes: 0, toxicspikes: 0, stickyweb: 0 };
  }
  if (fx.selfdestruct) me.hp = 0;
  if (foe && foe.hp <= 0) {
    foe.hp = 0;
    foe.alive = false;
  }
  if (me.hp <= 0) {
    me.hp = 0;
    me.alive = false;
  }
  if (fx.selfSwitch && me.alive && foe?.alive !== void 0) {
    const r = bestReplacement(w2, u);
    if (r >= 0) switchIn(w2, u, r);
  }
  if (fx.forceSwitch && foe?.alive) {
    const alts = T.mons.map((m, i) => m.alive && i !== T.active ? i : -1).filter((i) => i >= 0);
    if (alts.length) switchIn(w2, 1 - u, alts[0]);
  }
}
__name(useMove, "useMove");
function endOfTurn(w2) {
  const wt = toID(w2.weather);
  for (const si of [0, 1]) {
    const s = w2.sides[si];
    const m = activeOf(s);
    if (m?.alive) {
      const t = typesOf(m);
      const ab = toID(m.set.ability);
      const item = m.itemGone ? "" : toID(m.set.item);
      if (wt === "sandstorm" && !t.some((x) => ["Rock", "Ground", "Steel"].includes(x)) && !["overcoat", "sandveil", "sandrush", "sandforce", "magicguard"].includes(ab) && item !== "safetygoggles") m.hp -= 6.25;
      if (wt === "hail" && !t.includes("Ice") && !["overcoat", "icebody", "snowcloak", "magicguard"].includes(ab) && item !== "safetygoggles") m.hp -= 6.25;
      if (ab !== "magicguard") {
        if (m.status === "brn") m.hp -= 6.25;
        if (m.status === "psn") m.hp -= ab === "poisonheal" ? -12.5 : 12.5;
        if (m.status === "tox") {
          m.vol.toxN = (m.vol.toxN ?? 0) + 1;
          m.hp -= ab === "poisonheal" ? -12.5 : 6.25 * m.vol.toxN;
        }
        if (m.vol.curse) m.hp -= 25;
      }
      if (item === "leftovers" || item === "blacksludge" && t.includes("Poison")) m.hp += 6.25;
      if (item === "blacksludge" && !t.includes("Poison")) m.hp -= 12.5;
      if (toID(w2.terrain) === "grassyterrain") m.hp += 6.25;
      if (m.vol.leechseed) {
        const foe = activeOf(w2.sides[1 - si]);
        m.hp -= 12.5;
        if (foe?.alive) foe.hp = Math.min(100, foe.hp + 12.5);
      }
      if (m.vol.yawn) {
        m.vol.yawn--;
        if (!m.vol.yawn && !m.status) m.status = "slp";
      }
      if (m.vol.taunt) m.vol.taunt--;
      if (ab === "speedboost") m.boosts.spe = Math.min(6, (m.boosts.spe ?? 0) + 1);
      m.hp = Math.min(100, m.hp);
      if (m.hp <= 0) {
        m.hp = 0;
        m.alive = false;
      }
      m.activeTurns++;
    }
    for (const k of Object.keys(s.screens)) if (s.screens[k] > 0) s.screens[k]--;
  }
  if (w2.weather && --w2.weatherTurns <= 0 && !/desolate|primordial|delta/i.test(w2.weather)) w2.weather = "";
  if (w2.terrain && --w2.terrainTurns <= 0) w2.terrain = "";
  if (w2.trickRoom > 0) w2.trickRoom--;
  for (const si of [0, 1]) {
    const s = w2.sides[si];
    if (!activeOf(s)?.alive && aliveCount(s) > 0) {
      const r = bestReplacement(w2, si);
      if (r >= 0) switchIn(w2, si, r);
    }
  }
  w2.turn++;
}
__name(endOfTurn, "endOfTurn");
function step(w0, a0, a1) {
  const w2 = cloneWorld(w0);
  const acts = [a0, a1];
  for (const si of [0, 1]) {
    const a = acts[si];
    if (a.kind === "switch") switchIn(w2, si, a.to);
  }
  for (const si of [0, 1]) {
    const a = acts[si];
    if (a.kind === "move" && a.mega) {
      const m = activeOf(w2.sides[si]);
      const forme = megaFormeOf(m.set);
      if (forme) {
        const sp = dex.species.get(forme);
        m.set = { ...m.set, species: sp.name, ability: sp.abilities[0] };
        w2.sides[si].megaUsed = true;
      }
    }
    if (a.kind === "move" && a.z) w2.sides[si].zUsed = true;
  }
  const prot = [false, false];
  for (const si of [0, 1]) {
    const a = acts[si];
    if (a.kind === "move" && moveFx(a.move).protect) {
      const m = activeOf(w2.sides[si]);
      prot[si] = !(m.lastMove && moveFx(m.lastMove).protect);
      m.lastMove = moveFx(a.move).id;
    }
  }
  const pri = /* @__PURE__ */ __name((a) => a.kind === "move" ? moveFx(a.move).priority : -99, "pri");
  const first = acts[0].kind !== "move" ? 1 : acts[1].kind !== "move" ? 0 : order(w2, pri(acts[0]), pri(acts[1])) > 0 ? 0 : 1;
  const second = 1 - first;
  let flinch = false;
  const aF = acts[first];
  if (aF.kind === "move") {
    const fxF = moveFx(aF.move);
    const tgtAct = acts[second];
    if (!(fxF.special === "sucker" && !(tgtAct.kind === "move" && moveFx(tgtAct.move).category !== "Status"))) useMove(w2, first, aF, prot[second], false);
    flinch = (fxF.flinchChance ?? 0) >= 0.5 && (fxF.special !== "firstturn" || activeOf(w2.sides[first]).activeTurns === 0);
  }
  const aS = acts[second];
  if (aS.kind === "move") {
    const fxS = moveFx(aS.move);
    if (!(fxS.special === "sucker")) useMove(w2, second, aS, prot[first], flinch);
  }
  endOfTurn(w2);
  return w2;
}
__name(step, "step");
function megaFormeOf(set) {
  const stone = dex.items.get(set.item).megaStone;
  if (!stone) return "";
  if (typeof stone === "string") return stone;
  const map = stone;
  const base = dex.species.get(set.species);
  return map[base.name] ?? map[base.baseSpecies] ?? Object.values(map)[0] ?? "";
}
__name(megaFormeOf, "megaFormeOf");
function sideActions(w2, si) {
  const s = w2.sides[si];
  const m = activeOf(s);
  const out = [];
  if (m?.alive) {
    const canMega = !s.megaUsed && !!megaFormeOf(m.set) && !dex.species.get(m.set.species).isMega;
    for (const mv of m.set.moves) out.push({ kind: "move", move: mv, mega: canMega || void 0 });
  }
  s.mons.forEach((x, i) => {
    if (x.alive && i !== s.active) out.push({ kind: "switch", to: i });
  });
  return out.length ? out : [{ kind: "pass" }];
}
__name(sideActions, "sideActions");

// src/config/ai.ts
var DEFAULT_WEIGHTS = {
  alive: 1,
  hp: 1.2,
  status: { brn: 0.2, par: 0.2, psn: 0.12, tox: 0.25, slp: 0.35, frz: 0.45 },
  matchup: 0.6,
  boost: 0.1,
  hazard: 0.01,
  screen: 0.04,
  win: 20,
  switchCost: 0.15
};
var TUNED_WEIGHTS = { ...DEFAULT_WEIGHTS, alive: 0.8, hp: 1.6, switchCost: 0.3 };
var L2 = { worlds: 3, lambda: 0.6, depth: 1, replies: 3, greedyMix: 0.5, weights: TUNED_WEIGHTS };
var L3 = { worlds: 4, lambda: 0.5, timeMs: 5e3, maxSims: 400, topK: 4, simWorlds: 4, priorWeight: 0.3, weights: TUNED_WEIGHTS };
var PROFILES = [
  { id: "L0", label: "랜덤", level: 0, epsilon: 0, worlds: 1, lambda: 0 },
  { id: "L1e30", label: "초급 · 실수 30%", level: 1, epsilon: 0.3, worlds: 1, lambda: 0 },
  { id: "L1", label: "초급", level: 1, epsilon: 0, worlds: 1, lambda: 0 },
  { id: "L2e30", label: "중급 · 실수 30%", level: 2, epsilon: 0.3, ...L2 },
  { id: "L2e10", label: "중급 · 실수 10%", level: 2, epsilon: 0.1, ...L2 },
  { id: "L2", label: "중급", level: 2, epsilon: 0, ...L2 },
  { id: "L3e10", label: "상급 · 실수 10%", level: 3, epsilon: 0.1, ...L3 },
  { id: "L3", label: "상급", level: 3, epsilon: 0, ...L3 }
];

// src/core/ai/evaluate.ts
function physical(m) {
  const b = dex.species.get(m.set.species).baseStats;
  return b.atk >= b.spa;
}
__name(physical, "physical");
function monValue(m, W) {
  if (!m.alive) return 0;
  let v = W.alive + W.hp * (m.hp / 100);
  let pen = W.status[m.status] ?? 0;
  if (m.status === "brn" && !physical(m)) pen *= 0.3;
  if (m.status && toID(m.set.ability) === "guts") pen = -0.1;
  if ((m.status === "psn" || m.status === "tox") && toID(m.set.ability) === "poisonheal") pen = -0.1;
  v *= 1 - pen;
  return v;
}
__name(monValue, "monValue");
function boostValue(m, W) {
  if (!m?.alive) return 0;
  const b = m.boosts;
  const off = physical(m) ? b.atk ?? 0 : b.spa ?? 0;
  const x = off + 0.8 * (b.spe ?? 0) + 0.5 * ((b.def ?? 0) + (b.spd ?? 0)) + 0.3 * ((b.accuracy ?? 0) - 0 + (b.evasion ?? 0));
  return W.boost * Math.sign(x) * Math.sqrt(Math.abs(x)) * 2;
}
__name(boostValue, "boostValue");
function hazardCost(s, W) {
  let hp = 0;
  s.mons.forEach((m, i) => {
    if (!m.alive || i === s.active) return;
    const t = typesOf(m);
    if (s.hazards.stealthrock) hp += 12.5 * Math.pow(2, dex.getEffectiveness("Rock", t));
    if (s.hazards.spikes && !t.includes("Flying")) hp += [0, 12.5, 16.7, 25][s.hazards.spikes];
  });
  return W.hazard * hp;
}
__name(hazardCost, "hazardCost");
function matchupTerm(w2) {
  const a = activeOf(w2.sides[0]), b = activeOf(w2.sides[1]);
  if (!a?.alive || !b?.alive) return 0;
  const mine = Math.max(0.5, bestDamage(w2, 0)), theirs = Math.max(0.5, bestDamage(w2, 1));
  const myTurns = Math.ceil(b.hp / mine), theirTurns = Math.ceil(a.hp / theirs);
  const first = order(w2, 0, 0) > 0;
  let d = theirTurns - myTurns + (myTurns === theirTurns ? first ? 0.5 : -0.5 : 0);
  d = Math.max(-3, Math.min(3, d));
  return d / 3;
}
__name(matchupTerm, "matchupTerm");
function evaluate(w2, W = DEFAULT_WEIGHTS) {
  const [me, op] = w2.sides;
  const aMe = aliveCount(me), aOp = aliveCount(op);
  if (aOp === 0 && aMe > 0) return W.win + aMe;
  if (aMe === 0 && aOp > 0) return -W.win - aOp;
  if (aMe === 0 && aOp === 0) return 0;
  let v = 0;
  for (const m of me.mons) v += monValue(m, W);
  for (const m of op.mons) v -= monValue(m, W);
  v += W.matchup * matchupTerm(w2);
  v += boostValue(activeOf(me), W) - boostValue(activeOf(op), W);
  v += hazardCost(op, W) - hazardCost(me, W);
  const sc = /* @__PURE__ */ __name((s) => s.screens.reflect + s.screens.lightscreen + s.screens.auroraveil + s.screens.tailwind, "sc");
  v += W.screen * (sc(me) - sc(op));
  return v;
}
__name(evaluate, "evaluate");

// src/core/ai/simsearch.ts
function clearLog(b) {
  b.log.length = 0;
  b.sentLogPos = 0;
}
__name(clearLog, "clearLog");
function toPokemonSet(m) {
  const sp = dex.species.get(m.set.species);
  const base = sp.battleOnly ? Array.isArray(sp.battleOnly) ? sp.battleOnly[0] : sp.battleOnly : sp.name;
  const baseSp = dex.species.get(base);
  const full = /* @__PURE__ */ __name((o, d) => ({ hp: o?.hp ?? d, atk: o?.atk ?? d, def: o?.def ?? d, spa: o?.spa ?? d, spd: o?.spd ?? d, spe: o?.spe ?? d }), "full");
  return {
    name: m.key,
    species: baseSp.name,
    item: m.itemGone ? "" : m.set.item,
    ability: sp.isMega ? baseSp.abilities[0] : m.set.ability || baseSp.abilities[0],
    nature: m.set.nature,
    evs: full(m.set.evs, 0),
    ivs: full(m.set.ivs, 31),
    moves: m.set.moves,
    level: m.set.level,
    gender: ""
  };
}
__name(toPokemonSet, "toPokemonSet");
function applySide(b, side, ws, foe) {
  let left = 0;
  for (const p of side.pokemon) {
    const m = ws.mons.find((x) => x.key === p.name);
    if (!m) continue;
    if (!m.alive) {
      p.hp = 0;
      p.fainted = true;
      p.status = "fnt";
      continue;
    }
    left++;
    const sp = dex.species.get(m.set.species);
    if (sp.name !== p.species.name) {
      try {
        p.formeChange(sp.name, p.getItem(), true);
      } catch {
      }
    }
    p.hp = Math.max(1, Math.round(p.maxhp * m.hp / 100));
    if (m.status) {
      try {
        p.setStatus(m.status, p, null, true);
      } catch {
      }
    }
    p.boosts = { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0, ...m.boosts };
    if (m.itemGone) p.item = "";
    if (p.isActive) {
      if (m.types?.length) p.types = [...m.types];
      if (m.vol.protean) {
        const st = p.abilityState;
        st.protean = true;
        st.libero = true;
      }
      if (m.vol.substitute) p.addVolatile("substitute");
      if (m.vol.taunt) p.addVolatile("taunt");
      if (m.vol.leechseed && foe.active[0]) p.addVolatile("leechseed", foe.active[0]);
    }
  }
  side.pokemonLeft = left;
  if (ws.megaUsed) for (const p of side.pokemon) p.canMegaEvo = null;
  if (ws.zUsed) side.zMoveUsed = true;
  const src = side.active[0];
  const foeSrc = foe.active[0];
  for (const k of ["stealthrock", "spikes", "toxicspikes", "stickyweb"]) for (let i = 0; i < ws.hazards[k]; i++) side.addSideCondition(k, foeSrc);
  for (const k of ["reflect", "lightscreen", "auroraveil", "tailwind"]) {
    if (ws.screens[k] > 0 && side.addSideCondition(k, src)) side.sideConditions[k].duration = ws.screens[k];
  }
  void b;
}
__name(applySide, "applySide");
function buildBattle(w2, seed) {
  try {
    const order2 = /* @__PURE__ */ __name((s) => [s.mons[s.active], ...s.mons.filter((_, i) => i !== s.active)], "order");
    const b = new Battle({ formatid: FORMAT.id, seed: `${seed},7,11,13` });
    b.setPlayer("p1", { name: "A", team: Teams.pack(order2(w2.sides[0]).map(toPokemonSet)) });
    b.setPlayer("p2", { name: "B", team: Teams.pack(order2(w2.sides[1]).map(toPokemonSet)) });
    b.choose("p1", "team " + w2.sides[0].mons.map((_, i) => i + 1).join(""));
    b.choose("p2", "team " + w2.sides[1].mons.map((_, i) => i + 1).join(""));
    b.field.clearWeather();
    applySide(b, b.p1, w2.sides[0], b.p2);
    applySide(b, b.p2, w2.sides[1], b.p1);
    const src = b.p1.active[0];
    if (w2.weather) b.field.setWeather(toID(w2.weather), src);
    if (w2.terrain) b.field.setTerrain(toID(w2.terrain), src);
    if (w2.trickRoom > 0) b.field.addPseudoWeather("trickroom", src);
    clearLog(b);
    b.makeRequest("move");
    return b;
  } catch (e) {
    if (globalThis.AI_DEBUG) console.warn("L3 재구성 실패", e);
    return null;
  }
}
__name(buildBattle, "buildBattle");
function simToWorld(b, base) {
  const side = /* @__PURE__ */ __name((s, ws) => {
    const mons = ws.mons.map((m) => {
      const p = s.pokemon.find((x) => x.name === m.key);
      if (!p) return m;
      const boosts = {};
      for (const [k, v] of Object.entries(p.boosts)) if (v) boosts[k] = v;
      return {
        ...m,
        set: { ...m.set, species: p.species.name },
        hp: p.fainted ? 0 : p.hp / p.maxhp * 100,
        status: p.fainted ? "" : p.status,
        alive: !p.fainted && p.hp > 0,
        boosts,
        vol: { substitute: p.volatiles.substitute ? 1 : 0, taunt: p.volatiles.taunt ? 1 : 0, leechseed: p.volatiles.leechseed ? 1 : 0, protean: p.abilityState?.protean || p.abilityState?.libero ? 1 : 0 },
        itemGone: !p.item,
        activeTurns: p.activeTurns,
        types: p.isActive && p.types.join() !== p.species.types.join() ? [...p.types] : void 0
      };
    });
    const act = s.active[0];
    const active = Math.max(0, ws.mons.findIndex((m) => m.key === act?.name));
    const sc = s.sideConditions;
    return {
      mons,
      active,
      hazards: { stealthrock: sc.stealthrock ? 1 : 0, spikes: sc.spikes?.layers ?? 0, toxicspikes: sc.toxicspikes?.layers ?? 0, stickyweb: sc.stickyweb ? 1 : 0 },
      screens: { reflect: sc.reflect?.duration ?? 0, lightscreen: sc.lightscreen?.duration ?? 0, auroraveil: sc.auroraveil?.duration ?? 0, tailwind: sc.tailwind?.duration ?? 0 },
      megaUsed: ws.megaUsed || s.pokemon.some((p) => p.species.isMega),
      zUsed: s.zMoveUsed
    };
  }, "side");
  const pw = b.field.pseudoWeather;
  return {
    sides: [side(b.p1, base.sides[0]), side(b.p2, base.sides[1])],
    weather: b.field.weather,
    weatherTurns: b.field.weatherState?.duration ?? 3,
    terrain: b.field.terrain,
    terrainTurns: b.field.terrainState?.duration ?? 3,
    trickRoom: pw.trickroom?.duration ?? 0,
    turn: b.turn,
    mech: base.mech
  };
}
__name(simToWorld, "simToWorld");
function simSwitchChoice(side, key) {
  const i = side.pokemon.findIndex((p) => p.name === key);
  return i >= 0 ? `switch ${i + 1}` : null;
}
__name(simSwitchChoice, "simSwitchChoice");
function worldActionToSim(side, ws, a) {
  if (a.kind === "switch") return simSwitchChoice(side, ws.mons[a.to].key) ?? "default";
  if (a.kind === "move") {
    const p = side.active[0];
    const j = p.moveSlots.findIndex((s) => s.id === toID(a.move) || toID(a.move).startsWith("hiddenpower") && s.id.startsWith("hiddenpower"));
    return j >= 0 ? `move ${j + 1}${a.mega ? " mega" : ""}` : "default";
  }
  return "default";
}
__name(worldActionToSim, "worldActionToSim");
function quickChoice(b, sideIdx, base) {
  const side = sideIdx === 0 ? b.p1 : b.p2;
  const req = side.activeRequest;
  if (!req || req.wait) return "default";
  const legal = legalChoices(req);
  if (!legal.length) return "default";
  const w2 = simToWorld(b, base);
  const sign = sideIdx === 0 ? 1 : -1;
  if (req.forceSwitch) {
    let best2 = legal[0], bs = -Infinity;
    for (const c of legal) {
      if (!c.startsWith("switch")) continue;
      const pos = +c.split(" ")[1] - 1;
      const key = side.pokemon[pos]?.name;
      const idx = w2.sides[sideIdx].mons.findIndex((m) => m.key === key);
      if (idx < 0) continue;
      const t = { ...w2, sides: [...w2.sides] };
      t.sides[sideIdx] = { ...w2.sides[sideIdx], active: idx };
      const s = sign * evaluate(t);
      if (s > bs) {
        bs = s;
        best2 = c;
      }
    }
    return best2;
  }
  let best = "default", bd = -1;
  for (const c of legal) {
    if (!c.startsWith("move")) continue;
    const i = +c.split(" ")[1] - 1;
    const mv = side.active[0]?.moveSlots[i]?.move;
    if (!mv) continue;
    const d = expectedDamage(w2, sideIdx, mv).avg;
    if (d > bd) {
      bd = d;
      best = c;
    }
  }
  return best;
}
__name(quickChoice, "quickChoice");
function settleSwitches(b, base) {
  for (let guard = 0; guard < 4 && !b.ended; guard++) {
    const s1 = b.p1.requestState === "switch", s2 = b.p2.requestState === "switch";
    if (!s1 && !s2) break;
    if (s1) b.choose("p1", quickChoice(b, 0, base));
    if (s2) b.choose("p2", quickChoice(b, 1, base));
  }
}
__name(settleSwitches, "settleSwitches");
function rollout(ser, base, myChoice, oppChoice, seed, depth, W) {
  const b = State.deserializeBattle(ser);
  b.prng = new PRNG(`${seed},${seed * 3 + 1},17,29`);
  clearLog(b);
  if (!b.choose("p1", myChoice)) {
    globalThis.L3NULL = (globalThis.L3NULL ?? 0) + 1;
    if (globalThis.AI_DEBUG) console.log("choose fail", myChoice, JSON.stringify(b.p1.activeRequest)?.slice(0, 300));
    return null;
  }
  if (!b.choose("p2", oppChoice)) {
    globalThis.L3OPPFAIL = (globalThis.L3OPPFAIL ?? 0) + 1;
    b.choose("p2", "default");
  }
  settleSwitches(b, base);
  for (let d = 1; d < depth && !b.ended; d++) {
    b.choose("p1", quickChoice(b, 0, base));
    b.choose("p2", quickChoice(b, 1, base));
    settleSwitches(b, base);
    clearLog(b);
  }
  if (b.ended) return b.winner === "A" ? W.win + 3 : b.winner === "B" ? -W.win - 3 : 0;
  return evaluate(simToWorld(b, base), W);
}
__name(rollout, "rollout");
function opponentReplies(w2, myActs, k, W) {
  const opp = sideActions(w2, 1);
  const scored = opp.map((b) => ({ b, v: myActs.reduce((s, a) => s + evaluate(step(w2, a, b), W), 0) / myActs.length }));
  scored.sort((x, y) => x.v - y.v);
  return scored.slice(0, k).map((x) => x.b);
}
__name(opponentReplies, "opponentReplies");
async function simSearch(req, ctx, p, worlds, choices, myActs, W) {
  void req;
  const t0 = Date.now();
  const timeMs = p.timeMs ?? 5e3, maxSims = p.maxSims ?? 400;
  let lastYield = Date.now();
  const yieldUI = /* @__PURE__ */ __name(async () => {
    if (Date.now() - lastYield > 25) {
      await new Promise((r) => setTimeout(r, 0));
      lastYield = Date.now();
    }
  }, "yieldUI");
  const prepared = [];
  for (const [i, w2] of worlds.entries()) {
    const b = buildBattle(w2, 1e3 + i);
    if (!b) continue;
    const replies = opponentReplies(w2, myActs, 2, W).map((a) => worldActionToSim(b.p2, w2.sides[1], a));
    const mine = myActs.map((a, ai) => a.kind === "switch" ? simSwitchChoice(b.p1, w2.sides[0].mons[a.to].key) ?? "default" : choices[ai]);
    prepared.push({ w: w2, ser: State.serializeBattle(b), replies: [...new Set(replies)], mine });
    await yieldUI();
  }
  const acc = choices.map(() => prepared.map((pw) => pw.replies.map(() => ({ sum: 0, n: 0 }))));
  let sims = 0, round = 0;
  outer: while (true) {
    for (let wi = 0; wi < prepared.length; wi++) {
      const pw = prepared[wi];
      for (let ri = 0; ri < pw.replies.length; ri++) {
        for (let ai = 0; ai < choices.length; ai++) {
          const v = rollout(pw.ser, pw.w, pw.mine[ai], pw.replies[ri], round * 7919 + wi * 131 + ri * 17 + ai, 2, W);
          if (v !== null) {
            acc[ai][wi][ri].sum += v;
            acc[ai][wi][ri].n++;
          }
          sims++;
          await yieldUI();
        }
        if (Date.now() - t0 > timeMs || sims >= maxSims) break outer;
      }
    }
    round++;
    if (round > 50) break;
  }
  const scores = choices.map((c, ai) => {
    let tot = 0, nw = 0;
    acc[ai].forEach((perW) => {
      const means = perW.filter((x) => x.n).map((x) => x.sum / x.n);
      if (!means.length) return;
      const min = Math.min(...means), mean = means.reduce((s, x) => s + x, 0) / means.length;
      tot += p.lambda * min + (1 - p.lambda) * mean;
      nw++;
    });
    return { choice: c, value: nw ? tot / nw : -Infinity };
  });
  const max = Math.max(...scores.map((s) => s.value));
  const top = scores.filter((s) => s.value >= max - 1e-9);
  return { choice: top[Math.floor(ctx.rng() * top.length)]?.choice ?? choices[0], scores, sims, ms: Date.now() - t0 };
}
__name(simSearch, "simSearch");

// src/core/ai/agent.ts
function toWAction(req, choice) {
  const [kind, n, ...rest] = choice.split(" ");
  if (kind === "switch") return { kind: "switch", to: +n - 1, choice };
  if (kind === "move") {
    const mv = req.active[0].moves[+n - 1];
    return { kind: "move", move: mv.move, mega: rest.includes("mega"), z: rest.includes("zmove"), choice };
  }
  return { kind: "pass" };
}
__name(toWAction, "toWAction");
function myChoices(req) {
  const all = legalChoices(req);
  const a = req.active?.[0];
  if (a?.canMegaEvo) return all.filter((c) => !c.startsWith("move") || c.includes("mega"));
  return all;
}
__name(myChoices, "myChoices");
var PASS = { kind: "pass" };
var replyCache = /* @__PURE__ */ new WeakMap();
function greedy(w2, side, W) {
  let best = PASS, bv = -Infinity;
  for (const x of sideActions(w2, side)) {
    if (x.kind === "switch") continue;
    const v = side === 0 ? evaluate(step(w2, x, PASS), W) : -evaluate(step(w2, PASS, x), W);
    if (v > bv) {
      bv = v;
      best = x;
    }
  }
  return best;
}
__name(greedy, "greedy");
function topReplies(w2, k, W) {
  const opts = sideActions(w2, 1).map((b) => ({ b, v: evaluate(step(w2, PASS, b), W) }));
  opts.sort((x, y) => x.v - y.v);
  return opts.slice(0, k).map((x) => x.b);
}
__name(topReplies, "topReplies");
function valueOf(worlds, a, p, W, forced) {
  let total = 0;
  for (const w2 of worlds) {
    if (forced) {
      const t = cloneWorld(w2);
      if (a.kind === "switch") switchIn(t, 0, a.to);
      total += evaluate(t, W);
      continue;
    }
    if (p.level <= 1) {
      total += evaluate(step(w2, a, PASS), W);
      continue;
    }
    const replies = replyCache.get(w2) ?? topReplies(w2, p.replies ?? 99, W);
    replyCache.set(w2, replies);
    const vals = replies.map((b) => {
      let w1 = step(w2, a, b);
      for (let d = 1; d < (p.depth ?? 1); d++) w1 = step(w1, greedy(w1, 0, W), greedy(w1, 1, W));
      return evaluate(w1, W);
    });
    const min = Math.min(...vals), mean = vals.reduce((x, y) => x + y, 0) / vals.length;
    const reply = p.lambda * min + (1 - p.lambda) * mean;
    const g = p.greedyMix ?? 0;
    total += g ? g * evaluate(step(w2, a, PASS), W) + (1 - g) * reply : reply;
  }
  return total / worlds.length;
}
__name(valueOf, "valueOf");
async function decide(req, ctx, p) {
  const rng = ctx.rng;
  const W = p.weights ?? DEFAULT_WEIGHTS;
  const choices = myChoices(req);
  if (choices.length === 1) return { choice: choices[0], scores: [] };
  const n = p.level === 1 ? 1 : p.worlds;
  const worlds = sampleWorlds(req, ctx.view, ctx.team, n, rng);
  if (p.level === 3 && !req.forceSwitch) {
    const pre = { ...p, level: 2, depth: 1, replies: 3, lambda: 0.6, greedyMix: 0.5 };
    const approxWorlds = worlds.slice(0, 3);
    const approx = choices.map((c) => ({ choice: c, value: valueOf(approxWorlds, toWAction(req, c), pre, W, false) }));
    approx.sort((a, b) => b.value - a.value);
    const keep = approx.slice(0, p.topK ?? 4).map((x) => x.choice);
    const d = await simSearch(req, ctx, p, worlds.slice(0, p.simWorlds ?? 4), keep, keep.map((c) => toWAction(req, c)), W);
    const mix = p.priorWeight ?? 0.3;
    const scores2 = d.scores.map((s) => ({ choice: s.choice, value: (1 - mix) * s.value + mix * (approx.find((a) => a.choice === s.choice)?.value ?? 0) - (s.choice.startsWith("switch") ? W.switchCost : 0) }));
    const best = scores2.reduce((a, b) => b.value > a.value ? b : a, scores2[0]);
    return { choice: best?.choice ?? keep[0], scores: scores2, sims: d.sims, ms: d.ms };
  }
  const scores = choices.map((c) => ({ choice: c, value: valueOf(worlds, toWAction(req, c), p, W, !!req.forceSwitch) - (!req.forceSwitch && c.startsWith("switch") ? W.switchCost : 0) }));
  const max = Math.max(...scores.map((s) => s.value));
  const top = scores.filter((s) => s.value >= max - 1e-9);
  return { choice: top[Math.floor(rng() * top.length)].choice, scores };
}
__name(decide, "decide");
function makeAgent(p) {
  return {
    id: p.id,
    label: p.label,
    async choose(req, ctx) {
      if (p.level === 0 || ctx.rng() < p.epsilon) return RandomAgent.choose(req, ctx);
      if (req.teamPreview) return teamPreview(req, ctx);
      if (!req.active?.[0] && !req.forceSwitch) return "default";
      const d = await decide(req, ctx, p);
      if (globalThis.AI_DEBUG) console.log(`[${p.id}] ${d.choice} ${d.sims ? `(${d.sims} sims, ${d.ms}ms)` : ""} | ${d.scores.map((s) => `${s.choice.replace("move ", "m")}:${s.value.toFixed(2)}`).join(" ")}`);
      return d.choice;
    }
  };
}
__name(makeAgent, "makeAgent");
var PREVIEW = { oppSharp: 2.5, leadSharp: 5, megaPenalty: 0.35, meanWeight: 0.5, noise: 0.05 };
function teamPreview(req, ctx) {
  const pick2 = ctx.format.pickSize;
  const w2 = previewWorld(req, ctx.view, ctx.team);
  const [me, op] = w2.sides;
  if (!op.mons.length) return RandomAgent.choose(req, ctx);
  const M = me.mons.map((_, i) => op.mons.map((_2, j) => {
    me.active = i;
    op.active = j;
    return matchupTerm(w2);
  }));
  const n = me.mons.length, m = op.mons.length;
  const avg = /* @__PURE__ */ __name((xs) => xs.reduce((a, b) => a + b, 0) / xs.length, "avg");
  const oppEdge = op.mons.map((_, j) => -avg(M.map((row) => row[j])));
  const soft = /* @__PURE__ */ __name((k) => {
    const e = oppEdge.map((x) => Math.exp(k * x));
    const s = e.reduce((a, b) => a + b, 0);
    return e.map((x) => x / s);
  }, "soft");
  const q = soft(PREVIEW.oppSharp), lead = soft(PREVIEW.leadSharp);
  const wavg = /* @__PURE__ */ __name((row, p) => row.reduce((a, x, j) => a + x * p[j], 0), "wavg");
  const isMega = me.mons.map((x) => !!megaFormeOf(x.set));
  const combos = [];
  const rec = /* @__PURE__ */ __name((start, acc) => {
    if (acc.length === pick2) {
      combos.push([...acc]);
      return;
    }
    for (let i = start; i < n; i++) rec(i + 1, [...acc, i]);
  }, "rec");
  rec(0, []);
  let best = combos[0] ?? [0, 1, 2];
  let bestScore = -Infinity;
  for (const trio of combos) {
    let cover = 0;
    for (let j = 0; j < m; j++) cover += q[j] * Math.max(...trio.map((i) => M[i][j]));
    const mean = avg(trio.map((i) => wavg(M[i], q)));
    const megas = trio.filter((i) => isMega[i]).length;
    const s = cover + PREVIEW.meanWeight * mean - PREVIEW.megaPenalty * Math.max(0, megas - 1) + ctx.rng() * PREVIEW.noise;
    if (s > bestScore) {
      bestScore = s;
      best = trio;
    }
  }
  const leadIdx = best.reduce((a, b) => wavg(M[b], lead) > wavg(M[a], lead) ? b : a, best[0]);
  const rest = best.filter((i) => i !== leadIdx).sort((x, y) => wavg(M[y], q) - wavg(M[x], q));
  return `team ${[leadIdx, ...rest].map((i) => i + 1).join("")}`;
}
__name(teamPreview, "teamPreview");

export {
  toID,
  BattleStream,
  getPlayerStreams,
  Teams,
  settings,
  saveSettings,
  listTeams,
  getTeam,
  saveTeam,
  deleteTeam,
  newTeamId,
  koSpecies,
  koMove,
  koAbility,
  koItem,
  koType,
  koNature,
  koMoveDesc,
  koAbilityDesc,
  koItemDesc,
  STAT_KO,
  STAT_SHORT,
  STATUS_KO,
  CATEGORY_KO,
  josa,
  eun,
  iga,
  eul,
  euro,
  koEffect,
  matchKo,
  FORMAT,
  dex,
  STATS,
  calcStat,
  isPickable,
  usageLabel,
  SPARE_ITEMS,
  RandomTeamSource,
  curatedParties,
  curatedLabel,
  OpponentSource,
  sampleSets,
  blankSet,
  koProblem,
  validateTeam,
  validateSet,
  exportTeam,
  importTeam,
  statTotal,
  PROFILES,
  Mech,
  candidates,
  toWAction,
  myChoices,
  greedy,
  topReplies,
  decide,
  makeAgent,
  PREVIEW
};
