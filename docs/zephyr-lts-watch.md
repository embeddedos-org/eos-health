# Zephyr LTS watch — input to the Zephyr-vs-bare-metal decision (#2)

This document is **decision input, not a decision**. The structural
question — restore, repoint, or merge the split firmware trees — is
still Aswin/srpatcha's call (#2). What follows is the current upstream
picture, recorded so the decision is made against fresh facts.

## The LTS picture (Oct 2026)

- **Zephyr 4.6 is the next LTS (April 2027).** The published roadmap
  runs through 2029.
- **Zephyr 3.7 LTS is maintained to July 2029** — the conservative
  floor for any product that wants a long maintenance tail today.
- **4.4.0-rc2 is in stabilization** — the near-term release line.
- **LF 2026 survey: 49% named maintenance/LTS the top 5-year
  challenge.** The industry's pain is exactly the question #2 is
  asking: who maintains the tree for a decade.

## Vendor orbit

- New Zephyr Silver members include **GigaDevice** and **Morse Micro**
  (Wi-Fi HaLow) — new MCU vendors entering Zephyr's orbit, widening
  the hardware the LTS lines will cover.
- **TI + Infineon upgraded to Zephyr Platinum** (Oct 1, pre-summit) —
  the two most relevant silicon vendors for safety and long-lifecycle
  use are now at the top membership tier: deeper board support and
  LTS coverage for their parts is the reasonable expectation.
- **nRF54LC10A (announced ~Oct 9)** — 128 MHz Cortex-M33 + 128 MHz
  RISC-V coprocessor, BT LE Channel Sounding, 802.15.4 / Thread /
  Zigbee / Matter, sub-50 nA hibernation, **TrustZone + secure boot +
  tamper detection**: the secure-boot benchmark for the health-device
  story. Partially closes the standing nRF54 gap at the low-cost end.

## What this means for #2

- A Zephyr-based tree buys a maintained LTS line (3.7 to 2029, 4.6
  from April 2027) at the cost of tracking upstream.
- A bare-metal tree buys independence at the cost of owning the
  entire maintenance burden the survey flags as the industry's top
  challenge.
- Either way, the decision should name its LTS story explicitly —
  "we track Zephyr LTS" or "we own maintenance to <date>" — before
  the trees are restructured.
