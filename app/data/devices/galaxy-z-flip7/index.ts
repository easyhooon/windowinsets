import type { Device } from "../../types";

// PPI and diagonal are not inferred from captures.
export const galaxyZFlip7: Device = {
  "slug": "galaxy-z-flip7",
  "name": "Galaxy Z Flip7",
  "brand": "Samsung",
  "series": "Galaxy Z Flip",
  "formFactor": "foldable-flip",
  "foldAnimation": true,
  "releaseYear": 2025,
  "screens": [
    {
      "id": "cover",
      "label": "Cover",
      "diagonalInch": 0,
      "resolutionPx": {
        "width": 948,
        "height": 1048
      },
      "ppi": 0,
      "logicalSizeDp": {
        "width": 361.14,
        "height": 399.24
      },
      "densityDpi": 420,
      "cornerRadiiDp": {
        "topLeft": 6.1,
        "topRight": 6.1,
        "bottomRight": 41.14,
        "bottomLeft": 41.14
      },
      "insets": {
        "threeButton": {
          "systemBars": {
            "top": 0,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "displayCutout": {
            "top": 0,
            "right": 0,
            "bottom": 83.81,
            "left": 0
          },
          "cutoutShape": {
            "xPx": 428,
            "yPx": 828,
            "widthPx": 520,
            "heightPx": 220,
            "rightPx": 0,
            "bottomPx": 0,
            "xDp": 163.05,
            "yDp": 315.43,
            "widthDp": 198.1,
            "heightDp": 83.81,
            "rightDp": 0.0,
            "bottomDp": 0.0
          },
          "condition": {
            "oneUi": "8.5",
            "android": "16",
            "note": "Physical device, build BP4A.251205.006.F766NKSSCBZH3, closed (0\u00b0), portrait; Probe explicitly launched on cover display 1 through ADB, full screen and awake. Density 420 dpi (2.625 scale), font scale 1.0; defaultDensityDpi 480 is the primary-display property, not a cover default. No system bars are exposed on this cover window. Navigation classification falls back to the selected Android setting; it does not imply visible navigation buttons or gestures. Rotation only rotates the recorded portrait diagram."
          },
          "sources": [
            {
              "kind": "measured",
              "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 cover (SM-F766N), threeButton setting",
              "url": "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-flip7/cover-threeButton-awake.json",
              "retrievedAt": "2026-09-23"
            }
          ],
          "systemBarsPx": {
            "top": 0,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "displayCutoutPx": {
            "top": 0,
            "right": 0,
            "bottom": 220,
            "left": 0
          }
        },
        "gesture": {
          "systemBars": {
            "top": 0,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "displayCutout": {
            "top": 0,
            "right": 0,
            "bottom": 83.81,
            "left": 0
          },
          "cutoutShape": {
            "xPx": 428,
            "yPx": 828,
            "widthPx": 520,
            "heightPx": 220,
            "rightPx": 0,
            "bottomPx": 0,
            "xDp": 163.05,
            "yDp": 315.43,
            "widthDp": 198.1,
            "heightDp": 83.81,
            "rightDp": 0.0,
            "bottomDp": 0.0
          },
          "condition": {
            "oneUi": "8.5",
            "android": "16",
            "note": "Physical device, build BP4A.251205.006.F766NKSSCBZH3, closed (0\u00b0), portrait; Probe explicitly launched on cover display 1 through ADB, full screen and awake. Density 420 dpi (2.625 scale), font scale 1.0; defaultDensityDpi 480 is the primary-display property, not a cover default. No system bars are exposed on this cover window. Navigation classification falls back to the selected Android setting; it does not imply visible navigation buttons or gestures. Rotation only rotates the recorded portrait diagram."
          },
          "sources": [
            {
              "kind": "measured",
              "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 cover (SM-F766N), gesture setting",
              "url": "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-flip7/cover-gesture.json",
              "retrievedAt": "2026-09-23"
            }
          ],
          "systemBarsPx": {
            "top": 0,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "displayCutoutPx": {
            "top": 0,
            "right": 0,
            "bottom": 220,
            "left": 0
          }
        }
      },
      "sources": [
        {
          "kind": "measured",
          "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 cover (SM-F766N), threeButton setting",
          "url": "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-flip7/cover-threeButton-awake.json",
          "retrievedAt": "2026-09-23"
        },
        {
          "kind": "measured",
          "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 cover (SM-F766N), gesture setting",
          "url": "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-flip7/cover-gesture.json",
          "retrievedAt": "2026-09-23"
        }
      ],
      "logicalSizePx": {
        "width": 948,
        "height": 1048
      },
      "captureOrientation": "portrait",
      "cornerRadiiPx": {
        "topLeft": 16,
        "topRight": 16,
        "bottomRight": 108,
        "bottomLeft": 108
      }
    },
    {
      "id": "main",
      "label": "Main",
      "diagonalInch": 0,
      "resolutionPx": {
        "width": 1080,
        "height": 2520
      },
      "ppi": 0,
      "logicalSizeDp": {
        "width": 360.0,
        "height": 840.0
      },
      "densityDpi": 480,
      "cornerRadiiDp": {
        "topLeft": 22,
        "topRight": 22,
        "bottomRight": 22,
        "bottomLeft": 22
      },
      "insets": {
        "gesture": {
          "systemBars": {
            "top": 36.33,
            "right": 0,
            "bottom": 15,
            "left": 0
          },
          "displayCutout": {
            "top": 36.33,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "cutoutShape": {
            "xPx": 504,
            "yPx": 0,
            "widthPx": 72,
            "heightPx": 109,
            "rightPx": 504,
            "bottomPx": 2411,
            "xDp": 168.0,
            "yDp": 0.0,
            "widthDp": 24.0,
            "heightDp": 36.33,
            "rightDp": 168.0,
            "bottomDp": 803.67
          },
          "condition": {
            "oneUi": "8.5",
            "android": "16",
            "note": "Physical device, build BP4A.251205.006.F766NKSSCBZH3, fully open (180\u00b0), portrait, full screen; density 480 dpi matches default; font scale 1.0. View rotation only rotates this portrait capture; landscape insets were not measured."
          },
          "sources": [
            {
              "kind": "measured",
              "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 (SM-F766N), gesture",
              "url": "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-flip7/main-gesture.json",
              "retrievedAt": "2026-09-23"
            }
          ],
          "systemBarsPx": {
            "top": 109,
            "right": 0,
            "bottom": 45,
            "left": 0
          },
          "displayCutoutPx": {
            "top": 109,
            "right": 0,
            "bottom": 0,
            "left": 0
          }
        },
        "threeButton": {
          "systemBars": {
            "top": 36.33,
            "right": 0,
            "bottom": 48,
            "left": 0
          },
          "displayCutout": {
            "top": 36.33,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "cutoutShape": {
            "xPx": 504,
            "yPx": 0,
            "widthPx": 72,
            "heightPx": 109,
            "rightPx": 504,
            "bottomPx": 2411,
            "xDp": 168.0,
            "yDp": 0.0,
            "widthDp": 24.0,
            "heightDp": 36.33,
            "rightDp": 168.0,
            "bottomDp": 803.67
          },
          "condition": {
            "oneUi": "8.5",
            "android": "16",
            "note": "Physical device, build BP4A.251205.006.F766NKSSCBZH3, fully open (180\u00b0), portrait, full screen; density 480 dpi matches default; font scale 1.0. View rotation only rotates this portrait capture; landscape insets were not measured."
          },
          "sources": [
            {
              "kind": "measured",
              "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 (SM-F766N), threeButton",
              "url": "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-flip7/main-threeButton.json",
              "retrievedAt": "2026-09-23"
            }
          ],
          "systemBarsPx": {
            "top": 109,
            "right": 0,
            "bottom": 144,
            "left": 0
          },
          "displayCutoutPx": {
            "top": 109,
            "right": 0,
            "bottom": 0,
            "left": 0
          }
        }
      },
      "sources": [
        {
          "kind": "measured",
          "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 (SM-F766N), gesture",
          "url": "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-flip7/main-gesture.json",
          "retrievedAt": "2026-09-23"
        },
        {
          "kind": "measured",
          "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 (SM-F766N), threeButton",
          "url": "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-flip7/main-threeButton.json",
          "retrievedAt": "2026-09-23"
        }
      ],
      "logicalSizePx": {
        "width": 1080,
        "height": 2520
      },
      "captureOrientation": "portrait",
      "cornerRadiiPx": {
        "topLeft": 66,
        "topRight": 66,
        "bottomRight": 66,
        "bottomLeft": 66
      }
    }
  ],
  "sources": [
    {
      "kind": "measured",
      "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 (SM-F766N), gesture",
      "url": "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-flip7/main-gesture.json",
      "retrievedAt": "2026-09-23"
    },
    {
      "kind": "measured",
      "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 (SM-F766N), threeButton",
      "url": "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-flip7/main-threeButton.json",
      "retrievedAt": "2026-09-23"
    },
    {
      "kind": "measured",
      "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 cover (SM-F766N), threeButton setting",
      "url": "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-flip7/cover-threeButton-awake.json",
      "retrievedAt": "2026-09-23"
    },
    {
      "kind": "measured",
      "label": "InsetsProbe 1.1.2 on physical Galaxy Z Flip7 cover (SM-F766N), gesture setting",
      "url": "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-flip7/cover-gesture.json",
      "retrievedAt": "2026-09-23"
    }
  ]
};
