import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetEventsArgs } from './args/event.args';
import {
  CreateEventDto,
  UpdateEventDto,
  UpdateEventGroupDto,
} from './dto/event.dto';
import { EventsService } from './events.service';

@Controller('events')
@UseGuards(AuthGuard)
@ApiTags('Event')
@ApiBearerAuth()
export class EventsController {
  constructor(private readonly service: EventsService) {}

  @Get(':id')
  getOne(@Req() req, @Param('id') id: string) {
    return this.service.getOne(req.user.id, id);
  }

  @Get()
  getMany(@Req() req, @Query() args: GetEventsArgs) {
    return this.service.getMany(req.user.id, args);
  }

  @Post()
  create(@Req() req, @Body() dto: CreateEventDto) {
    return this.service.create(req.user.id, dto);
  }

  @Put(':id')
  update(
    @Req() req,
    @Param('id') eventId: string,
    @Body() dto: UpdateEventDto,
  ) {
    return this.service.update(req.user.id, eventId, dto);
  }

  @Delete(':id')
  delete(@Req() request, @Param('id') id: string) {
    return this.service.delete(request.user.id, id);
  }

  @Get('group/:id')
  getGroup(@Req() req, @Param('id') id: string) {
    return this.service.getGroup(req.user.id, id);
  }

  @Put('group/:id')
  updateGroup(
    @Req() req,
    @Param('id') eventId: string,
    @Body() dto: UpdateEventGroupDto,
  ) {
    return this.service.updateGroup(req.user.id, eventId, dto);
  }

  @Delete('group/:id')
  deleteGroup(@Req() request, @Param('id') id: string) {
    return this.service.deleteGroup(request.user.id, id);
  }
}
