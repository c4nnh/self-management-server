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
import { AuthGuard } from '../auth/auth.guard';
import { GetTransactionsArgs } from './args/transaction.args';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/transaction.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
@UseGuards(AuthGuard)
@ApiTags('Transaction')
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Get()
  getMany(@Req() request, @Query() args: GetTransactionsArgs) {
    return this.service.getMany(request.user.id, args);
  }

  @Post()
  create(@Req() request, @Body() dto: CreateTransactionDto) {
    return this.service.create(request.user.id, dto);
  }

  @Put(':id')
  update(
    @Req() request,
    @Param('id') id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.service.update(request.user.id, id, dto);
  }

  @Delete(':id')
  delete(@Req() request, @Param('id') id: string) {
    return this.service.delete(request.user.id, id);
  }
}
