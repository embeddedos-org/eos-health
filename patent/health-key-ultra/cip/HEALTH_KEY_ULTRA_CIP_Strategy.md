# Continuation-In-Part (CIP) Strategy: HEALTH-KEY ULTRA

**Project:** HEALTH-KEY ULTRA
**Base Application:** US Provisional App. No. 64/073,334 (Filed May 23, 2026)
**CIP Filing Deadline:** May 23, 2027

---

## 1. Objective

The objective of this Continuation-In-Part (CIP) application is to expand the claims of the original HEALTH-KEY ULTRA provisional patent to include advanced power management and edge-computing capabilities. While the initial filing protects the novel use of the USB-C shield for sensor input, the CIP will protect the next generation of the device's architecture.

## 2. Core CIP Claims

The CIP application will introduce three primary independent claims:

### Claim 1: Inductive Wireless Power Integration
> "A portable health monitoring apparatus comprising a USB Type-C interface, wherein the apparatus further includes an inductive power receiver coil embedded within the housing, configured to receive wireless power to charge an internal power storage cell independently of the USB Type-C interface, while maintaining the USB Type-C shield's function as an analog sensor input."

*Reference: `patent_fig4_cip_wireless.png`*

### Claim 2: Edge-AI Anomaly Detection Topology
> "The apparatus of Claim 1, further comprising a microcontroller executing a machine learning inference engine locally, wherein the microcontroller is configured to process analog signals received via the USB Type-C shield to detect physiological anomalies, and subsequently write only the anomalous data segments and associated metadata to the local non-volatile memory, thereby reducing required storage capacity and host-device bandwidth."

*Reference: `patent_fig5_cip_ai_chip.png`*

### Claim 3: Environmental Mesh Networking
> "A system comprising a plurality of the apparatuses of Claim 1, configured to establish a localized Bluetooth Low Energy mesh network, wherein each apparatus acts as a node to aggregate volatile organic compound (VOC) data, providing a distributed environmental mapping without reliance on external Wi-Fi or cellular infrastructure."

## 3. Technical Justification

The original HEALTH-KEY ULTRA design relies on the host device (e.g., a laptop or smartphone) for power and complex data analysis.

1.  **Wireless Charging:** Adding a small inductive coil allows the device to operate as a true standalone environmental monitor (e.g., tracking VOCs or UV exposure while clipped to a backpack) without needing to be plugged in.
2.  **Edge AI:** Implementing TensorFlow Lite Micro on the nRF52840 shifts the computational burden from the host PC to the dongle itself. This ensures that critical health events (like an arrhythmia detected during an ECG reading) are flagged immediately at the hardware level, rather than waiting for the user to plug the device into a computer for analysis.

## 4. Engineering Roadmap for CIP Implementation

1.  **Phase 1 (Current):** Secure CIP filing date based on block diagrams and firmware architecture planning.
2.  **Phase 2 (Year 1):** Prototype the wireless charging coil integration within the spatial constraints of the keychain housing.
3.  **Phase 3 (Year 1.5):** Train and quantize the anomaly detection models (HRV and Arrhythmia) to fit within the 256KB RAM footprint of the nRF52840.
4.  **Phase 4 (Year 2):** Commercialization in the "HEALTH-KEY ULTRA Gen 2."

![HEALTH-KEY ULTRA CIP Concept](../../docs/images/product-line/hk_ultra_cip_concept.png)
