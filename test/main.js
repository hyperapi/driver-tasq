
import HyperAPI            from '@hyperapi/core';
import { createClient }    from '@kirick/redis-client';
import Tasq                from '@kirick/tasq';
import { deepStrictEqual } from 'node:assert/strict';
import {
	after,
	describe,
	it      }              from 'mocha';

import HyperAPITasqDriver from '../src/main.js';

const redisClient = createClient();
const tasq = new Tasq(redisClient._client);

const driver = new HyperAPITasqDriver({
	tasq,
	topic: 'hyperapi',
});

const hyperAPIServer = new HyperAPI({
	root: new URL('api', import.meta.url).pathname,
	driver,
});

await new Promise((resolve) => setTimeout(resolve, 1000));

describe('requests', () => {
	it('request ok', async () => {
		deepStrictEqual(
			await tasq.request(
				'hyperapi',
				'echo',
				{
					name: 'Kirick',
				},
			),
			[
				true,
				{
					message: 'Hello, Kirick!',
				},
			],
		);
	});

	it('missing argument', async () => {
		deepStrictEqual(
			await tasq.request(
				'hyperapi',
				'echo',
			),
			[
				false,
				{
					code: 2,
					description: 'One of the parameters specified was missing or invalid',
				},
			],
		);
	});

	it('invalid argument', async () => {
		deepStrictEqual(
			await tasq.request(
				'hyperapi',
				'echo',
				{
					name: 'ToooooooLongName',
				},
			),
			[
				false,
				{
					code: 2,
					description: 'One of the parameters specified was missing or invalid',
				},
			],
		);
	});

	it('unknown method', async () => {
		deepStrictEqual(
			await tasq.request(
				'hyperapi',
				'unknown',
			),
			[
				false,
				{
					code: 5,
					description: 'Unknown method called',
				},
			],
		);
	});
});

after(() => {
	setTimeout(() => {
		hyperAPIServer.destroy();
		process.exit(0); // eslint-disable-line no-process-exit, unicorn/no-process-exit
	});
});
