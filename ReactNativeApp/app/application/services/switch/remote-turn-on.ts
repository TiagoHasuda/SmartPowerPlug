import { TurnOn } from "~/application/useCases";
import { AxiosHttpClient } from "~/infra";
import { Response } from "~/domain/common/types"
import { MakeUrl, RequestResponse } from "~/domain/common/helpers"
import { error, success } from "~/domain/common/utils";

export class RemoteTurnOn implements TurnOn {
    private readonly httpClient = new AxiosHttpClient

    async load(): Promise<Response<boolean>> {
        const url = await MakeUrl("turnOn")
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
