import { Prisma } from '@prisma/client';

export const CURRENCY_MASTER_DATA_SELECT: Prisma.CurrencySelect = {
  id: true,
  name: true,
  symbol: true,
  code: true,
};
