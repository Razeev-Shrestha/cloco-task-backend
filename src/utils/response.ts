import type { Prettify } from '@/types/prettify'

type ErrorResponse<T> = {
	success: false
	status: number
	message: string
	errors?: T
}

type PaginationType = {
	count: number
	hasNext: boolean
	page: number
	totalRows: number
	limit: number
}

type IResponse<T> = SuccessResponse<T> | ErrorResponse<T>

type ResponseReturnType<T> = Prettify<
	T extends { success: true; payload: infer P } ? SuccessResponse<P> : ErrorResponse<T>
>

type SuccessResponse<T> = {
	success: true
	status: number
	message: string
	payload: T
	pagination?: PaginationType
}

export const response = <T extends IResponse<unknown>>(
	res: T,
	paginationData?: PaginationType
): ResponseReturnType<T> => {
	if (!paginationData) return res as unknown as ResponseReturnType<T>

	return {
		...res,
		pagination: paginationData,
	} as unknown as ResponseReturnType<T>
}
