import swagger from '@elysiajs/swagger'

export const swaggerPlugin = swagger({
	path: '/docs',
	exclude: ['/docs', '/docs/json'],
	version: '0.0.1',
	provider: 'scalar',
	autoDarkMode: true,
	documentation: {
		info: {
			title: 'Api documentation for Cloco task',
			version: '0.0.1',
			license: {
				name: 'MIT',
			},
			description: 'This is a api documentation for Cloco task',
			contact: {
				name: 'Rajeev Shrestha',
			},
		},
		tags: [
			{
				name: 'General',
				description: 'General api endpoints',
			},
			{
				name: 'Authentication',
				description: 'Authentication api endpoints',
			},
			{
				name: 'User',
				description: 'User api endpoints',
			},
			{
				name: 'Artist',
				description: 'Artist api endpoints',
			},
			{
				name: 'Music',
				description: 'Music api endpoints',
			},
		],
		openapi: '3.0.3',

		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
					description: 'JWT token for authentication',
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
	},
	swaggerOptions: {
		syntaxHighlight: {
			activate: true,
			theme: 'agate',
		},
		withCredentials: true,
		tryItOutEnabled: true,
		showMutatedRequest: true,
		persistAuthorization: true,
	},
})
