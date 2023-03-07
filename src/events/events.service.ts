import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventStatus, Prisma } from '@prisma/client';
import * as moment from 'moment-timezone';
import { PrismaService } from 'src/db/prisma.service';
import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT } from 'src/utils';
import { v4 as uuidv4 } from 'uuid';
import { GetEventsArgs } from './args/event.args';
import {
  CreateEventDto,
  UpdateEventDto,
  UpdateEventGroupDto,
} from './dto/event.dto';
import { EventResponse } from './response/event.response';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  getOne = async (userId: string, eventId: string) => {
    const event = await this.checkExist(eventId);

    if (event.userId !== userId) {
      throw new ForbiddenException('This event does not belong to you');
    }

    return event;
  };

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

  getGroup = async (userId: string, groupId: string) => {
    const groups = await this.prisma.event.groupBy({
      by: ['groupId', 'title', 'description', 'priority', 'status', 'userId'],
      where: { groupId },
      _max: {
        endDate: true,
        endTime: true,
      },
      _min: {
        startDate: true,
        startTime: true,
      },
    });

    if (!groups.length) {
      throw new NotFoundException('This group of events does not exist');
    }

    const group = groups[0];

    if (group.userId !== userId) {
      throw new ForbiddenException(
        'This group of events does not belong to you',
      );
    }

    const { _max, _min, ...rest } = group;

    return {
      ...rest,
      ..._min,
      ..._max,
    };
  };

  create = async (userId: string, dto: CreateEventDto) => {
    const { startDate, endDate } = dto;

    if (
      !dto.startTime ||
      !dto.endTime ||
      moment(startDate, DEFAULT_DATE_FORMAT).isSame(
        moment(startDate, DEFAULT_DATE_FORMAT),
      )
    ) {
      await this.prisma.event.create({
        data: {
          ...dto,
          userId,
        },
      });
      return true;
    }

    const data: Prisma.EventCreateManyInput[] = [];
    const groupId = uuidv4();

    for (
      let date = moment(startDate).endOf('day');
      date.isSameOrBefore(moment(endDate).endOf('day'));
      date.add(1, 'day')
    ) {
      data.push({
        ...dto,
        startDate: date.toDate(),
        endDate: date.toDate(),
        groupId,
        userId,
      });
    }

    await this.prisma.event.createMany({
      data,
    });

    return true;
  };

  updateGroup = async (
    userId: string,
    groupId: string,
    dto: UpdateEventGroupDto,
  ) => {
    // check exist and permission
    const group = await this.getGroup(userId, groupId);
    if (dto.removeTime) {
      await this.prisma.$transaction([
        this.prisma.event.deleteMany({ where: { groupId } }),
        this.prisma.event.create({
          data: {
            ...group,
            ...dto,
            groupId: null,
            startTime: null,
            endTime: null,
          },
        }),
      ]);
      return true;
    }

    // validate date
    const startDate = moment(dto.startDate || group.startDate).endOf('day');
    const endDate = moment(dto.endDate || group.endDate).endOf('day');
    if (dto.startDate || dto.endDate) {
      if (endDate.isBefore(startDate)) {
        throw new BadRequestException('End date must be after start date');
      }
    }
    const startTime = moment(
      dto.startTime || group.startTime,
      DEFAULT_TIME_FORMAT,
    );
    const endTime = moment(dto.endTime || group.endTime, DEFAULT_TIME_FORMAT);
    if (dto.startTime || dto.endTime) {
      if (!startTime || !endTime) {
        throw new BadRequestException(
          'Start time and end time must appear together',
        );
      }
      if (endTime.isSameOrBefore(startTime)) {
        throw new BadRequestException('End time must be after start time');
      }
    }
    const events = await this.prisma.event.findMany({ where: { groupId } });
    const newEventsData: Prisma.EventCreateManyInput[] = [];

    // before old start date
    for (
      let date = moment(startDate).endOf('day');
      date.isBefore(moment(group.startDate).endOf('day'));
      date.add(1, 'day')
    ) {
      newEventsData.push({
        ...group,
        ...dto,
        startDate: date.toDate(),
        endDate: date.toDate(),
        groupId,
        userId,
      });
    }
    // after old end date
    for (
      let date = moment(group.endDate).add(1, 'day').endOf('day');
      date.isSameOrBefore(moment(endDate).endOf('day'));
      date.add(1, 'day')
    ) {
      newEventsData.push({
        ...group,
        ...dto,
        startDate: date.toDate(),
        endDate: date.toDate(),
        groupId,
        userId,
      });
    }
    // execute existed events
    // outside old date range
    // betweed old start date and old end date
    const deleteEventIds: string[] = [];
    events.forEach((event) => {
      const start = moment(event.startDate).endOf('day');
      const end = moment(event.endDate).endOf('day');

      if (end.isBefore(startDate) || start.isAfter(endDate)) {
        deleteEventIds.push(event.id);
      }
    });
    const { title, description, priority, status } = dto;

    await this.prisma.$transaction([
      this.prisma.event.updateMany({
        where: {
          groupId,
        },
        data: {
          title,
          description,
          priority,
          status,
        },
      }),
      this.prisma.event.createMany({ data: newEventsData }),
      this.prisma.event.deleteMany({ where: { id: { in: deleteEventIds } } }),
    ]);

    return {
      deleteEventIds,
      newEventsData,
    };
  };

  update = async (
    userId: string,
    eventId: string,
    { removeTime, ...dto }: UpdateEventDto,
  ) => {
    const event = await this.getOne(userId, eventId);

    // check if there is new start date or end date
    const startDate = moment(dto.startDate || event.startDate).endOf('day');
    const endDate = moment(dto.endDate || event.endDate).endOf('day');

    if (dto.startDate || dto.endDate) {
      if (endDate.isBefore(startDate)) {
        throw new BadRequestException('End date must be after start date');
      }
    }

    // check if there is new start time or end time
    if (!removeTime && (dto.startTime || dto.endTime)) {
      // check start time and end time must appear together in dto if event has no time
      if (
        (!event.startTime || !event.endTime) &&
        (!dto.startTime || !dto.endTime)
      ) {
        throw new BadRequestException(
          'Start time and end time must appear together',
        );
      }
      const start = moment(
        dto.startTime || event.startTime,
        DEFAULT_TIME_FORMAT,
      );
      const end = moment(dto.endTime || event.endTime, DEFAULT_TIME_FORMAT);

      if (!end.isSameOrAfter(start)) {
        throw new BadRequestException('End time must be after start time');
      }
    }

    // Update time of all day or one day event
    // change time (not remove)
    if ((dto.startTime || dto.endTime) && !removeTime) {
      if (startDate.isSame(endDate)) {
        await this.prisma.event.update({
          where: { id: eventId },
          data: {
            ...event,
            ...dto,
            startDate: startDate.toDate(),
            endDate: endDate.toDate(),
            groupId: null,
          },
        });

        return true;
      }

      const data: Prisma.EventCreateManyInput[] = [];
      const groupId = uuidv4();

      for (
        let date = moment(startDate, DEFAULT_DATE_FORMAT).endOf('day');
        date.isSameOrBefore(moment(endDate, DEFAULT_DATE_FORMAT).endOf('day'));
        date.add(1, 'day')
      ) {
        delete event.id;

        const startTime = moment(
          dto.startTime || event.startTime,
          DEFAULT_TIME_FORMAT,
        );

        const endTime = moment(
          dto.endTime || event.endTime,
          DEFAULT_TIME_FORMAT,
        );

        data.push({
          ...event,
          ...dto,
          startDate: date.toDate(),
          endDate: date.toDate(),
          groupId,
          userId,
          status: this.getStatusByDateAndTime(endDate, startTime, endTime),
        });
      }

      await this.prisma.$transaction([
        this.prisma.event.createMany({ data }),
        this.prisma.event.delete({ where: { id: eventId } }),
      ]);

      return true;
    }

    // remove time
    const data = {
      ...event,
      ...dto,
      ...(removeTime ? { startTime: null, endTime: null } : {}),
    };

    const isChangeDate =
      !moment(event.startDate).isSame(data.startDate, 'date') ||
      !moment(event.endDate).isSame(data.endDate, 'date');

    await this.prisma.event.update({
      where: { id: eventId },
      data: {
        ...data,
        groupId:
          JSON.stringify(event) !== JSON.stringify(data) && isChangeDate
            ? null
            : event.groupId,
      },
    });

    return true;
  };

  delete = async (userId: string, eventId: string) => {
    await this.getOne(userId, eventId);

    await this.prisma.event.delete({
      where: { id: eventId },
    });

    return true;
  };

  deleteGroup = async (userId: string, groupId: string) => {
    const event = await this.prisma.event.findFirst({
      where: { groupId },
    });

    if (!event) {
      throw new NotFoundException('This group of events does not exist');
    }

    if (event.userId !== userId) {
      throw new ForbiddenException(
        'This group of events does not belong to you',
      );
    }

    await this.prisma.event.deleteMany({
      where: { groupId },
    });

    return true;
  };

  private checkExist = async (id: string) => {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException('This event does not exist');
    }

    return event;
  };

  private getStatusByDateAndTime = (
    endDate: moment.Moment,
    endTime: moment.Moment,
    startTime: moment.Moment,
  ) => {
    const currentDate = moment(new Date(), DEFAULT_DATE_FORMAT).tz(
      process.env.TZ,
    );
    const currentTime = moment(new Date(), DEFAULT_TIME_FORMAT).tz(
      process.env.TZ,
    );

    if (endDate.isBefore(currentDate)) {
      return EventStatus.DONE;
    }

    if (endDate.isAfter(currentDate)) {
      return EventStatus.UPCOMING;
    }

    if (endDate.isSame(currentDate) && !endTime) {
      return EventStatus.IN_PROGRESS;
    }

    if (
      currentTime.isSameOrAfter(startTime) &&
      currentTime.isSameOrBefore(endTime)
    ) {
      return EventStatus.IN_PROGRESS;
    }

    if (endTime.add(30, 'seconds').isBefore(currentTime)) {
      return EventStatus.DONE;
    }

    return EventStatus.UPCOMING;
  };
}
