import { client } from '@/db/client'

export const updateIntoTable = async <
	T extends Record<string, unknown>,
	U extends Partial<Record<keyof T, unknown>>,
>(
	table: string,
	input: Partial<T>,
	condition: U
) => {
	const keys = Object.keys(input)
	const values = Object.values(input)

	const setClauses = keys.map((key, index) => `${key}=$${index + 1}`).join(',')

	const whereClauses = Object.keys(condition)
		.map((key, index) => `${key}=$${keys.length + index + 1}`)
		.join(' AND ')

	const query = `UPDATE ${table} SET ${setClauses} WHERE ${whereClauses} RETURNING *`

	return client.query<T>(query, [...values, ...Object.values(condition)])
}
