import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxDate,
} from 'class-validator';
import { UserEntity } from '../entities/user.entity';

export class UpdateUserDto
  implements Partial<Pick<UserEntity, 'name' | 'dob' | 'address' | 'hometown'>>
{
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsDate()
  @MaxDate(new Date(new Date().getFullYear() - 3, 0, 1))
  @IsOptional()
  dob?: Date;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  hometown?: string;
}

export class UpdateUserImageDto implements Pick<UserEntity, 'image'> {
  @IsString()
  @IsNotEmpty()
  image: string;
}

export class UpdateUserCurrencyDto implements Pick<UserEntity, 'currencyId'> {
  @IsString()
  @IsNotEmpty()
  currencyId: string;
}
