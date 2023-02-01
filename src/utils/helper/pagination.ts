import { PaginationResponse } from '../types';

export const formatPaginationResponse = <T>({
  totalItem,
  limit,
  items,
}: {
  totalItem: number;
  limit: number;
  items: T[];
}): PaginationResponse<T> => {
  return {
    totalItem,
    totalPage: Math.ceil(totalItem / limit),
    items,
  };
};
