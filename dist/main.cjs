var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __moduleCache = /* @__PURE__ */ new WeakMap;
var __toCommonJS = (from) => {
  var entry = __moduleCache.get(from), desc;
  if (entry)
    return entry;
  entry = __defProp({}, "__esModule", { value: true });
  if (from && typeof from === "object" || typeof from === "function")
    __getOwnPropNames(from).map((key) => !__hasOwnProp.call(entry, key) && __defProp(entry, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    }));
  __moduleCache.set(from, entry);
  return entry;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {
      get: all[name],
      enumerable: true,
      configurable: true,
      set: (newValue) => all[name] = () => newValue
    });
};

// dist/esm/main.js
var exports_main = {};
__export(exports_main, {
  HyperAPITasqDriver: () => HyperAPITasqDriver
});
module.exports = __toCommonJS(exports_main);
var import_core = require("@hyperapi/core");

class HyperAPITasqDriver {
  tasq;
  options;
  server;
  handler = null;
  constructor(tasq, options) {
    this.tasq = tasq;
    this.options = options;
  }
  start(handler) {
    this.handler = handler;
    this.server = this.tasq.serve({
      topic: this.options.topic,
      threads: this.options.threads,
      handler: async (path, args) => {
        const response = [true, undefined];
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
  stop() {
    this.server?.destroy();
  }
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
    if (hyperapi_response instanceof Response) {
      throw new TypeError("Response is not supported in this driver");
    }
    return hyperapi_response;
  }
}
