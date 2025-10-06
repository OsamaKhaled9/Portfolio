import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Logger,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ProfileService } from '../services/profile.service.js';
import { ProjectService } from '../services/project.service.js';
import { SkillService } from '../services/skill.service.js';
import { ExperienceService } from '../services/experience.service.js';
import { CertificationService } from '../services/certification.service.js';
import { UpdateProfileDto } from '../dto/update-profile.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';

@Controller('api')
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  constructor(
    private readonly profileService: ProfileService,
    private readonly projectService: ProjectService,
    private readonly skillService: SkillService,
    private readonly experienceService: ExperienceService,
    private readonly certificationService: CertificationService,
  ) {}

  @Get('profile')
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 requests per minute
  async getProfile() {
    try {
      const profile = await this.profileService.getProfile();

      if (!profile) {
        throw new HttpException(
          {
            success: false,
            data: null,
            message: 'Profile not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: profile,
        message: 'Profile retrieved successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          data: null,
          message: 'Failed to retrieve profile',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('admin/profile')
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
    try {
      const updatedProfile =
        await this.profileService.updateProfile(updateProfileDto);

      this.logger.log('Profile updated successfully');

      return {
        success: true,
        data: updatedProfile,
        message: 'Profile updated successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          data: null,
          message: 'Failed to update profile',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('portfolio')
  @Throttle({ default: { limit: 50, ttl: 60000 } }) // 50 requests per minute
  async getCompletePortfolio() {
    try {
      const profile = await this.profileService.getProfile();
      const projects = await this.projectService.findAll();
      const skills = await this.skillService.findAll();
      const experience = await this.experienceService.findAll();
      const certifications = await this.certificationService.findAll();

      return {
        success: true,
        data: {
          profile,
          projects,
          skills,
          experience,
          certifications,
        },
        message: 'Portfolio retrieved successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve portfolio: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      throw new HttpException(
        {
          success: false,
          data: {
            profile: null,
            projects: [],
            skills: [],
            experience: [],
            certifications: [],
          },
          message: 'Failed to retrieve portfolio',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
