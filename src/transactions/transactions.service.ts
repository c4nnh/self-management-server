import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CurrenciesService } from '../currencies/currencies.service';
import { PrismaService } from '../db/prisma.service';
import { GetTransactionsArgs } from './args/transaction.args';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/transaction.dto';
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
    const {
      title,
      type,
      amountFrom,
      amountTo,
      dateFrom,
      dateTo,
      limit,
      offset,
      orderBy,
      orderDirection,
    } = args;

    const where: Prisma.TransactionWhereInput = {
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

    const order: Prisma.TransactionOrderByWithRelationInput = {};

    if (orderBy) {
      order[orderBy] = orderDirection || Prisma.SortOrder.desc;
    } else {
      order.date = Prisma.SortOrder.desc;
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

  update = async (
    userId: string,
    transactionId: string,
    dto: UpdateTransactionDto,
  ): Promise<TransactionResponse> => {
    const transaction = await this.checkExist(transactionId);

    if (transaction.userId !== userId) {
      throw new ForbiddenException('This transaction does not belong to you');
    }

    if (dto.currencyId && dto.currencyId !== transaction.currencyId) {
      await this.currenciesService.checkExist(dto.currencyId);
    }

    return this.prisma.transaction.update({
      where: { id: transactionId },
      data: dto,
      include: {
        currency: true,
      },
    });
  };

  delete = async (userId: string, transactionId: string) => {
    const transaction = await this.checkExist(transactionId);

    if (transaction.userId !== userId) {
      throw new ForbiddenException('This transaction does not belong to you');
    }

    await this.prisma.transaction.delete({
      where: { id: transactionId },
    });

    return true;
  };

  private checkExist = async (id: string) => {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
    });

    if (!transaction) {
      throw new NotFoundException('This transaction does not exist');
    }

    return transaction;
  };
}
