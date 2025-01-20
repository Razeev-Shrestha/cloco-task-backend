import { Client } from 'pg'

export const client = new Client({
	application_name: 'cloco_task',
	connectionString: process.env.DATABASE_CONNECTION_STRING,
})

export type DbQuery = typeof client.query

export const query = client.query
