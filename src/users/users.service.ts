import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MeResponse } from '../auth/response/auth.response';
import { CurrenciesService } from '../currencies/currencies.service';
import { PrismaService } from '../db/prisma.service';
import { EVENT_EMITTER, IMAGE_FOLDER, USER_DETAIL_SELECT } from '../utils';
import {
  UpdateUserCurrencyDto,
  UpdateUserDto,
  UpdateUserImageDto,
} from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currenciesService: CurrenciesService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  update = async (id: string, dto: UpdateUserDto) => {
    const user = await this.checkExist(id);

    await this.prisma.user.update({
      where: { id },
      data: dto,
    });

    return {
      ...user,
      ...dto,
    };
  };

  updateAvatar = async (id: string, dto: UpdateUserImageDto) => {
    const user = await this.checkExist(id);

    const { image } = dto;
    if (user.image === image) return user;

    await this.prisma.user.update({
      where: { id },
      data: { image },
    });

    this.eventEmitter.emit(EVENT_EMITTER.DELETE_IMAGES, {
      urls: [user.image],
      folder: IMAGE_FOLDER.USER_AVATAR,
    });

    return {
      ...user,
      image,
    };
  };

  updateUserCurrency = async (
    userId: string,
    dto: UpdateUserCurrencyDto,
  ): Promise<MeResponse> => {
    const { currencyId } = dto;
    await this.currenciesService.checkExist(currencyId);

    const user = await this.checkExist(userId);

    const updatedUser = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        currencyId,
      },
      select: USER_DETAIL_SELECT,
    });

    return {
      ...user,
      ...updatedUser,
    };
  };

  checkExist = async (id: string) => {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: USER_DETAIL_SELECT,
    });

    if (!user) throw new NotFoundException('Your account does not exist');

    return user as MeResponse;
  };
}
