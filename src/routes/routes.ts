import type { Decorator, Derive, Resolve, Store } from '@/app.type'
import { authPlugin } from '@/plugins/auth.plugin'
import { makeSchemaOptional } from '@/utils/make-schema-optional'
import { response } from '@/utils/response'
import Elysia, { t } from 'elysia'
import { artistsSchema } from './artists/artists.schema'
import {
	createArtistService,
	deleteArtistService,
	getArtistService,
	getArtistsService,
	updateArtistService,
} from './artists/artists.service'
import { authLoginSchema } from './auth/auth.schema'
import { authLoginService, authMeService, authRegisterService } from './auth/auth.service'
import {
	createSongService,
	deleteSongService,
	getSongService,
	getSongsService,
	updateSongService,
} from './songs/songs.service'
import { usersSchema } from './users/users.schema'
import {
	createUserService,
	deleteUserService,
	getUserService,
	getUsersService,
	updateUserService,
} from './users/users.service'
import { mergeSchemas } from '@/utils/merge-schema'
import { songsSchema } from './songs/songs.schema'

export const routes = new Elysia<
	'/api/v1',
	{ store: Store; resolve: Resolve; derive: Derive; decorator: Decorator }
>({ prefix: '/api/v1' })
	.get(
		'/health-check',
		({ set }) => {
			set.status = 'Accepted'

			return response({
				payload: null,
				success: true,
				status: 200,
				message: 'Health Check OK!!',
			})
		},
		{
			tags: ['General'],
			detail: {
				tags: ['General'],
				summary: 'Health Check',
			},
		}
	)
	.group('/auth', app =>
		app
			.post('/login', authLoginService, {
				body: authLoginSchema,
				tags: ['Authentication'],
				parse: 'json',
				detail: {
					tags: ['Authentication'],
					summary: 'Login',
					description: 'Login User',
				},
			})
			.post('/register', authRegisterService, {
				body: usersSchema,
				tags: ['Authentication'],
				parse: 'json',
				detail: {
					tags: ['Authentication'],
					summary: 'Register',
					description: 'Register User',
				},
			})
			.use(authPlugin)
			.get('/me', authMeService, {
				tags: ['Authentication'],
				detail: {
					tags: ['Authentication'],
					summary: 'Me',
					description: 'Get User Profile',
				},
				authorizedRoles: ['artist_manager', 'artist', 'super_admin'],
			})
	)
	.use(authPlugin)
	.group('/users', app =>
		app
			.get('', getUsersService, {
				tags: ['Users'],
				detail: {
					tags: ['Users'],
					summary: 'Get Users',
					description: 'Get Users',
				},
				authorizedRoles: ['super_admin'],
			})
			.get('/:id', getUserService, {
				tags: ['Users'],
				detail: {
					tags: ['Users'],
					summary: 'Get User',
					description: 'Get User',
				},
				authorizedRoles: ['super_admin'],
			})
			.post('', createUserService, {
				body: usersSchema,
				tags: ['Users'],
				detail: {
					tags: ['Users'],
					summary: 'Create User',
					description: 'Create User',
				},
				authorizedRoles: ['super_admin'],
			})
			.patch('/:id', updateUserService, {
				body: makeSchemaOptional(usersSchema),
				tags: ['Users'],
				detail: {
					tags: ['Users'],
					summary: 'Update User',
					description: 'Update User',
				},
				authorizedRoles: ['super_admin'],
			})
			.delete('/:id', deleteUserService, {
				tags: ['Users'],

				detail: {
					tags: ['Users'],
					summary: 'Delete User',
					description: 'Delete User',
				},

				authorizedRoles: ['super_admin'],
				params: t.Object({
					id: t.Number(),
				}),
				transform({ params }) {
					const id = +params.id

					if (!Number.isNaN(id)) params.id = id
				},
			})
	)
	.group('/artists', app =>
		app
			.get('', getArtistsService, {
				tags: ['Artists'],
				detail: {
					tags: ['Artists'],
					summary: 'Get Artists',
					description: 'Get Artists',
				},
				authorizedRoles: ['super_admin', 'artist_manager'],
			})
			.get('/:id', getArtistService, {
				tags: ['Artists'],
				detail: {
					tags: ['Artists'],
					summary: 'Get Artist',
					description: 'Get Artist',
				},
				authorizedRoles: ['super_admin', 'artist_manager'],
			})
			.post('', createArtistService, {
				body: mergeSchemas(artistsSchema, usersSchema),
				tags: ['Artists'],
				detail: {
					tags: ['Artists'],
					summary: 'Create Artist',
					description: 'Create Artist',
				},
				authorizedRoles: ['artist_manager'],
			})
			.patch('/:id', updateArtistService, {
				body: makeSchemaOptional(mergeSchemas(artistsSchema, usersSchema)),
				tags: ['Artists'],
				detail: {
					tags: ['Artists'],
					summary: 'Update Artist',
					description: 'Update Artist',
				},
				authorizedRoles: ['artist_manager'],
			})
			.delete('/:id', deleteArtistService, {
				tags: ['Artists'],
				detail: {
					tags: ['Artists'],
					summary: 'Delete Artist',
					description: 'Delete Artist',
				},
				authorizedRoles: ['artist_manager'],
			})
			.get('/:id/songs', getSongsService, {
				tags: ['Songs'],
				detail: {
					tags: ['Songs'],
					summary: 'Get Songs',
					description: 'Get Songs',
				},
				authorizedRoles: ['super_admin', 'artist_manager', 'artist'],
			})
			.get('/:id/song', getSongService, {
				tags: ['Songs'],
				detail: {
					tags: ['Songs'],
					summary: 'Get Song',
					description: 'Get Song',
				},
				authorizedRoles: ['super_admin', 'artist_manager', 'artist'],
			})
			.post('/:id/songs', createSongService, {
				body: songsSchema,
				tags: ['Songs'],
				detail: {
					tags: ['Songs'],
					summary: 'Create Song',
					description: 'Create Song',
				},
				authorizedRoles: ['artist'],
			})
			.patch('/:id/song', updateSongService, {
				body: makeSchemaOptional(songsSchema),
				tags: ['Songs'],
				detail: {
					tags: ['Songs'],
					summary: 'Update Song',
					description: 'Update Song',
				},
				authorizedRoles: ['artist'],
			})
			.delete('/:id/song', deleteSongService, {
				tags: ['Songs'],
				detail: {
					tags: ['Songs'],
					summary: 'Delete Song',
					description: 'Delete Song',
				},
				authorizedRoles: ['artist'],
			})
	)
