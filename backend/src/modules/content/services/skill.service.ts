import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from '../entities/skill.entity.js';
import { CreateSkillDto, UpdateSkillDto } from '../dto/index.js';

@Injectable()
export class SkillService {
  private readonly logger = new Logger(SkillService.name);

  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
  ) {}

  async findAll(): Promise<Skill[]> {
    try {
      return await this.skillRepository.find({
        order: { category: 'ASC', name: 'ASC' },
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch skills: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'Failed to retrieve skills',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<Skill> {
    try {
      const skill = await this.skillRepository.findOne({ where: { id } });

      if (!skill) {
        throw new NotFoundException(`Skill with ID ${id} not found`);
      }

      return skill;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(
        `Failed to fetch skill ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'Failed to retrieve skill',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    try {
      // Check for duplicate skill names in the same category
      await this.checkDuplicateSkill(
        createSkillDto.name,
        createSkillDto.category,
      );
      const skill = this.skillRepository.create(createSkillDto);
      const savedSkill = await this.skillRepository.save(skill);

      this.logger.log(`Skill created with ID: ${savedSkill.id}`);
      return savedSkill;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to create skill: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'Failed to create skill',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateSkillDto: UpdateSkillDto): Promise<Skill> {
    try {
      const skill = await this.findOne(id);

      // Check for duplicate if name or category is being updated
      if (updateSkillDto.name || updateSkillDto.category) {
        const newName = updateSkillDto.name || skill.name;
        const newCategory = updateSkillDto.category || skill.category;
        await this.checkDuplicateSkill(newName, newCategory, id);
      }

      Object.assign(skill, updateSkillDto);
      const updatedSkill = await this.skillRepository.save(skill);

      this.logger.log(`Skill updated: ${id}`);
      return updatedSkill;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to update skill ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'Failed to update skill',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const skill = await this.findOne(id);
      await this.skillRepository.remove(skill);
      this.logger.log(`Skill removed: ${id}`);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to remove skill ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'Failed to delete skill',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async checkDuplicateSkill(
    name: string,
    category: string,
    excludeId?: number,
  ): Promise<void> {
    const existingSkill = await this.skillRepository
      .createQueryBuilder('skill')
      .where('LOWER(skill.name) = LOWER(:name)', { name })
      .andWhere('skill.category = :category', { category })
      .andWhere(excludeId ? 'skill.id != :excludeId' : '1=1', { excludeId })
      .getOne();

    if (existingSkill) {
      throw new HttpException(
        `Skill "${name}" already exists in category "${category}"`,
        HttpStatus.CONFLICT,
      );
    }
  }
}
