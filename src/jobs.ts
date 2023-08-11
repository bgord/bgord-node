export class Jobs {
  static SCHEDULES = { EVERY_MINUTE: '* * * * *' };

  static stopAll(jobs: Record<string, { stop: VoidFunction }>) {
    Object.values(jobs).forEach(job => job.stop());
  }
}
