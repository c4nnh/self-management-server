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
import { GetLoansArgs } from './args/loan.args';
import { CreateLoanDto, UpdateLoanDto } from './dto/loan.dto';
import { LoansService } from './loans.service';

@Controller('loans')
@UseGuards(AuthGuard)
@ApiTags('Loan')
@ApiBearerAuth()
export class LoansController {
  constructor(private readonly service: LoansService) {}

  @Get()
  getMany(@Req() request, @Query() args: GetLoansArgs) {
    return this.service.getMany(request.user.id, args);
  }

  @Get(':id')
  getDetail(@Req() request, @Param('id') id: string) {
    return this.service.getDetail(request.user.id, id);
  }

  @Post()
  create(@Req() request, @Body() dto: CreateLoanDto) {
    return this.service.create(request.user.id, dto);
  }

  @Put(':id')
  update(@Req() request, @Param('id') id: string, @Body() dto: UpdateLoanDto) {
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
