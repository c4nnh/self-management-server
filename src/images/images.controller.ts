import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { UploadImageDto } from './dto/image.dto';
import { ImagesService } from './images.service';

@Controller('images')
@UseGuards(AuthGuard)
@ApiTags('Image')
@ApiBearerAuth()
export class ImagesController {
  constructor(private readonly service: ImagesService) {}

  @Post('signed-url/assets')
  createSignedUrlForAsset(@Req() request, @Body() dto: UploadImageDto) {
    return this.service.createSignedUrlForAsset(request.user.id, dto);
  }
}
