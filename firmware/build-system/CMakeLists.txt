cmake_minimum_required(VERSION 3.20)

# ─────────────────────────────────────────────────────────────────────────────
# EoS Health Firmware — Production Build System
# Supports: health-key-ultra, health-band-neuro, health-ring, health-lab
# ─────────────────────────────────────────────────────────────────────────────

# Device selection (pass -DEOS_DEVICE=health-ring etc.)
set(EOS_DEVICE "health-ring" CACHE STRING "Target device")
set_property(CACHE EOS_DEVICE PROPERTY STRINGS
    health-key-ultra health-band-neuro health-ring health-lab)

# Firmware version
set(EOS_FW_VERSION_MAJOR 1)
set(EOS_FW_VERSION_MINOR 0)
set(EOS_FW_VERSION_PATCH 0)
set(EOS_FW_VERSION "${EOS_FW_VERSION_MAJOR}.${EOS_FW_VERSION_MINOR}.${EOS_FW_VERSION_PATCH}")

# Build type
set(CMAKE_BUILD_TYPE "Release" CACHE STRING "Build type")

# nRF5 SDK path (set via environment or cmake arg)
set(NRF5_SDK_PATH "$ENV{NRF5_SDK_PATH}" CACHE PATH "Path to nRF5 SDK 17.1.0")
if(NOT NRF5_SDK_PATH)
    message(FATAL_ERROR "NRF5_SDK_PATH not set. Download nRF5 SDK 17.1.0 from https://www.nordicsemi.com/")
endif()

# ARM GCC toolchain
set(CMAKE_SYSTEM_NAME Generic)
set(CMAKE_SYSTEM_PROCESSOR ARM)
set(CMAKE_C_COMPILER arm-none-eabi-gcc)
set(CMAKE_CXX_COMPILER arm-none-eabi-g++)
set(CMAKE_ASM_COMPILER arm-none-eabi-gcc)
set(CMAKE_OBJCOPY arm-none-eabi-objcopy)
set(CMAKE_SIZE arm-none-eabi-size)

project(eos-firmware C ASM)

# ─── Device-specific configuration ───────────────────────────────────────────
if(EOS_DEVICE STREQUAL "health-key-ultra")
    set(NRF_DEVICE "nRF52840_xxAA")
    set(SOFTDEVICE "s140")
    set(SOFTDEVICE_VERSION "7.3.0")
    set(EOS_DEVICE_DEFINE "EOS_DEVICE_HEALTH_KEY_ULTRA")
    set(EOS_SENSORS "ECG;SPO2;BAC;UV;IMU;TEMP")
    set(EOS_FEATURES "USB_HID;BLE;OTA;PROVISIONING")

elseif(EOS_DEVICE STREQUAL "health-band-neuro")
    set(NRF_DEVICE "nRF52840_xxAA")
    set(SOFTDEVICE "s140")
    set(SOFTDEVICE_VERSION "7.3.0")
    set(EOS_DEVICE_DEFINE "EOS_DEVICE_HEALTH_BAND_NEURO")
    set(EOS_SENSORS "SEMG_8CH;ECG;EDA;PPG;IMU;TEMP")
    set(EOS_FEATURES "TENS;BLE;OTA;PROVISIONING;AI_COPROCESSOR")

elseif(EOS_DEVICE STREQUAL "health-ring")
    # Tier selection
    set(EOS_RING_TIER "ultra" CACHE STRING "Ring tier: base or ultra")
    if(EOS_RING_TIER STREQUAL "ultra")
        set(NRF_DEVICE "nRF52840_xxAA")
        set(EOS_DEVICE_DEFINE "EOS_DEVICE_HEALTH_RING_ULTRA")
        set(EOS_SENSORS "ECG_DAEA;PPG_5WL;PIEZO_BP;IMU;TEMP")
        set(EOS_FEATURES "NFC_CHARGING;BLE;OTA;PROVISIONING;AI_COPROCESSOR;KEHS")
    else()
        set(NRF_DEVICE "nRF52833_xxAA")
        set(EOS_DEVICE_DEFINE "EOS_DEVICE_HEALTH_RING_BASE")
        set(EOS_SENSORS "ECG_ZPIES;PPG_3WL;IMU;TEMP")
        set(EOS_FEATURES "NFC_CHARGING;BLE;OTA;PROVISIONING;KEHS")
    endif()
    set(SOFTDEVICE "s140")
    set(SOFTDEVICE_VERSION "7.3.0")

