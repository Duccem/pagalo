import { Uuid } from './value-objects/uuid';

export type DomainEventPrimitives<T> = {
  id: string | undefined;
  occurred_on: Date | undefined;
  name: string;
  aggregate: string;
  data: T;
};
export abstract class DomainEvent<T> {
  static EVENT_NAME: string;
  static fromPrimitives: <T>(params: any) => DomainEvent<T>;
  readonly id: string;
  readonly occurred_on: Date;
  readonly name: string;
  readonly data: T;
  readonly aggregate: string;

  constructor(event: DomainEventPrimitives<T>) {
    this.id = event.id || Uuid.random().value;
    this.occurred_on = event.occurred_on || new Date();
    this.name = event.name;
    this.data = event.data;
    this.aggregate = event.aggregate;
  }

  public abstract toPrimitive(): DomainEventPrimitives<T>;
  public abstract isPublic(): boolean;
}
export interface EventBus {
  publish<T>(events: Array<DomainEvent<T>>): Promise<void>;
}
