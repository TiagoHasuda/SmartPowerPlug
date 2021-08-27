import { HttpResponse, HttpStatusCode } from "~/application/protocols";
import { error, success } from "../utils";
import { Response } from "~/domain/common/types"
import { UnexpectedError } from "../exceptions";

export class RequestResponse<R> {
    private constructor (private readonly _response: R | undefined) {
        Object.freeze(this)
    } 

    public static handle<R>(httpResponse: HttpResponse<R>): Response<RequestResponse<R>> {
        const { statusCode } = httpResponse

        if (this.isSuccess(statusCode)) {
            return success(new RequestResponse(httpResponse.body))
        }

        return error(new UnexpectedError())
    }
    
    private static isSuccess(statusCode: HttpStatusCode): boolean {
        return statusCode >= 200 && statusCode <= 299
    }
}