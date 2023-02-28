import { Prisma } from '@prisma/client';
import { CURRENCY_MASTER_DATA_SELECT } from './currency';

export const ASSET_DETAIL_SELECT: Required<
  Omit<Prisma.AssetSelect, 'owner' | 'userId' | 'currencyId'>
> = {
  id: true,
  name: true,
  price: true,
  boughtDate: true,
  description: true,
  images: true,
  createdAt: true,
  updatedAt: true,
  currency: {
    select: CURRENCY_MASTER_DATA_SELECT,
  },
};
