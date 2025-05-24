import { v4, validate } from 'uuid';
import { FormatError } from '../errors/format-error';
import { StringValueObject } from '../value-object';

export class Uuid extends StringValueObject {
  constructor(value: string) {
    super(value);
  }
  public static random(): Uuid {
    return new Uuid(v4());
  }

  public static validateID(id: string): boolean {
    if (!validate(id)) return false;
    return true;
  }

  protected validation(id: string): void {
    super.validation(id);
    if (!validate(id)) {
      throw new FormatError(`<${Uuid.name}> does not allow the value <${id}>`);
    }
  }

  public toString(): string {
    return this.value.toString();
  }
}
