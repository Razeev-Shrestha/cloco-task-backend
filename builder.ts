;(async () => {
	try {
		await Bun.build({
			entrypoints: ['./src/index.ts'],
			outdir: 'build',
			target: 'bun',
			format: 'esm',
			splitting: false,
			env: 'inline',
			sourcemap: 'linked',
			minify: {
				whitespace: true,
				identifiers: true,
				syntax: true,
			},
			root: '.',
		})
	} catch (error) {
		const e = error as AggregateError

		console.error('___BUILD_FAILED___')

		console.error(JSON.stringify(e, null, 2))
	}
})()
