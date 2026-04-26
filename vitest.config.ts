import path from 'path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	oxc: false,
	esbuild: false,
	test: {
		globals: true,
		root: './',
		include: ['src/**/*.unit.spec.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			thresholds: {
				lines: 90,
				branches: 85,
			},
			include: [
				'src/**/*.service.ts',
				'src/**/*.guard.ts',
				'src/**/*.pipe.ts',
				'src/**/*.interceptor.ts',
				'src/**/*.filter.ts',
				'src/**/*.dto.ts',
			],
			exclude: ['src/main.ts', 'src/**/*.module.ts', 'src/drizzle/**'],
		},
	},
	resolve: {
		alias: {
			src: path.resolve(__dirname, './src'),
			shared: path.resolve(__dirname, './shared'),
		},
	},
	plugins: [
		swc.vite({
			module: { type: 'es6' },
		}),
	],
});
