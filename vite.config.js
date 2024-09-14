import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { Mode, plugin as markdown } from 'vite-plugin-markdown'

export default defineConfig({
	plugins: [markdown({ mode: [Mode.HTML, Mode.TOC]}), sveltekit()]
});
