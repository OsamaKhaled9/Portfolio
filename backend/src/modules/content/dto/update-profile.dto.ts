import {
  IsString,
  IsOptional,
  IsEmail,
  IsUrl,
  IsObject,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  @MaxLength(200, { message: 'Title must not exceed 200 characters' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  title?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Invalid email format',
  })
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20, { message: 'Phone must not exceed 20 characters' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @Matches(/^[+\d\s\-()]+$/, {
    message: 'Phone number contains invalid characters',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Location must not exceed 200 characters' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Hero content must not exceed 1000 characters' })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  heroContent?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, {
    message: 'Pre-hero content must not exceed 500 characters',
  })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  preHeroContent?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000, {
    message: 'About content must not exceed 5000 characters',
  })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  aboutContent?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000, {
    message: 'Description must not exceed 2000 characters',
  })
  @Transform(({ value }: { value: string }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  description?: string;

  @IsOptional()
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'Resume URL must be a valid HTTP/HTTPS URL' },
  )
  @MaxLength(500, { message: 'Resume URL must not exceed 500 characters' })
  resumeUrl?: string;

  @IsOptional()
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'Profile image URL must be a valid HTTP/HTTPS URL' },
  )
  @MaxLength(500, {
    message: 'Profile image URL must not exceed 500 characters',
  })
  profileImageUrl?: string;

  @IsOptional()
  @IsObject({ message: 'Social links must be a valid object' })
  @Transform(({ value }: { value: Record<string, string> }) => {
    if (typeof value !== 'object' || value === null) {
      return value;
    }

    // Sanitize each social link URL
    const sanitized: Record<string, string> = {};
    for (const [key, url] of Object.entries(value)) {
      if (typeof key === 'string' && typeof url === 'string') {
        const trimmedKey = key.trim().toLowerCase();
        const trimmedUrl = url.trim();

        // Validate URL format and limit length
        if (
          trimmedKey.length <= 50 &&
          trimmedUrl.length <= 500 &&
          /^https?:\/\/.+/.test(trimmedUrl)
        ) {
          sanitized[trimmedKey] = trimmedUrl;
        }
      }
    }
    return sanitized;
  })
  socialLinks?: Record<string, string>;
}
