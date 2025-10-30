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

type ValiBaseSchema = Parameters<typeof v.parser>[0];

/**
 * Valibot validator for HyperAPI requests.
 * @param schema - The Valibot schema to validate the request against.
 * @returns A middleware function that validates the request arguments using the provided schema.
 */
export function valibot<S extends ValiBaseSchema>(schema: S) {
	return (request: HyperAPIRequest) => {
		const result = v.safeParse(schema, request.args);
		if (result.success) {
			return { args: result.output };
		}

		throw new HyperAPIInvalidParametersError();
	};
}
