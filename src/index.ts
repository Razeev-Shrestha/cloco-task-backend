import { logger } from '@/plugins/logger.plugin'
import { Elysia } from 'elysia'

new Elysia()
	.use(logger.into())
	.get('/', () => 'Hello Elysia')
	.listen(8080, ({ development, url }) => {
		logger.info(`Server listening on ${url}${development ? ' in development mode' : ''}`)
	})
