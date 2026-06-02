/*
 * EoS Health — Crash Recovery Module
 * File: firmware/shared/crash-recovery/crash_recovery.c
 *
 * Implements:
 *   - Hardware watchdog (WDT) with 5s timeout, kicked by health-check thread
 *   - Zephyr fault handler override: captures PC, LR, SP, fault type
 *   - Persistent crash log in NVM (survives reboot)
 *   - Safe-boot mode: if 3 crashes in 60s → enter minimal BLE-only mode
 *   - Crash report sent to mobile app via BLE on next connection
 *   - Thread health monitoring: detects stuck threads
 */

#include <zephyr/kernel.h>
#include <zephyr/drivers/watchdog.h>
#include <zephyr/storage/flash_map.h>
#include <zephyr/sys/reboot.h>
#include <zephyr/logging/log.h>
#include <zephyr/arch/cpu.h>
#include "crash_recovery.h"

LOG_MODULE_REGISTER(crash_recovery, LOG_LEVEL_INF);

/* ── Crash log NVM layout (4 KB at 0x000F3000) ─────────────── */
#define CRASH_LOG_PARTITION_ID  FIXED_PARTITION_ID(crash_log_partition)
#define CRASH_LOG_MAGIC         0xEA5C0DE1U
#define CRASH_LOG_MAX_ENTRIES   8

typedef struct {
    uint32_t magic;
    uint32_t crash_count;
    uint32_t last_crash_uptime_ms;
    crash_entry_t entries[CRASH_LOG_MAX_ENTRIES];
    uint8_t  entry_count;
    uint8_t  safe_boot_count;
    uint8_t  _pad[2];
} crash_log_nvm_t;

/* ── Thread health tracking ─────────────────────────────────── */
#define MAX_MONITORED_THREADS 8
static struct {
    struct k_thread *thread;
    uint32_t         last_kick_ms;
    uint32_t         timeout_ms;
    const char      *name;
} thread_health[MAX_MONITORED_THREADS];
static uint8_t thread_health_count;

/* ── Watchdog ───────────────────────────────────────────────── */
static const struct device *wdt_dev;
static int wdt_channel_id;

static void wdt_callback(const struct device *dev, int channel_id)
{
    /* WDT fired — system about to reset. Save minimal crash info. */
    crash_record(CRASH_TYPE_WATCHDOG, 0, 0, 0, 0);
    LOG_ERR("WATCHDOG TIMEOUT — system resetting");
    /* WDT will reset the system automatically */
}

int crash_recovery_init(void)
{
    /* Initialize WDT */
    wdt_dev = DEVICE_DT_GET(DT_NODELABEL(wdt0));
    if (!device_is_ready(wdt_dev)) {
        LOG_ERR("WDT not ready");
        return -ENODEV;
    }

    struct wdt_timeout_cfg wdt_cfg = {
        .window.min = 0,
        .window.max = 5000, /* 5 second timeout */
        .callback   = wdt_callback,
        .flags      = WDT_FLAG_RESET_SOC,
    };
    wdt_channel_id = wdt_install_timeout(wdt_dev, &wdt_cfg);
    if (wdt_channel_id < 0) {
        LOG_ERR("wdt_install_timeout failed: %d", wdt_channel_id);
        return wdt_channel_id;
    }
    wdt_setup(wdt_dev, WDT_OPT_PAUSE_HALTED_BY_DBG);

    /* Check for previous crash */
    crash_log_nvm_t log;
    crash_log_load(&log);
    if (log.magic == CRASH_LOG_MAGIC && log.crash_count > 0) {
        LOG_WRN("Previous crash detected: count=%u, type=%u",
                log.crash_count,
                log.entries[(log.entry_count - 1) % CRASH_LOG_MAX_ENTRIES].type);

        /* Safe-boot: 3+ crashes in < 60s → minimal mode */
        if (log.safe_boot_count >= 3) {
            LOG_ERR("SAFE BOOT MODE: too many crashes");
            crash_enter_safe_boot();
        }
    }

    LOG_INF("Crash recovery init OK");
    return 0;
}

/* ── Watchdog kick thread ───────────────────────────────────── */
static void watchdog_thread_fn(void *a, void *b, void *c)
{
    while (1) {
        k_sleep(K_SECONDS(4)); /* Kick every 4s, WDT timeout is 5s */

        /* Check all monitored threads are alive */
        uint32_t now = k_uptime_get_32();
        bool all_healthy = true;
        for (int i = 0; i < thread_health_count; i++) {
            if ((now - thread_health[i].last_kick_ms) > thread_health[i].timeout_ms) {
                LOG_ERR("Thread '%s' stuck for %u ms",
                        thread_health[i].name,
                        now - thread_health[i].last_kick_ms);
                crash_record(CRASH_TYPE_STUCK_THREAD, 0, 0, 0,
                             (uint32_t)thread_health[i].thread);
                all_healthy = false;
            }
        }

        if (all_healthy) {
            wdt_feed(wdt_dev, wdt_channel_id);
        }
        /* If not healthy: WDT will fire in 1s and reset the system */
    }
}

