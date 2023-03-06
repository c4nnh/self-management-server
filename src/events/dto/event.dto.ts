import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventPriority } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinDate,
} from 'class-validator';
import * as moment from 'moment-timezone';
import {
  IsDateAfterOtherField,
  IsDateWithoutTime,
  IsTime,
  IsTimeBeforeOtherField,
  MustAppearWith,
} from 'src/utils/validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsDateWithoutTime()
  @MinDate(moment().tz(process.env.TZ).startOf('day').toDate())
  @ApiProperty({
    example: '2023-01-01',
  })
  @Transform(({ value }) => moment(value).tz(process.env.TZ).toDate())
  startDate: Date;

  @IsDateWithoutTime()
  @IsDateAfterOtherField('startDate')
  @ApiProperty({
    example: '2023-01-01',
  })
  @Transform(({ value }) =>
    moment(value).tz(process.env.TZ).endOf('day').toDate(),
  )
  endDate: Date;

  @IsOptional()
  @IsTime()
  @MustAppearWith('endTime')
  @IsTimeBeforeOtherField('endTime')
  @ApiPropertyOptional({
    example: '10:30:00',
    nullable: true,
  })
  startTime?: string;

  @IsOptional()
  @IsTime()
  @ApiPropertyOptional({
    example: '11:30:00',
    nullable: true,
  })
  endTime?: string;

  @IsEnum(EventPriority)
  @IsOptional()
  @ApiPropertyOptional({
    enum: EventPriority,
  })
  priority?: EventPriority;
}
