
/**
 * @param {import('@hyperapi/core').HyperAPIRequest<v.InferOutput<typeof ArgumentsSchema>>} request -
 * @returns {Promise<{ message: string }>} -
 */
export default function (request) {
	return {
		message: `Hello, ${request.args.name}!`,
	};
}

import * as v      from 'valibot';
import { valibot } from '../validator.js';

const ArgumentsSchema = v.strictObject({
	name: v.pipe(
		v.string(),
		v.maxLength(10),
	),
});
export const argsValidator = valibot.bind(ArgumentsSchema);
