import type { AppContext } from '@/app.type'
import { internalServerErrorResponse } from '@/utils/error-response'
import { omit } from '@/utils/omit'
import { hashPassword, verifyPassword } from '@/utils/password'
import { response } from '@/utils/response'
import { createUser, getUser } from '../users/users.controller'
import type { UserSchema } from '../users/users.schema'
import type { AuthLoginType } from './auth.schema'

type AuthRegisterHandler = AppContext<{ body: UserSchema }, '/api/v1/auth/register'>

export const authRegisterService = async ({ body, set, log }: AuthRegisterHandler) => {
	try {
		const user = await getUser({ email: body.email })

		if (user.rows.length > 0) {
			set.status = 'Bad Request'
			return response({ message: 'User already exists', status: 400, success: false })
		}

		const hashedPassword = await hashPassword(body.password)

		await createUser({ ...body, role_type: 'super_admin', password: hashedPassword as string })

		set.status = 'Created'
		return response({
			message: 'User created successfully',
			status: 201,
			success: true,
			payload: null,
		})
	} catch (err) {
		log.error(err)
		set.status = 'Internal Server Error'
		return internalServerErrorResponse
	}
}

type AuthLoginHandler = AppContext<{ body: AuthLoginType }, '/api/v1/auth/login'>

export const authLoginService = async ({ body, log, set, jwt }: AuthLoginHandler) => {
	try {
		const user = await getUser({ email: body.email })

		if (user && user.rows.length === 0) {
			set.status = 'Bad Request'
			return response({ message: 'User not found', status: 404, success: false })
		}

		const isPasswordMatched = await verifyPassword(
			body.password,
			user.rows[0]?.password as string
		)

		if (!isPasswordMatched) {
			set.status = 'Unauthorized'
			return response({ message: 'Invalid credentials', status: 401, success: false })
		}

		const accessToken = await jwt.sign({
			email: user.rows[0]?.email as string,
			id: user.rows[0]?.id as number,
			role_type: user.rows[0]?.role_type as string,
			iat: Math.floor(Date.now() / 1000),
			exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
		})

		set.status = 'OK'
		return response({
			message: 'Login successful',
			status: 200,
			success: true,
			payload: { accessToken },
		})
	} catch (err) {
		log.error(err)
		set.status = 'Internal Server Error'
		return internalServerErrorResponse
	}
}

type AuthMeHandler = AppContext<{ body: undefined }, '/api/v1/auth/me'>

export const authMeService = async ({ user, log, set }: AuthMeHandler) => {
	try {
		const me = await getUser({ email: user.email })

		if (me.rows.length === 0 || !me.rows[0]) {
			set.status = 'Not Found'
			return response({ message: 'User not found', status: 404, success: false })
		}

		set.status = 'OK'
		return response({
			message: 'User fetched successfully',
			status: 200,
			success: true,
			payload: omit(me.rows[0], ['password', 'created_at', 'updated_at']),
		})
	} catch (err) {
		set.status = 'Internal Server Error'
		log.error(err)
		return internalServerErrorResponse
	}
}
