import { Currency } from '@prisma/client';

export class CurrencyEntity implements Currency {
  id: string;

  name: string;

  createdAt: Date;

  updatedAt: Date;
}
