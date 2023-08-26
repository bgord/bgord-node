import { Falsy } from './ts-utils';
import { TimestampType } from './schema';

enum StopwatchState {
  started = 'started',
  stopped = 'finished',
}

export type StopwatchResultType = { durationMs: TimestampType };

export class Stopwatch {
  private state: StopwatchState;

  private startMs: TimestampType;

  private stopMs: Falsy<TimestampType>;

  constructor() {
    this.state = StopwatchState.started;
    this.startMs = Date.now();
  }

  stop(): StopwatchResultType {
    if (this.state === StopwatchState.stopped) {
      throw new Error('Stopwatch is already stopped');
    }

    this.state = StopwatchState.stopped;
    this.stopMs = Date.now();

    return { durationMs: this.stopMs - this.startMs };
  }
}
