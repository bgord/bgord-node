import z from 'zod';

import { RoundingStrategy, RoundToNearest } from './rounding';

const MoneyAmount = z
  .number()
  .int({ message: 'money.amount.invalid ' })
  .min(0, { message: 'money.amount.invalid ' })
  .brand('money-amount');
type MoneyAmountType = z.infer<typeof MoneyAmount>;

export const MoneyMultiplicationFactor = z
  .number()
  .min(0, { message: 'money.multiplication-factor.invalid' })
  .brand('money-multiplication-factor');
type MoneyMultiplicationFactorType = z.infer<typeof MoneyMultiplicationFactor>;

export const MoneyDivisionFactor = z
  .number()
  .min(0, { message: 'money.division-factor.invalid' })
  .refine(value => value !== 0, { message: 'money.division-factor.invalid' })
  .brand('money-dividion-factor');
type MoneyDivisionFactorType = z.infer<typeof MoneyDivisionFactor>;

export class Money {
  private static readonly ZERO = 0;

  private readonly amount: MoneyAmountType;

  private readonly rounding: RoundingStrategy;

  constructor(value: number = Money.ZERO, rounding?: RoundingStrategy) {
    this.amount = MoneyAmount.parse(value);
    this.rounding = rounding ?? new RoundToNearest();
  }

  public getAmount(): MoneyAmountType {
    return this.amount;
  }

  public add(money: Money) {
    return new Money(MoneyAmount.parse(this.amount + money.getAmount()));
  }

  public multiply(factor: MoneyMultiplicationFactorType) {
    return new Money(MoneyAmount.parse(this.amount * factor));
  }

  public subtract(money: Money) {
    const result = this.amount - money.getAmount();

    if (result < Money.ZERO) {
      throw new Error('Less than zero');
    }

    return new Money(MoneyAmount.parse(result));
  }

  public divide(factor: MoneyDivisionFactorType) {
    if (factor === 0) {
      throw new Error('Cannot divide by zero');
    }

    return new Money(MoneyAmount.parse(this.amount / factor));
  }

  public equals(another: Money): boolean {
    return this.amount === another.getAmount();
  }

  public isGreaterThan(another: Money): boolean {
    return this.amount > another.getAmount();
  }

  public isLessThan(another: Money): boolean {
    return this.amount < another.getAmount();
  }

  public isZero(): boolean {
    return this.amount === Money.ZERO;
  }

  public toString(): string {
    return (this.amount / 100).toString();
  }
}
