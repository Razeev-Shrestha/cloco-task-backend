import Elysia from 'elysia'

/**
 * This plugin is used to extract Bearer token from Authorization header
 */
export const bearerPlugin = new Elysia().derive(
	{ as: 'global' },
	function deriverBearer({ headers: { authorization } }) {
		return {
			get bearer() {
				if ((authorization as string)?.startsWith('Bearer')) {
					return (authorization as string).slice('Bearer'.length + 1)
				}

				return ''
			},
		}
	}
)
