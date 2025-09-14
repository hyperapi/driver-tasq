import { HyperAPI, HyperAPIInvalidParametersError } from '@hyperapi/core';
import type { HyperAPIRequest } from '@hyperapi/core/dev';
import { createTasq } from '@kirick/tasq';
import { createClient } from 'redis';
import * as v from 'valibot';
import { HyperAPITasqDriver } from '../src/main.js';

const redisClient = createClient({
	socket: {
		port: 16379,
	},
});

await redisClient.connect();
await redisClient.FLUSHDB();

export const tasq = await createTasq(redisClient);

const driver = new HyperAPITasqDriver(tasq, {
	topic: 'hyperapi',
	// threads: 2,
});

export const hyperApi = new HyperAPI(
	driver,
	new URL('../test/hyper-api', import.meta.url).pathname,
);

// eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/no-explicit-any
export function valibot<S extends v.BaseSchema<any, any, any>>(schema: S) {
	return (request: HyperAPIRequest) => {
		const result = v.safeParse(schema, request.args);
		if (result.success) {
			return { args: result.output };
		}

		throw new HyperAPIInvalidParametersError();
	};
}
