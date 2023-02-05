import { OnEvent } from '@nestjs/event-emitter';
import { WebSocketGateway } from '@nestjs/websockets';
import { ImagesService } from '../images/images.service';
import { EVENT_EMITTER, getImageIdFromUrl } from '../utils';

@WebSocketGateway()
export class ImagesGateway {
  constructor(private readonly imagesService: ImagesService) {}

  @OnEvent(EVENT_EMITTER.DELETE_IMAGES)
  async deleteImages({ urls, folder }: { urls: string[]; folder: string }) {
    const ids = urls.map((url) => getImageIdFromUrl(url, folder));
    await this.imagesService.deleteImages(ids);
  }
}
