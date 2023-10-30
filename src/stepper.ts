type StepType = number;

type StepperConfigType = { total: StepType };

export class Stepper {
  static DEFAULT_CURRENT = 1;

  private current: StepType = Stepper.DEFAULT_CURRENT;

  private total: StepType;

  constructor(config: StepperConfigType) {
    if (!Number.isInteger(config.total)) {
      throw new Error('Total value is not an integer');
    }

    if (config.total <= Stepper.DEFAULT_CURRENT) {
      throw new Error('Total value should be greater than one');
    }

    this.total = config.total;
  }

  public continue(): Stepper {
    this.current = Math.min(this.current + 1, this.total);

    return this;
  }

  public read() {
    return {
      finished: this.isFinished(),
      raw: { current: this.current, total: this.total },
      formatted: `${this.current}/${this.total}`,
    };
  }

  public reset(): Stepper {
    this.current = Stepper.DEFAULT_CURRENT;
    return this;
  }

  public format(): string {
    return this.read().formatted;
  }

  public isFinished(): boolean {
    return this.current === this.total;
  }
}
