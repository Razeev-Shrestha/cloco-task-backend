import type { Logger } from '@bogeychan/elysia-logger/types'
import type { Context, RouteSchema, SingletonBase } from 'elysia'
import type { DbQuery } from './db/client'
import type { JwtType } from './plugins/jwt.plugin'

export type Store = SingletonBase['store']
export type Resolve = SingletonBase['resolve']
export type Decorator = SingletonBase['decorator'] & {
	jwt: JwtType
}

export type Derive = SingletonBase['derive'] & {
	log: Logger
	query: DbQuery
	readonly bearer: string | undefined
	user: {
		email: string
		role_type: string
	}
}

export type AppContext<
	T extends RouteSchema = RouteSchema,
	Path extends string = '',
	Store extends SingletonBase['store'] = SingletonBase['store'],
	Resolve extends SingletonBase['resolve'] = SingletonBase['resolve'],
	Decorator extends SingletonBase['decorator'] = SingletonBase['decorator'],
	Derive extends SingletonBase['derive'] = SingletonBase['derive'],
> = Context<
	T,
	{
		store: Store
		resolve: Resolve
		decorator: Decorator & {
			jwt: JwtType
		}
		derive: Derive & {
			log: Logger
			query: DbQuery
			bearer: string | undefined
			user: {
				email: string
				role_type: string
			}
		}
	},
	Path
>
