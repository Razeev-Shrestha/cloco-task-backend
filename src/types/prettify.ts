type RecordKey = string | number | symbol

export type MinimalPrettify<T> = {
	[K in keyof T]: T[K]
} & {}

export type Prettify<T> = {
	[K in keyof T]: T extends Record<RecordKey, unknown> ? MinimalPrettify<T[K]> : T[K]
} & {}
