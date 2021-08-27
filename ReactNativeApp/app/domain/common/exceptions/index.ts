import { ErrorsTypes } from "~/application/protocols"

export class AccessDeniedError extends Error {
    constructor() {
      super("AccessDenied")
      this.name = "AccessDenied"
      this.message = "exceptions:ACCESS_DENIED"
    }
}

export class BadRequestError extends Error {
  constructor(httpResponseError: ErrorsTypes) {
    super("BadRequest")
    this.name = "BadRequest"
    this.message = httpResponseError?.[0]?.errors?.[0]?.errorMessage || "exceptions.badRequest"
  }
}

export class UnexpectedError extends Error {
    constructor(message?: string) {
      super("UnexpectedError")
      this.name = "UnexpectedError"
      this.message = message ?? "exceptions:UNEXPECTED_ERROR"
    }
}
