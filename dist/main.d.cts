import { HyperAPIDriver, HyperAPIDriverHandler, HyperAPIRequest } from "@hyperapi/core";
import { Tasq } from "@kirick/tasq";

//#region src/main.d.ts
interface Options {
  topic: string;
  threads?: number;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare class HyperAPITasqDriver implements HyperAPIDriver<HyperAPIRequest<any>> {
  private tasq;
  private options;
  private server;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handler;
  /**
  * @param tasq Tasq instance.
  * @param options -
  * @param options.topic Tasq topic to listen.
  * @param options.threads Number of threads to use. Default is 1.
  */
  constructor(tasq: Tasq, options: Options);
  /**
  * Starts the server.
  * @param handler - The handler to use.
  */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  start(handler: HyperAPIDriverHandler<HyperAPIRequest<any>>): void;
  /** Stops the server. */
  stop(): void;
  /**
  * Handles the request.
  * @param path - API method path.
  * @param args - API method arguments.
  * @returns -
  */
  private processRequest;
} //#endregion
export { HyperAPITasqDriver };