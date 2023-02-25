import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import admin from 'firebase-admin';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../db/prisma.service';
import { ImagesService } from '../images/images.service';
import { getImageIdFromUrl, IMAGE_FOLDER } from '../utils';

@Injectable()
export class CronJobsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly imagesService: ImagesService,
    private readonly httpService: HttpService,
  ) {}

  @Cron('0 0 0 * * *', {
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async deleteUnusedImages() {
    console.log(`Delete unused images: ${new Date()}`);
    try {
      // get asset images
      const assetImageObjects = await this.prisma.asset.findMany({
        select: {
          images: true,
        },
      });
      const assetImageIds = assetImageObjects.reduce(
        (pre, curr) => [
          ...pre,
          ...curr.images.map((item) =>
            getImageIdFromUrl(item, IMAGE_FOLDER.ASSET),
          ),
        ],
        [],
      );

      // get images from firebase storage
      const firebaseImagesResponse = await admin
        .storage()
        .bucket(process.env.FIREBASE_BUCKET_NAME)
        .getFiles({});

      const firebaseImageIds: string[] = firebaseImagesResponse.reduce(
        (pre, curr) => [...pre, ...curr.map((item) => item.name)],
        [],
      );

      // get unused images
      const unusedImageIds = firebaseImageIds.filter(
        (item) => !assetImageIds.includes(item),
      );

      // delete unused images
      await this.imagesService.deleteImages(unusedImageIds);
    } catch {
      console.error('Can not execute job');
    }
  }

  @Cron('0 */5 * * * *')
  async keepKSMAAwake() {
    await firstValueFrom(
      this.httpService.get(process.env.KEEP_SM_AWAKE_HEALTH_CHECK_END_POINT),
    );
  }
}
