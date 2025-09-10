// src/modules/content/content.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile,Project,Skill,Experience } from './entities/index.js';

import { ProfileController } from './controllers/profile.controller.js';
import { ProjectController } from './controllers/project.controller.js';
import { SkillController } from './controllers/skill.controller.js';
import { ExperienceController } from './controllers/experience.controller.js';

import { ProfileService } from './services/profile.service.js';
import { ProjectService } from './services/project.service.js';
import { SkillService } from './services/skill.service.js';
import { ExperienceService } from './services/experience.service.js';
@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, Project, Skill, Experience]),
  ],
  controllers: [
    ProfileController,
    ProjectController,
    SkillController,
    ExperienceController,
  ],
  providers: [
    ProfileService,
    ProjectService,
    SkillService,
    ExperienceService,
  ],
  exports: [
    ProfileService,
    ProjectService,
    SkillService,
    ExperienceService,
  ],
})
export class ContentModule {}