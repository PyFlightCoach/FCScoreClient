import adapter from '@sveltejs/adapter-static';
import {sveltePreprocess} from 'svelte-preprocess';

export default {
	preprocess: sveltePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		paths: {
				base: process.env.NODE_ENV === 'production' ? '/PyFlightCoach/FCScoreClient' : '',
		},
		version: {name: process.env.npm_package_version}
	}
};