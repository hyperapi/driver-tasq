
/**
 * @param {import('@hyperapi/core').HyperAPIRequest<v.InferOutput<typeof ArgumentsSchema>>} request -
 * @returns {Promise<{ message: string }>} -
 */
export default async function (request) {
	await new Promise((resolve) => {
		setTimeout(
			resolve,
			10,
		);
	});

	return {
		message: `Hello, ${request.args.name}!`,
	};
}

import * as v      from 'valibot';
import { valibot } from '../validator.js';

const ArgumentsSchema = v.strictObject({
	name: v.string(),
});
export const argsValidator = valibot.bind(ArgumentsSchema);
