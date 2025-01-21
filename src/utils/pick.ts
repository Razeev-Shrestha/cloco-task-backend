export const pick = <T extends Record<string, unknown>, K extends keyof T = keyof T>(
	obj: T,
	keys: K[]
): Pick<T, K> => {
	const newObj = {} as T
	for (const key of keys) {
		newObj[key] = obj[key]
	}
	return newObj
}
