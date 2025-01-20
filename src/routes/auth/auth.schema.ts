import { type Static, t } from 'elysia'

export const authLoginSchema = t.Object(
	{
		email: t.String({
			description: 'email of the user.',
			format: 'email',
		}),
		password: t.String({ description: 'password of the user.' }),
	},
	{
		description: 'auth schema',
		default: {
			email: 'johndoe@gmail.com',
			password: 'password',
		},
	}
)

export type AuthLoginType = Static<typeof authLoginSchema>
