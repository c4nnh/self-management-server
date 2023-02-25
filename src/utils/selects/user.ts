import { Prisma } from '@prisma/client';
import { CURRENCY_MASTER_DATA_SELECT } from './currency';

export const USER_DETAIL_SELECT: Prisma.UserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  image: true,
  dob: true,
  address: true,
  hometown: true,
  currency: {
    select: CURRENCY_MASTER_DATA_SELECT,
  },
};
