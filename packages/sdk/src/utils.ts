import type { PaymentPayload } from './types.js';

/**
 * Normalize facilitator URL (remove trailing slash)
 */
export function normalizeUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

/**
 * Build full endpoint URL
 */
export function buildUrl(baseUrl: string, path: string): string {
  return `${normalizeUrl(baseUrl)}${path}`;
}

/**
 * Type guard for checking if value is a valid payment payload
 */
export function isPaymentPayload(value: unknown): value is PaymentPayload {
  if (!value || typeof value !== 'object') return false;
  const obj = value as Record<string, unknown>;
  return (
    (obj.x402Version === 1 || obj.x402Version === 2) &&
    typeof obj.scheme === 'string' &&
    typeof obj.network === 'string' &&
    obj.payload !== undefined
  );
}
