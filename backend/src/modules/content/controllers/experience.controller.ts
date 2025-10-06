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
import { ExperienceService } from '../services/experience.service.js';
import { CreateExperienceDto, UpdateExperienceDto } from '../dto/index.js';

@Controller('api')
@UseInterceptors(ClassSerializerInterceptor)
export class ExperienceController {
  private readonly logger = new Logger(ExperienceController.name);

  constructor(private readonly experienceService: ExperienceService) {}

  // Public endpoints with rate limiting
  @Get('experience')
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 requests per minute
  async findAll() {
    try {
      const experiences = await this.experienceService.findAll();
      return {
        success: true,
        data: experiences,
        message: 'Experience retrieved successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve experiences: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        {
          success: false,
          data: [],
          message: 'Failed to retrieve experience',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('experience/:id')
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const experience = await this.experienceService.findOne(id);
      return {
        success: true,
        data: experience,
        message: 'Experience retrieved successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve experience ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      const message =
        error instanceof Error
          ? error.message
          : 'Failed to retrieve experience';
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
  @Post('admin/experience')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async create(@Body() createExperienceDto: CreateExperienceDto) {
    try {
      const experience =
        await this.experienceService.create(createExperienceDto);

      this.logger.log(`Experience created: ${experience.id}`);

      return {
        success: true,
        data: experience,
        message: 'Experience created successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to create experience: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          data: null,
          message: 'Failed to create experience',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/experience/:id')
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
    @Body() updateExperienceDto: UpdateExperienceDto,
  ) {
    try {
      const experience = await this.experienceService.update(
        id,
        updateExperienceDto,
      );

      this.logger.log(`Experience updated: ${id}`);

      return {
        success: true,
        data: experience,
        message: 'Experience updated successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to update experience ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      const message =
        error instanceof Error ? error.message : 'Failed to update experience';
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
  @Delete('admin/experience/:id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.experienceService.remove(id);

      this.logger.log(`Experience deleted: ${id}`);

      return {
        success: true,
        data: null,
        message: 'Experience deleted successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to delete experience ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      const message =
        error instanceof Error ? error.message : 'Failed to delete experience';
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
