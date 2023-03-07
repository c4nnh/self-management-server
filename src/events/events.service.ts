import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as moment from 'moment-timezone';
import { PrismaService } from 'src/db/prisma.service';
import { GetEventsArgs } from './args/event.args';
import { CreateEventDto } from './dto/event.dto';
import { EventResponse } from './response/event.response';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  getMany = async (
    userId: string,
    args: GetEventsArgs,
  ): Promise<EventResponse[]> => {
    const { startDate, endDate } = args;

    return this.prisma.event.findMany({
      where: {
        userId,
        startDate: {
          gte: startDate,
        },
        endDate: {
          lte: endDate,
        },
      },
    });
  };

  create = async (userId: string, dto: CreateEventDto) => {
    const { startDate, endDate } = dto;

    if (!dto.startTime) {
      await this.prisma.event.create({
        data: {
          ...dto,
          userId,
        },
      });
      return true;
    }

    const data: Prisma.EventCreateManyInput[] = [];

    for (
      let date = moment(startDate);
      date.isBefore(moment(endDate));
      date.add(1, 'day')
    ) {
      data.push({
        ...dto,
        startDate: date.toDate(),
        endDate: date.toDate(),
        userId,
      });
    }

    await this.prisma.event.createMany({
      data,
    });

    return true;
  };
}
