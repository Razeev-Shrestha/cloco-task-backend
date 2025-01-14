import { type Static, t } from 'elysia'

const envSchema = t.Object({
	APP_ENV: t.String(),
	PORT: t.Number(),
})

declare module 'bun' {
	interface Env extends Static<typeof envSchema> {}
}
