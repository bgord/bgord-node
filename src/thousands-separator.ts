export class ThousandsSeparator {
  private static DEFAULT_SEPARATOR = ' ';

  static format(
    value: number,
    separator = ThousandsSeparator.DEFAULT_SEPARATOR
  ): string {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  }
}
