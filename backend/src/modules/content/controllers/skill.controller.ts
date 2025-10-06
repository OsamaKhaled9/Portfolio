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
import { SkillService } from '../services/skill.service.js';
import { CreateSkillDto } from '../dto/create-skill.dto.js';
import { UpdateSkillDto } from '../dto/update-skill.dto.js';

@Controller('api')
@UseInterceptors(ClassSerializerInterceptor)
export class SkillController {
  private readonly logger = new Logger(SkillController.name);

  constructor(private readonly skillService: SkillService) {}

  // Public endpoints with rate limiting
  @Get('skills')
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 requests per minute
  async findAll() {
    try {
      const skills = await this.skillService.findAll();
      return {
        success: true,
        data: skills,
        message: 'Skills retrieved successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve skills: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        {
          success: false,
          data: [],
          message: 'Failed to retrieve skills',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('skills/grouped-by-category')
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  async findGroupedByCategory() {
    try {
      const skills = await this.skillService.findAll();
      const grouped: Record<string, typeof skills> = skills.reduce(
        (acc: Record<string, typeof skills>, skill) => {
          if (!acc[skill.category]) {
            acc[skill.category] = [];
          }
          acc[skill.category].push(skill);
          return acc;
        },
        {},
      );

      return {
        success: true,
        data: grouped,
        message: 'Skills grouped by category retrieved successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve grouped skills: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        {
          success: false,
          data: {},
          message: 'Failed to retrieve grouped skills',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('skills/:id')
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const skill = await this.skillService.findOne(id);
      return {
        success: true,
        data: skill,
        message: 'Skill retrieved successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve skill ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      const message =
        error instanceof Error ? error.message : 'Failed to retrieve skill';
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
  @Post('admin/skills')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async create(@Body() createSkillDto: CreateSkillDto) {
    try {
      const skill = await this.skillService.create(createSkillDto);

      this.logger.log(`Skill created: ${skill.id}`);

      return {
        success: true,
        data: skill,
        message: 'Skill created successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to create skill: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          data: null,
          message: 'Failed to create skill',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/skills/:id')
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
    @Body() updateSkillDto: UpdateSkillDto,
  ) {
    try {
      const skill = await this.skillService.update(id, updateSkillDto);

      this.logger.log(`Skill updated: ${id}`);

      return {
        success: true,
        data: skill,
        message: 'Skill updated successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to update skill ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      const message =
        error instanceof Error ? error.message : 'Failed to update skill';
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
  @Delete('admin/skills/:id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.skillService.remove(id);

      this.logger.log(`Skill deleted: ${id}`);

      return {
        success: true,
        data: null,
        message: 'Skill deleted successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to delete skill ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      const message =
        error instanceof Error ? error.message : 'Failed to delete skill';
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
