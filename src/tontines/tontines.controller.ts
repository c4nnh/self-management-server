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
import { GetTontinesArgs } from './args/tontine.args';
import { CreateTontineDto, UpdateTontineDto } from './dto/tontine.dto';
import { TontinesService } from './tontines.service';

@Controller('tontines')
@UseGuards(AuthGuard)
@ApiTags('Tontine')
@ApiBearerAuth()
export class TontinesController {
  constructor(private readonly service: TontinesService) {}

  @Get()
  getMany(@Req() request, @Query() args: GetTontinesArgs) {
    return this.service.getMany(request.user.id, args);
  }

  @Get(':id')
  getDetail(@Req() request, @Param('id') id: string) {
    return this.service.getDetail(request.user.id, id);
  }

  @Post()
  create(@Req() request, @Body() dto: CreateTontineDto) {
    return this.service.create(request.user.id, dto);
  }

  @Put(':id')
  update(
    @Req() request,
    @Param('id') id: string,
    @Body() dto: UpdateTontineDto,
  ) {
    return this.service.update(request.user.id, id, dto);
  }

  @Delete(':id')
  delete(@Req() request, @Param('id') id: string) {
    return this.service.delete(request.user.id, id);
  }

  @Delete()
  deleteMany(@Req() request, @Body() ids: string[]) {
    return this.service.deleteMany(request.user.id, ids);
  }
}
