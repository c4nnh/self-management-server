import { PaginationResponse } from '../../utils';
import { CurrencyEntity } from '../entities/currency.entity';

export class PaginationCurrencyResponse
  implements PaginationResponse<CurrencyEntity>
{
  totalItem: number;
  totalPage: number;
  items: CurrencyEntity[];
}
