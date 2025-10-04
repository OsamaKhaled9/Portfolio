// src/modules/content/controllers/project.controller.ts
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
import { ProjectService } from '../services/project.service.js';
import { CreateProjectDto, UpdateProjectDto } from '../dto/index.js';

@Controller('api')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // Public endpoints
  @Get('projects')
  async findAll() {
    try {
      const projects = await this.projectService.findAll();
      return {
        success: true,
        data: projects,
        message: 'Projects retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to retrieve projects',
      };
    }
  }

  @Get('projects/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const project = await this.projectService.findOne(id);
      return {
        success: true,
        data: project,
        message: 'Project retrieved successfully',
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
  @Post('admin/projects')
  @UsePipes(new ValidationPipe())
  async create(@Body() createProjectDto: CreateProjectDto) {
    try {
      const project = await this.projectService.create(createProjectDto);
      return {
        success: true,
        data: project,
        message: 'Project created successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create project',
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/projects/:id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    try {
      const project = await this.projectService.update(id, updateProjectDto);
      return {
        success: true,
        data: project,
        message: 'Project updated successfully',
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
  @Delete('admin/projects/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.projectService.remove(id);
      return {
        success: true,
        data: null,
        message: 'Project deleted successfully',
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
