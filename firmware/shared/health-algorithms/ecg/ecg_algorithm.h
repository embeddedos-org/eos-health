/*
 * EoS Health — ECG Algorithm Header
 */

#ifndef EOS_ECG_ALGORITHM_H
#define EOS_ECG_ALGORITHM_H

#include <stdint.h>
#include <stdbool.h>

typedef struct {
    uint16_t heart_rate;   /* BPM */
    uint16_t hrv_rmssd;    /* ms */
    uint16_t hrv_sdnn;     /* ms */
    uint8_t  hrv_pnn50;    /* % */
    uint8_t  afib_flag;    /* 0=normal, 1=AFib detected */
    uint8_t  quality;      /* 0–100 signal quality score */
    uint8_t  lead_off;     /* 0=contact OK, 1=lead off */
} eos_ecg_result_t;

void                   ecg_algorithm_init(void);
void                   ecg_process_sample(int16_t raw_uv);
const eos_ecg_result_t *ecg_get_result(void);
void                   ecg_reset(void);

static void ecg_compute_results(void);
static uint8_t ecg_detect_afib(void);

#endif /* EOS_ECG_ALGORITHM_H */
