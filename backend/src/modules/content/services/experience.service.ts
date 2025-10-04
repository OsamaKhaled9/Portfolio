import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Experience } from '../entities/experience.entity.js';
import { CreateExperienceDto, UpdateExperienceDto } from '../dto/index.js';

@Injectable()
export class ExperienceService {
  constructor(
    @InjectRepository(Experience)
    private readonly experienceRepository: Repository<Experience>,
  ) {}

  async findAll(): Promise<Experience[]> {
    return await this.experienceRepository.find({
      order: { isCurrent: 'DESC', startDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Experience> {
    const experience = await this.experienceRepository.findOne({
      where: { id },
    });
    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }
    return experience;
  }

  async create(createExperienceDto: CreateExperienceDto): Promise<Experience> {
    const experience = this.experienceRepository.create(createExperienceDto);
    return await this.experienceRepository.save(experience);
  }

  async update(
    id: number,
    updateExperienceDto: UpdateExperienceDto,
  ): Promise<Experience> {
    const experience = await this.findOne(id);
    Object.assign(experience, updateExperienceDto);
    return await this.experienceRepository.save(experience);
  }

  async remove(id: number): Promise<void> {
    const experience = await this.findOne(id);
    await this.experienceRepository.remove(experience);
  }
}
