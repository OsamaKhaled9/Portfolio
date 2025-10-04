import {
  IsString,
  IsOptional,
  IsDate,
  IsUrl,
  IsBoolean,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCertificationDto {
  @IsString()
  name: string;

  @IsString()
  issuer: string;

  @IsDate()
  @Type(() => Date)
  completedDate: Date;

  @IsOptional()
  @IsUrl()
  credlyUrl?: string;

  @IsOptional()
  @IsUrl()
  certificateImage?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsNumber()
  order?: number;
}
