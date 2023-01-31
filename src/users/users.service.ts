import { Injectable } from '@nestjs/common';
import { MeResponse } from '../auth/response/auth.response';
import { CurrenciesService } from '../currencies/currencies.service';
import { PrismaService } from '../db/prisma.service';
import { UpdateUserCurrencyDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currenciesService: CurrenciesService,
  ) {}

  updateUserCurrency = async (
    userId: string,
    dto: UpdateUserCurrencyDto,
  ): Promise<MeResponse> => {
    const { currencyId } = dto;
    await this.currenciesService.checkExist(currencyId);

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        currencyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        currency: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  };
}
