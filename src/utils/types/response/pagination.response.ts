export class PaginationResponse<T> {
  pagination: {
    totalItem: number;
    limit: number;
    offset: number;
    isPaged?: boolean;
  };
  items: T[];
}
