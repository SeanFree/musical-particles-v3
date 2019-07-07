module.exports = {
	root: true,
	env: {
		node: true
	},
	'extends': [
		'plugin:vue/essential',
		'@vue/standard'
	],
	rules: {
		'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'indent': ['error', 'tab'],
		'no-tabs': 'off',
		'space-before-function-paren': 'off',
		'generator-star-spacing': 'off'
	},
	parserOptions: {
		parser: 'babel-eslint'
	}
}
