import jwt from '@elysiajs/jwt'

export const jwtPlugin = jwt({
	name: 'jwt',
	secret: process.env.JWT_SECRET_KEY,
	alg: 'HS256',
	exp: process.env.JWT_EXPIRATION_TIME,
})

export type JwtType = (typeof jwtPlugin)['decorator']['jwt']
