import {
  IsString,
  IsOptional,
  IsUrl,
  IsArray,
  IsBoolean,
  IsNumber,
  IsIn,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsUrl()
  githubUrl?: string;

  @IsOptional()
  @IsUrl()
  liveUrl?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[];

  @IsOptional()
  @IsString()
  status?: string;

  // ✅ NEW: Category validation
  @IsOptional()
  @IsIn(['Academic', 'Professional', 'Personal'])
  category?: 'Academic' | 'Professional' | 'Personal';

  // ✅ NEW: Order field
  @IsOptional()
  @IsNumber()
  order?: number;
}
