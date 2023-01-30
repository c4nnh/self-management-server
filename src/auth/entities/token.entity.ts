import { Role } from '@prisma/client';

export class Token {
  accessToken: string;
  refreshToken: string;
}

export class TokenPayload {
  userId: string;
  role: Role;
}
