
import { HyperAPIInvalidParametersError } from '@hyperapi/core';
import {
	parse,
	ValiError }                           from 'valibot';

/**
 * Validates the given value using Valibot schema.
 * @param {any} value The value to validate.
 * @returns {any} The validated value.
 */
export function valibot(value) {
	try {
		return parse(this, value);
	}
	catch (error) {
		if (error instanceof ValiError) {
			// console.error(error);
			throw new HyperAPIInvalidParametersError();
		}

		throw error;
	}
}