elseif(EOS_DEVICE STREQUAL "health-lab")
    set(EOS_LAB_TIER "ultra" CACHE STRING "Lab tier: base or ultra")
    if(EOS_LAB_TIER STREQUAL "ultra")
        set(NRF_DEVICE "nRF52840_xxAA")
        set(EOS_DEVICE_DEFINE "EOS_DEVICE_HEALTH_LAB_ULTRA")
        set(EOS_SENSORS "GLUCOSE;LACTATE;SODIUM;PH;CORTISOL;POTASSIUM;URIC_ACID")
        set(EOS_FEATURES "IONTOPHORESIS;NFC_CHARGING;BLE;OTA;PROVISIONING;SCBN_KALMAN")
    else()
        set(NRF_DEVICE "nRF52833_xxAA")
        set(EOS_DEVICE_DEFINE "EOS_DEVICE_HEALTH_LAB_BASE")
        set(EOS_SENSORS "GLUCOSE;LACTATE;SODIUM;PH")
        set(EOS_FEATURES "NFC_CHARGING;BLE;OTA;PROVISIONING")
    endif()
    set(SOFTDEVICE "s140")
    set(SOFTDEVICE_VERSION "7.3.0")

else()
    message(FATAL_ERROR "Unknown EOS_DEVICE: ${EOS_DEVICE}")
endif()

# ─── Compiler flags ───────────────────────────────────────────────────────────
set(CPU_FLAGS "-mcpu=cortex-m4 -mthumb -mfpu=fpv4-sp-d16 -mfloat-abi=hard")
set(COMMON_FLAGS "${CPU_FLAGS} -Wall -Wextra -ffunction-sections -fdata-sections -fno-strict-aliasing -fno-builtin -fshort-enums")
set(CMAKE_C_FLAGS "${COMMON_FLAGS} -std=c99")
set(CMAKE_ASM_FLAGS "${CPU_FLAGS} -x assembler-with-cpp")
set(CMAKE_EXE_LINKER_FLAGS "${CPU_FLAGS} -Wl,--gc-sections -Wl,-Map=${EOS_DEVICE}.map --specs=nano.specs")

if(CMAKE_BUILD_TYPE STREQUAL "Release")
    set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -O2 -DNDEBUG")
else()
    set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Og -g3 -DDEBUG")
endif()

# ─── Compile definitions ──────────────────────────────────────────────────────
add_compile_definitions(
    ${EOS_DEVICE_DEFINE}
    EOS_FW_VERSION_MAJOR=${EOS_FW_VERSION_MAJOR}
    EOS_FW_VERSION_MINOR=${EOS_FW_VERSION_MINOR}
    EOS_FW_VERSION_PATCH=${EOS_FW_VERSION_PATCH}
    NRF52840_XXAA
    SOFTDEVICE_PRESENT
    S140
    NRF_SD_BLE_API_VERSION=7
    SWI_DISABLE0
    FLOAT_ABI_HARD
    CONFIG_GPIO_AS_PINRESET
)

# ─── Include paths ────────────────────────────────────────────────────────────
include_directories(
    ${NRF5_SDK_PATH}/components/softdevice/${SOFTDEVICE}/headers
    ${NRF5_SDK_PATH}/components/softdevice/${SOFTDEVICE}/headers/nrf52
    ${NRF5_SDK_PATH}/components/libraries/util
    ${NRF5_SDK_PATH}/components/libraries/log
    ${NRF5_SDK_PATH}/components/libraries/timer
    ${NRF5_SDK_PATH}/components/libraries/button
    ${NRF5_SDK_PATH}/components/libraries/scheduler
    ${NRF5_SDK_PATH}/components/libraries/queue
    ${NRF5_SDK_PATH}/components/libraries/ringbuf
    ${NRF5_SDK_PATH}/components/libraries/atomic
    ${NRF5_SDK_PATH}/components/libraries/fds
    ${NRF5_SDK_PATH}/components/libraries/fstorage
    ${NRF5_SDK_PATH}/components/libraries/experimental_section_vars
    ${NRF5_SDK_PATH}/components/ble/ble_advertising
    ${NRF5_SDK_PATH}/components/ble/ble_services/ble_bas
    ${NRF5_SDK_PATH}/components/ble/ble_services/ble_dis
    ${NRF5_SDK_PATH}/components/ble/common
    ${NRF5_SDK_PATH}/components/ble/nrf_ble_gatt
    ${NRF5_SDK_PATH}/components/ble/nrf_ble_qwr
    ${NRF5_SDK_PATH}/components/ble/peer_manager
    ${NRF5_SDK_PATH}/components/boards
    ${NRF5_SDK_PATH}/components/drivers_nrf/usbd
    ${NRF5_SDK_PATH}/integration/nrfx
    ${NRF5_SDK_PATH}/modules/nrfx
    ${NRF5_SDK_PATH}/modules/nrfx/drivers/include
    ${NRF5_SDK_PATH}/modules/nrfx/hal
    ${NRF5_SDK_PATH}/modules/nrfx/mdk
    ${CMAKE_SOURCE_DIR}/../shared
    ${CMAKE_SOURCE_DIR}/../shared/ota
    ${CMAKE_SOURCE_DIR}/../shared/power
    ${CMAKE_SOURCE_DIR}/../shared/crash-recovery
    ${CMAKE_SOURCE_DIR}/../shared/data-buffer
    ${CMAKE_SOURCE_DIR}/../shared/ble-stack
    ${CMAKE_SOURCE_DIR}/../shared/provisioning
    ${CMAKE_SOURCE_DIR}/../shared/health-algorithms/ecg
    ${CMAKE_SOURCE_DIR}/../shared/health-algorithms/spo2
    ${CMAKE_SOURCE_DIR}/../shared/health-algorithms/blood-pressure
    ${CMAKE_SOURCE_DIR}/../shared/health-algorithms/glucose
    ${CMAKE_SOURCE_DIR}/../shared/health-algorithms/sensor-fusion
    ${CMAKE_SOURCE_DIR}/../shared/health-algorithms/advanced
    ${CMAKE_SOURCE_DIR}/../${EOS_DEVICE}/src/main
)

