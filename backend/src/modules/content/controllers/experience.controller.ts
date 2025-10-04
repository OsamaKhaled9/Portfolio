import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { ExperienceService } from '../services/experience.service.js';
import { CreateExperienceDto, UpdateExperienceDto } from '../dto/index.js';

@Controller('api')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  // Public endpoints
  @Get('experience')
  async findAll() {
    try {
      const experiences = await this.experienceService.findAll();
      return {
        success: true,
        data: experiences,
        message: 'Experience retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to retrieve experience',
      };
    }
  }

  @Get('experience/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const experience = await this.experienceService.findOne(id);
      return {
        success: true,
        data: experience,
        message: 'Experience retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message,
      };
    }
  }

  // Admin endpoints (protected)
  @UseGuards(JwtAuthGuard)
  @Post('admin/experience')
  @UsePipes(new ValidationPipe())
  async create(@Body() createExperienceDto: CreateExperienceDto) {
    try {
      const experience =
        await this.experienceService.create(createExperienceDto);
      return {
        success: true,
        data: experience,
        message: 'Experience created successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create experience',
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/experience/:id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ) {
    try {
      const experience = await this.experienceService.update(
        id,
        updateExperienceDto,
      );
      return {
        success: true,
        data: experience,
        message: 'Experience updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message,
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/experience/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.experienceService.remove(id);
      return {
        success: true,
        data: null,
        message: 'Experience deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error.message,
      };
    }
  }
}
