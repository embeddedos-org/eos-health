cmake_minimum_required(VERSION 3.20)

# ─── HEALTH-BAND-Neuro Firmware ────────────────────────────────────────────────
# Target: Nordic nRF52840 (ARM Cortex-M4F, 64 MHz, 1 MB Flash, 256 KB RAM)
# Toolchain: arm-none-eabi-gcc
# SDK: nRF5 SDK 17.1.0 / Zephyr RTOS 3.5
# ──────────────────────────────────────────────────────────────────────────────

project(health_band_neuro
    VERSION 1.4.0
    DESCRIPTION "HEALTH-BAND-Neuro wearable firmware — EEG/sEMG/ECG/TENS/BLE"
    LANGUAGES C ASM
)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_STANDARD_REQUIRED ON)

# ─── Target MCU ───────────────────────────────────────────────────────────────
set(MCU "nRF52840_xxAA")
set(CPU "cortex-m4")
set(FPU "fpv4-sp-d16")
set(FLOAT_ABI "hard")

# ─── Compiler flags ───────────────────────────────────────────────────────────
set(MCU_FLAGS "-mcpu=${CPU} -mthumb -mfpu=${FPU} -mfloat-abi=${FLOAT_ABI}")
set(CMAKE_C_FLAGS "${MCU_FLAGS} -Wall -Wextra -Wpedantic -fdata-sections -ffunction-sections -fstack-usage")
set(CMAKE_C_FLAGS_DEBUG   "-Og -g3 -DDEBUG")
set(CMAKE_C_FLAGS_RELEASE "-O2 -DNDEBUG")

# ─── Source files ─────────────────────────────────────────────────────────────
set(FIRMWARE_SOURCES
    src/main.c
    src/eeg/ads1299_driver.c
    src/eeg/eeg_filter.c
    src/eeg/eeg_classifier.c
    src/semg/semg_driver.c
    src/semg/semg_gesture.c
    src/ecg/ecg_driver.c
    src/ecg/ecg_hrv.c
    src/tens/tens_driver.c
    src/tens/tens_waveform.c
    src/bac/bac_sensor.c
    src/gps/gps_nmea.c
    src/ble/ble_stack.c
    src/ble/ble_health_service.c
    src/ble/ble_neuro_service.c
    src/power/power_manager.c
    src/storage/flash_storage.c
    src/imu/imu_driver.c
    src/imu/fall_detection.c
    src/utils/ring_buffer.c
    src/utils/crc32.c
    src/utils/fixed_point.c
)

# ─── Include directories ──────────────────────────────────────────────────────
include_directories(
    include
    src
    third_party/cmsis/include
    third_party/nrf52_hal/include
)

# ─── Main firmware binary ─────────────────────────────────────────────────────
add_executable(health_band_neuro.elf ${FIRMWARE_SOURCES})

target_compile_definitions(health_band_neuro.elf PRIVATE
    NRF52840_XXAA
    CONFIG_BLE_MAX_CONN=4
    CONFIG_EEG_CHANNELS=14
    CONFIG_SEMG_CHANNELS=3
    CONFIG_ECG_LEADS=1
    CONFIG_TENS_CHANNELS=2
    CONFIG_SAMPLE_RATE_EEG=250
    CONFIG_SAMPLE_RATE_SEMG=1000
    CONFIG_SAMPLE_RATE_ECG=500
    CONFIG_GPS_ENABLED=1
    CONFIG_BAC_ENABLED=1
    CONFIG_FALL_DETECT_ENABLED=1
)

# ─── Linker ───────────────────────────────────────────────────────────────────
set(LINKER_SCRIPT "${CMAKE_SOURCE_DIR}/linker/nrf52840_health_band.ld")
target_link_options(health_band_neuro.elf PRIVATE
    -T${LINKER_SCRIPT}
    -Wl,--gc-sections
    -Wl,-Map=${CMAKE_BINARY_DIR}/health_band_neuro.map
    --specs=nano.specs
    --specs=nosys.specs
    -lm
)

# ─── Post-build: generate .bin and .hex ───────────────────────────────────────
add_custom_command(TARGET health_band_neuro.elf POST_BUILD
    COMMAND ${CMAKE_OBJCOPY} -O binary health_band_neuro.elf health_band_neuro.bin
    COMMAND ${CMAKE_OBJCOPY} -O ihex   health_band_neuro.elf health_band_neuro.hex
    COMMAND ${CMAKE_SIZE}    health_band_neuro.elf
    COMMENT "Generating health_band_neuro.bin and .hex"
)

# ─── Unit tests (host build, no MCU required) ─────────────────────────────────
enable_testing()
add_subdirectory(tests)
