import { z } from 'zod';
import * as Schema from './schema';

export const Event = z.object({
  id: Schema.UUID,
  createdAt: z.date(),

  name: z.string().nonempty(),
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

export const EventDraft = Event.omit({
  id: true,
  createdAt: true,
});

export const ParsedEvent = Event.merge(
  z.object({
    payload: z.record(z.any()),
  })
);

export type EventType = z.infer<typeof Event>;
export type EventDraftType = z.infer<typeof EventDraft>;
export type ParsedEventType = z.infer<typeof ParsedEvent>;
