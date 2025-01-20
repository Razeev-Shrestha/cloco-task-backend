import { type Static, t } from 'elysia'

export const artistsSchema = t.Object(
	{
		id: t.Optional(t.Number()),
		user_id: t.Number({ description: 'User ID of the artist.' }),
		first_release_year: t.Number({ description: 'First release year of the artist.' }),
		no_of_albums_released: t.Number({ description: 'Number of albums released by the artist.' }),
		created_at: t.Optional(t.String({ format: 'date-time' })),
		updated_at: t.Optional(t.String({ format: 'date-time' })),
	},
	{
		description: 'Artist schema object',
		default: {
			id: 1,
			user_id: 1,
			first_release_year: 2000,
			no_of_albums_released: 10,
			created_at: '2021-10-10T10:10:10',
			updated_at: '2021-10-10T10:10:10',
		},
	}
)

export type ArtistsSchema = Static<typeof artistsSchema>
