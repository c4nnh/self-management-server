import { Prisma } from '@prisma/client';

export const ASSET_DETAIL_SELECT: Required<
  Omit<Prisma.AssetSelect, 'owner' | 'userId'>
> = {
  id: true,
  name: true,
  images: true,
  createdAt: true,
  updatedAt: true,
};
