//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
let __hyperapi_core = require("@hyperapi/core");
__hyperapi_core = __toESM(__hyperapi_core);
require("@kirick/tasq");

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
					if (error instanceof __hyperapi_core.HyperAPIError) response[1] = error.getResponse();
					else {
						console.error("Unhandled error in @hyperapi/driver-tasq:");
						console.error(error);
						response[1] = new __hyperapi_core.HyperAPIInternalError().getResponse();
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
		if (hyperapi_response instanceof __hyperapi_core.HyperAPIError) throw hyperapi_response;
		if (hyperapi_response instanceof Response) throw new TypeError("Response is not supported in this driver");
		return hyperapi_response;
	}
};

//#endregion
exports.HyperAPITasqDriver = HyperAPITasqDriver;