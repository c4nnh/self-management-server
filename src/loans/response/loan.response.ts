import { OmitType } from '@nestjs/swagger';
import { PaginationResponse } from 'src/utils';
import { LoanEntity } from '../entities/loan.entity';

export class LoanResponse extends OmitType(LoanEntity, ['user']) {}

export class PaginationLoanResponse
  implements PaginationResponse<LoanResponse>
{
  pagination: {
    totalItem: number;
    limit: number;
    offset: number;
  };
  items: LoanResponse[];
}
