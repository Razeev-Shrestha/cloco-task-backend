import { deleteFromTable } from '@/utils/delete-from-table'
import { insertIntoTable } from '@/utils/insert-into-table'
import { selectFromTable, withPaginationSelectFromTable } from '@/utils/select-from-table'
import { updateIntoTable } from '@/utils/update-into-table'
import type { ArtistsSchema } from './artists.schema'

export const getAllArtists = async ({
	page = 1,
	limit = 10,
}: { page?: number; limit?: number }) => {
	return withPaginationSelectFromTable('artists', limit, page)
}

export const getArtist = async (input: Partial<ArtistsSchema>) => {
	return selectFromTable<ArtistsSchema>('artists', input)
}

export const createArtist = async (input: ArtistsSchema) => {
	return insertIntoTable('artists', input)
}

export const updateArtist = async (input: Partial<ArtistsSchema>) => {
	return updateIntoTable('artists', input, { user_id: input.user_id })
}

export const deleteArtist = async (input: Partial<ArtistsSchema>) => {
	return deleteFromTable('artists', input)
}
