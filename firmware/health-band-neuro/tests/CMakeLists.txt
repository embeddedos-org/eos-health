cmake_minimum_required(VERSION 3.20)
project(health_band_neuro_tests C)

set(CMAKE_C_STANDARD 11)

# add_test() below only registers with ctest once testing is enabled. Without
# this, the suites built successfully and ctest reported "No tests were
# found!!!", so nothing was actually being run. The same fix was already
# applied to devices/health-band-neuro/firmware/tests/CMakeLists.txt; this
# copy of the tree never received it.
enable_testing()

# Host build — no MCU flags needed
set(CMAKE_C_FLAGS "-Wall -Wextra -O2 -DTEST_BUILD")

# Unity test framework (single-file, included inline)
add_library(unity STATIC unity/unity.c)
target_include_directories(unity PUBLIC unity)

# Test sources — compile firmware modules for host
#
# CMAKE_SOURCE_DIR is the top-level source directory, which is only this one
# while this directory is configured standalone. CMAKE_CURRENT_SOURCE_DIR is
# correct in both cases.
set(FW_ROOT ${CMAKE_CURRENT_SOURCE_DIR}/..)

# health_band.h sits at the root of this tree, not in an include/ subdirectory
# -- firmware/health-band-neuro/include/ does not exist. Only the devices/
# copy of this tree uses include/. Every suite here failed with
#   fatal error: health_band.h: No such file or directory
# once the configure errors above stopped masking the build. The header is
# byte-identical between the two trees; only the layout differs. Both paths
# are listed so this works whichever layout a tree uses.
set(FW_INCLUDE_DIRS ${FW_ROOT} ${FW_ROOT}/include unity)

# ─── Suites whose modules exist in this tree ─────────────────────────────────
add_executable(test_eeg_filter
    test_eeg_filter.c
    ${FW_ROOT}/src/eeg/eeg_filter.c
)
target_include_directories(test_eeg_filter PRIVATE ${FW_INCLUDE_DIRS})
target_link_libraries(test_eeg_filter unity m)
add_test(NAME test_eeg_filter COMMAND test_eeg_filter)

add_executable(test_gps_nmea
    test_gps_nmea.c
    ${FW_ROOT}/src/gps/gps_nmea.c
)
target_include_directories(test_gps_nmea PRIVATE ${FW_INCLUDE_DIRS})
target_link_libraries(test_gps_nmea unity m)
add_test(NAME test_gps_nmea COMMAND test_gps_nmea)

# ─── Suites whose modules do not exist in this tree ──────────────────────────
# test_ecg_hrv and test_semg_gesture name ../src/ecg/ecg_hrv.c and
# ../src/semg/semg_gesture.c. Neither file -- nor the ecg/ or semg/ directory
# -- exists under firmware/health-band-neuro/src/, which holds only eeg/, gps/
# and main/. This was a hard configure failure for the whole directory:
#   CMake Error: Cannot find source file: .../src/ecg/ecg_hrv.c
#   CMake Error: No SOURCES given to target: test_ecg_hrv
#
# The modules are not lost. They live in devices/health-band-neuro/firmware/
# src/, whose test suite builds and passes. This directory is a stale
# duplicate of devices/health-band-neuro/firmware/tests/: its test_gps_nmea.c
# and test_semg_gesture.c are byte-identical to that copy, while its
# test_ecg_hrv.c and test_eeg_filter.c are missing tests that copy has (the
# 0.15 Hz HF case added by PR #20, and seven band/notch cases), so the
# devices/ tree is the one being maintained.
#
# Nothing is stubbed and no source is invented here. The two targets are
# skipped with their missing files named, rather than failing the two suites
# that do work. Consolidating the duplicate trees is the real fix and is a
# maintainer decision -- see #2 and #30.
set(ABSENT_MODULE_SUITES "")
foreach(pair "test_ecg_hrv:src/ecg/ecg_hrv.c" "test_semg_gesture:src/semg/semg_gesture.c")
    string(REPLACE ":" ";" pair_list ${pair})
    list(GET pair_list 0 suite)
    list(GET pair_list 1 module)
    if(EXISTS ${FW_ROOT}/${module})
        add_executable(${suite} ${suite}.c ${FW_ROOT}/${module})
        target_include_directories(${suite} PRIVATE ${FW_INCLUDE_DIRS})
        target_link_libraries(${suite} unity m)
        add_test(NAME ${suite} COMMAND ${suite})
    else()
        list(APPEND ABSENT_MODULE_SUITES "${suite} (needs ${module})")
    endif()
endforeach()

if(ABSENT_MODULE_SUITES)
    string(REPLACE ";" "\n    " ABSENT_PRETTY "${ABSENT_MODULE_SUITES}")
    message(WARNING
        "Skipping test suites whose modules are absent from "
        "firmware/health-band-neuro/src:\n    ${ABSENT_PRETTY}\n"
        "The maintained copies of these suites are in "
        "devices/health-band-neuro/firmware/tests/ and are built there. "
        "See #2 and #30: these two trees are duplicates and should be merged.")
endif()
