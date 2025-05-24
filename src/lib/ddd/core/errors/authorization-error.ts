import { DomainError } from '../domain-error';

export class AuthorizationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
