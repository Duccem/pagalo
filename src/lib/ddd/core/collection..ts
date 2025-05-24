export type Meta = {
  total: number;
  page: number;
  size: number;
  pages: number;
};
export class Collection<T> {
  constructor(private items: T[] = [], private meta: Meta) {}

  getItems(): T[] {
    return this.items;
  }

  getMeta(): Meta {
    return this.meta;
  }

  static fromResponse<T>(response: { data: T[]; total: number; skip: number; take: number }): Collection<T> {
    return new Collection(response.data, Collection.buildPagination(response.total, response.take, response.skip));
  }

  static buildPagination(total: number, take: number, skip: number): Meta {
    return {
      total,
      page: (skip || 0) / (take || 10) + 1,
      size: take || 10,
      pages: Math.ceil(total / (take || 10)),
    };
  }
}
