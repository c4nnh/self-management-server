import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';
import { CreateCurrencyDto } from './dto/currency.dto';
import { CurrencyEntity } from './entities/currency.entity';

@Injectable()
export class CurrenciesService {
  constructor(private readonly prisma: PrismaService) {}

  getFirstCurrency = () => this.prisma.currency.findFirst();

  getAll = () =>
    this.prisma.currency.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });

  create = async (dto: CreateCurrencyDto): Promise<CurrencyEntity> => {
    const { name } = dto;
    const existedCurrency = await this.prisma.currency.findUnique({
      where: {
        name,
      },
    });
    if (existedCurrency) {
      throw new ConflictException('This currency already existed');
    }
    return this.prisma.currency.create({
      data: dto,
    });
  };

  delete = async (id: string) => {
    const currency = await this.prisma.currency.findUnique({
      where: { id },
    });
    if (!currency) {
      throw new NotFoundException('This currency does not exist');
    }

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
}
