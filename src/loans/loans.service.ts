import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CurrenciesService } from 'src/currencies/currencies.service';
import { PrismaService } from 'src/db/prisma.service';
import { GetLoansArgs } from './args/loan.args';
import { CreateLoanDto, UpdateLoanDto } from './dto/loan.dto';
import { LoanResponse, PaginationLoanResponse } from './response/loan.response';

@Injectable()
export class LoansService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly currenciesService: CurrenciesService,
  ) {}

  getDetail = async (userId: string, id: string) => {
    const loan = await this.checkExist(id);
    if (loan.userId === userId) {
      throw new ForbiddenException('This loan does not belong to you');
    }
    return loan;
  };

  getMany = async (
    userId: string,
    args: GetLoansArgs,
  ): Promise<PaginationLoanResponse> => {
    const {
      search,
      amountFrom,
      amountTo,
      dateFrom,
      dateTo,
      limit,
      offset,
      orderBy,
      orderDirection,
    } = args;

    const where: Prisma.LoanWhereInput = {
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

    if (search) {
      where.OR = [
        {
          debtor: {
            contains: search,
            mode: 'insensitive',
          },
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const order: Prisma.LoanOrderByWithRelationInput = {};

    if (orderBy) {
      order[orderBy] = orderDirection || Prisma.SortOrder.desc;
    } else {
      order.date === Prisma.SortOrder.desc;
    }

    const [totalItem, items] = await this.prisma.$transaction([
      this.prisma.loan.count({
        where,
      }),
      this.prisma.loan.findMany({
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
    dto: CreateLoanDto,
  ): Promise<LoanResponse> => {
    await this.currenciesService.checkExist(dto.currencyId);

    return this.prisma.loan.create({
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
    loanId: string,
    dto: UpdateLoanDto,
  ): Promise<LoanResponse> => {
    const loan = await this.getDetail(userId, loanId);

    if (dto.currencyId && dto.currencyId !== loan.currencyId) {
      await this.currenciesService.checkExist(dto.currencyId);
    }

    return this.prisma.loan.update({
      where: { id: loanId },
      data: {
        ...dto,
        userId,
      },
      include: {
        currency: true,
      },
    });
  };

  delete = async (userId: string, loanId: string) => {
    await this.getDetail(userId, loanId);

    await this.prisma.loan.delete({
      where: { id: loanId },
    });

    return true;
  };

  deleteMany = async (userId: string, loanIds: string[]) => {
    await this.prisma.loan.deleteMany({
      where: {
        userId,
        id: {
          in: loanIds,
        },
      },
    });

    return true;
  };

  private checkExist = async (id: string) => {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
    });
    if (!loan) {
      throw new NotFoundException('This loan does not exist');
    }
    return loan;
  };
}
