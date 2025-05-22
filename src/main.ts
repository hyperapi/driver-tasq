import {
	type HyperAPIDriver,
	type HyperAPIDriverHandler,
	type HyperAPIRequest,
	HyperAPIError,
	HyperAPIInternalError,
} from '@hyperapi/core';
import {
	Tasq,
	type TasqServer,
	type TasqRequestData,
} from '@kirick/tasq';

interface Options {
	topic: string;
	threads?: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class HyperAPITasqDriver implements HyperAPIDriver<HyperAPIRequest<any>> {
	private tasq: Tasq;
	private options: Options;
	private server: TasqServer | undefined;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private handler: HyperAPIDriverHandler<HyperAPIRequest<any>> | null = null;

	/**
	 * @param tasq Tasq instance.
	 * @param options -
	 * @param options.topic Tasq topic to listen.
	 * @param options.threads Number of threads to use. Default is 1.
	 */
	constructor(
		tasq: Tasq,
		options: Options,
	) {
		this.tasq = tasq;
		this.options = options;
	}

	/**
	 * Starts the server.
	 * @param handler - The handler to use.
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	start(handler: HyperAPIDriverHandler<HyperAPIRequest<any>>): void {
		this.handler = handler;
		this.server = this.tasq.serve({
			topic: this.options.topic,
			threads: this.options.threads,
			handler: async (path, args) => {
				const response: [ boolean, unknown ] = [ true, undefined ];

				try {
					response[1] = await this.processRequest(path, args);
				}
				catch (error) {
					response[0] = false;

					if (error instanceof HyperAPIError) {
						response[1] = error.getResponse();
					}
					else {
						// eslint-disable-next-line no-console
						console.error('Unhandled error in @hyperapi/driver-tasq:');
						// eslint-disable-next-line no-console
						console.error(error);

						response[1] = new HyperAPIInternalError().getResponse();
					}
				}

				return response;
			},
		});
	}

	/** Stops the server. */
	stop(): void {
		this.server?.destroy();
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
		if (!this.handler) {
			throw new Error('No handler available.');
		}

		const hyperapi_response = await this.handler({
			method: 'UNKNOWN',
			path,
			args,
		});

		if (hyperapi_response instanceof HyperAPIError) {
			throw hyperapi_response;
		}

		if (hyperapi_response instanceof Response) {
			throw new TypeError('Response is not supported in this driver');
		}

		return hyperapi_response;
	}
}
