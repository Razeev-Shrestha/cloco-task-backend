import type { AppContext } from '@/app.type'
import { internalServerErrorResponse } from '@/utils/error-response'
import { generatePassword } from '@/utils/generate-password'
import { hashPassword } from '@/utils/password'
import { response } from '@/utils/response'
import { createUser, deleteUser, getAllUsers, getUser, updateUser } from './users.controller'
import type { UserSchema } from './users.schema'

type GetUserByIdHandler = AppContext<{ params: { id: number } }, '/api/v1/users/:id'>

export const getUserService = async ({ log, set, params }: GetUserByIdHandler) => {
	try {
		const user = await getUser({ id: params.id })

		if (user.rows.length === 0) {
			set.status === 'Not Found'
			return response({ success: false, message: 'User not found.', status: 400, errors: null })
		}

		set.status === 'OK'
		return response({
			success: true,
			message: 'User fetched Successfully',
			status: 200,
			payload: user,
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

		if (user.rowCount === 0) {
			set.status = 'Conflict'
			return response({
				success: false,
				message: 'User already exists',
				status: 409,
				errors: null,
			})
		}

		const password = await generatePassword()

		const hashedPassword = await hashPassword(password)

		const newUser = await createUser({ ...body, password: hashedPassword as string })

		set.status = 'Created'
		return response({
			success: true,
			message: 'User created successfully',
			status: 201,
			payload: newUser,
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

		const updatedUser = await updateUser(params.id, body)

		set.status = 'OK'
		return response({
			success: true,
			message: 'User updated successfully',
			status: 200,
			payload: updatedUser,
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

type GetUsersHandler = AppContext<{ body: unknown }, '/api/v1/users'>

export const getUsersService = async ({ log, set }: GetUsersHandler) => {
	try {
		const users = await getAllUsers()

		set.status = 'OK'
		return response({
			success: true,
			message: 'Users fetched successfully',
			status: 200,
			payload: users,
		})
	} catch (err) {
		log.error(err)
		set.status = 'Internal Server Error'
		return internalServerErrorResponse
	}
}
