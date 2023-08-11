const Schedules = {
  EVERY_MINUTE: '* * * * *',
};

type StoppableJobType = { stop: () => void };

export class Jobs {
  static Schedules = Schedules;

  static stopAll(jobs: Record<string, StoppableJobType>) {
    Object.values(jobs).forEach(job => job.stop());
  }
}
