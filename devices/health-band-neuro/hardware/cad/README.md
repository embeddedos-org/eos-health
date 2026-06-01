# HEALTH-BAND Neuro: Mechanical CAD Documentation

This directory contains the 3D CAD models and mechanical assembly instructions for the HEALTH-BAND Neuro V1 hardware.

## 1. Mechanical Architecture

The HEALTH-BAND Neuro utilizes a flexible, continuous-loop design, defined by the "Zero-Hole Architecture." The mechanical design must accommodate the rigid-flex PCB, the 200mAh flexible Li-Po battery, and the flush-mounted display, all while maintaining water and dust resistance.

## 2. Primary Components

### 2.1 The Band Substrate
*   **Material:** Co-molded silicone elastomer with a carbon fiber weave outer layer for structural rigidity and aesthetic appeal.
*   **Function:** Houses the flexible battery and the main rigid-flex PCB routing.

### 2.2 The Display Integration
*   **Cutout:** A precise rectangular cavity in the outer carbon fiber layer.
*   **Mounting:** The 0.49-inch Micro OLED panel is seated within a rigid internal frame.
*   **Window:** A scratch-resistant sapphire or hardened glass window is bonded flush with the outer carbon fiber surface, creating a seamless, bezel-less feel.

### 2.3 The Left Port Housing (Female)
*   **Structure:** A rigid titanium or high-density polycarbonate end-cap.
*   **Features:** Contains the USB-C female receptacle.
*   **Breath Channel:** Integrates the hexagonal micro-perforated grille. A PTFE hydrophobic membrane sits behind the grille, protecting the Dart EC4-10-100 fuel cell and SGP40 sensor from moisture while allowing gas exchange.

### 2.4 The Right Port Housing (Male)
*   **Structure:** A rigid end-cap matching the left side.
*   **Features:** Contains the USB-C male plug.
*   **Clasp Mechanism:** Incorporates mechanical detents or a magnetic latching system to securely lock into the female receptacle, forming a continuous ring capable of withstanding everyday wrist movement.

### 2.5 The Inner Surface
*   **Electrodes:** Six platinum dots are co-molded flush with the inner silicone surface to ensure consistent skin contact for sEMG, TENS, and GSR measurements.
*   **Optical Window:** A small, transparent, bio-compatible window for the MAX30101 (HR/SpO2) sensor.

## 3. Assembly Process

1.  **Electronics Prep:** The rigid-flex PCB is populated and tested. The OLED display and flexible battery are attached.
2.  **Overmolding:** The electronic assembly is placed into a mold. The inner silicone layer is injected, embedding the platinum electrodes and optical window.
3.  **Outer Layer Application:** The carbon fiber outer layer is bonded to the silicone substrate.
4.  **Display Sealing:** The OLED display window is inserted and sealed using a UV-cured optical adhesive.
5.  **End-Cap Attachment:** The rigid left and right port housings are bonded to the ends of the flexible band, establishing the electrical connections to the USB-C ports and breath sensors.
