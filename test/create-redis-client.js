
/* eslint-disable jsdoc/require-jsdoc */

import { createClient } from 'redis';

export async function createRedisClient() {
	const redisClient = createClient({
		socket: {
			port: 41934,
		},
	});

	await redisClient.connect();

	return redisClient;
}
