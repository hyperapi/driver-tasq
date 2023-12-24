
/* eslint-disable jsdoc/require-jsdoc */

import { Tasq }              from '@kirick/tasq';
import { createRedisClient } from './create-redis-client.js';

export async function createTasq() {
	return new Tasq(
		await createRedisClient(),
	);
}
