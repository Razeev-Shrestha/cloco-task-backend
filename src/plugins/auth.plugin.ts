import type { Decorator, Derive, Resolve, Store } from '@/app.type'
import { internalServerErrorResponse } from '@/utils/error-response'
import { response } from '@/utils/response'
import Elysia from 'elysia'

const validRoles = ['super_admin', 'artist_manager', 'artist'] as const

type RoleType = typeof validRoles

export const authPlugin = new Elysia<
	'/api/v1',
	{
		derive: Derive
		decorator: Decorator
		store: Store
		resolve: Resolve
	}
>({ name: 'authPlugin' })
	.derive({ as: 'scoped' }, async ({ bearer, jwt, set, log }) => {
		try {
			if (!bearer) {
				set.status = 401
				return response({ success: false, message: 'Unauthenticated', status: 401 })
			}

			const profile = await jwt.verify(bearer)

			if (!profile) {
				set.status = 401
				return response({ success: false, message: 'Unauthenticated', status: 401 })
			}

			return {
				user: {
					email: profile.email as string,
					role_type: profile.role_type as string,
				},
			}
		} catch (err) {
			set.status = 'Internal Server Error'
			log.error(err)
			return internalServerErrorResponse
		}
	})
	.onBeforeHandle({ as: 'scoped' }, ({ set, user, log }) => {
		try {
			if (!user) {
				set.status = 401
				return response({ success: false, message: 'Unauthenticated', status: 401 })
			}
			return
		} catch (err) {
			set.status = 'Internal Server Error'
			log.error(err)
			return internalServerErrorResponse
		}
	})
	.macro(({ onBeforeHandle }) => ({
		authorizedRoles(roles: RoleType[number][]) {
			onBeforeHandle(({ user, set }) => {
				const role = user.role_type as RoleType[number]

				if (!roles.includes(role)) {
					set.status = 403
					return response({
						success: false,
						message: 'You are forbidden to access this resource.',
						status: 403,
					})
				}
				return
			})
		},
	}))
