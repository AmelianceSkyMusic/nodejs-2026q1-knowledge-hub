module.exports = {
	'*.(js|jsx|ts|tsx)': 'eslint --cache',
	'**/*.ts?(x)': () => 'tsc -p tsconfig.json --pretty --noEmit',
	'*.{js,jsx,ts,tsx,md,html,css,scss,json,yml,yaml}': 'prettier --check',
};
