import {
  IsString,
  IsOptional,
  IsDate,
  IsBoolean,
  IsArray,
  IsIn,
  IsNotEmpty,
  MaxLength,
  ArrayMaxSize,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateExperienceDto {
  @IsString()
  @IsNotEmpty({ message: 'Company name is required' })
  @MaxLength(200, { message: 'Company name must not exceed 200 characters' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  company: string;

  @IsString()
  @IsNotEmpty({ message: 'Position is required' })
  @MaxLength(200, { message: 'Position must not exceed 200 characters' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  position: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000, {
    message: 'Description must not exceed 2000 characters',
  })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
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
  @MaxLength(200, { message: 'Location must not exceed 200 characters' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  location?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50, { message: 'Technologies array must not exceed 50 items' })
  @IsString({ each: true })
  @MaxLength(100, {
    each: true,
    message: 'Each technology must not exceed 100 characters',
  })
  @Transform(({ value }: { value: unknown }) =>
    Array.isArray(value)
      ? value.map((item: unknown) =>
          typeof item === 'string' ? item.trim() : item,
        )
      : value,
  )
  technologies?: string[];

  @IsOptional()
  @IsIn(['Work', 'Education', 'Volunteer'], {
    message: 'Type must be Work, Education, or Volunteer',
  })
  type?: 'Work' | 'Education' | 'Volunteer';

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Institution must not exceed 200 characters' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  institution?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Degree must not exceed 200 characters' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  degree?: string;
}
