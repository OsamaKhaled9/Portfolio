// src/modules/content/services/profile.service.ts (Updated)
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Profile,Project,Skill,Experience } from '../entities/index.js';
import { UpdateProfileDto } from '../dto/index.js';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
    @InjectRepository(Experience)
    private experienceRepository: Repository<Experience>,
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

  private async createDefaultProfile(): Promise<Profile> {
    const defaultProfile = this.profileRepository.create({
      id: 1,
      name: 'Your Name',
      title: 'Backend Engineer',
      email: 'your@email.com',
      aboutContent: 'Write your about section here...',
      description: 'Passionate backend engineer...',
    } as DeepPartial<Profile>);
    
    return await this.profileRepository.save(defaultProfile);
  }

  // ✅ Updated to include all collections
  async getCompletePortfolio(): Promise<any> {
    try {
      const [profile, projects, skills, experience] = await Promise.all([
        this.getProfile(),
        this.projectRepository.find({ 
          order: { featured: 'DESC', createdAt: 'DESC' }
        }),
        this.skillRepository.find({ 
          order: { category: 'ASC', name: 'ASC' }
        }),
        this.experienceRepository.find({ 
          order: { isCurrent: 'DESC', startDate: 'DESC' }
        })
      ]);

      return {
        profile,
        projects,
        skills,
        experience,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching complete portfolio:', error);
      throw error;
    }
  }
}
