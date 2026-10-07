/*
 * crypto.c — Ed25519 verification for OTA images (eos-health#3)
 * SPDX-License-Identifier: MIT
 *
 * Not implemented yet, and it says so on every build. ota_verify_and_apply()
 * treats any non-zero return as "signature invalid", so this refuses every
 * image: an OTA update can never be swapped in unverified. Before this file
 * existed the OTA path could not link at all.
 *
 * The real verifier should come from the org's shared crypto (eos
 * services/crypto, or eSec once eSec#5 lands) rather than another vendored
 * copy. Note its convention when wiring it in: eos's ed25519_verify() returns
 * 1 for a valid signature, while this function must return 0 for valid.
 */
#include <stddef.h>
#include <stdint.h>

#include "../ota/ota_manager.h"

#warning "eos_verify_ed25519 is a fail-closed stub: every OTA image is rejected until a real Ed25519 verifier is linked (eos-health#3)"

int eos_verify_ed25519(const uint8_t *msg, size_t msg_len,
                       const uint8_t *sig, const uint8_t *pub_key)
{
    (void)msg;
    (void)msg_len;
    (void)sig;
    (void)pub_key;
    return -1;
}
