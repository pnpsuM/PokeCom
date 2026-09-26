import { t as ko_default } from "./data-ko-Bw8jdYZD.js";
import { t as sprites_default } from "./data-sprites-Dp2ZHFH5.js";
import { t as champions_bss_regmc_default } from "./data-ratings-CDtKhm8r.js";
//#region src/config/rules.ts
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
} };
/** 시뮬레이터에 넘길 포맷 id (커스텀 룰이 있으면 '@@@' 로 붙인다) */
function simFormatId(r) {
	return r.customRules.length ? `${r.simFormat}@@@${r.customRules.join(",")}` : r.simFormat;
}
//#endregion
//#region src/config/manifest.ts
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
		ratings: champions_bss_regmc_default
	},
	/** 외부 리소스 */
	remote: { sprites: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon" },
	/** 기기 저장소 이름 (바꾸면 기존 기록을 못 읽는다 — 주의) */
	storage: {
		settings: "pokecom-settings",
		teams: "pokecom-teams",
		ladderDb: "pokecom-ladder",
		spriteDb: "pokecom-sprites"
	}
};
//#endregion
//#region src/config/rating.ts
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
	matchWindow: {
		min: -50,
		max: 100
	},
	/** 무승부 점수 (승 1, 패 0) */
	tieScore: .5,
	/** 기권은 패배로 기록한다 */
	forfeitIsLoss: true
};
/** 등급: min 이상이면 그 등급. AI 레이팅 범위(측정값)에 맞춰 정한다 */
var GRADES = [
	{
		name: "몬스터볼",
		min: 0,
		color: "#e2685f"
	},
	{
		name: "슈퍼볼",
		min: 950,
		color: "#5a86e0"
	},
	{
		name: "하이퍼볼",
		min: 1100,
		color: "#e8c02e"
	},
	{
		name: "울트라볼",
		min: 1200,
		color: "#d9a520"
	},
	{
		name: "마스터볼",
		min: 1300,
		color: "#a06ce0"
	}
];
//#endregion
//#region src/config/ai.ts
var DEFAULT_WEIGHTS = {
	alive: 1,
	hp: 1.2,
	status: {
		brn: .2,
		par: .2,
		psn: .12,
		tox: .25,
		slp: .35,
		frz: .45
	},
	matchup: .6,
	boost: .1,
	hazard: .01,
	screen: .04,
	win: 20,
	switchCost: .15
};
var L2 = {
	worlds: 3,
	lambda: .6,
	depth: 2,
	replies: 3
};
var L3 = {
	worlds: 4,
	lambda: .5,
	timeMs: 5e3,
	maxSims: 400,
	topK: 4,
	simWorlds: 4,
	priorWeight: .3
};
var PROFILES = [
	{
		id: "L0",
		label: "랜덤",
		level: 0,
		epsilon: 0,
		worlds: 1,
		lambda: 0
	},
	{
		id: "L1e30",
		label: "초급 · 실수 30%",
		level: 1,
		epsilon: .3,
		worlds: 1,
		lambda: 0
	},
	{
		id: "L1",
		label: "초급",
		level: 1,
		epsilon: 0,
		worlds: 1,
		lambda: 0
	},
	{
		id: "L2e30",
		label: "중급 · 실수 30%",
		level: 2,
		epsilon: .3,
		...L2
	},
	{
		id: "L2e10",
		label: "중급 · 실수 10%",
		level: 2,
		epsilon: .1,
		...L2
	},
	{
		id: "L2",
		label: "중급",
		level: 2,
		epsilon: 0,
		...L2
	},
	{
		id: "L3e10",
		label: "상급 · 실수 10%",
		level: 3,
		epsilon: .1,
		...L3
	},
	{
		id: "L3",
		label: "상급",
		level: 3,
		epsilon: 0,
		...L3
	}
];
//#endregion
//#region src/config/version.ts
var APP_VERSION = "1.4.1";
/** 최근 변경 (설정 화면 "버전 정보"에 표시) */
var CHANGELOG = [
	{
		version: "1.4.1",
		date: "2026-09-26",
		notes: [
			"배틀 화면에 필드 상태 막대 상시 표시 (날씨·필드·트릭룸·양쪽 벽·순풍·설치기, 경과 턴)",
			"레이팅 숫자 글꼴 Times New Roman, 본문보다 2px 크게",
			"변환자재·리베로: 기술 버튼에 바뀔 타입·자속 표시, 바뀐 타입을 상성·정보·AI 계산에 반영"
		]
	},
	{
		version: "1.4.0",
		date: "2026-09-26",
		notes: ["특성·기술 효과로 바뀌는 기술 타입을 버튼·설명·상성 배지에 반영 (메가진화 켜면 메가 특성 기준)", "글꼴을 둥근모꼴로"]
	},
	{
		version: "1.3.0",
		date: "2026-09-26",
		notes: ["모듈 분리: 레이팅 정책·대전 룰·AI 단계·버전별 데이터를 config/ 로", "빌드를 조각(시뮬레이터·데이터·앱)으로 나눠 바뀐 파일만 올리도록"]
	},
	{
		version: "1.2.0",
		date: "2026-09-26",
		notes: ["AI 판단 로직(초급·중급·상급)과 Elo 래더"]
	},
	{
		version: "1.1.0",
		date: "2026-09-26",
		notes: ["Champions 룰, 9세대, 파티 짜기"]
	}
];
//#endregion
export { GRADES as a, simFormatId as c, PROFILES as i, CHANGELOG as n, RATING_POLICY as o, DEFAULT_WEIGHTS as r, MANIFEST as s, APP_VERSION as t };
