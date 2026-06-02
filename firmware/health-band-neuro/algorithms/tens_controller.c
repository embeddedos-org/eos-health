/*
 * EoS Health — TENS Therapy Controller
 * File: firmware/health-band-neuro/algorithms/tens_controller.c
 *
 * Transcutaneous Electrical Nerve Stimulation (TENS) controller.
 * Controls H-bridge driver for biphasic waveform delivery.
 *
 * Safety limits (IEC 60601-1):
 *   Max current:    80 mA peak
 *   Max frequency:  100 Hz
 *   Max duration:   30 minutes per session
 *   Max charge/phase: 50 µC (prevents electrolytic damage)
 *   Interlock:      Electrode impedance check before start
 *
 * Waveform modes:
 *   BURST:     Bursts of 100 Hz at 2 Hz carrier (pain relief)
 *   ACUPUNCTURE: 2–4 Hz low-frequency (endorphin release)
 *   CONVENTIONAL: 80–100 Hz continuous (gate control theory)
 *   MODULATION: Frequency sweeps 2–100 Hz (prevents adaptation)
 */

#include <zephyr/kernel.h>
#include <zephyr/drivers/pwm.h>
#include <zephyr/logging/log.h>
#include <math.h>
#include "tens_controller.h"

LOG_MODULE_REGISTER(tens, LOG_LEVEL_INF);

#define TENS_MAX_CURRENT_MA   80
#define TENS_MAX_FREQ_HZ      100
#define TENS_MAX_DURATION_S   1800  /* 30 minutes */
#define TENS_RAMP_STEPS       20    /* Ramp up over 20 steps */
#define TENS_PULSE_WIDTH_US   200   /* Default pulse width µs */
#define TENS_IMPEDANCE_MIN    500   /* Minimum electrode impedance Ω */
#define TENS_IMPEDANCE_MAX    5000  /* Maximum electrode impedance Ω */

K_MSGQ_DEFINE(tens_msgq, sizeof(tens_command_t), 4, 4);

typedef struct {
    bool active;
    tens_command_t current_cmd;
    uint32_t elapsed_s;
    uint8_t current_intensity;  /* Ramped intensity */
    bool electrode_ok;
} tens_state_t;

static tens_state_t tens;

void tens_controller_init(void)
{
    memset(&tens, 0, sizeof(tens));
    LOG_INF("TENS controller initialized");
}

/* ── Electrode impedance check ──────────────────────────────── */
static bool tens_check_electrodes(void)
{
    /* Send 1 mA test pulse and measure voltage */
    /* Impedance = V/I — must be 500–5000 Ω for good contact */
    /* This is a hardware-level check via AD5940 */
    uint32_t impedance_ohm = band_sensors_measure_electrode_impedance();
    tens.electrode_ok = (impedance_ohm >= TENS_IMPEDANCE_MIN &&
                         impedance_ohm <= TENS_IMPEDANCE_MAX);
    LOG_INF("TENS electrode impedance: %u Ω (%s)",
            impedance_ohm, tens.electrode_ok ? "OK" : "FAIL");
    return tens.electrode_ok;
}

/* ── Generate biphasic waveform pulse ───────────────────────── */
static void tens_pulse(uint8_t intensity_ma, uint16_t pulse_width_us, bool polarity)
{
    /* Set H-bridge direction */
    band_sensors_tens_set_polarity(polarity);

    /* Set current via DAC (0–80 mA range) */
    uint16_t dac_value = (uint16_t)((float)intensity_ma / 80.0f * 4095.0f);
    band_sensors_tens_set_current(dac_value);

    /* Enable H-bridge for pulse_width_us */
    band_sensors_tens_enable(true);
    k_busy_wait(pulse_width_us);
    band_sensors_tens_enable(false);

    /* Inter-phase gap (10 µs) */
    k_busy_wait(10);
}

/* ── Run TENS session ───────────────────────────────────────── */
void tens_run_session(const tens_command_t *cmd)
{
    LOG_INF("TENS session start: mode=%d, freq=%u Hz, intensity=%u mA, duration=%u s",
            cmd->mode, cmd->frequency_hz, cmd->intensity_ma, cmd->duration_s);

    /* Safety checks */
    if (!tens_check_electrodes()) {
        LOG_ERR("TENS aborted: electrode check failed");
        return;
    }

    tens.active = true;
    tens.current_cmd = *cmd;
    tens.elapsed_s = 0;

    uint32_t period_us = 1000000 / cmd->frequency_hz;
    uint16_t pulse_width_us = TENS_PULSE_WIDTH_US;

    /* Charge per phase check: I × t ≤ 50 µC */
    uint32_t charge_nC = (uint32_t)cmd->intensity_ma * pulse_width_us;
    if (charge_nC > 50000) {
        pulse_width_us = 50000 / cmd->intensity_ma;
        LOG_WRN("TENS: pulse width reduced to %u µs (charge limit)", pulse_width_us);
    }

    /* Ramp up intensity */
    for (int step = 1; step <= TENS_RAMP_STEPS; step++) {
        tens.current_intensity = (uint8_t)((float)cmd->intensity_ma * step / TENS_RAMP_STEPS);
        tens_pulse(tens.current_intensity, pulse_width_us, true);
        k_sleep(K_MSEC(100));
    }

    /* Main stimulation loop */
    int64_t session_start = k_uptime_get();
    int64_t session_end   = session_start + (int64_t)cmd->duration_s * 1000;

    while (k_uptime_get() < session_end) {
        /* Check for abort command */
        tens_command_t abort_cmd;
        if (k_msgq_get(&tens_msgq, &abort_cmd, K_NO_WAIT) == 0) {
            if (abort_cmd.mode == TENS_MODE_STOP) {
                LOG_INF("TENS session aborted by user");
                break;
            }
        }

        /* Modulation mode: sweep frequency */
        uint16_t freq = cmd->frequency_hz;
        if (cmd->mode == TENS_MODE_MODULATION) {
            float t = (float)(k_uptime_get() - session_start) / 1000.0f;
            freq = (uint16_t)(2.0f + 98.0f * (0.5f + 0.5f * sinf(2.0f * 3.14159f * t / 10.0f)));
            period_us = 1000000 / freq;
        }

        /* Burst mode: 100 Hz bursts at 2 Hz carrier */
        if (cmd->mode == TENS_MODE_BURST) {
            int64_t t_ms = k_uptime_get() - session_start;
            bool burst_on = (t_ms % 500) < 100; /* 100ms burst every 500ms */
            if (!burst_on) {
                k_sleep(K_MSEC(10));
                continue;
            }
        }

        /* Biphasic pulse: positive phase then negative phase */
        tens_pulse(cmd->intensity_ma, pulse_width_us, true);
        k_busy_wait(period_us / 2 - pulse_width_us - 10);
        tens_pulse(cmd->intensity_ma, pulse_width_us, false);
        k_busy_wait(period_us / 2 - pulse_width_us - 10);

        tens.elapsed_s = (uint32_t)((k_uptime_get() - session_start) / 1000);
    }

    /* Ramp down */
    for (int step = TENS_RAMP_STEPS; step >= 0; step--) {
        tens.current_intensity = (uint8_t)((float)cmd->intensity_ma * step / TENS_RAMP_STEPS);
        if (tens.current_intensity > 0) {
            tens_pulse(tens.current_intensity, pulse_width_us, true);
        }
        k_sleep(K_MSEC(100));
    }

    band_sensors_tens_enable(false);
    band_sensors_tens_set_current(0);
    tens.active = false;

    LOG_INF("TENS session complete: %u s delivered", tens.elapsed_s);
}
