import type { Prettify } from '@/types/prettify'

type SuccessResponse<T> = {
	success: true
	status: number
	message: string
	payload: T
}

type ErrorResponse<T> = {
	success: false
	status: number
	message: string
	errors?: T
}

type IResponse<T> = SuccessResponse<T> | ErrorResponse<T>

type ResponseReturnType<T> = Prettify<
	T extends { success: true; payload: infer P } ? SuccessResponse<P> : ErrorResponse<T>
>

export const response = <T extends IResponse<unknown>>(res: T): ResponseReturnType<T> =>
	res as unknown as ResponseReturnType<T>
