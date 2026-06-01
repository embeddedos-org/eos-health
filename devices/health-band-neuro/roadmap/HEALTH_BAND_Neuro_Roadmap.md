# HEALTH-BAND Neuro: Product Roadmap

This document outlines the development trajectory for the HEALTH-BAND Neuro, detailing the progression from the V1 hardware to future iterations incorporating advanced display technologies and expanded sensor capabilities.

---

## Phase 1: V1 Hardware (Current)
**Status:** Design Complete, Provisional Patent Filed

The V1 hardware establishes the foundational Zero-Hole Architecture and the core sensor suite.

*   **Architecture:** Dual-purpose USB-C clasp mechanism (Zero-Hole design).
*   **Display:** 0.49-inch Micro OLED (flush-mounted).
*   **Storage:** 64GB NAND Flash (USB MSC capability).
*   **Power:** 200mAh Li-Po battery with pass-through charging.
*   **Sensors:** HR/SpO2, ECG, BAC (Fuel Cell), VOC, Skin Temp, IMU, UV.
*   **Neuromodulation:** sEMG gesture input and TENS therapeutic output via 6x platinum electrodes.
*   **Connectivity:** BLE 5.3 and USB 2.0 FS.

## Phase 2: Firmware and Algorithm Refinement (Next 6-12 Months)
**Status:** In Progress

Focus shifts to optimizing the software stack running on the nRF52840 to fully utilize the V1 hardware capabilities.

*   **sEMG Machine Learning:** Train on-device TinyML models to accurately classify complex hand gestures (e.g., pinch, swipe, fist clench) for UI navigation without touching the display.
*   **TENS Protocol Development:** Develop specific electrical stimulation profiles for pain management, muscle recovery, and potentially tactile feedback (haptics via electrical stimulation).
*   **BAC Calibration:** Refine the Venturi channel airflow dynamics and sensor calibration algorithms for the Dart fuel cell to ensure law-enforcement-grade accuracy.

## Phase 3: V2 Hardware - The Holographic CIP (18-24 Months)
**Status:** Conceptual, CIP Patent Strategy Defined

The V2 iteration will focus on replacing the conventional OLED display with the technology outlined in the Continuation-In-Part (CIP) patent claim.

*   **Display Evolution:** Transition from the rigid Micro OLED panel to a flexible micro-LED array positioned behind a holographic diffuser film.
*   **Aesthetic Impact:** Achieve a truly bezel-less design where the display metrics appear to float on the surface of the carbon fiber band.
*   **Structural Impact:** Improved durability and flexibility by eliminating the glass/rigid substrate of the OLED panel.
*   **Sensor Expansion:** Investigate the integration of non-invasive continuous glucose monitoring (CBM) via advanced optical or transdermal techniques.

## Phase 4: V3 Hardware - Clinical Integration (36+ Months)
**Status:** Future Planning

The V3 iteration aims to position the HEALTH-BAND Neuro as a certified medical device rather than a consumer health tracker.

*   **FDA/CE Certification:** Pursue formal regulatory approval for the ECG, BAC, and TENS functionalities.
*   **Closed-Loop Therapy:** Implement closed-loop systems where biometric data (e.g., tremor detection via IMU or stress markers via HRV/GSR) automatically triggers specific TENS/neuromodulation protocols.
*   **Material Science:** Explore advanced biocompatible materials for the band and electrodes to support permanent, multi-week continuous wear.
