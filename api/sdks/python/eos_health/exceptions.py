"""EoS Health Python SDK — Exceptions"""


class EosHealthError(Exception):
    """Base exception for all EoS Health API errors."""
    pass


class AuthenticationError(EosHealthError):
    """Raised when the access token is invalid or expired."""
    pass


class RateLimitError(EosHealthError):
    """Raised when the API rate limit is exceeded."""
    pass


class DeviceNotFoundError(EosHealthError):
    """Raised when the specified device is not found."""
    pass


class InsufficientScopeError(EosHealthError):
    """Raised when the OAuth token lacks required scope."""
    pass


class DeviceCapabilityError(EosHealthError):
    """Raised when requesting data not supported by the device model."""
    pass
