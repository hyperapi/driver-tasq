import { HyperAPIError, HyperAPIInternalError } from "@hyperapi/core";
import { Tasq } from "@kirick/tasq";

//#region src/main.ts
var HyperAPITasqDriver = class {
	tasq;
	options;
	server;
	handler = null;
	/**
	* @param tasq Tasq instance.
	* @param options -
	* @param options.topic Tasq topic to listen.
	* @param options.threads Number of threads to use. Default is 1.
	*/
	constructor(tasq, options) {
		this.tasq = tasq;
		this.options = options;
	}
	/**
	* Starts the server.
	* @param handler - The handler to use.
	*/
	start(handler) {
		this.handler = handler;
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
	/** Stops the server. */
	stop() {
		this.server?.destroy();
	}
	/**
	* Handles the request.
	* @param path - API method path.
	* @param args - API method arguments.
	* @returns -
	*/
	async processRequest(path, args) {
		if (!this.handler) throw new Error("No handler available.");
		const hyperapi_response = await this.handler({
			method: "UNKNOWN",
			path,
			args
		});
		if (hyperapi_response instanceof HyperAPIError) throw hyperapi_response;
		if (hyperapi_response instanceof Response) throw new TypeError("Response is not supported in this driver");
		return hyperapi_response;
	}
};

//#endregion
export { HyperAPITasqDriver };