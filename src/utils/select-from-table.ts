import { client } from '@/db/client'
import type { QueryResult } from 'pg'

export const selectFromTable = async <
	T extends Record<string, unknown>,
	S extends Partial<Record<keyof T, unknown>> = Record<keyof T, unknown>,
>(
	table: string,
	condition: Partial<Record<keyof T, unknown>>,
	select?: Partial<S>
): Promise<QueryResult<S extends undefined ? T : Pick<T, keyof T>>> => {
	const keys = Object.keys(condition)
	const values = Object.values(condition)

	const whereClauses = keys.map((key, index) => `${key}=$${index + 1}`).join(' AND ')

	const query = `SELECT ${select ? Object.keys(select).join(',') : '*'} FROM ${table} WHERE ${whereClauses}`

	return client.query(query, values) as unknown as QueryResult<
		S extends undefined ? T : Pick<T, keyof T>
	>
}

export const withPaginationSelectFromTable = async <
	T extends Record<string, unknown>,
	S extends Partial<Record<keyof T, unknown>> = Record<keyof T, unknown>,
>(
	table: string,
	limit = 10,
	page = 1,
	select?: Partial<S>
): Promise<{
	data: T[]
	count: number
	total: number
	hasNext: boolean
	page: number
	limit: number
}> => {
	const offset = (Number(page) - 1) * limit
	let totalRows: number
	let data: T

	const countQuery = `SELECT COUNT(*) AS total FROM ${table}`
	const totalResult = await client.query<{ total: string }>(countQuery)
	//@ts-ignore
	const totalCount = Number.parseInt(totalResult?.rows[0].total, 10)

	const query =
		Number(limit) === -1
			? `SELECT ${select ? Object.keys(select).join(',') : '*'} FROM ${table} ORDER BY id DESC`
			: `SELECT ${select ? Object.keys(select).join(',') : '*'} FROM ${table} ORDER BY id DESC LIMIT $1 OFFSET $2`

	if (Number(limit) === -1) {
		const result = await client.query(query)
		if (!result.rowCount) {
			throw new Error('No data found')
		}
		totalRows = result.rowCount
		data = result.rows as unknown as T
	} else {
		const result = await client.query(query, [limit, offset])

		if (!result.rowCount) {
			throw new Error('No data found')
		}
		totalRows = result.rowCount
		data = result.rows as unknown as T
	}

	const hasNext = Number(limit) === -1 ? false : offset + totalRows < totalCount

	return {
		data: data as unknown as T[],
		total: totalCount,
		count: totalRows,
		hasNext,
		limit: Number(limit),
		page: Number(page),
	}
}
