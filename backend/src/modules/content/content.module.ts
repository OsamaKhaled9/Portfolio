import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Entities
import { Profile } from './entities/profile.entity.js';
import { Project } from './entities/project.entity.js';
import { Skill } from './entities/skill.entity.js';
import { Experience } from './entities/experience.entity.js';
import { Contact } from './entities/contact.entity.js';
import { Certification } from './entities/certification.entity.js'; // ✅ NEW

// Controllers
import { ProfileController } from './controllers/profile.controller.js';
import { ProjectController } from './controllers/project.controller.js';
import { SkillController } from './controllers/skill.controller.js';
import { ExperienceController } from './controllers/experience.controller.js';
import { ContactController } from './controllers/contact.controller.js';
import { CertificationController } from './controllers/certification.controller.js'; // ✅ NEW

// Services
import { ProfileService } from './services/profile.service.js';
import { ProjectService } from './services/project.service.js';
import { SkillService } from './services/skill.service.js';
import { ExperienceService } from './services/experience.service.js';
import { ContactService } from './services/contact.service.js';
import { CertificationService } from './services/certification.service.js'; // ✅ NEW
import { EmailModule } from '../email/email.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Profile,
      Project,
      Skill,
      Experience,
      Contact,
      Certification,
    ]), // ✅ Add Certification
    ConfigModule,
    EmailModule,
  ],
  controllers: [
    ProfileController,
    ProjectController,
    SkillController,
    ExperienceController,
    ContactController,
    CertificationController, // ✅ NEW
  ],
  providers: [
    ProfileService,
    ProjectService,
    SkillService,
    ExperienceService,
    ContactService,
    CertificationService, // ✅ NEW
  ],
  exports: [
    ProfileService,
    ProjectService,
    SkillService,
    ExperienceService,
    ContactService,
    CertificationService, // ✅ NEW
  ],
})
export class ContentModule {}
