import type { AppContext } from '@/app.type'
import { internalServerErrorResponse } from '@/utils/error-response'
import { omit } from '@/utils/omit'
import { hashPassword } from '@/utils/password'
import { response } from '@/utils/response'
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from './users.controller'
import type { UserSchema } from './users.schema'

type GetUserByIdHandler = AppContext<{ params: { id: number } }, '/api/v1/users/:id'>

export const getUserService = async ({ log, set, params }: GetUserByIdHandler) => {
	try {
		const user = await getUser({ id: params.id })

		if (user.rows.length === 0 || !user.rows[0]) {
			set.status === 'Not Found'
			return response({ success: false, message: 'User not found.', status: 400, errors: null })
		}

		set.status === 'OK'
		return response({
			success: true,
			message: 'User fetched Successfully',
			status: 200,
			payload: omit(user.rows[0], ['password', 'created_at', 'updated_at']),
		})
	} catch (error) {
		log.error(error)
		set.status === 'Internal Server Error'

		return internalServerErrorResponse
	}
}

type CreateUserHandler = AppContext<{ body: UserSchema }, '/api/v1/users'>

export const createUserService = async ({ log, body, set }: CreateUserHandler) => {
	try {
		const user = await getUser({ email: body.email })

		if (user.rowCount !== 0) {
			set.status = 'Conflict'
			return response({
				success: false,
				message: 'User already exists',
				status: 409,
				errors: null,
			})
		}

		const hashedPassword = await hashPassword(body.password)

		const newUser = await createUser({ ...body, password: hashedPassword as string })

		if (newUser.rowCount === 0 || !newUser.rows[0]) {
			set.status = 'Internal Server Error'
			return internalServerErrorResponse
		}

		set.status = 'Created'
		return response({
			success: true,
			message: 'User created successfully',
			status: 201,
			payload: omit(newUser.rows[0], ['password', 'created_at', 'updated_at']),
		})
	} catch (err) {
		log.error(err)
		set.status = 'Internal Server Error'
		return internalServerErrorResponse
	}
}

type UpdateUserHandler = AppContext<
	{ body: Partial<UserSchema>; params: { id: number } },
	'/api/v1/users/:id'
>

export const updateUserService = async ({ body, params, set, log }: UpdateUserHandler) => {
	try {
		const user = await getUser({ id: params.id })

		if (user.rows.length === 0) {
			set.status = 'Not Found'
			return response({
				success: false,
				message: 'User not found',
				status: 404,
				errors: null,
			})
		}

		const password = body.password ? await hashPassword(body.password) : undefined

		const updatedUser = await updateUser(params.id, {
			...body,
			...(password ? { password } : {}),
			updated_at: new Date().toISOString(),
		})

		if (updatedUser.rowCount === 0 || !updatedUser.rows[0]) {
			set.status = 'Internal Server Error'
			return internalServerErrorResponse
		}

		set.status = 'OK'
		return response({
			success: true,
			message: 'User updated successfully',
			status: 200,
			payload: omit(updatedUser.rows[0], ['password', 'created_at', 'updated_at']),
		})
	} catch (err) {
		log.error(err)
		set.status = 'Internal Server Error'
		return internalServerErrorResponse
	}
}

type DeleteUserHandler = AppContext<{ params: { id: number } }, '/api/v1/users/:id'>

export const deleteUserService = async ({ params, set, log }: DeleteUserHandler) => {
	try {
		const user = await getUser({ id: params.id })

		if (user.rows.length === 0) {
			set.status = 'Not Found'
			return response({
				success: false,
				message: 'User not found',
				status: 404,
				errors: null,
			})
		}

		await deleteUser(params.id)

		set.status = 'OK'
		return response({
			success: true,
			message: 'User deleted successfully',
			status: 200,
			payload: null,
		})
	} catch (err) {
		log.error(err)
		set.status = 'Internal Server Error'
		return internalServerErrorResponse
	}
}

type GetUsersHandler = AppContext<
	{ body: unknown; query: { page?: number; limit?: number } },
	'/api/v1/users'
>

export const getUsersService = async ({ log, set, query }: GetUsersHandler) => {
	try {
		const users = await getAllUsers(query)

		set.status = 'OK'
		return response({
			success: true,
			message: 'Users fetched successfully',
			status: 200,
			payload: users.data.map(user => omit(user, ['password', 'created_at', 'updated_at'])),
			pagination: {
				count: users.count,
				hasNext: users.hasNext,
				totalRows: users.total,
				page: users.page,
				limit: users.limit,
			},
		})
	} catch (err) {
		log.error(err)
		set.status = 'Internal Server Error'
		return internalServerErrorResponse
	}
}
