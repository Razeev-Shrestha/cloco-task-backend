import { client } from '@/db/client'
import type { QueryResult } from 'pg'

export const selectFromTable = async <
	T extends Record<string, unknown>,
	S extends Partial<Record<keyof T, unknown>> = Record<keyof T, unknown>,
>(
	table: string,
	condition: Partial<Record<keyof T, unknown>>,
	select?: Partial<S>
): Promise<QueryResult<S extends undefined ? T[] : Pick<T, keyof T>[]>> => {
	const keys = Object.keys(condition)
	const values = Object.values(condition)

	const whereClauses = keys.map((key, index) => `${key}=$${index + 1}`).join(' AND ')

	const query = `SELECT ${select ? Object.keys(select).join(',') : '*'} FROM ${table} WHERE ${whereClauses}`

	return client.query(query, values) as unknown as QueryResult<
		S extends undefined ? T[] : Pick<T, keyof T>[]
	>
}

export const withPaginationSelectFromTable = async (table: string) => {
	const query = `SELECT * FROM ${table} LIMIT 10 OFFSET 0`
	return client.query(query)
}
