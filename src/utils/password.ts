export const hashPassword = async (password: string) => {
	if (!password) return null

	return Bun.password.hash(password, {
		algorithm: 'argon2d',
	})
}

/**
 *
 * @param enteredPassword user entered password
 * @param hashedPassword password stored in the database
 * @returns boolean Promise
 */
export const verifyPassword = async (enteredPassword: string, hashedPassword: string) => {
	return Bun.password.verify(enteredPassword, hashedPassword, 'argon2d')
}
