import {Controller,  Get, Post, Put, Delete, Param, Body,UseGuards,ParseIntPipe,UsePipes,ValidationPipe} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard.js';
import { CertificationService } from '../services/certification.service.js';
import { CreateCertificationDto } from '../dto/create-certification.dto.js';
import { UpdateCertificationDto } from '../dto/update-certification.dto.js';

@Controller('api')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  // Public endpoints
  @Get('certifications')
  async findAll() {
    try {
      const certifications = await this.certificationService.findAll();
      return {
        success: true,
        data: certifications,
        message: 'Certifications retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: 'Failed to retrieve certifications',
      };
    }
  }

  @Get('certifications/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const certification = await this.certificationService.findOne(id);
      return {
        success: true,
        data: certification,
        message: 'Certification retrieved successfully',
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
  @Post('admin/certifications')
  @UsePipes(new ValidationPipe())
  async create(@Body() createCertificationDto: CreateCertificationDto) {
    try {
      const certification = await this.certificationService.create(createCertificationDto);
      return {
        success: true,
        data: certification,
        message: 'Certification created successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: 'Failed to create certification',
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/certifications/:id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCertificationDto: UpdateCertificationDto
  ) {
    try {
      const certification = await this.certificationService.update(id, updateCertificationDto);
      return {
        success: true,
        data: certification,
        message: 'Certification updated successfully',
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
  @Delete('admin/certifications/:id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      await this.certificationService.remove(id);
      return {
        success: true,
        data: null,
        message: 'Certification deleted successfully',
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
