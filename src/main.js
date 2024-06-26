
import {
	HyperAPIDriver,
	HyperAPIRequest } from '@hyperapi/core';
import { Tasq }       from '@kirick/tasq';

export class HyperAPITasqDriver extends HyperAPIDriver {
	#tasqServer;

	/**
	 * @param {Tasq} tasq Tasq instance.
	 * @param {object} options -
	 * @param {string} options.topic Tasq topic to listen.
	 * @param {number=} [options.threads] Number of threads to use. Default is 1.
	 */
	constructor(
		tasq,
		{
			topic,
			threads = 1,
		},
	) {
		super();

		if (tasq instanceof Tasq !== true) {
			throw new TypeError('Property "tasq" must be an instance of Tasq.');
		}

		this.#tasqServer = tasq.serve({
			topic,
			threads,
			handler: (method, args) => this.#onRequest(method, args),
		});
	}

	/**
	 * Handles the request.
	 * @param {string} method - API method name.
	 * @param {Record<string, any>} args - API method arguments.
	 * @returns {Promise<[boolean, any]>} - Whether the request was successful and the response.
	 */
	async #onRequest(method, args) {
		const response = await this.processRequest(
			new HyperAPIRequest(
				method,
				args,
			),
		);

		return [
			response.is_success,
			response.getResponse(),
		];
	}

	/**
	 * Destroys the driver.
	 * @returns {void}
	 */
	destroy() {
		this.#tasqServer.destroy();
	}
}
