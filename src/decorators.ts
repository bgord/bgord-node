import { Logger } from './logger';
import { RoundToDecimal } from './rounding';

export class Decorators {
  private readonly rounding = new RoundToDecimal(2);

  constructor(private readonly logger: Logger) {}

  duration() {
    const that = this;

    return function(
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const original: (...args: unknown[]) => unknown = descriptor.value;

      const label = `${target.name}.${propertyKey}`;

      descriptor.value = function(...args: unknown[]) {
        const before = performance.now();
        const value = original.apply(this, args);
        const after = performance.now();

        that.logger.info({
          message: `${label} duration`,
          operation: 'decorators_duration_ms',
          metadata: { durationMs: that.rounding.round(after - before) },
        });

        return value;
      };
    };
  }

  inspector() {
    const that = this;

    return function(
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const original: (...args: unknown[]) => unknown = descriptor.value;

      const label = `${target.name}.${propertyKey}`;

      descriptor.value = async function(...args: unknown[]) {
        const value = await original.apply(this, args);

        that.logger.info({
          message: `${label} inspector`,
          operation: 'decorators_inspector',
          metadata: { arguments: args, output: value },
        });

        return value;
      };
    };
  }
}
