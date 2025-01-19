import { response } from '@/utils/response'
import Elysia from 'elysia'

export const routes = new Elysia({ prefix: '/api/v1' }).get(
	'/health-check',
	({ set }) => {
		set.status === 'OK'

		return response({ payload: null, success: true, status: 200, message: 'Health Check OK!!' })
	},
	{
		tags: ['General'],
		detail: {
			tags: ['General'],
			summary: 'Health Check',
		},
	}
)
