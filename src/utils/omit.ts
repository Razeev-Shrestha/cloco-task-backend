export const omit = <T extends Record<string, unknown>, K extends keyof T = keyof T>(
	obj: T,
	keys: K[]
): Omit<T, K> => {
	const newObj = { ...obj }

	for (const key of keys) {
		delete newObj[key]
	}

	return newObj
}
