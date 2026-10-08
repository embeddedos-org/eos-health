/*
 * Ztest suite for eos_verify_ed25519() (firmware/shared/provisioning/crypto.c).
 *
 * eos-health#3: the OTA path called a verifier that did not exist. Until a
 * real Ed25519 verifier is linked, the function must fail closed: a non-zero
 * return for every input, including a signature that is genuinely valid
 * (RFC 8032 section 7.1, TEST 2), because ota_verify_and_apply() aborts the
 * swap on any non-zero return. When the real verifier lands, the valid-vector
 * case below must flip to == 0, which is the point of keeping it here.
 *
 * Build: west build -b native_sim firmware/shared/provisioning/tests
 * Run:   west build -t run
 */
#include <zephyr/ztest.h>
#include <stddef.h>
#include <stdint.h>

#include "ota_manager.h"

static const uint8_t t2_pub[32] = {
	0x3d, 0x40, 0x17, 0xc3, 0xe8, 0x43, 0x89, 0x5a, 0x92, 0xb7, 0x0a, 0xa7, 0x4d, 0x1b, 0x7e, 0xbc,
	0x9c, 0x98, 0x2c, 0xcf, 0x2e, 0xc4, 0x96, 0x8c, 0xc0, 0xcd, 0x55, 0xf1, 0x2a, 0xf4, 0x66, 0x0c};
static const uint8_t t2_sig[64] = {
	0x92, 0xa0, 0x09, 0xa9, 0xf0, 0xd4, 0xca, 0xb8, 0x72, 0x0e, 0x82, 0x0b, 0x5f, 0x64, 0x25, 0x40,
	0xa2, 0xb2, 0x7b, 0x54, 0x16, 0x50, 0x3f, 0x8f, 0xb3, 0x76, 0x22, 0x23, 0xeb, 0xdb, 0x69, 0xda,
	0x08, 0x5a, 0xc1, 0xe4, 0x3e, 0x15, 0x99, 0x6e, 0x45, 0x8f, 0x36, 0x13, 0xd0, 0xf1, 0x1d, 0x8c,
	0x38, 0x7b, 0x2e, 0xae, 0xb4, 0x30, 0x2a, 0xee, 0xb0, 0x0d, 0x29, 0x16, 0x12, 0xbb, 0x0c, 0x00};
static const uint8_t t2_msg[1] = {0x72};

ZTEST(ota_crypto, test_valid_signature_is_still_refused_by_the_stub)
{
	zassert_not_equal(eos_verify_ed25519(t2_msg, sizeof(t2_msg), t2_sig, t2_pub), 0,
			  "a fail-closed stub must not accept any signature");
}

ZTEST(ota_crypto, test_garbage_is_refused)
{
	uint8_t msg[32] = {0}, sig[64] = {0}, key[32] = {0};

	zassert_not_equal(eos_verify_ed25519(msg, sizeof(msg), sig, key), 0);
}

ZTEST(ota_crypto, test_null_inputs_are_refused)
{
	zassert_not_equal(eos_verify_ed25519(NULL, 0, NULL, NULL), 0);
}

ZTEST_SUITE(ota_crypto, NULL, NULL, NULL, NULL, NULL);
