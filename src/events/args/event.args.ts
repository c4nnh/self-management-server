import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';
import * as moment from 'moment-timezone';

export class GetEventsArgs {
  @IsDate()
  @IsOptional()
  @Transform(
    ({ value }: TransformFnParams) =>
      value && moment(value).tz(process.env.TZ).startOf('day').toDate(),
  )
  @ApiPropertyOptional({
    description: 'Default is the day before start of current month 10 days',
  })
  startDate?: Date = moment().startOf('month').subtract(10, 'days').toDate();

  @IsDate()
  @IsOptional()
  @Transform(({ value }: TransformFnParams) =>
    moment(value).tz(process.env.TZ).endOf('day').toDate(),
  )
  @ApiPropertyOptional({
    description: 'Default is the day after end of current month 10 days',
  })
  endDate?: Date = moment().endOf('month').add(10, 'days').toDate();
}
