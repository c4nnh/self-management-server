import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ImageFolder } from '../utils';
import { UploadImageDto } from './dto/image.dto';
import { CreateSignedUrlResponse } from './response/image.response';
import admin from 'firebase-admin';
import * as moment from 'moment';

@Injectable()
export class ImagesService {
  createSignedUrlForAsset = async (userId: string, dto: UploadImageDto) => {
    const folder: ImageFolder = 'asset';

    return this.createSignedUrl(userId, folder, dto);
  };

  private createSignedUrl = async (
    userId: string,
    folder: ImageFolder,
    dto: UploadImageDto,
  ): Promise<CreateSignedUrlResponse> => {
    const bucketName = process.env.FIREBASE_BUCKET_NAME;
    const { fileName, fileType } = dto;
    const ts = moment().format('yyyyMMDDHHmmssSSSS');
    const id = `${folder}/${userId}${ts}_${fileName}`;

    const res = await admin
      .storage()
      .bucket(bucketName)
      .file(id)
      .getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: new Date().getTime() + 1000 * 60 * 1, // 2 minutes
        contentType: fileType,
      });

    if (!res.length) {
      throw new InternalServerErrorException(
        'Can not get signed url now. Please try again later',
      );
    }

    const url = await admin.storage().bucket().file(id).publicUrl();

    await admin.storage().bucket().file(id).delete({
      ignoreNotFound: true,
    });

    return {
      uploadUrl: res[0],
      publicUrl: url,
    };
  };
}
