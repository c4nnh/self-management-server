import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CurrenciesService } from '../currencies/currencies.service';
import { PrismaService } from '../db/prisma.service';
import { GetTransactionsArgs } from './args/transaction.args';
import { CreateTransactionDto } from './dto/transaction.dto';
import {
  PaginationTransactionResponse,
  TransactionResponse,
} from './response/transaction.response';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currenciesService: CurrenciesService,
  ) {}

  getMany = async (
    userId: string,
    args: GetTransactionsArgs,
  ): Promise<PaginationTransactionResponse> => {
    const { title, type, from, to, limit, offset } = args;

    const where: Prisma.TransactionWhereInput = {
      userId,
      date: {
        gte: from,
        lte: to,
      },
    };

    if (title) {
      where.title = {
        contains: title,
        mode: 'insensitive',
      };
    }

    if (type) {
      where.type = {
        equals: type,
      };
    }

    const [totalItem, items] = await this.prisma.$transaction([
      this.prisma.transaction.count({
        where,
      }),
      this.prisma.transaction.findMany({
        where,
        take: limit,
        skip: offset,
        include: {
          currency: true,
        },
      }),
    ]);

    return {
      pagination: {
        limit,
        offset,
        totalItem,
      },
      items: items,
    };
  };

  create = async (
    userId: string,
    dto: CreateTransactionDto,
  ): Promise<TransactionResponse> => {
    await this.currenciesService.checkExist(dto.currencyId);

    return this.prisma.transaction.create({
      data: {
        ...dto,
        userId,
      },
      include: {
        currency: true,
      },
    });
  };
}
