import { Injectable } from '@nestjs/common';
import { PrismaService } from '../db/prisma.service';

@Injectable()
export class CurrenciesService {
  constructor(private readonly prisma: PrismaService) {}

  getFirstCurrency = () => this.prisma.currency.findFirst();
}
