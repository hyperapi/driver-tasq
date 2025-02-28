import { HyperAPIDriver, HyperAPIDriverHandler, HyperAPIRequest } from '@hyperapi/core';
import { Tasq } from '@kirick/tasq';
interface Options {
    topic: string;
    threads?: number;
}
export declare class HyperAPITasqDriver implements HyperAPIDriver<HyperAPIRequest<any>> {
    private tasq;
    private options;
    private server;
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
}
export {};
