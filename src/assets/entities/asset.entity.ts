import { Asset, Currency, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class AssetEntity implements Asset {
  id: string;

  name: string;

  images: string[];

  price: number;

  boughtDate: Date;

  description: string;

  createdAt: Date;

  updatedAt: Date;

  @Exclude()
  userId: string;

  owner: User;

  @Exclude()
  currencyId: string;

  currency: Currency;
}
