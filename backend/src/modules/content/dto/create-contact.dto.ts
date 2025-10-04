import {
  IsString,
  IsEmail,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100, { message: 'Name must not exceed 100 characters' })
  @Transform(({ value }: { value: string }) => value?.trim())
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  @MaxLength(255, { message: 'Email must not exceed 255 characters' })
  @Transform(({ value }: { value: string }) => value?.trim().toLowerCase())
  @Matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
    message: 'Invalid email format',
  })
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(200, { message: 'Subject must not exceed 200 characters' })
  @Transform(({ value }: { value: string }) => value?.trim())
  subject?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000, { message: 'Message must not exceed 2000 characters' })
  @Transform(({ value }: { value: string }) => value?.trim())
  message: string;
}
