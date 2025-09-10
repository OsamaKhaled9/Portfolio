import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './index.js';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}
