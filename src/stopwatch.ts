import { Falsy } from './ts-utils';
import { TimestampType } from './schema';

enum StopwatchState {
  started = 'started',
  stopped = 'finished',
}

export type StopwatchResultType = { durationMs: TimestampType };

export class Stopwatch {
  private state: StopwatchState = StopwatchState.started;

  private readonly startMs: TimestampType = Date.now();

  private stopMs: Falsy<TimestampType>;

  stop(): StopwatchResultType {
    if (this.state === StopwatchState.stopped) {
      throw new Error('Stopwatch is already stopped');
    }

    this.state = StopwatchState.stopped;
    this.stopMs = Date.now();

    return { durationMs: this.stopMs - this.startMs };
  }
}
