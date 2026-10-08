cmake_minimum_required(VERSION 3.20.0)

find_package(Zephyr REQUIRED HINTS $ENV{ZEPHYR_BASE})
project(provisioning_crypto_test)

# The module under test lives one level up; compile it into the test app
# so the suite exercises the real implementation, not a mock.
target_sources(app PRIVATE
    ../crypto.c
    src/test_crypto.c
)
target_include_directories(app PRIVATE
    ..
    ../../ota
)
