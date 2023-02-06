import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import {
  UpdateUserCurrencyDto,
  UpdateUserDto,
  UpdateUserImageDto,
} from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
@ApiTags('User')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Put('update-avatar')
  updateAvatar(@Req() request, @Body() dto: UpdateUserImageDto) {
    return this.service.updateAvatar(request.user.id, dto);
  }

  @Put()
  update(@Req() request, @Body() dto: UpdateUserDto) {
    return this.service.update(request.user.id, dto);
  }

  @Put('update-currency')
  updateUserCurrency(@Req() request, @Body() dto: UpdateUserCurrencyDto) {
    return this.service.updateUserCurrency(request.user.id, dto);
  }
}
