export * from "./response"
import { Response } from "./response"

export interface AddFunction<T, R = unknown> {
    add: (params: R) => Promise<Response<T>>
}

export interface DeleteFunction<T> {
    delete: (id: string) => Promise<Response<T>>
}

export interface LoadFunction<T, R = unknown> {
    load: (params?: R) => Promise<Response<T>>
}

export interface UpdateFunction<T, R = unknown> {
    update: (params: R) => Promise<Response<T>>
}
