import { createPinoLogger } from '@bogeychan/elysia-logger'

export const logger = createPinoLogger({
	safe: true,
	name: 'cloco-music-app',
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
		},
	},
})
