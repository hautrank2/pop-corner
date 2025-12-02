export type TableResponse<T> = {
  items: T[];
  pageSize: number;
  page: number;
  count: number;
};

export const TableResponseBase = {
  items: [],
  count: 0,
  pageSize: 0,
  page: 0,
};
