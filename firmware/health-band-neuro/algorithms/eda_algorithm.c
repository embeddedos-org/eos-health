/*
 * EoS Health — EDA (Electrodermal Activity) Algorithm
 * File: firmware/health-band-neuro/algorithms/eda_algorithm.c
 *
 * Measures skin conductance (galvanic skin response) via AD5940.
 * Separates tonic (SCL) and phasic (SCR) components.
 *
 * Clinical applications:
 *   - Stress and anxiety monitoring (autonomic nervous system)
 *   - Lie detection / deception research
 *   - Emotion recognition
 *   - Biofeedback therapy
 *   - PTSD and anxiety disorder monitoring
 *
 * EDA components:
 *   SCL (Skin Conductance Level): slow tonic baseline (0.1–20 µS)
 *   SCR (Skin Conductance Response): fast phasic bursts (0.01–3 µS)
 *   SCR rate: number of SCRs per minute (stress indicator)
 */

#include <math.h>
#include <string.h>
#include "eda_algorithm.h"

#define EDA_FS          8       /* Sample rate Hz */
#define EDA_SCL_TAU     10.0f   /* SCL low-pass time constant (seconds) */
#define EDA_SCR_MIN     0.01f   /* Minimum SCR amplitude (µS) */
#define EDA_SCR_WINDOW  (EDA_FS * 60)  /* 1-minute SCR rate window */

typedef struct {
    float scl_state;        /* Low-pass filter state for SCL */
    float scr_buf[EDA_SCR_WINDOW];
    uint16_t scr_idx;
    uint8_t scr_count;      /* SCRs in last 60 seconds */
    float prev_scr;
    bool  in_scr;           /* Currently in a phasic response */
    eos_eda_result_t result;
    uint32_t sample_count;
} eda_state_t;

static eda_state_t eda;

void eda_algorithm_init(void)
{
    memset(&eda, 0, sizeof(eda));
}

void eda_process_sample(const eda_sample_t *sample)
{
    eda.sample_count++;

    /* Convert AD5940 impedance measurement to conductance (µS) */
    float conductance_uS = 1000000.0f / sample->impedance_ohm;

    /* ── SCL: tonic component (low-pass, τ = 10s) ─────────────── */
    float alpha = 1.0f / (1.0f + EDA_SCL_TAU * EDA_FS);
    eda.scl_state = (1.0f - alpha) * eda.scl_state + alpha * conductance_uS;
    eda.result.scl_uS = eda.scl_state;

    /* ── SCR: phasic component (conductance - SCL) ─────────────── */
    float scr = conductance_uS - eda.scl_state;
    if (scr < 0.0f) scr = 0.0f;
    eda.result.scr_uS = scr;

    /* ── SCR detection (onset + amplitude) ─────────────────────── */
    /* SCR onset: rising edge above threshold */
    if (!eda.in_scr && scr > EDA_SCR_MIN && scr > eda.prev_scr) {
        eda.in_scr = true;
    }
    /* SCR end: falling edge */
    if (eda.in_scr && scr < eda.prev_scr * 0.9f) {
        eda.in_scr = false;
        eda.scr_count++;
    }
    eda.prev_scr = scr;

    /* ── SCR rate: count in rolling 60-second window ───────────── */
    eda.scr_buf[eda.scr_idx % EDA_SCR_WINDOW] = scr;
    eda.scr_idx++;
    if (eda.scr_idx % EDA_FS == 0) {
        /* Recount SCRs in window */
        uint8_t count = 0;
        bool in_event = false;
        for (int i = 0; i < EDA_SCR_WINDOW; i++) {
            float s = eda.scr_buf[i];
            if (!in_event && s > EDA_SCR_MIN) { in_event = true; count++; }
            if (in_event && s < EDA_SCR_MIN * 0.5f) { in_event = false; }
        }
        eda.result.scr_rate = count;
    }

    /* ── Stress score from EDA ──────────────────────────────────── */
    /* High SCL (>10 µS) + high SCR rate (>8/min) = high stress */
    float scl_score  = fminf(100.0f, eda.result.scl_uS / 20.0f * 100.0f);
    float scr_score  = fminf(100.0f, eda.result.scr_rate / 15.0f * 100.0f);
    eda.result.stress_score = (uint8_t)((scl_score * 0.4f + scr_score * 0.6f));

    /* ── Arousal level ──────────────────────────────────────────── */
    if (eda.result.stress_score < 25)       eda.result.arousal = EDA_AROUSAL_CALM;
    else if (eda.result.stress_score < 50)  eda.result.arousal = EDA_AROUSAL_RELAXED;
    else if (eda.result.stress_score < 75)  eda.result.arousal = EDA_AROUSAL_ALERT;
    else                                     eda.result.arousal = EDA_AROUSAL_STRESSED;
}

const eos_eda_result_t *eda_get_result(void) { return &eda.result; }
