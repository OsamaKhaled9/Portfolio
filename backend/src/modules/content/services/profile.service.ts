import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { Profile, Project, Skill, Experience } from '../entities/index.js';
import { UpdateProfileDto } from '../dto/index.js';

interface PortfolioData {
  profile: Profile;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  lastUpdated: string;
}

@Injectable()
export class ProfileService {
  private readonly logger = new Logger(ProfileService.name);

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
    try {
      let profile = await this.profileRepository.findOne({ where: { id: 1 } });

      if (!profile) {
        this.logger.warn('Profile not found, creating default profile');
        profile = await this.createDefaultProfile();
      }

      return profile;
    } catch (error) {
      this.logger.error(
        `Failed to get profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'Failed to retrieve profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateProfile(updateProfileDto: UpdateProfileDto): Promise<Profile> {
    try {
      const profile = await this.getProfile();

      // Validate social links structure if provided
      if (updateProfileDto.socialLinks) {
        this.validateSocialLinks(updateProfileDto.socialLinks);
      }

      Object.assign(profile, updateProfileDto);
      const updatedProfile = await this.profileRepository.save(profile);

      this.logger.log('Profile updated successfully');
      return updatedProfile;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'Failed to update profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private validateSocialLinks(socialLinks: Record<string, string>): void {
    const linkCount = Object.keys(socialLinks).length;

    // Limit number of social links to prevent abuse
    if (linkCount > 10) {
      throw new HttpException(
        'Maximum 10 social links allowed',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validate each social link
    for (const [platform, url] of Object.entries(socialLinks)) {
      if (platform.length > 50) {
        throw new HttpException(
          'Social platform name too long',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (url.length > 500) {
        throw new HttpException(
          'Social link URL too long',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Basic URL validation
      if (!/^https?:\/\/.+/.test(url)) {
        throw new HttpException(
          `Invalid URL format for ${platform}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  private async createDefaultProfile(): Promise<Profile> {
    try {
      const defaultProfile = this.profileRepository.create({
        id: 1,
        name: 'Your Name',
        title: 'Backend Engineer',
        email: 'your@email.com',
        aboutContent: 'Write your about section here...',
        description: 'Passionate backend engineer...',
      } as DeepPartial<Profile>);

      const savedProfile = await this.profileRepository.save(defaultProfile);
      this.logger.log('Default profile created');
      return savedProfile;
    } catch (error) {
      this.logger.error(
        `Failed to create default profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'Failed to create default profile',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCompletePortfolio(): Promise<PortfolioData> {
    try {
      const [profile, projects, skills, experience] = await Promise.all([
        this.getProfile(),
        this.projectRepository.find({
          order: { featured: 'DESC', createdAt: 'DESC' },
        }),
        this.skillRepository.find({
          order: { category: 'ASC', name: 'ASC' },
        }),
        this.experienceRepository.find({
          order: { isCurrent: 'DESC', startDate: 'DESC' },
        }),
      ]);

      return {
        profile,
        projects,
        skills,
        experience,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `Error fetching complete portfolio: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'Failed to retrieve complete portfolio',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
