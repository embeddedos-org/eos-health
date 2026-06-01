# HEALTH-KEY ULTRA — CAD Files (48×18×9.5 mm)

This directory will contain all mechanical design files for the HEALTH-KEY ULTRA enclosure.

## Required Files

| File | Description | Software |
| :--- | :--- | :--- |
| `healthkey_ultra_enclosure_top.step` | Top shell with breath inlet, LED light pipe, and USB-C Male cutout | SolidWorks / Fusion 360 |
| `healthkey_ultra_enclosure_bottom.step` | Bottom shell with keyring loop and electrode contact pads | SolidWorks / Fusion 360 |
| `healthkey_ultra_venturi_channel.step` | Internal co-axial Venturi breath channel with PTFE membrane seat | SolidWorks / Fusion 360 |
| `healthkey_ultra_enclosure_top.stl` | 3D-printable STL for prototyping (top shell) | Any slicer |
| `healthkey_ultra_enclosure_bottom.stl` | 3D-printable STL for prototyping (bottom shell) | Any slicer |
| `healthkey_ultra_assembly.step` | Full assembly with all components | SolidWorks / Fusion 360 |

## Design Constraints

The enclosure must accommodate a 6-layer HDI PCB measuring 44×14mm, a 40mAh Li-Po battery, and the Dart electrochemical fuel cell. The USB-C Male connector shield must be electrically isolated from the PCB ground plane to serve as a biopotential ECG electrode. Wall thickness is a minimum of 0.8mm to maintain structural integrity.
