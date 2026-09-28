import {
  ko_default
} from "./data-ko-PR7PYW7K.js";
import {
  sprites_default
} from "./data-sprites-QJGYGMEP.js";
import {
  champions_bss_regmc_default
} from "./data-ratings-B2QZJFNP.js";
import {
  CURATED_FILES
} from "./data-samples-7PD764JW.js";
import {
  USAGE_FILES
} from "./data-usage-5DZNZPEW.js";
import {
  __name
} from "./app-J5SB6L2L.js";

// src/config/rules.ts
var RULESETS = {
  /** Pokémon Champions 싱글 (BSS Reg M-C): 6마리 중 3마리, Lv50, 메가진화만 */
  "champions-bss-regmc": {
    key: "champions-bss-regmc",
    label: "Champions 싱글 (Reg M-C)",
    simFormat: "gen9championsbssregmc",
    customRules: [],
    gen: 9,
    gameType: "singles",
    teamSize: 6,
    pickSize: 3,
    level: 50,
    spPerStat: 32,
    spTotal: 66,
    gimmicks: { mega: true }
  }
};
function simFormatId(r) {
  return r.customRules.length ? `${r.simFormat}@@@${r.customRules.join(",")}` : r.simFormat;
}
__name(simFormatId, "simFormatId");

// src/config/manifest.ts
var MANIFEST = {
  /** 대전 룰 */
  rules: RULESETS["champions-bss-regmc"],
  /** 시뮬레이터 (Pokémon Showdown master) — 다시 묶기: PS_DIR=… npm run build:sim */
  sim: { commit: "a5df8274e85b0889bf2a9b3422a08b39732374fc" },
  /** 데이터 */
  data: {
    ko: ko_default,
    spriteMap: sprites_default,
    /** AI 프로필 레이팅 (룰마다 따로 측정) */
    ratings: champions_bss_regmc_default,
    /** 샘플 파티 (구박사 영상, Game8·알테마·note 구축 기사에서 옮김 — src/data/samples/). 고치면 data-samples 조각만 바뀜 */
    curated: CURATED_FILES,
    /** 사용률 통계 (Smogon Champions BSS, scripts/gen-usage.mjs 로 줄인 파일) — 없으면 랜덤 세트로 대신 */
    usage: USAGE_FILES,
    /** 상대 파티 출처 비율: 통계 / 샘플 / 내가 추가한 상대. 없는 출처의 몫은 나머지에 나눠 준다 */
    opponentMix: { usage: 0.6, curated: 0.3, custom: 0.1 }
  },
  /** 외부 리소스 */
  remote: {
    sprites: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon"
  },
  /** 기기 저장소 이름 (바꾸면 기존 기록을 못 읽는다 — 주의) */
  storage: {
    settings: "pokecom-settings",
    teams: "pokecom-teams",
    ladderDb: "pokecom-ladder",
    spriteDb: "pokecom-sprites"
  }
};

export {
  simFormatId,
  MANIFEST
};
