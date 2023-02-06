import { Currency } from '@prisma/client';
import { UserResponse } from '../../users/respoonse/user.response';
import { Token } from '../entities/token.entity';

export class MeResponse extends UserResponse {
  currency?: Pick<Currency, 'id' | 'name'>;
}

export class ResgisterResponse {
  user: UserResponse;
  token: Token;
}

export class LoginResponse extends ResgisterResponse {}
