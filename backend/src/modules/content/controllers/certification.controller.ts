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
  UseInterceptors,
  ClassSerializerInterceptor,
  Logger,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CertificationService } from '../services/certification.service.js';
import { CreateCertificationDto } from '../dto/create-certification.dto.js';
import { UpdateCertificationDto } from '../dto/update-certification.dto.js';

@Controller('api')
@UseInterceptors(ClassSerializerInterceptor)
export class CertificationController {
  private readonly logger = new Logger(CertificationController.name);

  constructor(private readonly certificationService: CertificationService) {}

  // Public endpoints with rate limiting
  @Get('certifications')
  @Throttle({ default: { limit: 100, ttl: 60000 } }) // 100 requests per minute
  async findAll() {
    try {
      const certifications = await this.certificationService.findAll();
      return {
        success: true,
        data: certifications,
        message: 'Certifications retrieved successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve certifications: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      const message =
        error instanceof Error
          ? error.message
          : 'Failed to retrieve certifications';
      throw new HttpException(
        {
          success: false,
          data: [],
          message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('certifications/:id')
  @Throttle({ default: { limit: 100, ttl: 60000 } })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const certification = await this.certificationService.findOne(id);

      if (!certification) {
        throw new HttpException(
          {
            success: false,
            data: null,
            message: 'Certification not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return {
        success: true,
        data: certification,
        message: 'Certification retrieved successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve certification ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      const message =
        error instanceof Error
          ? error.message
          : 'Failed to retrieve certification';
      throw new HttpException(
        {
          success: false,
          data: null,
          message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Admin endpoints (protected with authentication and stricter rate limiting)
  @UseGuards(JwtAuthGuard)
  @Post('admin/certifications')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute for admin
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createCertificationDto: CreateCertificationDto) {
    try {
      const certification = await this.certificationService.create(
        createCertificationDto,
      );

      this.logger.log(`Certification created: ${certification.id}`);

      return {
        success: true,
        data: certification,
        message: 'Certification created successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to create certification: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      const message =
        error instanceof Error
          ? error.message
          : 'Failed to create certification';
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
  @Put('admin/certifications/:id')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute for updates
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCertificationDto: UpdateCertificationDto,
  ) {
    try {
      const certification = await this.certificationService.update(
        id,
        updateCertificationDto,
      );

      if (!certification) {
        throw new HttpException(
          {
            success: false,
            data: null,
            message: 'Certification not found',
          },
          HttpStatus.NOT_FOUND,
        );
      }

      this.logger.log(`Certification updated: ${id}`);

      return {
        success: true,
        data: certification,
        message: 'Certification updated successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to update certification ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      const message =
        error instanceof Error
          ? error.message
          : 'Failed to update certification';
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
  @Delete('admin/certifications/:id')
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.certificationService.remove(id);

      this.logger.log(`Certification deleted: ${id}`);

      return {
        success: true,
        data: null,
        message: 'Certification deleted successfully',
      };
    } catch (error) {
      this.logger.error(
        `Failed to delete certification ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      const message =
        error instanceof Error
          ? error.message
          : 'Failed to delete certification';
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
