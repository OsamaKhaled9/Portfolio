import { PartialType } from '@nestjs/mapped-types';
import { CreateExperienceDto } from './index.js';

export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {}