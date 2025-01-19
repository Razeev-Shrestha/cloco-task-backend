import { logger } from '@/plugins/logger.plugin'
import { client } from './client'
;(async () => {
	try {
		client.connect(err => {
			if (err) {
				logger.error(err)
			} else {
				logger.info('Connected to database')
			}
		})
	} catch (error) {
		console.error(error)
	}
})()
