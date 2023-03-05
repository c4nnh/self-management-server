import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventPriority } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import * as moment from 'moment-timezone';
import {
  IsAfterYesterday,
  IsDateWithoutTime,
  IsTime,
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
  @IsAfterYesterday()
  @ApiProperty({
    example: '2023-01-01',
  })
  @Transform(({ value }) => moment(value).tz(process.env.TZ).toDate())
  startDate: Date;

  @IsDateWithoutTime()
  @ApiProperty({
    example: '2023-01-01',
  })
  @Transform(({ value }) => moment(value).tz(process.env.TZ).toDate())
  endDate: Date;

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
}
