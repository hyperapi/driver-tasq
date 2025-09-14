import { HyperAPIError, HyperAPIInternalError } from "@hyperapi/core";
import { HyperAPIDriver } from "@hyperapi/core/dev";
import { Tasq } from "@kirick/tasq";

//#region src/main.ts
var HyperAPITasqDriver = class extends HyperAPIDriver {
	server;
	/**
	* @param tasq Tasq instance.
	* @param options -
	* @param options.topic Tasq topic to listen.
	* @param options.threads Number of threads to use. Default is 1.
	*/
	constructor(tasq, options) {
		super();
		this.tasq = tasq;
		this.options = options;
		this.server = this.tasq.serve({
			topic: this.options.topic,
			threads: this.options.threads,
			handler: async (path, args) => {
				const response = [true, void 0];
				try {
					response[1] = await this.processRequest(path, args);
				} catch (error) {
					response[0] = false;
					if (error instanceof HyperAPIError) response[1] = error.getResponse();
					else {
						console.error("Unhandled error in @hyperapi/driver-tasq:");
						console.error(error);
						response[1] = new HyperAPIInternalError().getResponse();
					}
				}
				return response;
			}
		});
	}
	/**
	* Handles the request.
	* @param path - API method path.
	* @param args - API method arguments.
	* @returns -
	*/
	async processRequest(path, args) {
		if (Array.isArray(args)) throw new TypeError("Despite the fact that Tasq supports arrays as arguments, they are not supported in HyperAPI driver.");
		const hyperapi_response = await this.emitRequest({
			method: "UNKNOWN",
			path,
			args: args ?? {}
		});
		if (hyperapi_response instanceof HyperAPIError) throw hyperapi_response;
		if (hyperapi_response instanceof Response) throw new TypeError("Response is not supported in this driver");
		return hyperapi_response;
	}
	/** Stops the server. */
	destroy() {
		this.server?.destroy();
		super.destroy();
	}
};

//#endregion
export { HyperAPITasqDriver };