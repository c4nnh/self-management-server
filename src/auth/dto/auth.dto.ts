import { User } from '@prisma/client';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Token } from '../entities/token.entity';

export class RegisterDto implements Pick<User, 'email' | 'name' | 'password'> {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/, {
    message:
      'Password must has at least 8-16 characters and contains digit, symbol, lower case and upper case characters',
  })
  password: string;

  @IsString()
  name: string;
}

export class LoginDto implements Pick<User, 'email' | 'password'> {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class RefreshTokenDto implements Pick<Token, 'refreshToken'> {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
