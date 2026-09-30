export type ApiErrorKind =
  'offline' | 'unauthorized' | 'forbidden' | 'not-found' | 'invalid' | 'unknown';

/**
 * The single error type the API layer throws. Screens catch this and show
 * `error.message`; nothing above this layer needs to know about HTTP status
 * codes or PocketBase's ClientResponseError.
 */
export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number;

  constructor(kind: ApiErrorKind, message: string, status = 0, cause?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
    this.cause = cause;
    // keeps `instanceof ApiError` working once the class is transpiled
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

function kindForStatus(status: number): ApiErrorKind {
  if (status === 0) return 'offline';
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'not-found';
  if (status === 400) return 'invalid';
  return 'unknown';
}

function statusOf(cause: unknown): number {
  if (typeof cause === 'object' && cause !== null && 'status' in cause) {
    const { status } = cause as { status: unknown };
    if (typeof status === 'number') return status;
  }
  return 0;
}

/**
 * Normalises whatever the transport threw into an ApiError. `fallback` is the
 * message shown when the cause carries nothing more specific.
 */
export function toApiError(cause: unknown, fallback: string): ApiError {
  if (cause instanceof ApiError) return cause;

  const status = statusOf(cause);
  const kind = kindForStatus(status);

  const message =
    kind === 'offline'
      ? 'No connection to the server.'
      : kind === 'forbidden'
        ? `${fallback} The collection is not readable with these credentials.`
        : kind === 'not-found'
          ? `${fallback} The collection does not exist on the backend.`
          : fallback;

  return new ApiError(kind, message, status, cause);
}
