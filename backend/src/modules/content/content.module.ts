// src/modules/content/content.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity.js';
import { ProfileController } from './controllers/profile.controller.js';
import { ProfileService } from './services/profile.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ContentModule {}
