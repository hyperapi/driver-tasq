
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
const tasq = new Tasq(redisClient);

const driver = new HyperAPITasqDriver({
	tasq,
	topic: 'hyperapi',
});

const hyperAPIServer = new HyperAPI({
	driver,
	root: new URL('api', import.meta.url).pathname,
});

await new Promise((resolve) => setTimeout(resolve, 1000));

describe('requests', () => {
	it('request ok', async () => {
		deepStrictEqual(
			await tasq.request(
				'hyperapi.echo',
				{
					name: 'Kirick',
				},
			),
			{
				code: 0,
				data: 'Hello, Kirick!',
			},
		);
	});

	it('missing argument', async () => {
		deepStrictEqual(
			await tasq.request(
				'hyperapi.echo',
				{},
			),
			{
				code: 2,
				description: 'One of the parameters specified was missing or invalid',
			},
		);
	});

	it('invalid argument', async () => {
		deepStrictEqual(
			await tasq.request(
				'hyperapi.echo',
				{
					name: 'ToooooooLongName',
				},
			),
			{
				code: 2,
				description: 'One of the parameters specified was missing or invalid',
			},
		);
	});

	after(() => {
		setTimeout(() => {
			hyperAPIServer.destroy();
			process.exit(0); // eslint-disable-line no-process-exit, unicorn/no-process-exit
		});
	});
});
