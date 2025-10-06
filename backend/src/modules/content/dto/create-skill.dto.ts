import {
  IsString,
  IsOptional,
  IsNumber,
  IsUrl,
  IsIn,
  IsNotEmpty,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty({ message: 'Skill name is required' })
  @MaxLength(100, { message: 'Skill name must not exceed 100 characters' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  name: string;

  @IsIn(['Programming Languages', 'Frameworks & Tools', 'Cloud & Databases'], {
    message:
      'Category must be Programming Languages, Frameworks & Tools, or Cloud & Databases',
  })
  category:
    | 'Programming Languages'
    | 'Frameworks & Tools'
    | 'Cloud & Databases';

  @IsOptional()
  @IsIn(['Beginner', 'Intermediate', 'Advanced', 'Expert'], {
    message: 'Proficiency must be Beginner, Intermediate, Advanced, or Expert',
  })
  proficiency?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

  @IsOptional()
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'Icon URL must be a valid HTTP/HTTPS URL' },
  )
  @MaxLength(500, { message: 'Icon URL must not exceed 500 characters' })
  iconUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Years of experience must be at least 0' })
  @Max(50, { message: 'Years of experience must not exceed 50' })
  yearsOfExperience?: number;
}
