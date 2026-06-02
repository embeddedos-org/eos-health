# EoS Health — Reliability Specifications

**Version:** 1.0 | **Date:** June 2026

This document defines the complete reliability test specifications for all four EoS Health devices. All devices must pass every applicable test before production release.

---

## HEALTH-KEY ULTRA — Reliability Specs

| Test | Standard | Requirement | Pass Criteria |
|---|---|---|---|
| Water resistance | IEC 60529 IP68 | 2m, 30 min, freshwater | No ingress, sensors ±2% post-test |
| Drop test | MIL-STD-810H 516.8 | 1.5m, 26 orientations, concrete | No failure, BLE maintained |
| Thermal cycling | IEC 60068-2-14 | -20°C to +60°C, 100 cycles | No failure, sensors ±2% |
| Battery cycles | IEC 61960-3 | 500 cycles, 25°C | ≥80% capacity retention |
| USB-C durability | IEC 60512-99-001 | 10,000 insertion cycles | No mechanical failure |
| Vibration | MIL-STD-810H 514.8 | 10–2000 Hz, 3 axes, 1h each | No failure |
| ESD | IEC 61000-4-2 | ±8 kV contact, ±15 kV air | No permanent damage |
| Biocompatibility | ISO 10993-5/10/23 | Skin contact (titanium) | Pass cytotox, sensitization |

---

## HEALTH-BAND Neuro — Reliability Specs

| Test | Standard | Requirement | Pass Criteria |
|---|---|---|---|
| Water resistance | IEC 60529 IP68 | 2m, 30 min, freshwater | No ingress, sensors ±2% |
| Drop test | MIL-STD-810H 516.8 | 1.5m, 26 orientations | No failure |
| Flex fatigue (strap) | ASTM F2052 | 100,000 bend cycles (180°) | No crack, no delamination |
| Thermal cycling | IEC 60068-2-14 | -20°C to +60°C, 100 cycles | No failure |
| Battery cycles | IEC 61960-3 | 500 cycles | ≥80% capacity |
| TENS safety | IEC 60601-1 | 80 mA max, 100 Hz max | No skin burns, no shock |
| EMC | IEC 60601-1-2 | Class B emissions | Pass FCC Part 15B |
| Electrode biocompat | ISO 10993-5/10 | Ag/AgCl electrodes | Pass cytotox, sensitization |
| Clasp durability | — | 50,000 open/close cycles | No failure |

---

## HEALTH-RING — Reliability Specs

| Test | Standard | Requirement | Pass Criteria |
|---|---|---|---|
| Water resistance | IEC 60529 IP68 | 200m, 30 min, saltwater | No ingress, sensors ±2% |
| Drop test | MIL-STD-810H 516.8 | 1.5m, 26 orientations | No failure |
| Thermal cycling | IEC 60068-2-14 | -20°C to +60°C, 100 cycles | No failure |
| Battery cycles | IEC 61960-3 | 500 cycles | ≥80% capacity |
| NFC charging cycles | — | 1,000 charge cycles | Charging efficiency ≥90% |
| Ring wear simulation | — | 500h continuous wear, 10 users | No skin irritation, no corrosion |
| Scratch resistance | Mohs scale | Grade 9 (titanium) | No visible scratches from keys |
| Biocompatibility | ISO 10993-5/10/23 | Grade 23 titanium | Pass all tests |
| Crush test | — | 500N radial force | No structural failure |
| Sizing accuracy | — | ±0.1mm inner diameter | All sizes 5–13 (US) |

---

## HEALTH-LAB — Reliability Specs

| Test | Standard | Requirement | Pass Criteria |
|---|---|---|---|
| Water resistance | IEC 60529 IPX7 | 1m, 30 min, freshwater | No ingress |
| Adhesive strength | ASTM D1002 | 72h wear, sweat simulation | No delamination |
| Flex fatigue | ASTM F2052 | 100,000 bend cycles (90°) | No crack, no delamination |
| Thermal stability | IEC 60068-2-2 | 40°C, 85% RH, 7 days | Enzyme activity ±10% |
| Biosensor accuracy | ISO 15197 | ±5% vs YSI reference | 95% readings within spec |
| Electrode shelf life | — | 12 months at 4–25°C | Accuracy ±10% at expiry |
| Skin irritation | ISO 10993-23 | 14-day wear | No Grade 2+ irritation |
| Biocompatibility | ISO 10993-5/10 | All skin-contact materials | Pass cytotox, sensitization |
| Cartridge insertion | — | 1,000 insertion cycles | No mechanical failure |
| Iontophoresis safety | IEC 60601-1 | 0.5 mA/cm² max | No skin burns |

---

## Shared BLE Reliability Requirements (All Devices)

| Test | Requirement | Pass Criteria |
|---|---|---|
| Connection stability | 24h continuous, 10m range | <1 disconnect/hour |
| Reconnection time | After 30s disconnect | <5 seconds |
| Range | Open space | ≥10m (BLE 5.0 spec) |
| Throughput | ECG streaming (512Hz, 16-bit) | ≥1 KB/s sustained |
| Coexistence | 2.4 GHz WiFi environment | <5% packet loss |
| Pairing time | New device | <10 seconds |
| Bonding persistence | After power cycle | Bond retained |

---

## Production Acceptance Criteria (Factory Test)

Every unit must pass all factory tests before shipment. Units that fail any test are quarantined for root cause analysis. Acceptable Quality Level (AQL): 0.65% (ISO 2859-1, Level II).

| Test | Limit |
|---|---|
| BLE RSSI at 1m | > -70 dBm |
| Battery voltage at ship | > 80% |
| ECG signal quality | > 70% quality score |
| PPG red DC | > 50,000 counts |
| IMU self-test | Pass |
| Flash read/write | 0 errors |
| Provisioning data | Serial match |
| Firmware version | Current release |