K_THREAD_DEFINE(watchdog_thread, 512, watchdog_thread_fn, NULL, NULL, NULL, 1, 0, 0);

/* ── Thread registration ────────────────────────────────────── */
void crash_register_thread(struct k_thread *thread, const char *name,
                            uint32_t timeout_ms)
{
    if (thread_health_count >= MAX_MONITORED_THREADS) return;
    thread_health[thread_health_count].thread       = thread;
    thread_health[thread_health_count].name         = name;
    thread_health[thread_health_count].timeout_ms   = timeout_ms;
    thread_health[thread_health_count].last_kick_ms = k_uptime_get_32();
    thread_health_count++;
}

void crash_thread_kick(struct k_thread *thread)
{
    for (int i = 0; i < thread_health_count; i++) {
        if (thread_health[i].thread == thread) {
            thread_health[i].last_kick_ms = k_uptime_get_32();
            return;
        }
    }
}

/* ── Fault handler override ─────────────────────────────────── */
void k_sys_fatal_error_handler(unsigned int reason, const z_arch_esf_t *esf)
{
    uint32_t pc = 0, lr = 0, sp = 0;

#ifdef CONFIG_ARM
    if (esf) {
        pc = esf->basic.pc;
        lr = esf->basic.lr;
        sp = (uint32_t)esf;
    }
#endif

    LOG_ERR("FATAL FAULT: reason=%u PC=0x%08X LR=0x%08X SP=0x%08X",
            reason, pc, lr, sp);

    crash_record((crash_type_t)reason, pc, lr, sp, 0);

    /* Allow log to flush */
    k_sleep(K_MSEC(100));

    /* Reset */
    sys_reboot(SYS_REBOOT_COLD);
}

/* ── Crash log ──────────────────────────────────────────────── */
void crash_record(crash_type_t type, uint32_t pc, uint32_t lr,
                  uint32_t sp, uint32_t extra)
{
    crash_log_nvm_t log;
    crash_log_load(&log);

    if (log.magic != CRASH_LOG_MAGIC) {
        memset(&log, 0, sizeof(log));
        log.magic = CRASH_LOG_MAGIC;
    }

    uint8_t idx = log.entry_count % CRASH_LOG_MAX_ENTRIES;
    log.entries[idx].type       = type;
    log.entries[idx].pc         = pc;
    log.entries[idx].lr         = lr;
    log.entries[idx].sp         = sp;
    log.entries[idx].extra      = extra;
    log.entries[idx].uptime_ms  = k_uptime_get_32();
    log.entries[idx].fw_version = EOS_FW_VERSION;
    log.entry_count++;
    log.crash_count++;
    log.last_crash_uptime_ms = k_uptime_get_32();

    /* Detect rapid crash loop */
    if (log.crash_count >= 3) {
        uint32_t first_crash = log.entries[0].uptime_ms;
        uint32_t last_crash  = log.entries[idx].uptime_ms;
        if ((last_crash - first_crash) < 60000) {
            log.safe_boot_count++;
        } else {
            log.safe_boot_count = 0;
            log.crash_count     = 1;
        }
    }

    crash_log_save(&log);
}

static void crash_log_load(crash_log_nvm_t *log)
{
    const struct flash_area *fa;
    flash_area_open(CRASH_LOG_PARTITION_ID, &fa);
    flash_area_read(fa, 0, log, sizeof(*log));
    flash_area_close(fa);
}

static void crash_log_save(const crash_log_nvm_t *log)
{
    const struct flash_area *fa;
    flash_area_open(CRASH_LOG_PARTITION_ID, &fa);
    flash_area_erase(fa, 0, sizeof(*log));
    flash_area_write(fa, 0, log, sizeof(*log));
    flash_area_close(fa);
}

void crash_enter_safe_boot(void)
{
    LOG_ERR("Entering SAFE BOOT MODE — BLE only, sensors disabled");
    /* Disable all sensors */
    sensor_set_rate(SENSOR_RATE_OFF);
    /* Start minimal BLE advertising for crash report retrieval */
    ble_start_safe_boot_advertising();
    /* Block here — main application does not start */
    while (1) {
        k_sleep(K_SECONDS(1));
        wdt_feed(wdt_dev, wdt_channel_id);
    }
}

crash_log_nvm_t *crash_get_log(void)
{
    static crash_log_nvm_t log;
    crash_log_load(&log);
    return (log.magic == CRASH_LOG_MAGIC) ? &log : NULL;
}

void crash_clear_log(void)
{
    const struct flash_area *fa;
    flash_area_open(CRASH_LOG_PARTITION_ID, &fa);
    flash_area_erase(fa, 0, sizeof(crash_log_nvm_t));
    flash_area_close(fa);
}
