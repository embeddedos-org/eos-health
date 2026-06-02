/*
 * EoS Health — Crash Recovery Header
 */

#ifndef EOS_CRASH_RECOVERY_H
#define EOS_CRASH_RECOVERY_H

#include <stdint.h>
#include <zephyr/kernel.h>

#define EOS_FW_VERSION  0x01000000U  /* 1.0.0.0 */

typedef enum {
    CRASH_TYPE_WATCHDOG     = 0,
    CRASH_TYPE_HARDFAULT    = 1,
    CRASH_TYPE_BUSFAULT     = 2,
    CRASH_TYPE_USAGEFAULT   = 3,
    CRASH_TYPE_MEMFAULT     = 4,
    CRASH_TYPE_STUCK_THREAD = 5,
    CRASH_TYPE_STACK_OVF    = 6,
    CRASH_TYPE_ASSERT       = 7,
} crash_type_t;

typedef struct {
    crash_type_t type;
    uint32_t     pc;
    uint32_t     lr;
    uint32_t     sp;
    uint32_t     extra;
    uint32_t     uptime_ms;
    uint32_t     fw_version;
} crash_entry_t;

int  crash_recovery_init(void);
void crash_record(crash_type_t type, uint32_t pc, uint32_t lr,
                  uint32_t sp, uint32_t extra);
void crash_register_thread(struct k_thread *thread, const char *name,
                            uint32_t timeout_ms);
void crash_thread_kick(struct k_thread *thread);
void crash_enter_safe_boot(void);
void crash_clear_log(void);

typedef struct crash_log_nvm_t crash_log_nvm_t;
crash_log_nvm_t *crash_get_log(void);

/* Internal */
static void crash_log_load(crash_log_nvm_t *log);
static void crash_log_save(const crash_log_nvm_t *log);

/* HAL */
void ble_start_safe_boot_advertising(void);

#endif /* EOS_CRASH_RECOVERY_H */
