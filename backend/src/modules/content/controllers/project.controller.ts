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
  HttpException,
  HttpStatus,
  Logger,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { ProjectService } from '../services/project.service.js';
import { CreateProjectDto, UpdateProjectDto } from '../dto/index.js';

@Controller('api')
@UseInterceptors(ClassSerializerInterceptor)
export class ProjectController {
  private readonly logger = new Logger(ProjectController.name);

  constructor(private readonly projectService: ProjectService) {}

  // Public endpoints with rate limiting
  @Get('projects')
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 requests per minute
  async findAll() {
    try {
      const projects = await this.projectService.findAll();
      return {
        success: true,
        data: projects,
        message: 'Projects retrieved successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve projects: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        {
          success: false,
          data: [],
          message: 'Failed to retrieve projects',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('projects/:id')
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const project = await this.projectService.findOne(id);
      return {
        success: true,
        data: project,
        message: 'Project retrieved successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve project ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      const message =
        error instanceof Error ? error.message : 'Failed to retrieve project';
      throw new HttpException(
        {
          success: false,
          data: null,
          message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // Admin endpoints (protected with stricter rate limiting)
  @UseGuards(JwtAuthGuard)
  @Post('admin/projects')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async create(@Body() createProjectDto: CreateProjectDto) {
    try {
      const project = await this.projectService.create(createProjectDto);

      this.logger.log(`Project created: ${project.id}`);

      return {
        success: true,
        data: project,
        message: 'Project created successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          data: null,
          message: 'Failed to create project',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/projects/:id')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    try {
      const project = await this.projectService.update(id, updateProjectDto);

      this.logger.log(`Project updated: ${id}`);

      return {
        success: true,
        data: project,
        message: 'Project updated successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to update project ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      const message =
        error instanceof Error ? error.message : 'Failed to update project';
      throw new HttpException(
        {
          success: false,
          data: null,
          message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/projects/:id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.projectService.remove(id);

      this.logger.log(`Project deleted: ${id}`);

      return {
        success: true,
        data: null,
        message: 'Project deleted successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to delete project ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      const message =
        error instanceof Error ? error.message : 'Failed to delete project';
      throw new HttpException(
        {
          success: false,
          data: null,
          message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
