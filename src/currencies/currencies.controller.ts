import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './dto/currency.dto';

@Controller('currencies')
@UseGuards(AuthGuard)
@ApiTags('Currency')
@ApiBearerAuth()
export class CurrenciesController {
  constructor(private readonly service: CurrenciesService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateCurrencyDto) {
    return this.service.create(dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
