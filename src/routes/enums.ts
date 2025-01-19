import { type Static, t } from 'elysia'

export const RoleTypeEnum = t.Const({
	super_admin: 'super_admin',
	artist_manager: 'artist_manager',
	artist: 'artist',
} as const)

export const GenderEnum = t.Const({
	male: 'male',
	female: 'female',
	others: 'others',
})

export const GenreEnum = t.Const({
	rnb: 'rnb',
	country: 'country',
	classic: 'classic',
	rock: 'rock',
	jazz: 'jazz',
})

export type RoleType = Static<typeof RoleTypeEnum>

export type GenderType = Static<typeof GenderEnum>

export type GenreType = Static<typeof GenreEnum>
