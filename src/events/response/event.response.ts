import { OmitType } from '@nestjs/swagger';
import { EventEntity } from '../entities/event.entity';

export class EventResponse extends OmitType(EventEntity, ['user']) {}
