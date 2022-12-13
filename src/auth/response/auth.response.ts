import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity';
import { Token } from '../entities/token.entity';

export class MeResponse extends PickType(UserEntity, [
  'id',
  'email',
  'name',
  'image',
]) {}

export class ResgisterResponse {
  user: MeResponse;
  token: Token;
}

export class LoginResponse extends ResgisterResponse {}
