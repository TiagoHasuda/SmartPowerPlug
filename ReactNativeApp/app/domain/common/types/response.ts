import { AccessDeniedError, UnexpectedError } from "~/domain/common/exceptions"
import { Either } from "~/domain/common/utils"

export type ResponseError = AccessDeniedError | UnexpectedError

export type Response<R = unknown> = Either<ResponseError, R>
