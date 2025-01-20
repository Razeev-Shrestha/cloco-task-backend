import type { AppContext } from '@/app.type'
import type { Prettify } from '@/types/prettify'
import { internalServerErrorResponse } from '@/utils/error-response'
import { response } from '@/utils/response'
import { createSong, deleteSong, getAllSongs, getSong, updateSong } from './songs.controller'
import type { SongsSchema } from './songs.schema'

type GetSongHandler = AppContext<
	{ params: { artist_id: number; title: string } },
	'/api/v1/artists/:artist_id/songs/title'
>

export const getSongService = async ({ params, log, set }: GetSongHandler) => {
	try {
		const song = await getSong({ artist_id: params.artist_id, title: params.title })

		if (song.rowCount === 0) {
			set.status === 'Bad Request'
			return response({ message: 'Song not found', status: 400, success: false })
		}
		return response({
			payload: song.rows,
			status: 200,
			success: true,
			message: 'Song fetched successfully',
		})
	} catch (err) {
		log.error(err)
		set.status = 'Internal Server Error'
		return internalServerErrorResponse
	}
}

type GetSongsHandler = AppContext<
	{ params: { artist_id: number }; query: { page?: number; limit?: number } },
	'/api/v1/artists/:artist_id/songs'
>

export const getSongsService = async ({ params, log, set, query }: GetSongsHandler) => {
	try {
		const songs = await getAllSongs({
			page: query.page,
			limit: query.limit,
			condition: { artist_id: params.artist_id },
		})

		if (songs.data.length === 0) {
			set.status = 'Bad Request'
			return response({ message: 'Songs not found', status: 400, success: false })
		}
		return response({
			pagination: {
				page: songs.page,
				count: songs.count,
				hasNext: songs.hasNext,
			},
			payload: songs.data,
			status: 200,
			success: true,
			message: 'Songs fetched successfully',
		})
	} catch (err) {
		log.error(err)
		set.status = 'Internal Server Error'
		return internalServerErrorResponse
	}
}

type CreateSongHandler = AppContext<
	{ body: Prettify<Omit<SongsSchema, 'artist_id'>>; params: { artist_id: number } },
	'/api/v1/artists/:artist_id/songs'
>

export const createSongService = async ({ body, params, log, set }: CreateSongHandler) => {
	try {
		const song = await getSong({ artist_id: params.artist_id, title: body.title })

		if (song.rowCount !== 0) {
			set.status = 'Bad Request'
			return response({ message: 'Song already exists', status: 400, success: false })
		}

		const newSong = await createSong({ ...body, artist_id: params.artist_id })

		return response({
			payload: newSong.rows,
			status: 201,
			success: true,
			message: 'Song created successfully',
		})
	} catch (err) {
		log.error(err)
		set.status = 'Internal Server Error'
		return internalServerErrorResponse
	}
}

type UpdateSongHandler = AppContext<
	{
		body: Prettify<Partial<Omit<SongsSchema, 'artist_id'>>>
		params: { artist_id: number }
		query: { title: string }
	},
	'/api/v1/artists/:artist_id/songs'
>

export const updateSongService = async ({ body, params, log, set, query }: UpdateSongHandler) => {
	try {
		const song = await getSong({ artist_id: params.artist_id, title: query.title })

		if (song.rowCount === 0) {
			set.status = 'Bad Request'
			return response({ message: 'Song not found', status: 400, success: false })
		}

		const updatedSong = await updateSong({ ...body, artist_id: params.artist_id })

		return response({
			payload: updatedSong.rows,
			status: 200,
			success: true,
			message: 'Song updated successfully',
		})
	} catch (err) {
		log.error(err)
		set.status = 'Internal Server Error'
		return internalServerErrorResponse
	}
}

type DeleteSongHandler = AppContext<
	{ params: { artist_id: number }; query: { title: string } },
	'/api/v1/artists/:artist_id/songs?title='
>

export const deleteSongService = async ({ params, log, set, query }: DeleteSongHandler) => {
	try {
		const song = await getSong({ artist_id: params.artist_id, title: query.title })

		if (song.rowCount === 0) {
			set.status = 'Bad Request'
			return response({ message: 'Song not found', status: 400, success: false })
		}

		await deleteSong({ artist_id: params.artist_id, title: query.title })

		return response({
			status: 204,
			success: true,
			message: 'Song deleted successfully',
			payload: null,
		})
	} catch (err) {
		log.error(err)
		set.status = 'Internal Server Error'
		return internalServerErrorResponse
	}
}
