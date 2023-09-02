type ApproximationValueType = number;
type ApproximationResultType = number;
type ApproximationDecimalPlacesType = number;

export class Approximation {
  static float(
    value: ApproximationValueType,
    decimalPlaces: ApproximationDecimalPlacesType = 2
  ): ApproximationResultType {
    return parseFloat(value.toFixed(decimalPlaces));
  }
}
