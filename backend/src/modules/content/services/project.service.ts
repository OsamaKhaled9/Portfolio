import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/index.js';
import { CreateProjectDto } from '../dto/index.js';
import { UpdateProjectDto } from '../dto/index.js';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<Project[]> {
    try {
      return await this.projectRepository.find({
        order: { featured: 'DESC', order: 'ASC', createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch projects: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'Failed to retrieve projects',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number): Promise<Project> {
    try {
      const project = await this.projectRepository.findOne({ where: { id } });

      if (!project) {
        throw new NotFoundException(`Project with ID ${id} not found`);
      }

      return project;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(
        `Failed to fetch project ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'Failed to retrieve project',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    try {
      // Validate tech stack if provided
      if (createProjectDto.techStack) {
        this.validateTechStack(createProjectDto.techStack);
      }

      const project = this.projectRepository.create(createProjectDto);
      const savedProject = await this.projectRepository.save(project);

      this.logger.log(`Project created with ID: ${savedProject.id}`);
      return savedProject;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'Failed to create project',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    try {
      const project = await this.findOne(id);

      // Validate tech stack if provided
      if (updateProjectDto.techStack) {
        this.validateTechStack(updateProjectDto.techStack);
      }

      Object.assign(project, updateProjectDto);
      const updatedProject = await this.projectRepository.save(project);

      this.logger.log(`Project updated: ${id}`);
      return updatedProject;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to update project ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'Failed to update project',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const project = await this.findOne(id);
      await this.projectRepository.remove(project);
      this.logger.log(`Project removed: ${id}`);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      this.logger.error(
        `Failed to remove project ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'Failed to delete project',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private validateTechStack(techStack: string[]): void {
    // Remove duplicates (case-insensitive)
    const uniqueTechs = new Set(
      techStack.map((tech) => tech.toLowerCase().trim()),
    );

    if (uniqueTechs.size !== techStack.length) {
      throw new HttpException(
        'Tech stack contains duplicate entries',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validate each technology name
    for (const tech of techStack) {
      if (tech.trim().length === 0) {
        throw new HttpException(
          'Tech stack cannot contain empty values',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Prevent potentially malicious or overly long tech names
      if (tech.length > 50) {
        throw new HttpException(
          'Technology name too long',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Basic alphanumeric and common characters validation
      if (!/^[a-zA-Z0-9\s.#+\-_]+$/.test(tech)) {
        throw new HttpException(
          `Invalid characters in technology name: ${tech}`,
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
