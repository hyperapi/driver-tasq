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

// src/main.js
var main_exports = {};
__export(main_exports, {
  HyperAPITasqDriver: () => HyperAPITasqDriver
});
module.exports = __toCommonJS(main_exports);
var import_core = require("@hyperapi/core");
var import_tasq = require("@kirick/tasq");
var HyperAPITasqDriver = class extends import_core.HyperAPIDriver {
  #tasqServer;
  /**
   * @param {Tasq} tasq Tasq instance.
   * @param {object} options -
   * @param {string} options.topic Tasq topic to listen.
   * @param {number=} [options.threads] Number of threads to use. Default is 1.
   */
  constructor(tasq, {
    topic,
    threads = 1
  }) {
    super();
    if (tasq instanceof import_tasq.Tasq !== true) {
      throw new TypeError('Property "tasq" must be an instance of Tasq.');
    }
    this.#tasqServer = tasq.serve({
      topic,
      threads,
      handler: (method, args) => this.#onRequest(method, args)
    });
  }
  /**
   * Handles the request.
   * @param {string} method - API method name.
   * @param {Record<string, any>} args - API method arguments.
   * @returns {Promise<[boolean, any]>} - Whether the request was successful and the response.
   */
  async #onRequest(method, args) {
    const response = await this.processRequest(
      new import_core.HyperAPIRequest(
        method,
        args
      )
    );
    return [
      response.is_success,
      response.getResponse()
    ];
  }
  /**
   * Destroys the driver.
   * @returns {void}
   */
  destroy() {
    this.#tasqServer.destroy();
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  HyperAPITasqDriver
});
