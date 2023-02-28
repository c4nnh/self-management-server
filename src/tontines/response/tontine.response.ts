import { OmitType } from '@nestjs/swagger';
import { PaginationResponse } from 'src/utils';
import { TontineEntity } from '../entities/tontine.entity';

export class TontineResponse extends OmitType(TontineEntity, ['user']) {}

export class PaginationTontineResponse
  implements PaginationResponse<TontineResponse>
{
  pagination: {
    totalItem: number;
    limit: number;
    offset: number;
  };
  items: TontineResponse[];
}
