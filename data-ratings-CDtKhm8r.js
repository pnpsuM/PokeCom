var champions_bss_regmc_default = {
	measuredAt: "2026-09-26",
	method: "AI 자가 대전, Bradley-Terry, L0=800",
	pairs: {
		"L0|L1e30": [11, 49],
		"L0|L1": [4, 56],
		"L0|L2e30": [16, 44],
		"L0|L2e10": [6, 54],
		"L0|L2": [6, 54],
		"L1e30|L1": [21, 39],
		"L1e30|L2e30": [33, 27],
		"L1e30|L2e10": [23, 37],
		"L1e30|L2": [24, 36],
		"L1|L2e30": [39, 21],
		"L1|L2e10": [33, 27],
		"L1|L2": [29, 31],
		"L2e30|L2e10": [24, 36],
		"L2e30|L2": [23, 37],
		"L2e10|L2": [20, 40],
		"L3|L2": [10, 10],
		"L3|L1": [13, 7],
		"L3e10|L2": [8, 12],
		"L3e10|L1": [11, 9],
		"L3|L3e10": [10, 10]
	},
	profiles: [
		{
			"id": "L0",
			"rating": 800,
			"games": 300
		},
		{
			"id": "L2e30",
			"rating": 1046,
			"games": 300
		},
		{
			"id": "L1e30",
			"rating": 1069,
			"games": 300
		},
		{
			"id": "L2e10",
			"rating": 1121,
			"games": 300
		},
		{
			"id": "L1",
			"rating": 1163,
			"games": 340
		},
		{
			"id": "L3e10",
			"rating": 1165,
			"games": 60
		},
		{
			"id": "L2",
			"rating": 1179,
			"games": 340
		},
		{
			"id": "L3",
			"rating": 1200,
			"games": 60
		}
	]
};
//#endregion
export { champions_bss_regmc_default as t };
