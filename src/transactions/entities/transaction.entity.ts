import { Currency, Transaction, User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { type TransactionType } from '@prisma/client';

export class TransactionEntity implements Transaction {
  id: string;

  title: string;

  description: string;

  type: TransactionType;

  amount: number;

  date: Date;

  createdAt: Date;

  updatedAt: Date;

  @Exclude()
  currencyId: string;

  currency: Currency;

  @Exclude()
  userId: string;

  user: User;
}
