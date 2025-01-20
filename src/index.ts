import { logger } from '@/plugins/logger.plugin'
import { Elysia } from 'elysia'
import { swaggerPlugin } from './plugins/swagger.plugin'
import { routes } from './routes/routes'
import '../env'
import serverTiming from '@elysiajs/server-timing'
import { client, query } from './db/client'
import { bearerPlugin } from './plugins/bearer.plugin'
import { corsPlugin } from './plugins/cors.plugin'
import { errorHandlerPlugin } from './plugins/error-handler.plugin'
import { jwtPlugin } from './plugins/jwt.plugin'

new Elysia()
	.onStart(() => {
		client.connect(err => {
			if (err) {
				logger.error('Error connecting to the database', err)
				client.end()
				process.exit(1)
			}
		})
	})
	.use(corsPlugin)
	.use(jwtPlugin)
	.use(bearerPlugin)
	.use(swaggerPlugin)
	.use(serverTiming())
	.use(logger.into())
	.use(errorHandlerPlugin)
	.decorate('query', query)
	.use(routes)
	.listen(process.env.PORT, ({ url }) => {
		logger.info(
			`Server listening on ${url}${process.env.APP_ENV === 'development' ? ' in development mode' : ''}`
		)
	})
