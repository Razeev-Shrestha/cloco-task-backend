import {
	type Static,
	type TMappedResult,
	type TObject,
	type TOptionalFromMappedResult,
	Type,
} from '@sinclair/typebox'

export const makeSchemaOptional = <T extends TObject>(schema: T) => {
	const keys = Object.keys(schema.properties) as Array<keyof Static<T>>

	const optionalSchema = keys.reduce(
		(acc, key) => {
			//@ts-ignore
			acc[key] = Type.Optional(schema.properties[key])
			return acc
		},
		{} as { [K in keyof Static<T>]: TOptionalFromMappedResult<TMappedResult, true> }
	)

	return Type.Object(optionalSchema)
}
