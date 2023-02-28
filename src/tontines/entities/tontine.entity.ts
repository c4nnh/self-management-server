import { Currency, Tontine, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class TontineEntity implements Tontine {
  id: string;

  amount: number;

  date: Date;

  description: string;

  createdAt: Date;

  updatedAt: Date;

  @Exclude()
  userId: string;

  user: User;

  @Exclude()
  currencyId: string;

  currency: Currency;
}
