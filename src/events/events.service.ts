import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { CreateEventDto } from './dto/event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  create = async (userId: string, dto: CreateEventDto) => {
    await this.prisma.event.create({
      data: {
        ...dto,
        startTime: '10:11:12',
        userId,
      },
    });
  };
}
