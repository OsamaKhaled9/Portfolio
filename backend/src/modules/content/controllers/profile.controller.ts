// src/modules/content/controllers/profile.controller.ts
import { Controller, Get, Put, Body, UseGuards, HttpStatus } from '@nestjs/common';
import { ProfileService } from '../services/profile.service.js';
import { UpdateProfileDto, ProfileResponseDto, PortfolioResponseDto } from '../dto/index.js';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';

@Controller('api')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('profile')
  async getProfile(): Promise<ProfileResponseDto> {
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
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto): Promise<ProfileResponseDto> {
    try {
      const updatedProfile = await this.profileService.updateProfile(updateProfileDto);
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

  @Get('portfolio')
  async getCompletePortfolio(): Promise<PortfolioResponseDto> {
    try {
      const portfolio = await this.profileService.getCompletePortfolio();
      return {
        success: true,
        data: portfolio,
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
        },
        message: 'Failed to retrieve portfolio',
      };
    }
  }
}
