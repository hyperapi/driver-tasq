
import {
	HyperAPIDriver,
	HyperAPIRequest } from '@hyperapi/core';
import Tasq           from '@kirick/tasq';

export default class HyperAPITasqDriver extends HyperAPIDriver {
	#tasqServer;

	constructor({
		tasq,
		topic,
	}) {
		super();

		if (tasq instanceof Tasq !== true) {
			throw new TypeError('Property "tasq" must be an instance of Tasq.');
		}

		this.#tasqServer = tasq.serve({
			topic,
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

	destroy() {
		this.#tasqServer.destroy();
	}
}
