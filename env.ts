import { type Static, t } from 'elysia'

const envSchema = t.Object({
	APP_ENV: t.Union([t.Literal('development'), t.Literal('production')], {
		default: 'development',
	}),
	PORT: t.Number({ default: 8109 }),
	JWT_SECRET_KEY: t.String(),
	JWT_EXPIRATION_TIME: t.String(),
	POSTGRES_DB: t.String(),
	POSTGRES_USER: t.String(),
	POSTGRES_PASSWORD: t.String(),
	POSTGRES_PORT: t.Number(),
	POSTGRES_HOST: t.String(),
	DATABASE_CONNECTION_STRING: t.String(),
})

declare module 'bun' {
	interface Env extends Static<typeof envSchema> {}
}
