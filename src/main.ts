import { HyperAPIError, HyperAPIInternalError } from '@hyperapi/core';
import { HyperAPIDriver, type HyperAPIRequest } from '@hyperapi/core/dev';
import { Tasq, type TasqRequestData, type TasqServer } from '@kirick/tasq';

interface Options {
	topic: string;
	threads?: number;
}

export class HyperAPITasqDriver extends HyperAPIDriver<HyperAPIRequest> {
	#server: TasqServer | undefined;

	/**
	 * @param tasq Tasq instance.
	 * @param options -
	 * @param options.topic Tasq topic to listen.
	 * @param options.threads Number of threads to use. Default is 1.
	 */
	constructor(tasq: Tasq, options: Options) {
		super();

		this.#server = tasq.serve({
			topic: options.topic,
			threads: options.threads,
			handler: async (path, args) => {
				const response: [boolean, unknown] = [true, undefined];

				try {
					response[1] = await this.processRequest(path, args);
				} catch (error) {
					response[0] = false;

					if (error instanceof HyperAPIError) {
						response[1] = error.getResponse();
					} else {
						// oxlint-disable-next-line no-console
						console.error('Unhandled error in @hyperapi/driver-tasq:');
						// oxlint-disable-next-line no-console
						console.error(error);

						response[1] = new HyperAPIInternalError().getResponse();
					}
				}

				return response;
			},
		});
	}

	/**
	 * Handles the request.
	 * @param path - API method path.
	 * @param args - API method arguments.
	 * @returns -
	 */
	private async processRequest(
		path: string,
		args: TasqRequestData,
	): Promise<unknown> {
		if (Array.isArray(args)) {
			throw new TypeError(
				'Despite the fact that Tasq supports arrays as arguments, they are not supported in HyperAPI driver.',
			);
		}

		const hyperapi_response = await this.fetch({
			method: 'UNDEF',
			path,
			args: args ?? {},
		});

		if (hyperapi_response instanceof HyperAPIError) {
			throw hyperapi_response;
		}

		if (hyperapi_response instanceof Response) {
			throw new TypeError('Response is not supported in this driver');
		}

		return hyperapi_response;
	}

	/** Stops the server. */
	override destroy(): void {
		this.#server?.destroy();

		super.destroy();
	}
}
