import { deleteFromTable } from '@/utils/delete-from-table'
import { insertIntoTable } from '@/utils/insert-into-table'
import { selectFromTable, withPaginationSelectFromTable } from '@/utils/select-from-table'
import { updateIntoTable } from '@/utils/update-into-table'
import type { SongsSchema } from './songs.schema'

export const getAllSongs = async ({
	page,
	limit,
	condition,
}: {
	page: number | undefined
	limit: number | undefined
	condition?: Record<string, unknown>
}) => {
	return withPaginationSelectFromTable('musics', limit, page, condition)
}

export const getSong = async (input: Partial<SongsSchema>) => {
	return selectFromTable<SongsSchema>('musics', input)
}

export const createSong = async (input: SongsSchema) => {
	return insertIntoTable('musics', input)
}

export const updateSong = async (input: Partial<SongsSchema>) => {
	return updateIntoTable('musics', input, { title: input.title })
}

export const deleteSong = async (input: Partial<SongsSchema>) => {
	return deleteFromTable('musics', input)
}
