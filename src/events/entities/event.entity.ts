import { Event, EventPriority, EventStatus, User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class EventEntity implements Event {
  id: string;

  title: string;

  description: string;

  startDate: Date;

  endDate: Date;

  startTime: string;

  endTime: string;

  priority: EventPriority;

  status: EventStatus;

  groupId: string;

  createdAt: Date;

  updatedAt: Date;

  @Exclude()
  userId: string;

  user: User;
}
