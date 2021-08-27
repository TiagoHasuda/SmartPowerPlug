import { TurnOff } from "~/application/useCases"
import { AxiosHttpClient } from "~/infra"
import { Response } from "~/domain/common/types"
import { MakeUrl, RequestResponse } from "~/domain/common/helpers"
import { error, success } from "~/domain/common/utils"

export class RemoteTurnOff implements TurnOff {
    private readonly httpClient = new AxiosHttpClient

    async load(): Promise<Response<boolean>> {
        const url = await MakeUrl("turnOff")
        const httpResponse = await this.httpClient.request({
            method: "post",
            url: url
        })

        const responseOrError = RequestResponse.handle<boolean>(httpResponse)
        if (responseOrError.isError()) {
            return error(responseOrError.value)
        }

        return success(true)
    }
}
