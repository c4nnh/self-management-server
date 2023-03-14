import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SystemJobsService {
  constructor(private readonly httpService: HttpService) {}

  @Cron('0 */5 * * * *')
  async keepKSMAAwake() {
    if (process.env.NODE_ENV !== 'develop') {
      await firstValueFrom(
        this.httpService.get(process.env.KEEP_SM_AWAKE_HEALTH_CHECK_END_POINT),
      );
    }
  }
}
