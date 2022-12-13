import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  id: string;

  name: string;

  email: string;

  image: string | null;

  dob: Date | null;

  address: string | null;

  hometown: string | null;

  @Exclude()
  password: string;

  createdAt: Date;

  updatedAt: Date;
}
