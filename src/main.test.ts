import { expect, test } from 'vitest';
import { tasq } from '../test/setup.js';

test('plain', async () => {
	const result = await tasq.request('hyperapi', 'echo', { name: 'Kirick' });

	expect(result).toStrictEqual([
		true,
		{
			message: 'Hello, Kirick!',
		},
	]);
});

test('slug argument', async () => {
	const result = await tasq.request('hyperapi', 'echo/otsu');

	expect(result).toStrictEqual([
		true,
		{
			message: 'Hello, otsu!',
		},
	]);
});

test('unknown method', async () => {
	const result = await tasq.request('hyperapi', 'unknown');

	expect(result).toStrictEqual([
		false,
		{
			code: 5,
			description: 'Unknown method called',
		},
	]);
});
