
import {
	HyperAPIDriver,
	HyperAPIRequest } from '@hyperapi/core';
import Tasq           from '@kirick/tasq';

export default class HyperAPITasqDriver extends HyperAPIDriver {
	#tasqServer;

	/**
	 * @param {object} options Options.
	 * @param {Tasq} options.tasq Tasq instance.
	 * @param {string} options.topic Tasq topic to listen.
	 * @param {number=} [options.threads] Number of threads to use.
	 */
	constructor({
		tasq,
		topic,
		threads = 1,
	}) {
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

	async #onRequest(method, args) {
		const request = new HyperAPIRequest(method, args);
		const response = await this.onRequest(request);

		return [
			response.is_success,
			response.getResponse(),
		];
	}

	/**
	 * Destroys the driver.
	 */
	destroy() {
		this.#tasqServer.destroy();
	}
}
