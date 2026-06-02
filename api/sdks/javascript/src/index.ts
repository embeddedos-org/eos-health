/**
 * EoS Health JavaScript/TypeScript SDK
 * =====================================
 * Official JS/TS client for the EoS Health Developer API.
 *
 * Install:
 *   npm install @eos-health/api
 *   yarn add @eos-health/api
 *
 * Quick start:
 *   import { EosHealthClient } from '@eos-health/api';
 *
 *   const client = new EosHealthClient({ accessToken: 'your_token' });
 *   const recovery = await client.recovery.get({ startDate: '2026-06-01' });
 *   console.log(`Recovery score: ${recovery.days[0].score}`);
 */

export { EosHealthClient } from './client';
export * from './types';
export * from './errors';
export { createOAuthUrl, exchangeCode } from './oauth';
