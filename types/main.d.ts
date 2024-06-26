export class HyperAPITasqDriver extends HyperAPIDriver {
    /**
     * @param {Tasq} tasq Tasq instance.
     * @param {object} options -
     * @param {string} options.topic Tasq topic to listen.
     * @param {number=} [options.threads] Number of threads to use. Default is 1.
     */
    constructor(tasq: Tasq, { topic, threads, }: {
        topic: string;
        threads?: number | undefined;
    });
    /**
     * Destroys the driver.
     * @returns {void}
     */
    destroy(): void;
    #private;
}
import { HyperAPIDriver } from '@hyperapi/core';
import { Tasq } from '@kirick/tasq';
