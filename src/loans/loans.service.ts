import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { GetLoansArgs } from './args/loan.args';
import { CreateLoanDto, UpdateLoanDto } from './dto/loan.dto';
import { LoanResponse, PaginationLoanResponse } from './response/loan.response';

@Injectable()
export class LoansService {
  constructor(private readonly prisma: PrismaService) {}

  getDetail = (userId: string, id: string) => this.checkExist(id);

  getMany = async (
    userId: string,
    args: GetLoansArgs,
  ): Promise<PaginationLoanResponse> => {
    return {
      pagination: {
        totalItem: 0,
        limit: 10,
        offset: 0,
      },
      items: [],
    };
  };

  create = async (
    userId: string,
    dto: CreateLoanDto,
  ): Promise<LoanResponse> => {
    return null;
  };

  update = async (
    userId: string,
    loanId: string,
    dto: UpdateLoanDto,
  ): Promise<LoanResponse> => {
    return null;
  };

  delete = async (userId: string, loanId: string) => {
    return true;
  };

  deleteMany = async (userId: string, loanIds: string[]) => {
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
