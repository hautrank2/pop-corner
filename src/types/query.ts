export type TableResponse<T> = {
  items: T[];
  pageSize: number;
  page: number;
  total: number;
  totalPage: number;
};

export const TableResponseBase = {
  items: [],
  total: 0,
  totalPage: 0,
  pageSize: 0,
  page: 0,
};
