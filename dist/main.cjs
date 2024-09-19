"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// dist/esm/main.js
var main_exports = {};
__export(main_exports, {
  HyperAPITasqDriver: () => HyperAPITasqDriver
});
module.exports = __toCommonJS(main_exports);
var import_core = require("@hyperapi/core");
var HyperAPITasqDriver = class {
  tasq;
  options;
  server;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          if (error instanceof import_core.HyperAPIError) {
            response[1] = error.getResponse();
          } else {
            console.error("Unhandled error in @hyperapi/driver-tasq:");
            console.error(error);
            response[1] = new import_core.HyperAPIInternalError().getResponse();
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
   * @param path - API method name.
   * @param args - API method arguments.
   * @returns - Whether the request was successful and the response.
   */
  async processRequest(path, args) {
    if (!this.handler) {
      throw new Error("No handler available.");
    }
    const hyperapi_response = await this.handler({
      method: "UNKNOWN",
      path,
      args
    });
    if (hyperapi_response instanceof import_core.HyperAPIError) {
      throw hyperapi_response;
    }
    return hyperapi_response;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HyperAPITasqDriver
});
