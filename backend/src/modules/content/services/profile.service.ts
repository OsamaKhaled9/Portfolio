// src/modules/content/services/profile.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm'; // ← Add DeepPartial import
import { Profile } from '../entities/profile.entity.js';
import { UpdateProfileDto } from '../dto/index.js';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async getProfile(): Promise<Profile> {
    let profile = await this.profileRepository.findOne({ where: { id: 1 } });
    
    if (!profile) {
      profile = await this.createDefaultProfile();
    }
    
    return profile;
  }

  async updateProfile(updateProfileDto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.getProfile();
    Object.assign(profile, updateProfileDto);
    return await this.profileRepository.save(profile);
  }

  // ✅ FIXED: Cast to DeepPartial<Profile>
  private async createDefaultProfile(): Promise<Profile> {
    const defaultProfile = this.profileRepository.create({
      id: 1,
      name: 'Your Name',
      title: 'Backend Engineer',
      email: 'your@email.com',
      aboutContent: 'Write your about section here...',
      description: 'Passionate backend engineer...',
    } as DeepPartial<Profile>); // ← This fixes the TypeScript error
    
    return await this.profileRepository.save(defaultProfile);
  }

  async getCompletePortfolio(): Promise<any> {
    const profile = await this.getProfile();
    
    return {
      profile,
      projects: [], // TODO: Implement later
      skills: [],   // TODO: Implement later  
      experience: [], // TODO: Implement later
    };
  }
}
