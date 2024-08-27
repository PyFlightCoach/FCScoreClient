import { describe, expect, it } from 'vitest';

import { describe_selectors, split_arg_string } from '$lib/api_objects/mandef';

import data from '$lib/data/trgle.json';

describe('utility functions', () => {
	it('split_arg_string', () => {
		expect(split_arg_string('sp:10,rot:0.5')).toEqual({ sp: 10, rot: 0.5 });
	});

	it('describe selectors', () => {
		expect(describe_selectors(['before_slowdown(sp:10)', 'first()'])).toBe(
			'The first value before the speed has reduced below 10 m/s'
		);

		expect(describe_selectors(['before_slowdown(sp:10)'])).toBe(
			'All values before the speed has reduced below 10 m/s'
		);

		expect(describe_selectors(['after_slowdown(sp:10)'])).toBe(
			'All values after the speed has reduced below 10 m/s'
		);

		expect(describe_selectors(['after_speedup(sp:10)'])).toBe(
			'All values after the speed has increased above 10 m/s'
		);

		expect(describe_selectors(['autorot_break(rot:0.5)'])).toBe(
			'All values before the autorotation has rotated by 29°'
		);

		expect(describe_selectors(['autorot_recovery(rot:0.5)'])).toBe(
			'All values within 29° of the end of the autorotation'
		);

		expect(describe_selectors(['autorotation(brot:0.5,rrot:0.5)'])).toBe(
			'All values after the autorotation has rotated by 29° and within 29° of the end'
		);

		expect(describe_selectors(['absmax()'])).toBe('The maximum absolute value');
	});
});
