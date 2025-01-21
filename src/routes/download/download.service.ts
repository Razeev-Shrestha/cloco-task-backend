import type { AppContext } from '@/app.type'
import { client } from '@/db/client'
import { internalServerErrorResponse } from '@/utils/error-response'
import Papa from 'papaparse'

type DownloadCsvHandler = AppContext<
	{ query: { page?: number; limit?: number } },
	'/api/v1/download'
>

export const downloadCsvService = async ({
	set,
	log,
	query: { page = 1, limit = 10 },
}: DownloadCsvHandler) => {
	try {
		const offset = (Number(page) - 1) * limit
		let totalRows: number
		let data: any

		const countQuery = 'SELECT COUNT(*) AS total FROM artists'
		const totalResult = await client.query<{ total: string }>(countQuery)
		//@ts-ignore
		const totalCount = Number.parseInt(totalResult?.rows[0].total, 10)

		const query =
			Number(limit) === -1
				? 'SELECT a.first_release_year,a.no_of_albums_released,u.id,u.email,u.first_name,u.last_name,u.gender,u.role_type FROM artists a LEFT JOIN users u ON a.user_id = u.id ORDER BY a.id DESC'
				: 'SELECT a.first_release_year,a.no_of_albums_released,u.id,u.email,u.first_name,u.last_name,u.gender,u.role_type FROM artists a LEFT JOIN users u ON a.user_id = u.id ORDER BY a.id DESC LIMIT $1 OFFSET $2'

		if (Number(limit) === -1) {
			const result = await client.query(query)

			totalRows = result.rowCount as number
			data = result.rows
		} else {
			const result = await client.query(query, [limit, offset])

			totalRows = result.rowCount as number
			data = result.rows
		}

		const csv = Papa.unparse(data, { delimiter: ';' })

		set.headers = {
			'Content-Type': 'text/csv',
			'Content-Disposition': `attachment; filename=artists-${page}-${limit}.csv`,
			// 'Access-Control-Allow-Origin': '*',
			// 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			// 'Access-Control-Allow-Headers': 'Authorization, Content-Type',
		}

		return csv
	} catch (err) {
		log.error(err)
		set.status = 'Internal Server Error'
		return internalServerErrorResponse
	}
}
