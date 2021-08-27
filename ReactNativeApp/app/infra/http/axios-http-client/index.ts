import axios, { AxiosResponse } from "axios"

import { HttpClient, HttpRequest, HttpResponse } from "~/application/protocols"

export class AxiosHttpClient implements HttpClient {
    async request({ method, url, body, headers }: HttpRequest): Promise<HttpResponse> {
        let axiosResponse: AxiosResponse

        const extraHeaders = {
            ...headers,
        }

        try {
            axiosResponse = await axios.request({
                url,
                data: body,
                headers: extraHeaders,
                method,
                timeout: 10000,
            })
        } catch (error) {
            axiosResponse = error.response
        }

        return {
            statusCode: axiosResponse?.status,
            body: axiosResponse?.data,
        }
    }
}
