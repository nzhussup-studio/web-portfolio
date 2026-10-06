export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message = "Request failed",
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function isNotFoundError(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 404;
}
