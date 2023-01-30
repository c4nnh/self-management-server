import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity';
import { Token } from '../entities/token.entity';

export class UserResponse extends PickType(UserEntity, [
  'id',
  'email',
  'name',
  'image',
]) {}

export class MeResponse extends UserResponse {
  currency: string;
}

export class ResgisterResponse {
  user: UserResponse;
  token: Token;
}

export class LoginResponse extends ResgisterResponse {}
