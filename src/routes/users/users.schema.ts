import { type Static, t } from 'elysia'

export const usersSchema = t.Object(
	{
		id: t.Optional(t.Number()),
		first_name: t.String({ minLength: 3, maxLength: 255, description: 'First name of the user' }),
		last_name: t.String({ minLength: 3, maxLength: 255, description: 'Last name of the user' }),
		email: t.String({ format: 'email', description: 'Email of the user' }),
		password: t.String({ minLength: 6, maxLength: 255, description: 'Password of the user' }),
		phone: t.String({ minLength: 10, maxLength: 10, description: 'Phone number of the user' }),
		dob: t.String({ format: 'date', description: 'Date of birth of the user' }),
		gender: t.Union([t.Literal('male'), t.Literal('female'), t.Literal('others')]),
		role_type: t.Union([
			t.Literal('super_Admin'),
			t.Literal('artist_manager'),
			t.Literal('artist'),
		]),
		address: t.Optional(t.String({ description: 'Address of the user' })),
		created_at: t.Optional(t.String({ format: 'date-time' })),
		updated_at: t.Optional(t.String({ format: 'date-time' })),
	},
	{
		description: 'User schema object',
		default: {
			id: 1,
			first_name: 'John',
			last_name: 'Doe',
			email: 'johndoe@gmail.com',
			password: 'john_doe123@',
			phone: '1234567890',
			dob: '2004-12-12',
			gender: 'male',
			role_type: 'artist',
			address: '1234 Main St',
			created_at: '2021-10-10T10:10:10',
			updated_at: '2021-10-10T10:10:10',
		},
	}
)

export type UserSchema = Static<typeof usersSchema>
