import { response } from './response'

export const notFoundErrorResponse = response({
	status: 404,
	success: false,
	message: 'Resource not found.',
})

export const internalServerErrorResponse = response({
	status: 500,
	success: false,
	message: 'Internal server error.',
})
