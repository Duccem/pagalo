import { FormatError } from '../errors/format-error';
import { NumberValueObject } from '../value-object';

export class Latitude extends NumberValueObject {
  public validation(value: number): void {
    super.validation(value);
    if (value > 90 && value < -90) {
      throw new FormatError('Latitude out of boundaries');
    }
  }
}
