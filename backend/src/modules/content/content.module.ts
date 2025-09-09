// src/modules/content/content.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonalInfo, Project, Skill, Experience, ContentBlock } from './entities/index.js' ; 

@Module({
  imports: [
    TypeOrmModule.forFeature([PersonalInfo, Project, Skill, Experience, ContentBlock])
  ],
  // Add controllers and services later
})
export class ContentModule {}
