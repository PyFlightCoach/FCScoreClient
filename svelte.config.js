import adapter from '@sveltejs/adapter-static';
import preprocess from 'svelte-preprocess';

export default {
	preprocess: preprocess(),
	kit: {
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
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