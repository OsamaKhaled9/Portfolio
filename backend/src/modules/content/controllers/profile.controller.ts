import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ProfileService } from '../services/profile.service.js';
import { ProjectService } from '../services/project.service.js';
import { SkillService } from '../services/skill.service.js';
import { ExperienceService } from '../services/experience.service.js';
import { CertificationService } from '../services/certification.service.js'; // ✅ NEW
import { UpdateProfileDto } from '../dto/update-profile.dto.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';

@Controller('api')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly projectService: ProjectService,
    private readonly skillService: SkillService,
    private readonly experienceService: ExperienceService,
    private readonly certificationService: CertificationService, // ✅ NEW
  ) {}

  @Get('profile')
  async getProfile() {
    try {
      const profile = await this.profileService.getProfile();
      return {
        success: true,
        data: profile,
        message: 'Profile retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to retrieve profile',
      };
    }
  }

  @Put('admin/profile')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
    try {
      const updatedProfile =
        await this.profileService.updateProfile(updateProfileDto);
      return {
        success: true,
        data: updatedProfile,
        message: 'Profile updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to update profile',
      };
    }
  }

  // ✅ ENHANCED: Include certifications in portfolio
  @Get('portfolio')
  async getCompletePortfolio() {
    try {
      const profile = await this.profileService.getProfile();
      const projects = await this.projectService.findAll();
      const skills = await this.skillService.findAll();
      const experience = await this.experienceService.findAll();
      const certifications = await this.certificationService.findAll(); // ✅ NEW

      return {
        success: true,
        data: {
          profile,
          projects,
          skills,
          experience,
          certifications, // ✅ NEW
        },
        message: 'Portfolio retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: {
          profile: null,
          projects: [],
          skills: [],
          experience: [],
          certifications: [], // ✅ NEW
        },
        message: 'Failed to retrieve portfolio',
      };
    }
  }
}
