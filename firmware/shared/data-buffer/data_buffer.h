/*
 * EoS Health — Data Buffer Header
 */

#ifndef EOS_DATA_BUFFER_H
#define EOS_DATA_BUFFER_H

#include <stdint.h>
#include <stdbool.h>

typedef enum {
    SENSOR_TYPE_ECG         = 0x01,
    SENSOR_TYPE_PPG         = 0x02,
    SENSOR_TYPE_SPO2        = 0x03,
    SENSOR_TYPE_HR          = 0x04,
    SENSOR_TYPE_HRV         = 0x05,
    SENSOR_TYPE_TEMPERATURE = 0x06,
    SENSOR_TYPE_IMU         = 0x07,
    SENSOR_TYPE_BLOOD_PRES  = 0x08,
    SENSOR_TYPE_HBA1C       = 0x09,
    SENSOR_TYPE_GLUCOSE     = 0x0A,
    SENSOR_TYPE_LACTATE     = 0x0B,
    SENSOR_TYPE_CORTISOL    = 0x0C,
    SENSOR_TYPE_ELECTROLYTE = 0x0D,
    SENSOR_TYPE_EMSG        = 0x0E,
    SENSOR_TYPE_BAC         = 0x0F,
    SENSOR_TYPE_SUMMARY     = 0x10,  /* Aggregated health summary */
} sensor_type_t;

/* Record flags */
#define DATA_FLAG_CRITICAL  0x01  /* Do not drop on buffer full */
#define DATA_FLAG_ALERT     0x02  /* Requires immediate sync */
#define DATA_FLAG_COMPRESSED 0x04 /* Data is LZ4 compressed */

typedef struct __attribute__((packed)) {
    uint32_t magic;
    uint32_t write_offset;
    uint32_t read_offset;
    uint32_t record_count;
    uint32_t bytes_used;
    uint8_t  _pad[12];
} data_buf_header_t;

/**
 * @brief Callback for sync — called once per record.
 * @return 0 on success, -EAGAIN if BLE congested (pause sync)
 */
typedef int (*data_buffer_sync_cb_t)(sensor_type_t type, uint8_t flags,
                                      const uint8_t *data, uint16_t len,
                                      uint32_t timestamp_ms);

int      data_buffer_init(void);
int      data_buffer_write(sensor_type_t type, uint8_t flags,
                            const uint8_t *data, uint16_t len);
int      data_buffer_sync_start(data_buffer_sync_cb_t cb);
void     data_buffer_clear(void);

uint32_t data_buffer_get_record_count(void);
uint32_t data_buffer_get_bytes_used(void);
bool     data_buffer_is_overflow(void);

static void data_buffer_save_header(void);
static void data_buffer_drop_oldest_noncritical(void);

#endif /* EOS_DATA_BUFFER_H */
