import { PaginationResponse } from '../../utils';
import { CurrencyEntity } from '../entities/currency.entity';

export class PaginationCurrencyResponse
  implements PaginationResponse<CurrencyEntity>
{
  pagination: {
    totalItem: number;
    limit: number;
    offset: number;
    isPaged?: boolean;
  };
  items: CurrencyEntity[];
}
