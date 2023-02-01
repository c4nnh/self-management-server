import { OmitType } from '@nestjs/swagger';
import { PaginationResponse } from '../../utils';
import { AssetEntity } from '../entities/asset.entity';

export class AssetResponse extends OmitType(AssetEntity, ['user']) {}

export class PaginationAssetResponse
  implements PaginationResponse<AssetResponse>
{
  pagination: { totalItem: number; limit: number; offset: number };
  items: AssetResponse[];
}
