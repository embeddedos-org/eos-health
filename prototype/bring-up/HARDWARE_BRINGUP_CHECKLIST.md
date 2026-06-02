# EoS Health — Hardware Bring-Up Checklist

**Purpose:** Step-by-step procedure for first power-on and initial verification of each prototype PCB.  
**Required equipment:** Bench power supply, multimeter, oscilloscope, J-Link EDU Mini, USB-C cable, soldering station.

---

## Pre-Power-On Inspection (All Devices)

Complete these checks **before applying any power** to avoid damaging components.

### Visual Inspection
- [ ] All components present and correctly oriented (check ICs, capacitors, inductors)
- [ ] No solder bridges on fine-pitch ICs (ADS1299, nRF52840, BQ25125)
- [ ] No missing components (check against BOM)
- [ ] PCB not cracked or delaminated
- [ ] Flex connectors fully seated (HEALTH-BAND Neuro, HEALTH-RING)
- [ ] No foreign objects or solder balls on PCB

### Continuity Checks (Multimeter — Diode Mode)
- [ ] GND to GND: 0Ω (short) — verify ground plane continuity
- [ ] VCC to GND: **open** (no short) — critical before power-on
- [ ] 3.3V rail to GND: **open**
- [ ] 1.8V rail to GND: **open**
- [ ] Battery+ to GND: **open** (before battery connection)
- [ ] USB VBUS to GND: **open**

### X-Ray Inspection (if available)
- [ ] BGA/QFN solder joints — no voids >25% pad area
- [ ] nRF52840 QFN64 — all pads soldered
- [ ] ADS1299 TQFP64 — all pins soldered, no bridges

---

## HEALTH-KEY ULTRA — Bring-Up Sequence

### Step 1: Power Supply Test (No MCU)
1. Set bench PSU to 3.7V, current limit 100 mA
2. Connect PSU to battery pads (+ and -)
3. Verify: current draw < 5 mA (quiescent)
4. Measure test points:
   - [ ] TP_VCC: 3.3V ±0.1V
   - [ ] TP_1V8: 1.8V ±0.05V
   - [ ] TP_VBAT: 3.7V (battery voltage)
5. Check for hot components (thermal camera or finger — carefully)

### Step 2: USB-C Connection
1. Connect USB-C cable to host PC
2. Verify: USB VBUS = 5.0V at TP_VBUS
3. Verify: BQ25125 charging indicator LED (if populated)
4. Verify: current draw 50–200 mA (charging)

### Step 3: J-Link Flash
```bash
./jlink/flash_all_devices.sh health-key-ultra
```
- [ ] Erase successful
- [ ] SoftDevice flashed
- [ ] Application flashed
- [ ] Verification passed
- [ ] UICR written

### Step 4: First Boot
1. Observe UART output (115200 baud, 8N1) on debug UART pads
2. Expected boot sequence:
   ```
   [BOOT] EoS HEALTH-KEY ULTRA v1.0.0
   [BOOT] Serial: EOS-KEY-ULTRA-XXXXXXXX
   [POWER] Battery: 3.72V (98%)
   [BLE] Advertising as "EoS KEY ULTRA XXXX"
   [SENSORS] ECG: OK | PPG: OK | BAC: OK
   [READY] System ready
   ```
3. [ ] Boot sequence complete without errors
4. [ ] BLE advertising visible in nRF Connect app

### Step 5: Sensor Smoke Test
- [ ] ECG: Connect to skin, verify signal on UART/BLE (not flat line)
- [ ] PPG: Cover sensor with finger, verify HR reading 50–120 bpm
- [ ] BAC: Breathe on sensor, verify baseline reading ~0.00%
- [ ] IMU: Shake device, verify accelerometer data changes

---

## HEALTH-BAND Neuro — Bring-Up Sequence

### Step 1: Main PCB Power Test
1. Set PSU to 3.7V, 200 mA limit
2. Connect to battery pads
3. Verify: current < 10 mA quiescent
4. Measure:
   - [ ] TP_VCC: 3.3V ±0.1V
   - [ ] TP_1V8: 1.8V ±0.05V
   - [ ] TP_AVDD: 3.0V ±0.05V (analog supply for ADS1299)

### Step 2: Flex Strap Connection
1. Connect FPCB strap to main PCB via FFC connector
2. Verify: no short circuits introduced
3. Verify: sEMG electrode continuity (each electrode to ADS1299 input)

### Step 3: J-Link Flash
```bash
./jlink/flash_all_devices.sh health-band-neuro
```

### Step 4: First Boot
Expected UART output:
```
[BOOT] EoS HEALTH-BAND Neuro v1.0.0
[ADS1299] 8-channel sEMG: OK
[EDA] Skin conductance: OK
[TENS] Safety check: OK (output disabled)
[BLE] Advertising as "EoS BAND Neuro XXXX"
[READY] System ready
```

### Step 5: sEMG Smoke Test
- [ ] Place band on forearm, tighten to skin contact
- [ ] Open nRF Connect → EoS BAND Neuro → sEMG characteristic
- [ ] Clench fist: verify 8-channel EMG burst visible
- [ ] Relax: verify noise floor < 1 µV_rms

### Step 6: TENS Safety Test
**⚠️ WARNING: Do NOT enable TENS output without safety verification first**
- [ ] Verify TENS output is disabled at boot (firmware check)
- [ ] Connect 1 kΩ load resistor across TENS output pads
- [ ] Enable TENS via BLE command (1 Hz, 100 µs, 1 mA)
- [ ] Measure: output voltage = 1V ±0.2V across 1 kΩ
- [ ] Verify: output stops immediately when BLE disconnects
- [ ] Verify: output stops if current exceeds 15 mA (hardware limit)

---

## HEALTH-RING — Bring-Up Sequence

### Step 1: PCB Power Test (Before Ring Assembly)
1. Test PCB before inserting into titanium ring body
2. Set PSU to 3.8V, 50 mA limit
3. Connect to battery pads (use fine-tip probes)
4. Verify: current < 3 mA quiescent
5. Measure:
   - [ ] TP_VCC: 3.3V ±0.1V
   - [ ] TP_1V8: 1.8V ±0.05V
   - [ ] NFC coil: 13.56 MHz resonance visible on oscilloscope

### Step 2: J-Link Flash (Before Ring Assembly)
```bash
./jlink/flash_all_devices.sh health-ring
```
**Flash before assembly — J-Link pads are inaccessible after potting.**

### Step 3: Ring Assembly
1. Insert PCB into titanium ring body
2. Route flex PCB around ring interior
3. Apply Loctite M-21HP biocompatible epoxy
4. Cure: 24h at room temperature or 1h at 65°C
5. Verify: no epoxy on ECG electrode pads or PPG window

### Step 4: NFC Charging Test
1. Place ring on NFC charging cradle
2. Verify: charging LED on cradle illuminates
3. Verify: battery voltage increases over 30 minutes
4. Verify: BLE advertising resumes after charging

### Step 5: Sensor Smoke Test
- [ ] PPG: Wear ring on finger, verify HR reading
- [ ] SpO₂: Verify SpO₂ reading 95–100%
- [ ] ECG: Touch both ECG arc electrodes, verify waveform
- [ ] Temperature: Verify skin temperature 33–37°C
- [ ] IMU: Shake ring, verify step count increments

---

## HEALTH-LAB — Bring-Up Sequence

### Step 1: Patch Power Test
1. Connect flexible battery (Enfucell SoftBattery)
2. Verify: current < 1 mA quiescent
3. Measure:
   - [ ] TP_VCC: 3.0V ±0.1V
   - [ ] TP_VREF: 2.048V ±0.01V (LMP91000 reference)

### Step 2: J-Link Flash
```bash
./jlink/flash_all_devices.sh health-lab
```
**Note:** HEALTH-LAB uses SWD test pads on the patch edge — use spring-loaded pogo pins.

### Step 3: Enzyme Immobilization (Lab Step)
**⚠️ Requires biosafety cabinet and enzyme handling training**
1. Prepare GOx solution: 10 mg/mL in PBS pH 7.4
2. Mix with BSA (10 mg/mL) and glutaraldehyde (0.5%)
3. Apply 1 µL to glucose working electrode
4. Cure: 2h at 4°C
5. Rinse with PBS, dry under N₂
6. Repeat for LOx (lactate oxidase) on lactate electrode

### Step 4: Electrochemical Smoke Test
1. Apply patch to forearm (clean, dry skin)
2. Activate iontophoresis: 0.5 mA, 5 min (sweat stimulation)
3. Open nRF Connect → EoS LAB → glucose characteristic
4. Verify: glucose reading 4.0–7.0 mM (fasting)
5. Verify: lactate reading 0.5–2.0 mM (rest)
6. Verify: pH reading 6.5–7.5

---

## Common Issues and Solutions

| Symptom | Likely Cause | Solution |
|---|---|---|
| No power (0V on all rails) | Short circuit or missing component | Check continuity, inspect under microscope |
| High quiescent current (>50 mA) | Latch-up or wrong component | Remove power immediately, check orientation |
| BLE not advertising | Firmware not running | Check UART for boot errors, re-flash |
| Sensor reading 0 or stuck | I²C/SPI communication failure | Check SCL/SDA with oscilloscope, verify pull-ups |
| ECG flat line | Electrode contact or lead-off detection | Check electrode impedance, verify lead-off pins |
| NFC not charging | Coil misalignment | Adjust ring position on cradle |
| TENS output too high | Wrong gain setting | Verify DAC output, check current sense resistor |
