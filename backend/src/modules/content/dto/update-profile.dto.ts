import { IsString, IsOptional, IsEmail, IsUrl, IsObject } from 'class-validator';

export class UpdateProfileDto {
  // ✅ NEW: Name field
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  heroContent?: string;

  @IsOptional()
  @IsString()
  preHeroContent?: string;

  @IsOptional()
  @IsString()
  aboutContent?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  resumeUrl?: string;

  @IsOptional()
  @IsUrl()
  profileImageUrl?: string;

  // ✅ FIXED: Proper JSON object validation
  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, string>;
}
