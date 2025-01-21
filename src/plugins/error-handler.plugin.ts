import { internalServerErrorResponse, notFoundErrorResponse } from '@/utils/error-response'
import { response } from '@/utils/response'
import Elysia from 'elysia'
import { logger } from './logger.plugin'

export const errorHandlerPlugin = new Elysia().onError({ as: 'global' }, ({ code, set, error }) => {
	switch (code) {
		case 'NOT_FOUND':
			set.status = 'Not Found'
			logger.error(error)

			return notFoundErrorResponse
		case 'INTERNAL_SERVER_ERROR':
			set.status = 'Internal Server Error'
			logger.error(error)

			return internalServerErrorResponse
		case 'VALIDATION': {
			set.status = 'Unprocessable Content'
			logger.error(error)

			const errors = error.all.map(err => {
				if (!err.summary) {
					return {
						message: 'Unprocessable entity.',
					}
				}

				return {
					field: err.path.slice(1),
					message: err.message,
				}
			})

			return response({
				status: 422,
				success: false,
				errors: errors,
				message: 'Unprocessable entity.',
			})
		}
		default:
			logger.info('Error code not found')
			set.status = 'Internal Server Error'
			logger.error(error)

			return internalServerErrorResponse
	}
})
