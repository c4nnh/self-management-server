import { UserEntity } from '../entities/user.entity';

export class CreateUserDto
  implements Pick<UserEntity, 'email' | 'name' | 'password'>
{
  email: string;

  name: string;

  password: string;
}
