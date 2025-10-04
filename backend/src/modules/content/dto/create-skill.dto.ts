import { IsString, IsOptional, IsNumber, IsUrl, IsIn } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  name: string;

  // ✅ ENHANCED: Fixed category options
  @IsIn(['Programming Languages', 'Frameworks & Tools', 'Cloud & Databases'])
  category:
    | 'Programming Languages'
    | 'Frameworks & Tools'
    | 'Cloud & Databases';

  @IsOptional()
  @IsString()
  proficiency?: string;

  @IsOptional()
  @IsUrl()
  iconUrl?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;
}
