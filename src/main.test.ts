import {
	afterAll,
	expect,
	test,
} from 'vitest';
import { HyperAPI } from '@hyperapi/core';
import { createTasq } from '@kirick/tasq';
import { redisClient } from '../test/redis.js';
import { HyperAPITasqDriver } from './main.js';

const tasq = await createTasq(redisClient);

const driver = new HyperAPITasqDriver(
	tasq,
	{
		topic: 'hyperapi',
		// threads: 2,
	},
);

const hyperAPIServer = new HyperAPI({
	root: new URL('../test/hyper-api', import.meta.url).pathname,
	driver,
});

afterAll(() => {
	hyperAPIServer.destroy();
});

test('plain', async () => {
	const result = await tasq.request(
		'hyperapi',
		'echo',
		{ name: 'Kirick' },
	);

	expect(result).toStrictEqual([
		true,
		{
			message: 'Hello, Kirick!',
		},
	]);
});

test('slug argument', async () => {
	const result = await tasq.request(
		'hyperapi',
		'echo/otsu',
	);

	expect(result).toStrictEqual([
		true,
		{
			message: 'Hello, otsu!',
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
