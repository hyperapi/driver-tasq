import { HyperAPIDriver, HyperAPIRequest } from "@hyperapi/core/dev";
import { Tasq } from "@kirick/tasq";

//#region src/main.d.ts
interface Options {
  topic: string;
  threads?: number;
}
declare class HyperAPITasqDriver extends HyperAPIDriver<HyperAPIRequest> {
  #private;
  /**
  * @param tasq Tasq instance.
  * @param options -
  * @param options.topic Tasq topic to listen.
  * @param options.threads Number of threads to use. Default is 1.
  */
  constructor(tasq: Tasq, options: Options);
  /**
  * Handles the request.
  * @param path - API method path.
  * @param args - API method arguments.
  * @returns -
  */
  private processRequest;
  /** Stops the server. */
  override destroy(): void;
}
//#endregion
export { HyperAPITasqDriver };