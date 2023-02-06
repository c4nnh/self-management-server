import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UserResponse extends PickType(UserEntity, [
  'id',
  'email',
  'role',
  'name',
  'image',
]) {}
