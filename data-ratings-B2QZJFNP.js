// src/data/ratings/champions-bss-regmc.json
var measuredAt = "2026-09-28";
var method = "AI 자가 대전, Bradley-Terry, L0=800";
var pairs = {
  "L0|L1e30": [
    1,
    39
  ],
  "L0|L1": [
    2,
    38
  ],
  "L0|L2e30": [
    6,
    34
  ],
  "L0|L2e10": [
    2,
    38
  ],
  "L0|L2": [
    6,
    34
  ],
  "L1e30|L1": [
    14,
    26
  ],
  "L1e30|L2e30": [
    15,
    25
  ],
  "L1e30|L2e10": [
    12,
    28
  ],
  "L1e30|L2": [
    6,
    34
  ],
  "L1|L2e30": [
    25,
    15
  ],
  "L1|L2e10": [
    24,
    16
  ],
  "L1|L2": [
    18,
    22
  ],
  "L2e30|L2e10": [
    13,
    27
  ],
  "L2e30|L2": [
    14,
    26
  ],
  "L2e10|L2": [
    16,
    24
  ],
  "L3|L2": [
    13,
    17
  ],
  "L3|L1": [
    16,
    14
  ],
  "L3|L3e10": [
    13,
    17
  ],
  "L3e10|L2": [
    15,
    15
  ],
  "L3e10|L1": [
    15,
    15
  ]
};
var profiles = [
  {
    id: "L0",
    rating: 800,
    games: 200
  },
  {
    id: "L1e30",
    rating: 1118,
    games: 200
  },
  {
    id: "L2e30",
    rating: 1170,
    games: 200
  },
  {
    id: "L2e10",
    rating: 1252,
    games: 200
  },
  {
    id: "L3",
    rating: 1265,
    games: 90
  },
  {
    id: "L1",
    rating: 1272,
    games: 260
  },
  {
    id: "L3e10",
    rating: 1294,
    games: 90
  },
  {
    id: "L2",
    rating: 1305,
    games: 260
  }
];
var champions_bss_regmc_default = {
  measuredAt,
  method,
  pairs,
  profiles
};

export {
  measuredAt,
  method,
  pairs,
  profiles,
  champions_bss_regmc_default
};
