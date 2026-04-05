module.exports = {
	plugins: ['eslint-plugin-perfectionist'],
	rules: {
		'perfectionist/sort-imports': [
			'error',
			{
				type: 'natural',
				order: 'asc',
				newlinesBetween: 1,
				internalPattern: ['^@/.*', '^~.*', '^___shared/.*'],
				groups: [
					//* 1. Logic
					'react',
					'next',
					'external',
					'internal-alias',
					'internal-tilde',
					'ameliance-ui',
					['parent', 'sibling', 'index'],

					//* 2. Constants
					'constants-external',
					'constants-internal',

					//* 3. Types
					'type-external',
					'type-internal',

					//* 4. Others
					'assets',
					'styles',
					'unknown',
				],
				customGroups: [
					//* Types
					{
						groupName: 'type-external',
						modifiers: ['type'],
						elementNamePattern: '^(?!\\.|@/|~|___shared).*',
					},
					{
						groupName: 'type-internal',
						modifiers: ['type'],
					},

					//* Constants
					{
						groupName: 'constants-external',
						elementNamePattern: '^[A-Z0-9_]+$',
						modifiers: [],
					},
					{ groupName: 'constants-internal', elementNamePattern: '.*constants.*' },

					//* Logic
					{ groupName: 'react', elementNamePattern: '^react' },
					{ groupName: 'next', elementNamePattern: '^next' },
					{ groupName: 'internal-alias', elementNamePattern: '^@/|^___shared' },
					{ groupName: 'internal-tilde', elementNamePattern: '^~(?!/ameliance-ui|assets)' },
					{ groupName: 'ameliance-ui', elementNamePattern: '^~/ameliance-ui' },

					//* Others
					{ groupName: 'assets', elementNamePattern: '^~assets' },
					{ groupName: 'styles', elementNamePattern: '\\.(css|scss|sass|less)$' },
				],
			},
		],

		'perfectionist/sort-named-imports': [
			'error',
			{
				type: 'natural',
				order: 'asc',
				groups: ['others', 'constants', 'types'],
				newlinesBetween: 1,
				customGroups: [
					{ groupName: 'types', modifiers: ['type'] },
					{ groupName: 'constants', elementNamePattern: '^[A-Z0-9_]+$' },
					{ groupName: 'others', elementNamePattern: '^(?![A-Z0-9_]+$).+$' },
				],
			},
		],

		'perfectionist/sort-named-exports': [
			'error',
			{
				type: 'natural',
				order: 'asc',
				groups: ['others', 'constants', 'types'],
				newlinesBetween: 1,
				customGroups: [
					{ groupName: 'types', modifiers: ['type'] },
					{ groupName: 'constants', elementNamePattern: '^[A-Z0-9_]+$' },
					{ groupName: 'others', elementNamePattern: '^(?![A-Z0-9_]+$).+$' },
				],
			},
		],

		'perfectionist/sort-exports': [
			'error',
			{
				type: 'natural',
				order: 'asc',
			},
		],
	},
};
