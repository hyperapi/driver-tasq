
/* global describe, test, expect */

import { HyperAPI }           from '@hyperapi/core';
import { HyperAPITasqDriver } from '../src/main.js';
import { createTasq }         from '../test/create-tasq.js';

const tasq = await createTasq();

const driver = new HyperAPITasqDriver(
	await createTasq(),
	{
		topic: 'hyperapi',
		// threads: 2,
	},
);

const hyperAPIServer = new HyperAPI({
	root: new URL('../test/api', import.meta.url).pathname,
	driver,
});

await new Promise((resolve) => setTimeout(resolve, 100));

describe('requests', () => {
	test('request ok (sync)', async () => {
		const result = await tasq.request(
			'hyperapi',
			'echo',
			{
				name: 'Kirick',
			},
		);

		expect(result).toStrictEqual([
			true,
			{
				message: 'Hello, Kirick!',
			},
		]);
	});

	test('request ok (async)', async () => {
		const result = await tasq.request(
			'hyperapi',
			'echo.async',
			{
				name: 'Otsu',
			},
		);

		expect(result).toStrictEqual([
			true,
			{
				message: 'Hello, Otsu!',
			},
		]);
	});

	test('missing argument', async () => {
		const result = await tasq.request(
			'hyperapi',
			'echo',
		);

		expect(result).toStrictEqual([
			false,
			{
				code: 2,
				description: 'One of the parameters specified was missing or invalid',
			},
		]);
	});

	test('invalid argument', async () => {
		const result = await tasq.request(
			'hyperapi',
			'echo',
			{
				name: 'ToooooooLongName',
			},
		);

		expect(result).toStrictEqual([
			false,
			{
				code: 2,
				description: 'One of the parameters specified was missing or invalid',
			},
		]);
	});

	test('unknown method', async () => {
		const result = await tasq.request(
			'hyperapi',
			'unknown',
		);

		expect(result).toStrictEqual([
			false,
			{
				code: 5,
				description: 'Unknown method called',
			},
		]);
	});
});
