import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../db/prisma.service';
import { GetCurrenciesArgs } from './args/currency.args';
import { CreateCurrencyDto, UpdateCurrencyDto } from './dto/currency.dto';
import { CurrencyEntity } from './entities/currency.entity';
import { PaginationCurrencyResponse } from './responses/currency.response';

@Injectable()
export class CurrenciesService {
  constructor(private readonly prisma: PrismaService) {}

  getDetail = (id: string) => this.checkExist(id);

  getMany = async (
    args: GetCurrenciesArgs,
  ): Promise<PaginationCurrencyResponse> => {
    const { search, limit, offset, isPaged } = args;

    const where: Prisma.CurrencyWhereInput = {
      OR: [
        {
          name: {
            contains: search || '',
            mode: 'insensitive',
          },
        },
        {
          symbol: {
            contains: search || '',
            mode: 'insensitive',
          },
        },
        {
          code: {
            contains: search || '',
            mode: 'insensitive',
          },
        },
      ],
    };

    if (!isPaged) {
      const items = await this.prisma.currency.findMany({ where });
      return {
        pagination: {
          totalItem: items.length,
          limit,
          offset,
          isPaged,
        },
        items,
      };
    }

    const [totalItem, items] = await this.prisma.$transaction([
      this.prisma.currency.count({
        where,
      }),
      this.prisma.currency.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: {
          createdAt: 'asc',
        },
      }),
    ]);

    return {
      pagination: {
        totalItem,
        limit,
        offset,
      },
      items,
    };
  };

  create = async (dto: CreateCurrencyDto): Promise<CurrencyEntity> => {
    const { code } = dto;
    const existedCurrency = await this.prisma.currency.findUnique({
      where: {
        code,
      },
    });
    if (existedCurrency) {
      throw new ConflictException('This code already existed');
    }
    return this.prisma.currency.create({
      data: dto,
    });
  };

  update = async (
    id: string,
    dto: UpdateCurrencyDto,
  ): Promise<CurrencyEntity> => {
    const { name, symbol, code } = dto;

    const currency = await this.checkExist(id);
    // ignore update if new name, symbol and code equal to current name symbol and code
    if (
      currency.name === name &&
      currency.symbol === symbol &&
      currency.code === code
    ) {
      return currency;
    }

    const existedCurrency = await this.prisma.currency.findFirst({
      where: {
        code,
        NOT: {
          id,
        },
      },
    });

    if (existedCurrency) {
      throw new ConflictException('This currency already existed');
    }

    return this.prisma.currency.update({
      where: { id },
      data: dto,
    });
  };

  delete = async (id: string) => {
    await this.checkExist(id);

    const usedCurrency = await this.prisma.transaction.findFirst({
      where: {
        currencyId: id,
      },
    });
    if (usedCurrency) {
      throw new BadRequestException('This currency is in used');
    }

    await this.prisma.currency.delete({
      where: { id },
    });
    return true;
  };

  deleteMany = async (ids: string[]) => {
    const checkExistedTransaction = await this.prisma.transaction.findFirst({
      where: {
        currencyId: {
          in: ids,
        },
      },
    });
    if (checkExistedTransaction) {
      throw new BadRequestException('One of these currencies is in used');
    }

    await this.prisma.currency.deleteMany({
      where: { id: { in: ids } },
    });

    return true;
  };

  checkExist = async (id: string) => {
    const currency = await this.prisma.currency.findUnique({
      where: { id },
    });
    if (!currency) {
      throw new NotFoundException('This currency does not exist');
    }
    return currency;
  };
}
