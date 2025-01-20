import type { AppContext } from '@/app.type'
import { internalServerErrorResponse } from '@/utils/error-response'
import { omit } from '@/utils/omit'
import { pick } from '@/utils/pick'
import { response } from '@/utils/response'
import { createUser, getUser, updateUser } from '../users/users.controller'
import type { UserSchema } from '../users/users.schema'
import {
	createArtist,
	deleteArtist,
	getAllArtists,
	getArtist,
	updateArtist,
} from './artists.controller'
import type { ArtistsSchema } from './artists.schema'

type GetArtistHandler = AppContext<{ params: { id: number } }, '/api/v1/artists/:id'>

export const getArtistService = async ({ params, log, set }: GetArtistHandler) => {
	try {
		const artist = await getArtist({ id: params.id })

		if (artist.rowCount === 0) {
			set.status = 'Bad Request'
			return response({ message: 'Artist not found', status: 400, success: false })
		}
		return response({
			payload: artist.rows,
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

type GetArtistsHandler = AppContext<
	{ params: { limit?: number; page?: number } },
	'/api/v1/artists'
>

export const getArtistsService = async ({ log, set, params }: GetArtistsHandler) => {
	try {
		const artists = await getAllArtists(params)

		return response({
			pagination: {
				page: artists.page,
				hasNext: artists.hasNext,
				count: artists.count,
			},
			payload: artists.data,
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

		const newUser = await createUser(userBody)

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

		const updatedUser = await updateUser(params.id, userBody)

		if (updatedUser && updatedUser.rows.length === 0) {
			set.status === 'Internal Server Error'
			return internalServerErrorResponse
		}

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
		const artist = await getArtist({ id: params.id })

		if (artist.rowCount === 0) {
			set.status = 'Bad Request'
			return response({ message: 'Artist not found', status: 400, success: false })
		}

		await deleteArtist({ id: params.id })

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
