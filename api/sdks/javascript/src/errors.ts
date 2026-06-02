/** EoS Health TypeScript SDK — Error Classes */

export class EosHealthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EosHealthError';
  }
}

export class AuthenticationError extends EosHealthError {
  constructor(message = 'Invalid or expired access token') {
    super(message);
    this.name = 'AuthenticationError';
  }
}

export class RateLimitError extends EosHealthError {
  constructor(message = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class DeviceNotFoundError extends EosHealthError {
  constructor(message = 'Device not found') {
    super(message);
    this.name = 'DeviceNotFoundError';
  }
}

export class InsufficientScopeError extends EosHealthError {
  constructor(message = 'Insufficient OAuth scope') {
    super(message);
    this.name = 'InsufficientScopeError';
  }
}
