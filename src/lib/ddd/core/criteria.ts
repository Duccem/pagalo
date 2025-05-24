export enum Operator {
  EQUAL = '=',
  NOT_EQUAL = '!=',
  GT = '>',
  LT = '<',
  GTE = '>=',
  LTE = '<=',
  CONTAINS = 'CONTAINS',
  NOT_CONTAINS = 'NOT_CONTAINS',
  IN = 'IN',
  NOT_IN = 'NOT_IN',
  BETWEEN = 'BETWEEN',
  NOT_BETWEEN = 'NOT_BETWEEN',
}
export enum Direction {
  ASC = 'ASC',
  DESC = 'DESC',
}
export enum FilterType {
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
}
export type Filter = { field: string; value: any; operator: Operator };
export type Filters = { filters: (Filter | Filters)[]; type: FilterType };
export type Order = { field: string; order: Direction };
export type Pagination = { limit: number; offset: number };
export type Include = { field: string; criteria?: Criteria };

export function isAsc(direction: Direction): boolean {
  return direction === Direction.ASC;
}

export function isFilter(filter: any): filter is Filter {
  return filter.field && filter.value && filter.operator;
}

export interface CriteriaConverter {
  criteria(criteria: Criteria): any;
}
export class Criteria {
  protected filters: Filters;
  protected order?: Order;
  protected pagination?: Pagination;
  protected includes: Include[] = [];

  constructor(filters?: Filters, order?: Order, pagination?: Pagination, includes?: Include[]) {
    this.filters = filters || { filters: [], type: FilterType.AND };
    this.order = order;
    this.pagination = pagination;
    this.includes = includes || [];
  }
  hasFilter(): boolean {
    return this.filters.filters.length > 0;
  }
  hasOrder(): boolean {
    return !!this.order;
  }
  hasPagination(): boolean {
    return !!this.pagination;
  }
  getFilters(): Filters {
    return this.filters;
  }
  getOrder(): Order | undefined {
    return this.order;
  }
  getPagination(): Pagination | undefined {
    return this.pagination;
  }

  getIncludes(): Include[] {
    return this.includes;
  }

  where(filters: Filter[]): Criteria {
    this.filters = { filters, type: FilterType.AND };
    return this;
  }

  and(criteria: Criteria): Criteria {
    this.filters = { filters: [this.filters, criteria.filters], type: FilterType.AND };
    return this;
  }

  or(criteria: Criteria): Criteria {
    this.filters = { filters: [this.filters, criteria.filters], type: FilterType.OR };
    return this;
  }

  not(criteria: Criteria): Criteria {
    this.filters = { filters: [this.filters, criteria.filters], type: FilterType.NOT };
    return this;
  }

  orderBy(field: string, order: Direction): Criteria {
    this.order = { field, order };
    return this;
  }

  limit(limit: number): Criteria {
    this.pagination = this.hasPagination() ? { ...this.pagination!, limit } : { limit, offset: 0 };
    return this;
  }

  offset(offset: number): Criteria {
    this.pagination = this.hasPagination() ? { ...this.pagination!, offset } : { limit: 50, offset };
    return this;
  }

  paginate(limit: number, offset: number): Criteria {
    this.pagination = { limit, offset };
    return this;
  }

  static fromValues(filters: Filter[], order?: Order, pagination?: Pagination, include?: Include[]): Criteria {
    return new Criteria({ filters, type: FilterType.AND }, order, pagination, include);
  }

  static empty(): Criteria {
    return new Criteria();
  }
}
