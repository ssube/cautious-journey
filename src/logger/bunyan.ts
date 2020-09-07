import { constructorName } from '@apextoaster/js-utils';
import * as bunyan from 'bunyan';
import { Logger } from 'noicejs';

const { createLogger, stdSerializers } = bunyan;

/**
 * Attach bunyan to the Logger. Does very little, since bunyan matches the Logger interface.
 */
export class BunyanLogger {
  public static create(options: bunyan.LoggerOptions): Logger {
    return createLogger({
      ...options,
      serializers: {
        ...stdSerializers,
        container: constructorName,
        logger: constructorName,
        module: constructorName,
      },
    });
  }
}
