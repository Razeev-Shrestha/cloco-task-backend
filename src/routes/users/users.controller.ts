import { deleteFromTable } from '@/utils/delete-from-table'
import { insertIntoTable } from '@/utils/insert-into-table'
import { selectFromTable, withPaginationSelectFromTable } from '@/utils/select-from-table'
import { updateIntoTable } from '@/utils/update-into-table'
import type { UserSchema } from './users.schema'

export const getAllUsers = async ({ page = 1, limit = 10 }: { page?: number; limit?: number }) => {
	return withPaginationSelectFromTable<UserSchema>('users', limit, page)
}

export const getUser = async (input: Partial<UserSchema>) => {
	return selectFromTable<UserSchema>('users', input)
}

export const createUser = async (input: UserSchema) => {
	return insertIntoTable('users', input)
}

export const updateUser = async (id: number, input: Partial<UserSchema>) => {
	return updateIntoTable('users', input, { id })
}

export const deleteUser = async (id: number) => {
	return deleteFromTable('users', { id })
}
