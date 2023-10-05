import z from 'zod';

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

export class Money {
  private static readonly ZERO = 0;

  private readonly amount: MoneyAmountType;

  constructor(value: number = Money.ZERO) {
    this.amount = MoneyAmount.parse(value);
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

  public equals(another: Money): boolean {
    return this.amount === another.getAmount();
  }

  public toString(): string {
    return (this.amount / 100).toString();
  }

  public isGreaterThan(another: Money): boolean {
    return this.amount > another.getAmount();
  }

  public isLessThan(another: Money): boolean {
    return this.amount < another.getAmount();
  }
}
