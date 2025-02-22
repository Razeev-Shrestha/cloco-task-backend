import type { UserConfig } from '@commitlint/types'
import { RuleConfigSeverity } from '@commitlint/types'

const Configuration: UserConfig = {
	extends: ['@commitlint/config-conventional'],
	formatter: '@commitlint/format',
	rules: {
		'body-leading-blank': [RuleConfigSeverity.Warning, 'always'],
		'body-max-line-length': [RuleConfigSeverity.Error, 'always', 100],
		'footer-leading-blank': [RuleConfigSeverity.Warning, 'always'],
		'footer-max-line-length': [RuleConfigSeverity.Error, 'always', 100],
		'header-max-length': [RuleConfigSeverity.Error, 'always', 100],
		'scope-case': [RuleConfigSeverity.Error, 'always', 'lower-case'],
		'subject-case': [RuleConfigSeverity.Error, 'always', 'sentence-case'],
		'subject-empty': [RuleConfigSeverity.Error, 'never'],
		'subject-full-stop': [RuleConfigSeverity.Error, 'never', '.'],
		'type-case': [RuleConfigSeverity.Error, 'always', 'lower-case'],
		'type-empty': [RuleConfigSeverity.Error, 'never'],
		'type-enum': [
			RuleConfigSeverity.Error,
			'always',
			[
				'build',
				'ci',
				'chore',
				'docs',
				'feat',
				'fix',
				'perf',
				'refactor',
				'revert',
				'style',
				'test',
				'setup',
			],
		],
	},
}

// biome-ignore lint/style/noDefaultExport: Cannot use named exports in this file
export default Configuration
