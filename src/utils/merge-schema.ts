import { type Static, type TObject, Type } from '@sinclair/typebox'

export const mergeSchemas = <T extends TObject[]>(...schemas: T) => {
	const mergedProperties = schemas.reduce(
		(acc, schema) => {
			const keys = Object.keys(schema.properties) as Array<keyof Static<T[number]>>
			keys.forEach(key => {
				//@ts-ignore
				acc[key] = schema.properties[key]
			})
			return acc
		},
		{} as Record<string, any>
	)

	return Type.Object(mergedProperties)
}
