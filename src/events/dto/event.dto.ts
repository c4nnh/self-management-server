import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventPriority, EventStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinDate,
} from 'class-validator';
import * as moment from 'moment-timezone';
import {
  IsDateAfterOtherField,
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

  @IsDate()
  @MinDate(moment().tz(process.env.TZ).toDate())
  @ApiProperty({
    example: '2023-01-01',
  })
  @Transform(({ value }) => moment(value).tz(process.env.TZ).toDate())
  startDate: Date;

  @IsDate()
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

export class UpdateEventDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsDate()
  @ApiPropertyOptional({
    example: '2023-01-01T01-01-01',
    nullable: true,
  })
  @Transform(({ value }) => value && moment(value).tz(process.env.TZ).toDate())
  @IsOptional()
  startDate?: Date;

  @IsDate()
  @ApiPropertyOptional({
    example: '2023-01-01T01-01-01',
    nullable: true,
  })
  @Transform(
    ({ value }) =>
      value && moment(value).tz(process.env.TZ).endOf('day').toDate(),
  )
  @IsOptional()
  endDate?: Date;

  @IsOptional()
  @IsBoolean()
  removeTime?: boolean;

  @IsOptional()
  @IsTime()
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

  @IsEnum(EventStatus)
  @IsOptional()
  @ApiPropertyOptional({
    enum: EventStatus,
  })
  status?: EventStatus;
}

export class UpdateEventGroupDto extends UpdateEventDto {}
