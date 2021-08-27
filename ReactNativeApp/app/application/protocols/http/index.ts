export type HttpMethod = "post" | "get" | "put" | "delete" | "patch"

export enum HttpStatusCode {
    ok = 200,
    created = 201,
    noContent = 204,
    badRequest = 400,
    unauthorized = 401,
    forbidden = 403,
    notFound = 404,
    unprocessableEntity = 422,
    serverError = 500,
}

export interface HttpRequest {
    url: string
    method: HttpMethod
    body?: any
    headers?: any
}

export interface HttpClient<R = any> {
    request: (data: HttpRequest) => Promise<HttpResponse<R>>
}

export type HttpResponseBody<R> = (R & { errors?: any })

export interface HttpResponse<R = any> {
    statusCode: HttpStatusCode
    body?: HttpResponseBody<R>
}

export type ErrorsTypes = Array<{
    errors?: Array<{
      propertyName: string
      errorMessage: string
      attemptedValue: string
      customState: string
      severity: number
      errorCode: string
      formattedMessagePlaceholderValues: {
        PropertyName: string
        PropertyValue: string
      }
    }>
}>
