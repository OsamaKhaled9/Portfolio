// src/modules/content/controllers/skill.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseIntPipe,UsePipes,ValidationPipe} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { SkillService } from '../services/skill.service.js';
import { CreateSkillDto ,UpdateSkillDto } from '../dto/index.js';

@Controller('api')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  // Public endpoints
  @Get('skills')
  async findAll() {
    try {
      const skills = await this.skillService.findAll();
      return {
        success: true,
        data: skills,
        message: 'Skills retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to retrieve skills',
      };
    }
  }

  @Get('skills/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const skill = await this.skillService.findOne(id);
      return {
        success: true,
        data: skill,
        message: 'Skill retrieved successfully',
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
  @Post('admin/skills')
  @UsePipes(new ValidationPipe())
  async create(@Body() createSkillDto: CreateSkillDto) {
    try {
      const skill = await this.skillService.create(createSkillDto);
      return {
        success: true,
        data: skill,
        message: 'Skill created successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create skill',
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/skills/:id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSkillDto: UpdateSkillDto
  ) {
    try {
      const skill = await this.skillService.update(id, updateSkillDto);
      return {
        success: true,
        data: skill,
        message: 'Skill updated successfully',
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
  @Delete('admin/skills/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.skillService.remove(id);
      return {
        success: true,
        data: null,
        message: 'Skill deleted successfully',
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
