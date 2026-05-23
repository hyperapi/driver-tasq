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
let __hyperapi_core_dev = require("@hyperapi/core/dev");
__hyperapi_core_dev = __toESM(__hyperapi_core_dev);
require("@kirick/tasq");

//#region src/main.ts
var HyperAPITasqDriver = class extends __hyperapi_core_dev.HyperAPIDriver {
	#server;
	/**
	* @param tasq Tasq instance.
	* @param options -
	* @param options.topic Tasq topic to listen.
	* @param options.threads Number of threads to use. Default is 1.
	*/
	constructor(tasq, options) {
		super();
		this.#server = tasq.serve({
			topic: options.topic,
			threads: options.threads,
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
	/**
	* Handles the request.
	* @param path - API method path.
	* @param args - API method arguments.
	* @returns -
	*/
	async processRequest(path, args) {
		if (Array.isArray(args)) throw new TypeError("Despite the fact that Tasq supports arrays as arguments, they are not supported in HyperAPI driver.");
		const hyperapi_response = await this.emitRequest({
			method: "UNDEF",
			path,
			args: args ?? {}
		});
		if (hyperapi_response instanceof __hyperapi_core.HyperAPIError) throw hyperapi_response;
		if (hyperapi_response instanceof Response) throw new TypeError("Response is not supported in this driver");
		return hyperapi_response;
	}
	/** Stops the server. */
	destroy() {
		this.#server?.destroy();
		super.destroy();
	}
};

//#endregion
exports.HyperAPITasqDriver = HyperAPITasqDriver;