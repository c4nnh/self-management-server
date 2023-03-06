import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetEventsArgs } from './args/event.args';
import { CreateEventDto } from './dto/event.dto';
import { EventsService } from './events.service';

@Controller('events')
@UseGuards(AuthGuard)
@ApiTags('Event')
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly service: EventsService) {}

  @Get()
  getEvents(@Req() req, @Query() args: GetEventsArgs) {
    return this.service.getMany(req.user.id, args);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateEventDto) {
    return this.service.create(req.user.id, dto);
  }
}
