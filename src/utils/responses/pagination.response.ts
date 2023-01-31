export class PaginationResponse<T> {
  totalItem: number;
  totalPage: number;
  items: T[];
}
