import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from '../entities/experience.entity.js';
import { CreateExperienceDto, UpdateExperienceDto } from '../dto/index.js';

@Injectable()
export class ExperienceService {
  private readonly logger = new Logger(ExperienceService.name);

  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
  ) {}

  async findAll(): Promise<Experience[]> {
    try {
      return await this.experienceRepository.find({
        order: { isCurrent: 'DESC', startDate: 'DESC' },
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch experiences: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'Failed to retrieve experiences',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<Experience> {
    try {
      const experience = await this.experienceRepository.findOne({
        where: { id },
      });

      if (!experience) {
        throw new NotFoundException(`Experience with ID ${id} not found`);
      }

      return experience;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(
        `Failed to fetch experience ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'Failed to retrieve experience',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createExperienceDto: CreateExperienceDto): Promise<Experience> {
    try {
      // Validate date logic
      if (
        createExperienceDto.endDate &&
        createExperienceDto.startDate > createExperienceDto.endDate
      ) {
        throw new HttpException(
          'End date must be after start date',
          HttpStatus.BAD_REQUEST,
        );
      }

      const experience = this.experienceRepository.create(createExperienceDto);
      const savedExperience = await this.experienceRepository.save(experience);

      this.logger.log(`Experience created with ID: ${savedExperience.id}`);
      return savedExperience;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to create experience: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'Failed to create experience',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: number,
    updateExperienceDto: UpdateExperienceDto,
  ): Promise<Experience> {
    try {
      const experience = await this.findOne(id);

      // Validate date logic if dates are being updated
      const newStartDate =
        updateExperienceDto.startDate || experience.startDate;
      const newEndDate = updateExperienceDto.endDate || experience.endDate;

      if (newEndDate && newStartDate > newEndDate) {
        throw new HttpException(
          'End date must be after start date',
          HttpStatus.BAD_REQUEST,
        );
      }

      Object.assign(experience, updateExperienceDto);
      const updatedExperience =
        await this.experienceRepository.save(experience);

      this.logger.log(`Experience updated: ${id}`);
      return updatedExperience;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to update experience ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'Failed to update experience',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const experience = await this.findOne(id);
      await this.experienceRepository.remove(experience);
      this.logger.log(`Experience removed: ${id}`);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to remove experience ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'Failed to delete experience',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
