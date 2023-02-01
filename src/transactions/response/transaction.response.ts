import { OmitType } from '@nestjs/swagger';
import { PaginationResponse } from '../../utils';
import { TransactionEntity } from '../entities/transaction.entity';

export class TransactionResponse extends OmitType(TransactionEntity, [
  'user',
]) {}

export class PaginationTransactionResponse
  implements PaginationResponse<TransactionResponse>
{
  pagination: { totalItem: number; limit: number; offset: number };
  items: TransactionResponse[];
}
