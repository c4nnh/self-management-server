import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { GetCurrenciesArgs } from './args/currency.args';
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto, UpdateCurrencyDto } from './dto/currency.dto';

@Controller('currencies')
@UseGuards(AuthGuard)
@ApiTags('Currency')
@ApiBearerAuth()
export class CurrenciesController {
  constructor(private readonly service: CurrenciesService) {}

  @Get()
  getMany(@Query() args: GetCurrenciesArgs) {
    return this.service.getMany(args);
  }

  @Get(':id')
  getDetail(@Param('id') id: string) {
    return this.service.getDetail(id);
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateCurrencyDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateCurrencyDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Delete()
  @Roles('ADMIN')
  deleteMany(@Body() ids: string[]) {
    return this.service.deleteMany(ids);
  }
}
