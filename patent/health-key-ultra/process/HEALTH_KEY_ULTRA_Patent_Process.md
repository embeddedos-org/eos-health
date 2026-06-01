# HEALTH-KEY ULTRA: Patent Process and Timeline

**Inventor:** Srikanth Patchava
**Assignee:** Embedded Operating Systems Research Foundation (EoS)
**Core Patent:** US Provisional App. No. 64/073,334 (Filed May 23, 2026)

This document outlines the strategic roadmap for securing intellectual property rights for the HEALTH-KEY ULTRA, detailing the transition from provisional filing to non-provisional status, and the execution of the Continuation-In-Part (CIP) strategy.

---

## Phase 1: Provisional Patent (Current Status)

The provisional patent establishes the priority date and secures the core architecture of the HEALTH-KEY ULTRA.

*   **Filing Date:** May 23, 2026
*   **Expiration Date:** May 23, 2027 (12-month window)
*   **Core Claims Protected:**
    *   **USB-C Shield as Sensor Input:** Utilizing the grounded metal shield of a USB Type-C connector as the primary electrical contact for dual-channel Blood Alcohol Content (BAC) sensing.
    *   **Ground Pin ECG:** Utilizing the USB-C ground pin in conjunction with the shield for single-lead electrocardiogram (ECG) acquisition.
    *   **Mass Storage Integration:** The specific hardware topology allowing the nRF52840 MCU to enumerate 64GB of NAND flash as a USB Mass Storage Class (MSC) device while simultaneously routing analog sensor data.

**Action Items (Phase 1):**
*   [x] File Provisional Application.
*   [x] Generate engineering block diagrams (Fig 1-3).
*   [ ] Draft full non-provisional claims based on prototype testing.

---

## Phase 2: Non-Provisional Utility Patent (Months 6-10)

Before the provisional expires, a full non-provisional utility patent application must be filed to begin the formal examination process.

*   **Target Filing Date:** November 2026 - March 2027
*   **Required Documentation:**
    *   Formal claim set (independent and dependent claims).
    *   Detailed description of the preferred embodiment.
    *   Formal USPTO-compliant drawings.
*   **Strategy:** Claim the specific circuit topology that allows the USB-C shield to switch between standard grounding and high-impedance analog input without violating USB-IF specifications.

---

## Phase 3: Continuation-In-Part (CIP) Strategy (Months 10-12)

The CIP application allows for the addition of new material (improvements or new features) that were not present in the original provisional filing, while maintaining the original priority date for the foundational claims.

*   **Target Filing Date:** April 2027 - May 23, 2027
*   **New Claims to be Added (CIP):**
    1.  **Wireless Charging Integration:** The inclusion of a Qi-compatible wireless charging coil embedded within the keychain housing, allowing the device to charge without being plugged into a host (see `patent_fig4_cip_wireless.png`).
    2.  **On-Device AI Inference:** The specific implementation of TensorFlow Lite Micro on the nRF52840 to perform localized anomaly detection (e.g., Arrhythmia classification) directly on the hardware before data is written to the flash storage (see `patent_fig5_cip_ai_chip.png`).
    3.  **Multi-Device BLE Mesh:** The protocol allowing multiple HEALTH-KEY devices to form a localized mesh network for aggregate environmental sensing (e.g., distributed VOC mapping in a facility).

**Action Items (Phase 3):**
*   [x] Generate CIP concept diagrams (Fig 4-5).
*   [ ] Draft specific CIP claim language.
*   [ ] File CIP alongside or shortly after the non-provisional utility application.

---

## Phase 4: Patent Prosecution and Issuance (Years 1-3)

Following the non-provisional and CIP filings, the applications enter the examination phase.

*   **Office Actions:** Respond to USPTO examiner rejections or objections. This typically involves narrowing claims to overcome prior art.
*   **Target Issuance:** 2028 - 2029.

![HEALTH-KEY ULTRA Patent Overview](../../docs/images/product-line/hk_ultra_patent_overview.png)
