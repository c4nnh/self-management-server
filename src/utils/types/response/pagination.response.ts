export class PaginationResponse<T> {
  pagination: {
    totalItem: number;
    limit: number;
    offset: number;
  };
  items: T[];
}
