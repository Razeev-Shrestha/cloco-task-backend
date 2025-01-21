import { client } from '@/db/client'

export const deleteFromTable = async (table: string, condition: Record<string, unknown>) => {
	const whereClauses = Object.keys(condition)
		.map((key, index) => `${key}=$${index + 1}`)
		.join(' AND ')

	const query = `DELETE FROM ${table} WHERE ${whereClauses} RETURNING *`

	return client.query(query, Object.values(condition))
}
