import { Currency, Loan, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class LoanEntity implements Loan {
  id: string;

  debtor: string;

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
