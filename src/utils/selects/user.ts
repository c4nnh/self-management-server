import { Prisma } from '@prisma/client';

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
    select: {
      id: true,
      name: true,
    },
  },
};
