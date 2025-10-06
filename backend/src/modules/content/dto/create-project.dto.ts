import {
  IsString,
  IsOptional,
  IsUrl,
  IsArray,
  IsBoolean,
  IsNumber,
  IsIn,
  IsNotEmpty,
  MaxLength,
  Min,
  Max,
  ArrayMaxSize,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required' })
  @MaxLength(5000, { message: 'Description must not exceed 5000 characters' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  description: string;

  @IsOptional()
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'GitHub URL must be a valid HTTP/HTTPS URL' },
  )
  @MaxLength(500, { message: 'GitHub URL must not exceed 500 characters' })
  githubUrl?: string;

  @IsOptional()
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'Live URL must be a valid HTTP/HTTPS URL' },
  )
  @MaxLength(500, { message: 'Live URL must not exceed 500 characters' })
  liveUrl?: string;

  @IsOptional()
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'Image URL must be a valid HTTP/HTTPS URL' },
  )
  @MaxLength(500, { message: 'Image URL must not exceed 500 characters' })
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30, { message: 'Tech stack must not exceed 30 items' })
  @IsString({ each: true })
  @MaxLength(50, {
    each: true,
    message: 'Each technology must not exceed 50 characters',
  })
  @Transform(({ value }: { value: unknown }) =>
    Array.isArray(value)
      ? value.map((item: unknown) =>
          typeof item === 'string' ? item.trim() : item,
        )
      : value,
  )
  techStack?: string[];

  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Status must not exceed 50 characters' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  status?: string;

  @IsOptional()
  @IsIn(['Academic', 'Professional', 'Personal'], {
    message: 'Category must be Academic, Professional, or Personal',
  })
  category?: 'Academic' | 'Professional' | 'Personal';

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Order must be at least 0' })
  @Max(9999, { message: 'Order must not exceed 9999' })
  order?: number;
}
