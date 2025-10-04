import {
  IsString,
  IsOptional,
  IsDate,
  IsBoolean,
  IsArray,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExperienceDto {
  @IsString()
  company: string;

  @IsString()
  position: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;

  @IsOptional()
  @IsBoolean()
  isCurrent?: boolean;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologies?: string[];

  // ✅ ENHANCED: Restricted values
  @IsOptional()
  @IsIn(['Work', 'Education', 'Volunteer'])
  type?: 'Work' | 'Education' | 'Volunteer';

  // ✅ NEW: For education entries
  @IsOptional()
  @IsString()
  institution?: string;

  @IsOptional()
  @IsString()
  degree?: string;
}
