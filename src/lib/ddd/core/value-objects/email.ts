import { FormatError } from '../errors/format-error';
import { StringValueObject } from '../value-object';

export class Email extends StringValueObject {
  protected validation(value: string): void {
    super.validation(value);
    const rex = new RegExp(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if (rex.test(value)) return;
    else throw new FormatError('El email no tiene el formato correcto');
  }
}
