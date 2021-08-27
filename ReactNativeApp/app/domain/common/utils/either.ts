export type Either<L, R> = Error<L, R> | Success<L, R>

export class Error<L, R> {
  readonly value: L

  constructor(value: L) {
    this.value = value
  }

  isError(): this is Error<L, R> {
    return true
  }

  isSuccess(): this is Success<L, R> {
    return false
  }
}

export class Success<L, R> {
  readonly value: R

  constructor(value: R) {
    this.value = value
  }

  isError(): this is Error<L, R> {
    return false
  }

  isSuccess(): this is Success<L, R> {
    return true
  }
}

export const error = <L, R>(l: L): Either<L, R> => {
  return new Error<L, R>(l)
}

export const success = <L, R>(r: R): Either<L, R> => {
  return new Success<L, R>(r)
}
