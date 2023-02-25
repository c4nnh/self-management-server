import { Currency } from '@prisma/client';

export class CurrencyEntity implements Currency {
  id: string;

  name: string;

  symbol: string;

  code: string;

  createdAt: Date;

  updatedAt: Date;
}