# ─── Source files ─────────────────────────────────────────────────────────────
set(SHARED_SOURCES
    ${CMAKE_SOURCE_DIR}/../shared/ota/ota_manager.c
    ${CMAKE_SOURCE_DIR}/../shared/power/power_manager.c
    ${CMAKE_SOURCE_DIR}/../shared/crash-recovery/crash_recovery.c
    ${CMAKE_SOURCE_DIR}/../shared/data-buffer/data_buffer.c
    ${CMAKE_SOURCE_DIR}/../shared/ble-stack/ble_manager.c
    ${CMAKE_SOURCE_DIR}/../shared/provisioning/provisioning.c
    ${CMAKE_SOURCE_DIR}/../shared/health-algorithms/ecg/ecg_algorithm.c
    ${CMAKE_SOURCE_DIR}/../shared/health-algorithms/spo2/spo2_algorithm.c
    ${CMAKE_SOURCE_DIR}/../shared/health-algorithms/blood-pressure/bp_algorithm.c
    ${CMAKE_SOURCE_DIR}/../shared/health-algorithms/glucose/glucose_algorithm.c
    ${CMAKE_SOURCE_DIR}/../shared/health-algorithms/sensor-fusion/sensor_fusion.c
    ${CMAKE_SOURCE_DIR}/../shared/health-algorithms/advanced/advanced_algorithms.c
)

set(DEVICE_SOURCES
    ${CMAKE_SOURCE_DIR}/../${EOS_DEVICE}/src/main/main.c
)

if(EOS_DEVICE STREQUAL "health-band-neuro")
    list(APPEND DEVICE_SOURCES
        ${CMAKE_SOURCE_DIR}/../health-band-neuro/algorithms/semg_algorithm.c
        ${CMAKE_SOURCE_DIR}/../health-band-neuro/algorithms/eda_algorithm.c
        ${CMAKE_SOURCE_DIR}/../health-band-neuro/algorithms/tens_controller.c
    )
endif()

# ─── Linker script ────────────────────────────────────────────────────────────
set(LINKER_SCRIPT "${CMAKE_SOURCE_DIR}/linker/${NRF_DEVICE}_${SOFTDEVICE}.ld")

# ─── Target ───────────────────────────────────────────────────────────────────
add_executable(${EOS_DEVICE} ${SHARED_SOURCES} ${DEVICE_SOURCES})
target_link_options(${EOS_DEVICE} PRIVATE -T${LINKER_SCRIPT})

# ─── Post-build: generate .hex and .bin ──────────────────────────────────────
add_custom_command(TARGET ${EOS_DEVICE} POST_BUILD
    COMMAND ${CMAKE_OBJCOPY} -O ihex $<TARGET_FILE:${EOS_DEVICE}> ${EOS_DEVICE}-${EOS_FW_VERSION}.hex
    COMMAND ${CMAKE_OBJCOPY} -O binary $<TARGET_FILE:${EOS_DEVICE}> ${EOS_DEVICE}-${EOS_FW_VERSION}.bin
    COMMAND ${CMAKE_SIZE} $<TARGET_FILE:${EOS_DEVICE}>
    COMMENT "Generating ${EOS_DEVICE}-${EOS_FW_VERSION}.hex and .bin"
)

message(STATUS "EoS Firmware Build Configuration:")
message(STATUS "  Device:     ${EOS_DEVICE}")
message(STATUS "  MCU:        ${NRF_DEVICE}")
message(STATUS "  SoftDevice: ${SOFTDEVICE} v${SOFTDEVICE_VERSION}")
message(STATUS "  Version:    ${EOS_FW_VERSION}")
message(STATUS "  Build type: ${CMAKE_BUILD_TYPE}")
message(STATUS "  Sensors:    ${EOS_SENSORS}")
message(STATUS "  Features:   ${EOS_FEATURES}")
