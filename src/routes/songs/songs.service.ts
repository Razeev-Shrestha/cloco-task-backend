import type { AppContext } from '@/app.type'
import type { Prettify } from '@/types/prettify'
import { internalServerErrorResponse } from '@/utils/error-response'
import { response } from '@/utils/response'
import { createSong, deleteSong, updateSong } from './songs.controller'
import type { SongsSchema } from './songs.schema'
import { client } from '@/db/client'

type GetSongHandler = AppContext<
	{ params: { id: number }; query: { title: string } },
	'/api/v1/artists/:id/song'
>

export const getSongService = async ({ params, log, set, query: { title } }: GetSongHandler) => {
	try {
		const song = await client.query(
			`
			SELECT m.title,m.genre,m.album_name,m.artist_id FROM musics m JOIN artists a ON m.artist_id = a.id JOIN users u ON a.user_id = u.id WHERE u.id = $1 AND m.title = $2
			`,
			[params.id, title]
		)

		if (song.rowCount === 0) {
			set.status = 'Bad Request'
			return response({ message: 'Song not found', status: 400, success: false })
		}

		return response({
			payload: song.rows[0],
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
	{ params: { id: number }; query: { page?: number; limit?: number } },
	'/api/v1/artists/:id/songs'
>

export const getSongsService = async ({
	params,
	log,
	set,
	query: { limit = 10, page = 1 },
}: GetSongsHandler) => {
	try {
		const offset = (Number(page) - 1) * limit
		let totalRows: number
		let data: any

		const countQuery = 'SELECT COUNT(*) AS total FROM musics'
		const totalResult = await client.query<{ total: string }>(countQuery)
		//@ts-ignore
		const totalCount = Number.parseInt(totalResult?.rows[0].total, 10)

		const query =
			Number(limit) === -1
				? 'SELECT m.title,m.genre,m.album_name,m.artist_id FROM musics m JOIN artists a ON m.artist_id = a.id JOIN users u ON a.user_id = u.id WHERE u.id = $1'
				: 'SELECT m.title,m.genre,m.album_name,m.artist_id FROM musics m JOIN artists a ON m.artist_id = a.id JOIN users u ON a.user_id = u.id WHERE u.id = $1 LIMIT $2 OFFSET $3'

		if (Number(limit) === -1) {
			const result = await client.query(query, [params.id])

			totalRows = result.rowCount as number
			data = result.rows
		} else {
			const result = await client.query(query, [params.id, limit, offset])

			totalRows = result.rowCount as number
			data = result.rows
		}
		const hasNext = Number(limit) === -1 ? false : offset + totalRows < totalCount

		set.status = 'OK'
		return response({
			payload: data,
			message: 'Songs fetched successfully',
			status: 200,
			success: true,
			pagination: {
				totalRows: totalCount,
				count: totalRows,
				hasNext,
				limit: Number(limit),
				page: Number(page),
			},
		})
	} catch (err) {
		log.error(err)
		set.status = 'Internal Server Error'
		return internalServerErrorResponse
	}
}

type CreateSongHandler = AppContext<
	{ body: Prettify<Omit<SongsSchema, 'artist_id'>>; params: { id: number } },
	'/api/v1/artists/:id/songs'
>

export const createSongService = async ({ body, params, log, set }: CreateSongHandler) => {
	try {
		const artist = await client.query(
			'SELECT a.id FROM  artists a LEFT JOIN  users u ON a.user_id = a.id WHERE a.user_id = $1',
			[params.id]
		)

		const newSong = await createSong({ ...body, artist_id: artist.rows[0].id })

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
		params: { id: number }
		query: { title: string }
	},
	'/api/v1/artists/:artist_id/songs'
>

export const updateSongService = async ({ body, params, log, set, query }: UpdateSongHandler) => {
	try {
		const artist = await client.query(
			`
			SELECT a.id FROM artists a LEFT JOIN users u ON a.user_id = u.id WHERE u.id = $1
			`,
			[params.id]
		)

		const updatedSong = await updateSong({
			...body,
			artist_id: artist.rows[0].id,
			title: query.title,
			updated_at: new Date().toISOString(),
		})

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
	{ params: { id: number }; query: { title: string } },
	'/api/v1/artists/:artist_id/songs?title='
>

export const deleteSongService = async ({ params, log, set, query }: DeleteSongHandler) => {
	try {
		const artist = await client.query(
			`
			SELECT a.id FROM artists a LEFT JOIN users u ON a.user_id = u.id WHERE u.id = $1
			`,
			[params.id]
		)

		await deleteSong({ artist_id: artist.rows[0].id, title: query.title })

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
