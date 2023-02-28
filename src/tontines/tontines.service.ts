import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CurrenciesService } from 'src/currencies/currencies.service';
import { PrismaService } from 'src/db/prisma.service';
import { GetTontinesArgs } from './args/tontine.args';
import { CreateTontineDto, UpdateTontineDto } from './dto/tontine.dto';
import {
  PaginationTontineResponse,
  TontineResponse,
} from './response/tontine.response';

@Injectable()
export class TontinesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currenciesService: CurrenciesService,
  ) {}

  getDetail = async (userId: string, id: string) => {
    const tontine = await this.checkExist(id);
    if (tontine.userId !== userId) {
      throw new ForbiddenException('This tontine does not belong to you');
    }
    return tontine;
  };

  create = async (
    userId: string,
    dto: CreateTontineDto,
  ): Promise<TontineResponse> => {
    await this.currenciesService.checkExist(dto.currencyId);

    return this.prisma.tontine.create({
      data: {
        ...dto,
        userId,
      },
      include: {
        currency: true,
      },
    });
  };

  getMany = async (
    userId: string,
    args: GetTontinesArgs,
  ): Promise<PaginationTontineResponse> => {
    const {
      description,
      amountFrom,
      amountTo,
      dateFrom,
      dateTo,
      limit,
      offset,
      orderBy,
      orderDirection,
    } = args;

    const where: Prisma.TontineWhereInput = {
      userId,
      date: {
        gte: dateFrom,
        lte: dateTo,
      },
      amount: {
        gte: amountFrom,
      },
    };

    if (amountTo) {
      (where.amount as Prisma.FloatFilter).lte = amountTo;
    }

    if (description) {
      where.description = {
        contains: description,
        mode: 'insensitive',
      };
    }

    const order: Prisma.TontineOrderByWithRelationInput = {};

    if (orderBy) {
      order[orderBy] = orderDirection || Prisma.SortOrder.desc;
    } else {
      order.date === Prisma.SortOrder.desc;
    }

    const [totalItem, items] = await this.prisma.$transaction([
      this.prisma.tontine.count({
        where,
      }),
      this.prisma.tontine.findMany({
        where,
        take: limit,
        skip: offset,
        include: {
          currency: true,
        },
        orderBy: order,
      }),
    ]);

    return {
      pagination: {
        limit,
        offset,
        totalItem,
      },
      items,
    };
  };

  update = async (
    userId: string,
    tontineId: string,
    dto: UpdateTontineDto,
  ): Promise<TontineResponse> => {
    const tontine = await this.getDetail(userId, tontineId);

    if (dto.currencyId && dto.currencyId !== tontine.currencyId) {
      await this.currenciesService.checkExist(dto.currencyId);
    }

    return this.prisma.tontine.update({
      where: { id: tontineId },
      data: {
        ...dto,
        userId,
      },
      include: {
        currency: true,
      },
    });
  };

  delete = async (userId: string, tontineId: string) => {
    await this.getDetail(userId, tontineId);

    await this.prisma.tontine.delete({
      where: { id: tontineId },
    });

    return true;
  };

  deleteMany = async (userId: string, tontineIds: string[]) => {
    await this.prisma.tontine.deleteMany({
      where: {
        userId,
        id: {
          in: tontineIds,
        },
      },
    });

    return true;
  };

  private checkExist = async (id: string) => {
    const tontine = await this.prisma.tontine.findUnique({
      where: { id },
      include: {
        currency: true,
      },
    });
    if (!tontine) {
      throw new NotFoundException('This tontine does not exist');
    }
    return tontine;
  };
}
