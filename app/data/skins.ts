/** Official emulator artwork. Pixel rectangles describe assets, never measured insets. */
export interface DeviceSkin {
  image: string; foreground: string | null; width: number; height: number;
  screen: { x: number; y: number; width: number; height: number };
  body: { x: number; y: number; width: number; height: number; radius: number };
}
export const skins: Record<string, DeviceSkin> = {
  "galaxy-z-fold8/main": {
    "image": "/skins/galaxy-z-fold8/main/device.png",
    "foreground": "/skins/galaxy-z-fold8/main/foreground.png",
    "width": 2885,
    "height": 2261,
    "screen": {
      "x": 217,
      "y": 206,
      "width": 2448,
      "height": 1848
    },
    "body": {
      "x": 169,
      "y": 158,
      "width": 2544,
      "height": 1944,
      "radius": 65
    }
  },
  "galaxy-z-fold8/cover": {
    "image": "/skins/galaxy-z-fold8/cover/device.png",
    "foreground": "/skins/galaxy-z-fold8/cover/foreground.png",
    "width": 1701,
    "height": 2388,
    "screen": {
      "x": 235,
      "y": 209,
      "width": 1248,
      "height": 1972
    },
    "body": {
      "x": 187,
      "y": 161,
      "width": 1344,
      "height": 2068,
      "radius": 75
    }
  },
  "galaxy-z-flip8/main": {
    "image": "/skins/galaxy-z-flip8/main/device.png",
    "foreground": "/skins/galaxy-z-flip8/main/foreground.png",
    "width": 1503,
    "height": 2920,
    "screen": {
      "x": 211,
      "y": 200,
      "width": 1080,
      "height": 2520
    },
    "body": {
      "x": 163,
      "y": 152,
      "width": 1176,
      "height": 2616,
      "radius": 130
    }
  },
  "galaxy-z-flip8/cover": {
    "image": "/skins/galaxy-z-flip8/cover/device.png",
    "foreground": "/skins/galaxy-z-flip8/cover/foreground.png",
    "width": 1337,
    "height": 1455,
    "screen": {
      "x": 195,
      "y": 222,
      "width": 948,
      "height": 1048
    },
    "body": {
      "x": 147,
      "y": 174,
      "width": 1044,
      "height": 1144,
      "radius": 100
    }
  },
  "galaxy-s25-plus/main": {
    "image": "/skins/galaxy-s25-plus/main/device.png",
    "foreground": "/skins/galaxy-s25-plus/main/foreground.png",
    "width": 1990,
    "height": 3658,
    "screen": {
      "x": 274,
      "y": 263,
      "width": 1440,
      "height": 3120
    },
    "body": {
      "x": 226,
      "y": 215,
      "width": 1536,
      "height": 3216,
      "radius": 150
    }
  },
  "galaxy-s25-ultra/main": {
    "image": "/skins/galaxy-s25-ultra/main/device.png",
    "foreground": "/skins/galaxy-s25-ultra/main/foreground.png",
    "width": 1852,
    "height": 3518,
    "screen": {
      "x": 206,
      "y": 197,
      "width": 1440,
      "height": 3120
    },
    "body": {
      "x": 160,
      "y": 151,
      "width": 1532,
      "height": 3212,
      "radius": 110
    }
  },
  "galaxy-s20/main": {
    "image": "/skins/galaxy-s20/main/device.png",
    "foreground": "/skins/galaxy-s20/main/foreground.png",
    "width": 2227,
    "height": 4017,
    "screen": {
      "x": 393,
      "y": 407,
      "width": 1440,
      "height": 3200
    },
    "body": {
      "x": 334,
      "y": 325,
      "width": 1558,
      "height": 3368,
      "radius": 220
    }
  },
  "galaxy-s20-fe/main": {
    "image": "/skins/galaxy-s20-fe/main/device.png",
    "foreground": "/skins/galaxy-s20-fe/main/foreground.png",
    "width": 1504,
    "height": 2843,
    "screen": {
      "x": 211,
      "y": 211,
      "width": 1080,
      "height": 2400
    },
    "body": {
      "x": 171,
      "y": 171,
      "width": 1160,
      "height": 2480,
      "radius": 115
    }
  },
  "galaxy-s20-plus/main": {
    "image": "/skins/galaxy-s20-plus/main/device.png",
    "foreground": "/skins/galaxy-s20-plus/main/foreground.png",
    "width": 1997,
    "height": 3731,
    "screen": {
      "x": 277,
      "y": 259,
      "width": 1440,
      "height": 3200
    },
    "body": {
      "x": 237,
      "y": 219,
      "width": 1520,
      "height": 3280,
      "radius": 165
    }
  },
  "galaxy-s20-ultra/main": {
    "image": "/skins/galaxy-s20-ultra/main/device.png",
    "foreground": "/skins/galaxy-s20-ultra/main/foreground.png",
    "width": 1897,
    "height": 3631,
    "screen": {
      "x": 227,
      "y": 209,
      "width": 1440,
      "height": 3200
    },
    "body": {
      "x": 187,
      "y": 169,
      "width": 1520,
      "height": 3280,
      "radius": 165
    }
  },
  "galaxy-s21/main": {
    "image": "/skins/galaxy-s21/main/device.png",
    "foreground": "/skins/galaxy-s21/main/foreground.png",
    "width": 1780,
    "height": 3072,
    "screen": {
      "x": 351,
      "y": 336,
      "width": 1080,
      "height": 2400
    },
    "body": {
      "x": 311,
      "y": 296,
      "width": 1160,
      "height": 2480,
      "radius": 140
    }
  },
  "galaxy-s21-fe/main": {
    "image": "/skins/galaxy-s21-fe/main/device.png",
    "foreground": "/skins/galaxy-s21-fe/main/foreground.png",
    "width": 1515,
    "height": 2850,
    "screen": {
      "x": 218,
      "y": 215,
      "width": 1080,
      "height": 2400
    },
    "body": {
      "x": 178,
      "y": 175,
      "width": 1160,
      "height": 2480,
      "radius": 135
    }
  },
  "galaxy-s21-plus/main": {
    "image": "/skins/galaxy-s21-plus/main/device.png",
    "foreground": "/skins/galaxy-s21-plus/main/foreground.png",
    "width": 1519,
    "height": 2827,
    "screen": {
      "x": 219,
      "y": 211,
      "width": 1080,
      "height": 2400
    },
    "body": {
      "x": 179,
      "y": 171,
      "width": 1160,
      "height": 2480,
      "radius": 135
    }
  },
  "galaxy-s21-ultra/main": {
    "image": "/skins/galaxy-s21-ultra/main/device.png",
    "foreground": "/skins/galaxy-s21-ultra/main/foreground.png",
    "width": 1860,
    "height": 3646,
    "screen": {
      "x": 210,
      "y": 220,
      "width": 1440,
      "height": 3200
    },
    "body": {
      "x": 170,
      "y": 180,
      "width": 1520,
      "height": 3280,
      "radius": 180
    }
  },
  "galaxy-s22/main": {
    "image": "/skins/galaxy-s22/main/device.png",
    "foreground": "/skins/galaxy-s22/main/foreground.png",
    "width": 1765,
    "height": 3025,
    "screen": {
      "x": 344,
      "y": 340,
      "width": 1080,
      "height": 2340
    },
    "body": {
      "x": 304,
      "y": 300,
      "width": 1160,
      "height": 2420,
      "radius": 140
    }
  },
  "galaxy-s22-plus/main": {
    "image": "/skins/galaxy-s22-plus/main/device.png",
    "foreground": "/skins/galaxy-s22-plus/main/foreground.png",
    "width": 1513,
    "height": 2770,
    "screen": {
      "x": 216,
      "y": 214,
      "width": 1080,
      "height": 2340
    },
    "body": {
      "x": 176,
      "y": 174,
      "width": 1160,
      "height": 2420,
      "radius": 140
    }
  },
  "galaxy-s22-ultra/main": {
    "image": "/skins/galaxy-s22-ultra/main/device.png",
    "foreground": "/skins/galaxy-s22-ultra/main/foreground.png",
    "width": 1856,
    "height": 3517,
    "screen": {
      "x": 208,
      "y": 204,
      "width": 1440,
      "height": 3088
    },
    "body": {
      "x": 168,
      "y": 164,
      "width": 1520,
      "height": 3168,
      "radius": 30
    }
  },
  "galaxy-s23/main": {
    "image": "/skins/galaxy-s23/main/device.png",
    "foreground": "/skins/galaxy-s23/main/foreground.png",
    "width": 1775,
    "height": 3035,
    "screen": {
      "x": 348,
      "y": 347,
      "width": 1080,
      "height": 2340
    },
    "body": {
      "x": 308,
      "y": 307,
      "width": 1160,
      "height": 2420,
      "radius": 145
    }
  },
  "galaxy-s23-fe/main": {
    "image": "/skins/galaxy-s23-fe/main/device.png",
    "foreground": "/skins/galaxy-s23-fe/main/foreground.png",
    "width": 1626,
    "height": 2899,
    "screen": {
      "x": 273,
      "y": 269,
      "width": 1080,
      "height": 2340
    },
    "body": {
      "x": 233,
      "y": 229,
      "width": 1160,
      "height": 2420,
      "radius": 145
    }
  },
  "galaxy-s23-plus/main": {
    "image": "/skins/galaxy-s23-plus/main/device.png",
    "foreground": "/skins/galaxy-s23-plus/main/foreground.png",
    "width": 1518,
    "height": 2782,
    "screen": {
      "x": 220,
      "y": 221,
      "width": 1080,
      "height": 2340
    },
    "body": {
      "x": 180,
      "y": 181,
      "width": 1160,
      "height": 2420,
      "radius": 135
    }
  },
  "galaxy-s23-ultra/main": {
    "image": "/skins/galaxy-s23-ultra/main/device.png",
    "foreground": "/skins/galaxy-s23-ultra/main/foreground.png",
    "width": 1853,
    "height": 3521,
    "screen": {
      "x": 207,
      "y": 209,
      "width": 1440,
      "height": 3088
    },
    "body": {
      "x": 167,
      "y": 169,
      "width": 1520,
      "height": 3168,
      "radius": 30
    }
  },
  "galaxy-s24/main": {
    "image": "/skins/galaxy-s24/main/device.png",
    "foreground": "/skins/galaxy-s24/main/foreground.png",
    "width": 1746,
    "height": 3006,
    "screen": {
      "x": 332,
      "y": 331,
      "width": 1080,
      "height": 2340
    },
    "body": {
      "x": 292,
      "y": 291,
      "width": 1160,
      "height": 2420,
      "radius": 135
    }
  },
  "galaxy-s24-fe/main": {
    "image": "/skins/galaxy-s24-fe/main/device.png",
    "foreground": "/skins/galaxy-s24-fe/main/foreground.png",
    "width": 1512,
    "height": 2777,
    "screen": {
      "x": 216,
      "y": 210,
      "width": 1080,
      "height": 2340
    },
    "body": {
      "x": 176,
      "y": 170,
      "width": 1160,
      "height": 2420,
      "radius": 155
    }
  },
  "galaxy-s24-plus/main": {
    "image": "/skins/galaxy-s24-plus/main/device.png",
    "foreground": "/skins/galaxy-s24-plus/main/foreground.png",
    "width": 1951,
    "height": 3636,
    "screen": {
      "x": 256,
      "y": 256,
      "width": 1440,
      "height": 3120
    },
    "body": {
      "x": 216,
      "y": 216,
      "width": 1520,
      "height": 3200,
      "radius": 165
    }
  },
  "galaxy-s24-ultra/main": {
    "image": "/skins/galaxy-s24-ultra/main/device.png",
    "foreground": "/skins/galaxy-s24-ultra/main/foreground.png",
    "width": 1898,
    "height": 3534,
    "screen": {
      "x": 229,
      "y": 208,
      "width": 1440,
      "height": 3120
    },
    "body": {
      "x": 189,
      "y": 168,
      "width": 1520,
      "height": 3200,
      "radius": 30
    }
  },
  "galaxy-s25/main": {
    "image": "/skins/galaxy-s25/main/device.png",
    "foreground": "/skins/galaxy-s25/main/foreground.png",
    "width": 1686,
    "height": 2939,
    "screen": {
      "x": 306,
      "y": 294,
      "width": 1080,
      "height": 2340
    },
    "body": {
      "x": 266,
      "y": 254,
      "width": 1160,
      "height": 2420,
      "radius": 160
    }
  },
  "galaxy-s25-edge/main": {
    "image": "/skins/galaxy-s25-edge/main/device.png",
    "foreground": "/skins/galaxy-s25-edge/main/foreground.png",
    "width": 1958,
    "height": 3626,
    "screen": {
      "x": 259,
      "y": 250,
      "width": 1440,
      "height": 3120
    },
    "body": {
      "x": 219,
      "y": 210,
      "width": 1520,
      "height": 3200,
      "radius": 140
    }
  },
  "galaxy-s25-fe/main": {
    "image": "/skins/galaxy-s25-fe/main/device.png",
    "foreground": "/skins/galaxy-s25-fe/main/foreground.png",
    "width": 1585,
    "height": 2840,
    "screen": {
      "x": 253,
      "y": 244,
      "width": 1080,
      "height": 2340
    },
    "body": {
      "x": 213,
      "y": 204,
      "width": 1160,
      "height": 2420,
      "radius": 145
    }
  },
  "galaxy-s26/main": {
    "image": "/skins/galaxy-s26/main/device.png",
    "foreground": "/skins/galaxy-s26/main/foreground.png",
    "width": 1785,
    "height": 3030,
    "screen": {
      "x": 352,
      "y": 341,
      "width": 1080,
      "height": 2340
    },
    "body": {
      "x": 312,
      "y": 301,
      "width": 1160,
      "height": 2420,
      "radius": 120
    }
  },
  "galaxy-s26-fe/main": {
    "image": "/skins/galaxy-s26-fe/main/device.png",
    "foreground": "/skins/galaxy-s26-fe/main/foreground.png",
    "width": 1585,
    "height": 2841,
    "screen": {
      "x": 252,
      "y": 243,
      "width": 1080,
      "height": 2340
    },
    "body": {
      "x": 212,
      "y": 203,
      "width": 1160,
      "height": 2420,
      "radius": 145
    }
  },
  "galaxy-s26-plus/main": {
    "image": "/skins/galaxy-s26-plus/main/device.png",
    "foreground": "/skins/galaxy-s26-plus/main/foreground.png",
    "width": 1961,
    "height": 3622,
    "screen": {
      "x": 261,
      "y": 251,
      "width": 1440,
      "height": 3120
    },
    "body": {
      "x": 221,
      "y": 211,
      "width": 1520,
      "height": 3200,
      "radius": 145
    }
  },
  "galaxy-s26-ultra/main": {
    "image": "/skins/galaxy-s26-ultra/main/device.png",
    "foreground": "/skins/galaxy-s26-ultra/main/foreground.png",
    "width": 1861,
    "height": 3523,
    "screen": {
      "x": 210,
      "y": 202,
      "width": 1440,
      "height": 3120
    },
    "body": {
      "x": 170,
      "y": 162,
      "width": 1520,
      "height": 3200,
      "radius": 140
    }
  },
  "galaxy-fold/cover": {
    "image": "/skins/galaxy-fold/cover/device.png",
    "foreground": "/skins/galaxy-fold/cover/foreground.png",
    "width": 1270,
    "height": 2798,
    "screen": {
      "x": 304,
      "y": 561,
      "width": 720,
      "height": 1680
    },
    "body": {
      "x": 264,
      "y": 521,
      "width": 800,
      "height": 1760,
      "radius": 100
    }
  },
  "galaxy-fold/main": {
    "image": "/skins/galaxy-fold/main/device.png",
    "foreground": "/skins/galaxy-fold/main/foreground.png",
    "width": 1954,
    "height": 2585,
    "screen": {
      "x": 209,
      "y": 217,
      "width": 1536,
      "height": 2152
    },
    "body": {
      "x": 169,
      "y": 177,
      "width": 1616,
      "height": 2232,
      "radius": 100
    }
  },
  "galaxy-tab-a11/main": {
    "image": "/skins/galaxy-tab-a11/main/device.png",
    "foreground": "/skins/galaxy-tab-a11/main/foreground.png",
    "width": 1041,
    "height": 1668,
    "screen": {
      "x": 120,
      "y": 164,
      "width": 800,
      "height": 1340
    },
    "body": {
      "x": 65,
      "y": 109,
      "width": 910,
      "height": 1450,
      "radius": 70
    }
  },
  "galaxy-tab-a11-plus/main": {
    "image": "/skins/galaxy-tab-a11-plus/main/device.png",
    "foreground": "/skins/galaxy-tab-a11-plus/main/foreground.png",
    "width": 1695,
    "height": 2395,
    "screen": {
      "x": 247,
      "y": 237,
      "width": 1200,
      "height": 1920
    },
    "body": {
      "x": 192,
      "y": 182,
      "width": 1310,
      "height": 2030,
      "radius": 70
    }
  },
  "galaxy-tab-a7-10-4-2022/main": {
    "image": "/skins/galaxy-tab-a7-10-4-2022/main/device.png",
    "foreground": "/skins/galaxy-tab-a7-10-4-2022/main/foreground.png",
    "width": 1697,
    "height": 2482,
    "screen": {
      "x": 248,
      "y": 240,
      "width": 1200,
      "height": 2000
    },
    "body": {
      "x": 193,
      "y": 185,
      "width": 1310,
      "height": 2110,
      "radius": 70
    }
  },
  "galaxy-tab-a7-lite/main": {
    "image": "/skins/galaxy-tab-a7-lite/main/device.png",
    "foreground": "/skins/galaxy-tab-a7-lite/main/foreground.png",
    "width": 1085,
    "height": 1684,
    "screen": {
      "x": 141,
      "y": 173,
      "width": 800,
      "height": 1340
    },
    "body": {
      "x": 86,
      "y": 118,
      "width": 910,
      "height": 1450,
      "radius": 70
    }
  },
  "galaxy-tab-a9/main": {
    "image": "/skins/galaxy-tab-a9/main/device.png",
    "foreground": "/skins/galaxy-tab-a9/main/foreground.png",
    "width": 1058,
    "height": 1645,
    "screen": {
      "x": 128,
      "y": 151,
      "width": 800,
      "height": 1340
    },
    "body": {
      "x": 73,
      "y": 96,
      "width": 910,
      "height": 1450,
      "radius": 70
    }
  },
  "galaxy-tab-a9-plus/main": {
    "image": "/skins/galaxy-tab-a9-plus/main/device.png",
    "foreground": "/skins/galaxy-tab-a9-plus/main/foreground.png",
    "width": 1684,
    "height": 2384,
    "screen": {
      "x": 242,
      "y": 232,
      "width": 1200,
      "height": 1920
    },
    "body": {
      "x": 187,
      "y": 177,
      "width": 1310,
      "height": 2030,
      "radius": 70
    }
  },
  "galaxy-tab-active3/main": {
    "image": "/skins/galaxy-tab-active3/main/device.png",
    "foreground": "/skins/galaxy-tab-active3/main/foreground.png",
    "width": 1724,
    "height": 2674,
    "screen": {
      "x": 260,
      "y": 378,
      "width": 1200,
      "height": 1920
    },
    "body": {
      "x": 160,
      "y": 278,
      "width": 1400,
      "height": 2120,
      "radius": 70
    }
  },
  "galaxy-tab-active4-pro/main": {
    "image": "/skins/galaxy-tab-active4-pro/main/device.png",
    "foreground": "/skins/galaxy-tab-active4-pro/main/foreground.png",
    "width": 2617,
    "height": 1845,
    "screen": {
      "x": 399,
      "y": 311,
      "width": 1920,
      "height": 1200
    },
    "body": {
      "x": 299,
      "y": 211,
      "width": 2120,
      "height": 1400,
      "radius": 70
    }
  },
  "galaxy-tab-active5/main": {
    "image": "/skins/galaxy-tab-active5/main/device.png",
    "foreground": "/skins/galaxy-tab-active5/main/foreground.png",
    "width": 1722,
    "height": 2673,
    "screen": {
      "x": 262,
      "y": 374,
      "width": 1200,
      "height": 1920
    },
    "body": {
      "x": 162,
      "y": 274,
      "width": 1400,
      "height": 2120,
      "radius": 70
    }
  },
  "galaxy-tab-active5-pro/main": {
    "image": "/skins/galaxy-tab-active5-pro/main/device.png",
    "foreground": "/skins/galaxy-tab-active5-pro/main/foreground.png",
    "width": 2462,
    "height": 1798,
    "screen": {
      "x": 271,
      "y": 293,
      "width": 1920,
      "height": 1200
    },
    "body": {
      "x": 171,
      "y": 193,
      "width": 2120,
      "height": 1400,
      "radius": 70
    }
  },
  "galaxy-tab-s10-fe/main": {
    "image": "/skins/galaxy-tab-s10-fe/main/device.png",
    "foreground": "/skins/galaxy-tab-s10-fe/main/foreground.png",
    "width": 1938,
    "height": 2788,
    "screen": {
      "x": 249,
      "y": 242,
      "width": 1440,
      "height": 2304
    },
    "body": {
      "x": 194,
      "y": 187,
      "width": 1550,
      "height": 2414,
      "radius": 70
    }
  },
  "galaxy-tab-s10-fe-plus/main": {
    "image": "/skins/galaxy-tab-s10-fe-plus/main/device.png",
    "foreground": "/skins/galaxy-tab-s10-fe-plus/main/foreground.png",
    "width": 2299,
    "height": 3361,
    "screen": {
      "x": 249,
      "y": 240,
      "width": 1800,
      "height": 2880
    },
    "body": {
      "x": 194,
      "y": 185,
      "width": 1910,
      "height": 2990,
      "radius": 70
    }
  },
  "galaxy-tab-s10-lite/main": {
    "image": "/skins/galaxy-tab-s10-lite/main/device.png",
    "foreground": "/skins/galaxy-tab-s10-lite/main/foreground.png",
    "width": 1813,
    "height": 2589,
    "screen": {
      "x": 240,
      "y": 238,
      "width": 1320,
      "height": 2112
    },
    "body": {
      "x": 185,
      "y": 183,
      "width": 1430,
      "height": 2222,
      "radius": 70
    }
  },
  "galaxy-tab-s10-plus/main": {
    "image": "/skins/galaxy-tab-s10-plus/main/device.png",
    "foreground": "/skins/galaxy-tab-s10-plus/main/foreground.png",
    "width": 2253,
    "height": 3280,
    "screen": {
      "x": 250,
      "y": 240,
      "width": 1752,
      "height": 2800
    },
    "body": {
      "x": 195,
      "y": 185,
      "width": 1862,
      "height": 2910,
      "radius": 70
    }
  },
  "galaxy-tab-s10-ultra/main": {
    "image": "/skins/galaxy-tab-s10-ultra/main/device.png",
    "foreground": "/skins/galaxy-tab-s10-ultra/main/foreground.png",
    "width": 2285,
    "height": 3377,
    "screen": {
      "x": 218,
      "y": 208,
      "width": 1848,
      "height": 2960
    },
    "body": {
      "x": 163,
      "y": 153,
      "width": 1958,
      "height": 3070,
      "radius": 70
    }
  },
  "galaxy-tab-s11/main": {
    "image": "/skins/galaxy-tab-s11/main/device.png",
    "foreground": "/skins/galaxy-tab-s11/main/foreground.png",
    "width": 2108,
    "height": 3049,
    "screen": {
      "x": 254,
      "y": 244,
      "width": 1600,
      "height": 2560
    },
    "body": {
      "x": 199,
      "y": 189,
      "width": 1710,
      "height": 2670,
      "radius": 70
    }
  },
  "galaxy-tab-s11-ultra/main": {
    "image": "/skins/galaxy-tab-s11-ultra/main/device.png",
    "foreground": "/skins/galaxy-tab-s11-ultra/main/foreground.png",
    "width": 2282,
    "height": 3377,
    "screen": {
      "x": 217,
      "y": 207,
      "width": 1848,
      "height": 2960
    },
    "body": {
      "x": 162,
      "y": 152,
      "width": 1958,
      "height": 3070,
      "radius": 70
    }
  },
  "galaxy-tab-s4-10-5/main": {
    "image": "/skins/galaxy-tab-s4-10-5/main/device.png",
    "foreground": null,
    "width": 2176,
    "height": 3111,
    "screen": {
      "x": 288,
      "y": 275,
      "width": 1600,
      "height": 2560
    },
    "body": {
      "x": 233,
      "y": 220,
      "width": 1710,
      "height": 2670,
      "radius": 70
    }
  },
  "galaxy-tab-s6/main": {
    "image": "/skins/galaxy-tab-s6/main/device.png",
    "foreground": "/skins/galaxy-tab-s6/main/foreground.png",
    "width": 2112,
    "height": 3052,
    "screen": {
      "x": 255,
      "y": 245,
      "width": 1600,
      "height": 2560
    },
    "body": {
      "x": 200,
      "y": 190,
      "width": 1710,
      "height": 2670,
      "radius": 70
    }
  },
  "galaxy-tab-s6-lite/main": {
    "image": "/skins/galaxy-tab-s6-lite/main/device.png",
    "foreground": "/skins/galaxy-tab-s6-lite/main/foreground.png",
    "width": 1680,
    "height": 2463,
    "screen": {
      "x": 240,
      "y": 231,
      "width": 1200,
      "height": 2000
    },
    "body": {
      "x": 185,
      "y": 176,
      "width": 1310,
      "height": 2110,
      "radius": 70
    }
  },
  "galaxy-tab-s7/main": {
    "image": "/skins/galaxy-tab-s7/main/device.png",
    "foreground": "/skins/galaxy-tab-s7/main/foreground.png",
    "width": 2099,
    "height": 3127,
    "screen": {
      "x": 249,
      "y": 238,
      "width": 1600,
      "height": 2650
    },
    "body": {
      "x": 194,
      "y": 183,
      "width": 1710,
      "height": 2760,
      "radius": 70
    }
  },
  "galaxy-tab-s7-fe/main": {
    "image": "/skins/galaxy-tab-s7-fe/main/device.png",
    "foreground": "/skins/galaxy-tab-s7-fe/main/foreground.png",
    "width": 2089,
    "height": 3034,
    "screen": {
      "x": 245,
      "y": 237,
      "width": 1600,
      "height": 2560
    },
    "body": {
      "x": 190,
      "y": 182,
      "width": 1710,
      "height": 2670,
      "radius": 70
    }
  },
  "galaxy-tab-s7-plus/main": {
    "image": "/skins/galaxy-tab-s7-plus/main/device.png",
    "foreground": "/skins/galaxy-tab-s7-plus/main/foreground.png",
    "width": 2249,
    "height": 3276,
    "screen": {
      "x": 248,
      "y": 238,
      "width": 1752,
      "height": 2800
    },
    "body": {
      "x": 193,
      "y": 183,
      "width": 1862,
      "height": 2910,
      "radius": 70
    }
  },
  "galaxy-tab-s8/main": {
    "image": "/skins/galaxy-tab-s8/main/device.png",
    "foreground": "/skins/galaxy-tab-s8/main/foreground.png",
    "width": 2453,
    "height": 3396,
    "screen": {
      "x": 426,
      "y": 419,
      "width": 1600,
      "height": 2560
    },
    "body": {
      "x": 371,
      "y": 364,
      "width": 1710,
      "height": 2670,
      "radius": 70
    }
  },
  "galaxy-tab-s8-plus/main": {
    "image": "/skins/galaxy-tab-s8-plus/main/device.png",
    "foreground": "/skins/galaxy-tab-s8-plus/main/foreground.png",
    "width": 2251,
    "height": 3277,
    "screen": {
      "x": 249,
      "y": 240,
      "width": 1752,
      "height": 2800
    },
    "body": {
      "x": 194,
      "y": 185,
      "width": 1862,
      "height": 2910,
      "radius": 70
    }
  },
  "galaxy-tab-s9/main": {
    "image": "/skins/galaxy-tab-s9/main/device.png",
    "foreground": "/skins/galaxy-tab-s9/main/foreground.png",
    "width": 2121,
    "height": 3060,
    "screen": {
      "x": 261,
      "y": 250,
      "width": 1600,
      "height": 2560
    },
    "body": {
      "x": 206,
      "y": 195,
      "width": 1710,
      "height": 2670,
      "radius": 70
    }
  },
  "galaxy-tab-s9-fe/main": {
    "image": "/skins/galaxy-tab-s9-fe/main/device.png",
    "foreground": "/skins/galaxy-tab-s9-fe/main/foreground.png",
    "width": 1937,
    "height": 2787,
    "screen": {
      "x": 248,
      "y": 242,
      "width": 1440,
      "height": 2304
    },
    "body": {
      "x": 193,
      "y": 187,
      "width": 1550,
      "height": 2414,
      "radius": 70
    }
  },
  "galaxy-tab-s9-fe-plus/main": {
    "image": "/skins/galaxy-tab-s9-fe-plus/main/device.png",
    "foreground": "/skins/galaxy-tab-s9-fe-plus/main/foreground.png",
    "width": 2098,
    "height": 3040,
    "screen": {
      "x": 249,
      "y": 240,
      "width": 1600,
      "height": 2560
    },
    "body": {
      "x": 194,
      "y": 185,
      "width": 1710,
      "height": 2670,
      "radius": 70
    }
  },
  "galaxy-tab-s9-plus/main": {
    "image": "/skins/galaxy-tab-s9-plus/main/device.png",
    "foreground": "/skins/galaxy-tab-s9-plus/main/foreground.png",
    "width": 2253,
    "height": 3283,
    "screen": {
      "x": 248,
      "y": 242,
      "width": 1752,
      "height": 2800
    },
    "body": {
      "x": 193,
      "y": 187,
      "width": 1862,
      "height": 2910,
      "radius": 70
    }
  },
  "galaxy-tab-s9-ultra/main": {
    "image": "/skins/galaxy-tab-s9-ultra/main/device.png",
    "foreground": "/skins/galaxy-tab-s9-ultra/main/foreground.png",
    "width": 2290,
    "height": 3382,
    "screen": {
      "x": 221,
      "y": 210,
      "width": 1848,
      "height": 2960
    },
    "body": {
      "x": 166,
      "y": 155,
      "width": 1958,
      "height": 3070,
      "radius": 70
    }
  },
  "galaxy-z-flip/main": {
    "image": "/skins/galaxy-z-flip/main/device.png",
    "foreground": "/skins/galaxy-z-flip/main/foreground.png",
    "width": 1544,
    "height": 3084,
    "screen": {
      "x": 228,
      "y": 224,
      "width": 1080,
      "height": 2636
    },
    "body": {
      "x": 188,
      "y": 184,
      "width": 1160,
      "height": 2716,
      "radius": 100
    }
  },
  "galaxy-z-flip3/main": {
    "image": "/skins/galaxy-z-flip3/main/device.png",
    "foreground": "/skins/galaxy-z-flip3/main/foreground.png",
    "width": 1526,
    "height": 3083,
    "screen": {
      "x": 223,
      "y": 218,
      "width": 1080,
      "height": 2640
    },
    "body": {
      "x": 183,
      "y": 178,
      "width": 1160,
      "height": 2720,
      "radius": 100
    }
  },
  "galaxy-z-flip4/main": {
    "image": "/skins/galaxy-z-flip4/main/device.png",
    "foreground": "/skins/galaxy-z-flip4/main/foreground.png",
    "width": 1500,
    "height": 3049,
    "screen": {
      "x": 210,
      "y": 202,
      "width": 1080,
      "height": 2640
    },
    "body": {
      "x": 170,
      "y": 162,
      "width": 1160,
      "height": 2720,
      "radius": 100
    }
  },
  "galaxy-z-flip6/main": {
    "image": "/skins/galaxy-z-flip6/main/device.png",
    "foreground": "/skins/galaxy-z-flip6/main/foreground.png",
    "width": 1523,
    "height": 3066,
    "screen": {
      "x": 223,
      "y": 211,
      "width": 1080,
      "height": 2640
    },
    "body": {
      "x": 183,
      "y": 171,
      "width": 1160,
      "height": 2720,
      "radius": 100
    }
  },
  "galaxy-z-flip7/cover": {
    "image": "/skins/galaxy-z-flip7/cover/device.png",
    "foreground": "/skins/galaxy-z-flip7/cover/foreground.png",
    "width": 1334,
    "height": 1452,
    "screen": {
      "x": 193,
      "y": 220,
      "width": 948,
      "height": 1048
    },
    "body": {
      "x": 153,
      "y": 180,
      "width": 1028,
      "height": 1128,
      "radius": 100
    }
  },
  "galaxy-z-flip7/main": {
    "image": "/skins/galaxy-z-flip7/main/device.png",
    "foreground": "/skins/galaxy-z-flip7/main/foreground.png",
    "width": 1504,
    "height": 2924,
    "screen": {
      "x": 213,
      "y": 201,
      "width": 1080,
      "height": 2520
    },
    "body": {
      "x": 173,
      "y": 161,
      "width": 1160,
      "height": 2600,
      "radius": 100
    }
  },
  "galaxy-z-flip7-fe/main": {
    "image": "/skins/galaxy-z-flip7-fe/main/device.png",
    "foreground": "/skins/galaxy-z-flip7-fe/main/foreground.png",
    "width": 1630,
    "height": 3158,
    "screen": {
      "x": 281,
      "y": 258,
      "width": 1080,
      "height": 2640
    },
    "body": {
      "x": 241,
      "y": 218,
      "width": 1160,
      "height": 2720,
      "radius": 100
    }
  },
  "galaxy-z-fold2/cover": {
    "image": "/skins/galaxy-z-fold2/cover/device.png",
    "foreground": "/skins/galaxy-z-fold2/cover/foreground.png",
    "width": 1332,
    "height": 2693,
    "screen": {
      "x": 309,
      "y": 215,
      "width": 816,
      "height": 2260
    },
    "body": {
      "x": 269,
      "y": 175,
      "width": 896,
      "height": 2340,
      "radius": 100
    }
  },
  "galaxy-z-fold2/main": {
    "image": "/skins/galaxy-z-fold2/main/device.png",
    "foreground": "/skins/galaxy-z-fold2/main/foreground.png",
    "width": 2193,
    "height": 2629,
    "screen": {
      "x": 213,
      "y": 210,
      "width": 1768,
      "height": 2208
    },
    "body": {
      "x": 173,
      "y": 170,
      "width": 1848,
      "height": 2288,
      "radius": 100
    }
  },
  "galaxy-z-fold4/cover": {
    "image": "/skins/galaxy-z-fold4/cover/device.png",
    "foreground": "/skins/galaxy-z-fold4/cover/foreground.png",
    "width": 1371,
    "height": 2740,
    "screen": {
      "x": 259,
      "y": 212,
      "width": 904,
      "height": 2316
    },
    "body": {
      "x": 219,
      "y": 172,
      "width": 984,
      "height": 2396,
      "radius": 100
    }
  },
  "galaxy-z-fold4/main": {
    "image": "/skins/galaxy-z-fold4/main/device.png",
    "foreground": "/skins/galaxy-z-fold4/main/foreground.png",
    "width": 2210,
    "height": 2554,
    "screen": {
      "x": 199,
      "y": 189,
      "width": 1812,
      "height": 2176
    },
    "body": {
      "x": 159,
      "y": 149,
      "width": 1892,
      "height": 2256,
      "radius": 100
    }
  },
  "galaxy-z-fold5/cover": {
    "image": "/skins/galaxy-z-fold5/cover/device.png",
    "foreground": "/skins/galaxy-z-fold5/cover/foreground.png",
    "width": 1374,
    "height": 2742,
    "screen": {
      "x": 259,
      "y": 202,
      "width": 904,
      "height": 2316
    },
    "body": {
      "x": 219,
      "y": 162,
      "width": 984,
      "height": 2396,
      "radius": 100
    }
  },
  "galaxy-z-fold5/main": {
    "image": "/skins/galaxy-z-fold5/main/device.png",
    "foreground": "/skins/galaxy-z-fold5/main/foreground.png",
    "width": 2212,
    "height": 2555,
    "screen": {
      "x": 200,
      "y": 192,
      "width": 1812,
      "height": 2176
    },
    "body": {
      "x": 160,
      "y": 152,
      "width": 1892,
      "height": 2256,
      "radius": 100
    }
  },
  "galaxy-z-fold6/cover": {
    "image": "/skins/galaxy-z-fold6/cover/device.png",
    "foreground": "/skins/galaxy-z-fold6/cover/foreground.png",
    "width": 1416,
    "height": 2774,
    "screen": {
      "x": 241,
      "y": 196,
      "width": 968,
      "height": 2376
    },
    "body": {
      "x": 201,
      "y": 156,
      "width": 1048,
      "height": 2456,
      "radius": 100
    }
  },
  "galaxy-z-fold6/main": {
    "image": "/skins/galaxy-z-fold6/main/device.png",
    "foreground": "/skins/galaxy-z-fold6/main/foreground.png",
    "width": 2270,
    "height": 2558,
    "screen": {
      "x": 206,
      "y": 198,
      "width": 1856,
      "height": 2160
    },
    "body": {
      "x": 166,
      "y": 158,
      "width": 1936,
      "height": 2240,
      "radius": 100
    }
  },
  "galaxy-z-fold7/cover": {
    "image": "/skins/galaxy-z-fold7/cover/device.png",
    "foreground": "/skins/galaxy-z-fold7/cover/foreground.png",
    "width": 1526,
    "height": 2931,
    "screen": {
      "x": 232,
      "y": 206,
      "width": 1080,
      "height": 2520
    },
    "body": {
      "x": 192,
      "y": 166,
      "width": 1160,
      "height": 2600,
      "radius": 100
    }
  },
  "galaxy-z-fold7/main": {
    "image": "/skins/galaxy-z-fold7/main/device.png",
    "foreground": "/skins/galaxy-z-fold7/main/foreground.png",
    "width": 2395,
    "height": 2597,
    "screen": {
      "x": 214,
      "y": 207,
      "width": 1968,
      "height": 2184
    },
    "body": {
      "x": 174,
      "y": 167,
      "width": 2048,
      "height": 2264,
      "radius": 100
    }
  },
  "galaxy-z-fold8-ultra/cover": {
    "image": "/skins/galaxy-z-fold8-ultra/cover/device.png",
    "foreground": "/skins/galaxy-z-fold8-ultra/cover/foreground.png",
    "width": 1528,
    "height": 2942,
    "screen": {
      "x": 232,
      "y": 206,
      "width": 1080,
      "height": 2520
    },
    "body": {
      "x": 192,
      "y": 166,
      "width": 1160,
      "height": 2600,
      "radius": 100
    }
  },
  "galaxy-z-fold8-ultra/main": {
    "image": "/skins/galaxy-z-fold8-ultra/main/device.png",
    "foreground": "/skins/galaxy-z-fold8-ultra/main/foreground.png",
    "width": 2706,
    "height": 2932,
    "screen": {
      "x": 225,
      "y": 213,
      "width": 2256,
      "height": 2504
    },
    "body": {
      "x": 185,
      "y": 173,
      "width": 2336,
      "height": 2584,
      "radius": 100
    }
  },
  "galaxy-z-fold3/cover": {
    "image": "/skins/galaxy-z-fold3/cover/device.png",
    "foreground": "/skins/galaxy-z-fold3/cover/foreground.png",
    "width": 1342,
    "height": 2708,
    "screen": {
      "x": 299,
      "y": 220,
      "width": 832,
      "height": 2268
    },
    "body": {
      "x": 259,
      "y": 180,
      "width": 912,
      "height": 2348,
      "radius": 100
    }
  },
  "galaxy-z-fold3/main": {
    "image": "/skins/galaxy-z-fold3/main/device.png",
    "foreground": "/skins/galaxy-z-fold3/main/foreground.png",
    "width": 2217,
    "height": 2640,
    "screen": {
      "x": 224,
      "y": 216,
      "width": 1768,
      "height": 2208
    },
    "body": {
      "x": 184,
      "y": 176,
      "width": 1848,
      "height": 2288,
      "radius": 100
    }
  },
  "galaxy-z-flip5/main": {
    "image": "/skins/galaxy-z-flip5/main/device.png",
    "foreground": "/skins/galaxy-z-flip5/main/foreground.png",
    "width": 1507,
    "height": 3062,
    "screen": {
      "x": 214,
      "y": 210,
      "width": 1080,
      "height": 2640
    },
    "body": {
      "x": 174,
      "y": 170,
      "width": 1160,
      "height": 2720,
      "radius": 100
    }
  }
};
