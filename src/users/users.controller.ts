import { Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateUserCurrencyDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Put('update-currency')
  updateUserCurrency(@Req() request, @Body() dto: UpdateUserCurrencyDto) {
    return this.service.updateUserCurrency(request.user.id, dto);
  }
}
