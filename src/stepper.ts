type StepType = number;

type StepperConfigType = { total: StepType };

export class Stepper {
  private current: StepType = 1;

  private total: StepType;

  constructor(config: StepperConfigType) {
    if (!Number.isInteger(config.total)) {
      throw new Error('Total value is not an integer');
    }

    if (config.total <= 1) {
      throw new Error('Total value should be greater than one');
    }

    this.total = config.total;
  }

  public continue() {
    if (this.isFinished()) {
      throw new Error('Stepper is finished');
    }

    this.current = this.current + 1;
  }

  public read() {
    return {
      finished: this.isFinished(),
      raw: { current: this.current, total: this.total },
      formatted: `${this.current}/${this.total}`,
    };
  }

  public isFinished(): boolean {
    return this.current === this.total;
  }
}
