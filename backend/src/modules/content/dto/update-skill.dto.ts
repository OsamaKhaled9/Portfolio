import { PartialType } from '@nestjs/mapped-types';
import { CreateSkillDto } from './index.js';

export class UpdateSkillDto extends PartialType(CreateSkillDto) {}
