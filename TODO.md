# EoS Health — Production Readiness TODO

## Pillar 1: EoS Firmware (All 4 Devices)
- [x] OTA Manager (MCUboot, Ed25519, dual-bank, rollback)
- [x] Power Manager (5 sleep states, PMIC, NFC charging)
- [x] Crash Recovery (watchdog, fault handlers, crash log)
- [x] Data Buffer (64KB NVM ring, BLE sync, compression)
- [x] BLE Manager (auto-reconnect, MTU=247, 2M PHY, bonding)
- [x] Provisioning (serial, OTA key, calibration, APPROTECT)
- [x] HEALTH-RING main.c (dual-tier, NFC charging, 512Hz ECG)
- [x] HEALTH-LAB main.c (biosensor, iontophoresis, patch lifetime)
- [x] HEALTH-KEY ULTRA main.c (USB-C HID + BLE, BAC, UV)
- [ ] HEALTH-BAND Neuro main.c (sEMG, TENS, neural band)
- [ ] Sensor drivers: MAX30001, MAX86176, LSM6DSO, LMP91000, BME688
- [ ] BLE GATT profiles: all 4 devices (custom UUIDs, characteristics)
- [ ] HbA1c algorithm (1300nm PPG, HEALTH-RING Ultra)
- [ ] sEMG algorithm (HEALTH-BAND Neuro)
- [ ] TENS protocol (HEALTH-BAND Neuro)
- [ ] VO2max algorithm (all devices with HR+IMU)
- [ ] Body temperature algorithm (all devices)
- [ ] Skin conductance / EDA algorithm (HEALTH-BAND Neuro)
- [ ] Menstrual cycle tracking algorithm
- [ ] HRV recovery score (Whoop-style)
- [ ] Respiratory rate algorithm (PPG-derived)
- [ ] ebuild.config for all 4 devices (complete, not stub)
- [ ] Zephyr device tree overlays for all 4 PCBs

## Pillar 2: Hardware Openness
- [x] HEALTH-KEY ULTRA KiCad schematic
- [x] HEALTH-BAND Neuro KiCad schematic
- [x] HEALTH-RING KiCad schematic
- [x] HEALTH-LAB KiCad schematic
- [ ] HEALTH-RING hardware architecture doc (complete)
- [ ] HEALTH-LAB hardware architecture doc (complete)
- [ ] BOM with Mouser/DigiKey part numbers for all 4 devices
- [ ] PCB manufacturing notes (JLCPCB/Seeed specs)
- [ ] 3D CAD models (STEP files) for all 4 devices
- [ ] CERN OHL-S v2 license headers on all hardware files

## Pillar 3: Reliability
- [ ] IP68/IPX7 test specification (all 4 devices)
- [ ] Drop test specification (1.5m onto concrete, 26 orientations)
- [ ] Thermal cycling test spec (-20°C to +60°C, 100 cycles)
- [ ] Flex fatigue test spec (HEALTH-LAB: 100k bend cycles)
- [ ] Ring wear test spec (HEALTH-RING: 500h continuous wear)
- [ ] Battery cycle test spec (500 charge cycles, <80% capacity loss)
- [ ] NFC charging reliability test (HEALTH-RING)
- [ ] BLE connection stability test (24h continuous, 10m range)
- [ ] Adhesive biocompatibility spec (HEALTH-LAB, ISO 10993)
- [ ] EMC/RF compliance checklist (FCC Part 15, CE RED)
- [ ] RELIABILITY_SPEC.md for each device

## Pillar 4: Clinical Validation & Regulatory
- [ ] HIPAA_COMPLIANCE.md — data handling, PHI definition, BAA template
- [ ] FDA_PATHWAY.md — 510(k) vs De Novo vs exempt classification per device
- [ ] IRB_PROTOCOL_TEMPLATE.md — study design, consent form, endpoints
- [ ] Clinical validation study design (n=100, 3 sites, IRB approval)
- [ ] ECG accuracy validation protocol (vs 12-lead Holter)
- [ ] SpO2 validation protocol (vs co-oximetry, ISO 80601-2-61)
- [ ] BP validation protocol (vs sphygmomanometer, AAMI SP10)
- [ ] Glucose validation protocol (vs YSI 2300, ISO 15197)
- [ ] Sleep staging validation protocol (vs PSG, AASM scoring)
- [ ] Data encryption spec (AES-256 at rest, TLS 1.3 in transit)
- [ ] Audit logging spec (HIPAA §164.312(b))
- [ ] De-identification spec (HIPAA Safe Harbor method)

## Pillar 5: Health Algorithms (Complete)
- [x] ECG + AFib (Pan-Tompkins, MIT-BIH validated)
- [x] SpO2 (ratio-of-ratios, ISO 80601)
- [x] Blood pressure PTT (AAMI SP10)
- [x] Glucose SCBN Kalman (7-analyte, ISO 15197)
- [x] Sensor fusion (TFLite Micro, sleep/stress/activity)
- [ ] HbA1c (1300nm MSHE algorithm, HEALTH-RING Ultra)
- [ ] sEMG signal processing (HEALTH-BAND Neuro)
- [ ] VO2max estimation (HR + speed + age model)
- [ ] Body temperature (skin-to-core correction model)
- [ ] Respiratory rate (PPG morphology analysis)
- [ ] HRV recovery score (Whoop-style readiness 0-100)
- [ ] Stress score (LF/HF ratio + EDA + cortisol fusion)
- [ ] Menstrual cycle phase detection (temp + HRV)
- [ ] Sample data pipeline (raw → filtered → features → output)
- [ ] Calibration procedures (factory + user-initiated)
- [ ] Algorithm accuracy test vectors (ground truth datasets)

## Pillar 6: Mobile App (Health Hub)
- [ ] React Native app architecture document
- [ ] BLE GATT service definitions (all 4 devices)
- [ ] Device pairing and onboarding flow
- [ ] Real-time ECG display (512Hz streaming)
- [ ] Dashboard: health score, HR, HRV, SpO2, sleep, stress
- [ ] Historical trends (7-day, 30-day, 90-day charts)
- [ ] Glucose monitoring view (HEALTH-LAB)
- [ ] Sleep analysis view (stages, score, recommendations)
- [ ] Recovery score view (Whoop-style)
- [ ] Activity tracking (steps, calories, VO2max)
- [ ] Alert system (AFib, low SpO2, glucose alerts)
- [ ] HIPAA-compliant local storage (encrypted SQLite)
- [ ] Cloud sync (HIPAA-compliant backend)
- [ ] Data export (PDF health report, CSV raw data)
- [ ] Firmware OTA update UI
- [ ] Competitor feature parity checklist

## Product Listing (All 4 Devices)
- [ ] HEALTH-KEY ULTRA README: competitive comparison table
- [ ] HEALTH-BAND Neuro README: competitive comparison table
- [ ] HEALTH-RING README: competitive comparison table vs Oura/RingConn/Ultrahuman
- [ ] HEALTH-LAB README: competitive comparison table
- [ ] Company website: 4-product listing with specs
- [ ] Roadmap: updated with clinical validation milestones

## EoS Tools Integration
- [ ] eBuild: all 4 device build configs complete
- [ ] eos-factory-tool: provisioning + test for all 4 devices
- [ ] eos-health-app (web): connected to all 4 device APIs
- [ ] eVera integration: voice health coaching via EoS AI
