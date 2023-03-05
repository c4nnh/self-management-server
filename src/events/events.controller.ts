import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateEventDto } from './dto/event.dto';
import { EventsService } from './events.service';

@Controller('events')
@UseGuards(AuthGuard)
@ApiTags('Event')
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly service: EventsService) {}

  @Post()
  createEvent(@Req() req, @Body() dto: CreateEventDto) {
    return this.service.create(req.user.id, dto);
  }
}
