import { IsNotEmpty, IsString } from 'class-validator';

export class UploadImageDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  fileType: string;
}
