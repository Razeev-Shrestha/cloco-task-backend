import { client } from '@/db/client'

export const insertIntoTable = async <T extends Record<string, unknown>>(
	table: string,
	input: T
) => {
	const keys = Object.keys(input).filter(key => input[key] !== undefined)

	const values = keys.map(key => input[key])

	const columns = keys.join(',')

	const placeholders = keys.map((_, index) => `$${index + 1}`).join(',')

	const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`

	console.log(query, values)

	return client.query<T>(query, values)
}
