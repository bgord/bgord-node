import { z } from 'zod';

import * as Schema from './schema';
import { Logger } from './logger';

export const Event = z.object({
  id: Schema.UUID,
  createdAt: z.date(),

  stream: z.string().min(1),

  name: z.string().min(1),
  version: z
    .number()
    .int()
    .positive(),
  payload: z
    .record(z.any())
    .refine(value => {
      try {
        JSON.parse(String(value));
        return true;
      } catch (error) {
        return false;
      }
    })
    .transform(value => JSON.stringify(value)),
});

export const EventDraft = Event.omit({ id: true, createdAt: true });

export const ParsedEvent = Event.merge(
  z.object({ payload: z.record(z.any()) })
);

export type EventType = z.infer<typeof Event>;
export type EventDraftType = z.infer<typeof EventDraft>;
export type ParsedEventType = z.infer<typeof ParsedEvent>;

export class EventHandler {
  logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  handle<T extends Pick<EventType, 'name'>>(fn: (event: T) => Promise<void>) {
    return async (event: T) => {
      try {
        await fn(event);
      } catch (error) {
        this.logger.error({
          message: `Unknown ${event.name} error handler error`,
          operation: 'unknown_error_handler_error',
          metadata: this.logger.formatError(error),
        });
      }
    };
  }
}

export class EventLogger {
  logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  handle(
    type: string,
    _debugName: string,
    eventName: string | undefined,
    eventData: Record<string, any> | undefined
  ) {
    if (type === 'subscribe') return;

    if (typeof eventName === 'symbol') return;

    this.logger.info({
      message: `${eventName} emitted`,
      operation: 'event_emitted',
      metadata: eventData,
    });
  }
}
