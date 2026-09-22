import type { Device } from "../../types";

// Raw captures are immutable. PPI and diagonal remain unsourced; do not infer them.
export const galaxyZFold2: Device = {
  "slug": "galaxy-z-fold2",
  "name": "Galaxy Z Fold2",
  "brand": "Samsung",
  "series": "Galaxy Z Fold",
  "formFactor": "foldable-book",
  "releaseYear": 2020,
  "screens": [
    {
      "id": "cover",
      "label": "Cover",
      "diagonalInch": 0,
      "resolutionPx": {
        "width": 960,
        "height": 2658
      },
      "ppi": 0,
      "logicalSizeDp": {
        "width": 320,
        "height": 886
      },
      "densityDpi": 480,
      "cornerRadiiDp": null,
      "insets": {
        "gesture": null,
        "threeButton": {
          "systemBars": {
            "top": 31,
            "right": 0,
            "bottom": 48,
            "left": 0
          },
          "displayCutout": {
            "top": 30.67,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "cutoutShape": {
            "xDp": 148,
            "yDp": 0,
            "widthDp": 24,
            "heightDp": 30.67
          },
          "condition": {
            "oneUi": "5.1.1",
            "android": "13",
            "note": "Physical device, closed, portrait; font scale 0.8; density 480 dpi. Captured app window is 960×2658 px (320×886 dp), while wm reports a physical panel of 816×2260. A size reset retained the 960×2658 override; its origin is unverified. These values describe the observed app configuration, not every Fold2. Hinge-angle sensor and rounded corners unavailable."
          },
          "sources": [
            {
              "kind": "measured",
              "label": "InsetsProbe 1.1.1 on physical Galaxy Z Fold2 cover (SM-F916N)",
              "url": "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-fold2/cover-threeButton.json",
              "retrievedAt": "2026-09-22"
            }
          ]
        }
      },
      "sources": [
        {
          "kind": "measured",
          "label": "InsetsProbe 1.1.1 on physical Galaxy Z Fold2 cover (SM-F916N)",
          "url": "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-fold2/cover-threeButton.json",
          "retrievedAt": "2026-09-22"
        }
      ]
    },
    {
      "id": "main",
      "label": "Main",
      "diagonalInch": 0,
      "resolutionPx": {
        "width": 1768,
        "height": 2208
      },
      "ppi": 0,
      "logicalSizeDp": {
        "width": 589.33,
        "height": 736
      },
      "densityDpi": 480,
      "cornerRadiiDp": {
        "topLeft": 20,
        "topRight": 20,
        "bottomRight": 20,
        "bottomLeft": 20
      },
      "insets": {
        "gesture": null,
        "threeButton": {
          "systemBars": {
            "top": 29.33,
            "right": 0,
            "bottom": 48,
            "left": 0
          },
          "displayCutout": {
            "top": 29.33,
            "right": 0,
            "bottom": 0,
            "left": 0
          },
          "cutoutShape": {
            "xDp": 436.33,
            "yDp": 0,
            "widthDp": 25,
            "heightDp": 29.33
          },
          "condition": {
            "oneUi": "5.1.1",
            "android": "13",
            "note": "Physical device; portrait; font scale 0.8; density 480 dpi (matches reported default). Full-window dimensions include system bars. Hinge-angle sensor unavailable; WindowManager reports FLAT."
          },
          "sources": [
            {
              "kind": "measured",
              "label": "InsetsProbe 1.1.1 on physical Galaxy Z Fold2 (SM-F916N)",
              "url": "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-fold2/main-threeButton.json",
              "retrievedAt": "2026-09-22"
            }
          ]
        }
      },
      "sources": [
        {
          "kind": "measured",
          "label": "InsetsProbe 1.1.1 on physical Galaxy Z Fold2 (SM-F916N)",
          "url": "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-fold2/main-threeButton.json",
          "retrievedAt": "2026-09-22"
        }
      ]
    }
  ],
  "sources": [
    {
      "kind": "measured",
      "label": "InsetsProbe 1.1.1 on physical Galaxy Z Fold2 (SM-F916N)",
      "url": "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-fold2/main-threeButton.json",
      "retrievedAt": "2026-09-22"
    },
    {
      "kind": "measured",
      "label": "InsetsProbe 1.1.1 on physical Galaxy Z Fold2 cover (SM-F916N)",
      "url": "https://github.com/easyhooon/windowinsets/blob/main/measurements/galaxy-z-fold2/cover-threeButton.json",
      "retrievedAt": "2026-09-22"
    }
  ]
};
