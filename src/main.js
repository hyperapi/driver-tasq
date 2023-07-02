
import HyperAPIDriver  from '@hyperapi/core/driver'; // eslint-disable-line import/no-unresolved, import/extensions, node/no-missing-import
import HyperAPIRequest from '@hyperapi/core/request'; // eslint-disable-line import/no-unresolved, import/extensions, node/no-missing-import
import Tasq            from '@kirick/tasq';

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
			handler: async (method, args) => this.#onRequest(method, args),
		});
	}

	async #onRequest(method, args) {
		const response = await this.onRequest(
			new HyperAPIRequest(method, args),
		);

		return response.object();
	}

	destroy() {
		this.#tasqServer.destroy();
	}
}
