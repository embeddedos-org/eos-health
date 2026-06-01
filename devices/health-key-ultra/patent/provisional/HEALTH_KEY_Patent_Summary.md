# Patent Summary: HEALTH-KEY ULTRA

**Title:** Dual-Mode, Multi-Sensor Health Monitoring Apparatus with Integrated Biopotential Electrodes and Mass Storage
**Inventor:** Srikanth Patchava
**Application Number:** US Provisional App. No. 64/073,334
**Filing Date:** May 23, 2026
**Assignee/Affiliation:** Embedded Operating Systems Research Foundation (EoS)

---

## Abstract of the Invention
The present invention relates to a highly miniaturized, multi-modal health monitoring apparatus integrated within the form factor of a standard USB Type-C flash drive. The apparatus comprises a microcontroller, non-volatile mass storage, a Bluetooth Low Energy (BLE) transceiver, and a suite of physiological and environmental sensors. The device operates autonomously in a dual-mode architecture, functioning as a USB composite device when physically connected to a host, and as a wireless BLE GATT server when disconnected. Novel mechanical and electrical configurations are disclosed, including the repurposing of the USB-C connector shield as a biopotential electrode for electrocardiogram (ECG) acquisition, a permanently integrated hydrophobic PTFE membrane enabling saliva-proof breath analysis via an internal Venturi channel, and the utilization of a multi-wavelength optical biosensor array as a dual-purpose physiological monitor and device status indicator.

## Key Claims Summary

The patent application includes claims covering the following core innovations:

1.  **Dual-Mode Architecture:** The autonomous switching mechanism between USB tethered mode (Mass Storage + HID) and untethered battery-powered mode (BLE 5.3 GATT Server) without requiring user intervention.
2.  **USB-C Shield Electrode:** The use of the metallic outer shield of the USB-C male connector as the primary biopotential electrode (Lead I) for acquiring an ECG signal, in conjunction with a secondary electrode on the device body.
3.  **Hydrophobic Venturi Breath Channel:** A breath analysis inlet positioned on the device body, separated from the USB-C connector face, featuring a permanently integrated hydrophobic PTFE membrane. This membrane permits the transmission of volatile organic compounds (VOCs) and ethanol while blocking liquid ingress, enabling direct breath analysis without disposable mouthpieces.
4.  **Dual-Purpose Optical Biosensor/Status LED:** The utilization of an integrated optical PPG sensor (such as the MAX30101) containing Green, Red, and IR LEDs, wherein the LEDs are driven at high frequencies for physiological measurement (HR, SpO2) and at lower frequencies/intensities to serve as the device's primary visual status indicator (e.g., charging, pairing, ready states).
5.  **Hygiene Breath Sleeve (Accessory):** A removable hydrophobic membrane sleeve configured to engage the USB-C male connector, providing an optional, disposable sterile interface for clinical or shared-use environments.
6.  **Future Expansion (Generation 3):** Claims covering the integration of selective VOC arrays for breathomics and microfluidic channels for saliva-based diagnostics using disposable reagent cartridges.
