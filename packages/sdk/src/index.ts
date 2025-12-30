// Main client
export { OpenFacilitator, createDefaultFacilitator } from './client.js';

// Types
export type {
  FacilitatorConfig,
  PaymentPayload,
  PaymentAuthorization,
  PaymentRequirements,
  VerifyResponse,
  SettleResponse,
  SupportedResponse,
  PaymentKind,
  NetworkType,
  NetworkInfo,
} from './types.js';

// Errors
export {
  FacilitatorError,
  NetworkError,
  VerificationError,
  SettlementError,
  ConfigurationError,
} from './errors.js';

// Network utilities
export {
  NETWORKS,
  getNetwork,
  getNetworkType,
  toV1NetworkId,
  toV2NetworkId,
  isValidNetwork,
  getMainnets,
  getTestnets,
} from './networks.js';

// Utils
export { isPaymentPayload } from './utils.js';
