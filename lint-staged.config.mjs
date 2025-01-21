/** @type {import('lint-staged').Config} */

const configuration = {
	// Run Biome on staged files that have the following extensions: js, ts, jsx, tsx, json and jsonc
	'*.{js,ts,cjs,mjs,d.cts,d.mts,json,jsonc}': [
		'biome check --apply --no-errors-on-unmatched', // Format, sort imports, lint, and apply safe fixes
		'biome check --apply --organize-imports-enabled=true --no-errors-on-unmatched', // format and apply safe fixes
		'biome check --apply-unsafe --no-errors-on-unmatched', // Format, sort imports, lints, apply safe/unsafe fixes
		'biome format --write --no-errors-on-unmatched', // Format
		'biome lint --apply --no-errors-on-unmatched', // Lint and apply safe fixes
	],
}

// biome-ignore lint/style/noDefaultExport: Can't use ESM import/export in this file
export default configuration
