import { Asset, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class AssetEntity implements Asset {
  id: string;

  name: string;

  images: string[];

  createdAt: Date;

  updatedAt: Date;

  @Exclude()
  userId: string;

  user: User;
}
