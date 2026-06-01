cmake_minimum_required(VERSION 3.20)
project(health_band_neuro_tests C)

set(CMAKE_C_STANDARD 11)

# Host build — no MCU flags needed
set(CMAKE_C_FLAGS "-Wall -Wextra -O2 -DTEST_BUILD")

# Unity test framework (single-file, included inline)
add_library(unity STATIC unity/unity.c)
target_include_directories(unity PUBLIC unity)

# Test sources — compile firmware modules for host
set(FW_ROOT ${CMAKE_SOURCE_DIR}/..)

add_executable(test_eeg_filter
    test_eeg_filter.c
    ${FW_ROOT}/src/eeg/eeg_filter.c
)
target_include_directories(test_eeg_filter PRIVATE ${FW_ROOT}/include unity)
target_link_libraries(test_eeg_filter unity m)
add_test(NAME test_eeg_filter COMMAND test_eeg_filter)

add_executable(test_ecg_hrv
    test_ecg_hrv.c
    ${FW_ROOT}/src/ecg/ecg_hrv.c
)
target_include_directories(test_ecg_hrv PRIVATE ${FW_ROOT}/include unity)
target_link_libraries(test_ecg_hrv unity m)
add_test(NAME test_ecg_hrv COMMAND test_ecg_hrv)

add_executable(test_semg_gesture
    test_semg_gesture.c
    ${FW_ROOT}/src/semg/semg_gesture.c
)
target_include_directories(test_semg_gesture PRIVATE ${FW_ROOT}/include unity)
target_link_libraries(test_semg_gesture unity m)
add_test(NAME test_semg_gesture COMMAND test_semg_gesture)

add_executable(test_gps_nmea
    test_gps_nmea.c
    ${FW_ROOT}/src/gps/gps_nmea.c
)
target_include_directories(test_gps_nmea PRIVATE ${FW_ROOT}/include unity)
target_link_libraries(test_gps_nmea unity m)
add_test(NAME test_gps_nmea COMMAND test_gps_nmea)
