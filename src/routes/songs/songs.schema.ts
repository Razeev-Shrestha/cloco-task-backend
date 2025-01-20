import { type Static, t } from 'elysia'

export const songsSchema = t.Object(
	{
		artist_id: t.Number({ description: 'Artist ID of the song.' }),
		title: t.String({ minLength: 3, maxLength: 255, description: 'Title of the song.' }),
		album_name: t.String({
			minLength: 3,
			maxLength: 255,
			description: 'Album name of the song.',
		}),
		genre: t.Union(
			[
				t.Literal('rnb'),
				t.Literal('country'),
				t.Literal('classic'),
				t.Literal('rock'),
				t.Literal('jazz'),
			],
			{ description: 'Genre of the song.' }
		),
		created_at: t.Optional(t.String({ format: 'date-time' })),
		updated_at: t.Optional(t.String({ format: 'date-time' })),
	},
	{
		description: 'Song schema object',
		default: {
			artist_id: 1,
			title: 'Song Title',
			album_name: 'Album Name',
			genre: 'rnb',
			created_at: '2021-10-10T10:10:10',
			updated_at: '2021-10-10T10:10:10',
		},
	}
)

export type SongsSchema = Static<typeof songsSchema>
