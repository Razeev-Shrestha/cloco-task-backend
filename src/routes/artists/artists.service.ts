import type { AppContext } from '@/app.type'
import { internalServerErrorResponse } from '@/utils/error-response'
import { omit } from '@/utils/omit'
import { pick } from '@/utils/pick'
import { response } from '@/utils/response'
import { createUser, getUser, updateUser } from '../users/users.controller'
import type { UserSchema } from '../users/users.schema'
import { createArtist, deleteArtist, getArtist, updateArtist } from './artists.controller'
import type { ArtistsSchema } from './artists.schema'
import { client } from '@/db/client'
import { hashPassword } from '@/utils/password'

type GetArtistHandler = AppContext<{ params: { id: number } }, '/api/v1/artists/:id'>

export const getArtistService = async ({ params, log, set }: GetArtistHandler) => {
	try {
		const artist = await client.query(
			`
			SELECT a.first_release_year,a.no_of_albums_released,u.id,u.email,u.first_name,u.last_name,u.gender,u.role_type FROM artists a LEFT JOIN users u ON a.user_id = u.id WHERE a.user_id = $1
			`,
			[params.id]
		)

		if (artist.rowCount === 0) {
			set.status = 'Bad Request'
			return response({ message: 'Artist not found', status: 400, success: false })
		}
		return response({
			payload: artist.rows[0],
			status: 200,
			success: true,
			message: 'Artist fetched successfully',
		})
	} catch (err) {
		log.error(err)
		set.status = 'Internal Server Error'
		return internalServerErrorResponse
	}
}

type GetArtistsHandler = AppContext<{ query: { limit?: number; page?: number } }, '/api/v1/artists'>

export const getArtistsService = async ({
	log,
	set,
	query: { limit = 10, page = 1 },
}: GetArtistsHandler) => {
	try {
		const offset = (Number(page) - 1) * limit
		let totalRows: number
		let data: any

		const countQuery = 'SELECT COUNT(*) AS total FROM artists'
		const totalResult = await client.query<{ total: string }>(countQuery)
		//@ts-ignore
		const totalCount = Number.parseInt(totalResult?.rows[0].total, 10)

		const query =
			Number(limit) === -1
				? 'SELECT a.first_release_year,a.no_of_albums_released,u.id,u.email,u.first_name,u.last_name,u.gender,u.role_type FROM artists a LEFT JOIN users u ON a.user_id = u.id ORDER BY a.id DESC'
				: 'SELECT a.first_release_year,a.no_of_albums_released,u.id,u.email,u.first_name,u.last_name,u.gender,u.role_type FROM artists a LEFT JOIN users u ON a.user_id = u.id ORDER BY a.id DESC LIMIT $1 OFFSET $2'

		if (Number(limit) === -1) {
			const result = await client.query(query)

			totalRows = result.rowCount as number
			data = result.rows
		} else {
			const result = await client.query(query, [limit, offset])

			totalRows = result.rowCount as number
			data = result.rows
		}

		const hasNext = Number(limit) === -1 ? false : offset + totalRows < totalCount

		set.status = 'OK'

		return response({
			payload: data,
			pagination: {
				page: Number(page),
				hasNext,
				count: totalRows,
				limit: Number(limit),
				totalRows: totalCount,
			},
			status: 200,
			success: true,
			message: 'Artists fetched successfully',
		})
	} catch (err) {
		log.error(err)
		set.status = 'Internal Server Error'
		return internalServerErrorResponse
	}
}

type CreateArtistHandler = AppContext<{ body: ArtistsSchema & UserSchema }, '/api/v1/artists'>

export const createArtistService = async ({ body, log, set }: CreateArtistHandler) => {
	try {
		const user = await getUser({ email: body.email })

		if (user && user.rows.length > 0) {
			set.status = 'Bad Request'
			return response({ message: 'User already exists', status: 400, success: false })
		}

		const userBody = omit(body, ['first_release_year', 'no_of_albums_released', 'user_id'])

		const hashedPassword = await hashPassword(userBody.password)

		const newUser = await createUser({
			...userBody,
			password: hashedPassword as string,
		})

		if (newUser && newUser.rows.length === 0) {
			set.status === 'Internal Server Error'
			return internalServerErrorResponse
		}

		if (!newUser) {
			set.status = 'Bad Request'
			return response({ message: 'User not created', status: 400, success: false })
		}

		const artist = await createArtist({
			first_release_year: body.first_release_year,
			no_of_albums_released: body.no_of_albums_released,
			user_id: newUser.rows[0]?.id as number,
		})
		return response({
			payload: artist.rows,
			status: 201,
			success: true,
			message: 'Artist created successfully',
		})
	} catch (err) {
		log.error(err)
		set.status = 'Internal Server Error'
		return internalServerErrorResponse
	}
}

type UpdateArtistHandler = AppContext<
	{ body: Partial<ArtistsSchema & UserSchema>; params: { id: number } },
	'/api/v1/artists/:id'
>

export const updateArtistService = async ({ body, log, set, params }: UpdateArtistHandler) => {
	try {
		const userBody = omit(body, ['first_release_year', 'no_of_albums_released', 'user_id'])

		await updateUser(params.id, {
			...userBody,

			...(userBody.password && {
				password: (await hashPassword(userBody.password as string)) as string,
			}),
		})

		const artistBody = pick(body, ['first_release_year', 'no_of_albums_released'])

		const artist = await updateArtist(artistBody)

		return response({
			payload: artist.rows,
			status: 201,
			success: true,
			message: 'Artist updated successfully',
		})
	} catch (err) {
		log.error(err)
		set.status = 'Internal Server Error'
		return internalServerErrorResponse
	}
}

type DeleteArtistHandler = AppContext<{ params: { id: number } }, '/api/v1/artists/:id'>

export const deleteArtistService = async ({ params, log, set }: DeleteArtistHandler) => {
	try {
		const artist = await getArtist({ user_id: params.id })

		if (artist.rowCount === 0) {
			set.status = 'Bad Request'
			return response({ message: 'Artist not found', status: 400, success: false })
		}

		await deleteArtist({ user_id: params.id })

		return response({
			payload: null,
			status: 200,
			success: true,
			message: 'Artist deleted successfully',
		})
	} catch (err) {
		log.error(err)
		set.status = 'Internal Server Error'
		return internalServerErrorResponse
	}
}
