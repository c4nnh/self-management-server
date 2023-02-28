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
import { GetAssetsArgs } from './args/asset.args';
import { AssetsService } from './assets.service';
import { CreateAssetDto, UpdateAssetDto } from './dto/asset.dto';

@Controller('assets')
@UseGuards(AuthGuard)
@ApiTags('Asset')
@ApiBearerAuth()
export class AssetsController {
  constructor(private readonly service: AssetsService) {}

  @Get(':id')
  getDetail(@Req() request, @Param('id') id: string) {
    return this.service.getDetail(request.user.id, id);
  }

  @Get()
  getMany(@Req() request, @Query() args: GetAssetsArgs) {
    return this.service.getMany(request.user.id, args);
  }

  @Post()
  create(@Req() request, @Body() dto: CreateAssetDto) {
    return this.service.create(request.user.id, dto);
  }

  @Put(':id')
  update(@Req() request, @Param('id') id: string, @Body() dto: UpdateAssetDto) {
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
