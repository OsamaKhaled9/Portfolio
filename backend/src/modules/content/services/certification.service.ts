import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certification } from '../entities/certification.entity.js';
import { CreateCertificationDto } from '../dto/create-certification.dto.js';
import { UpdateCertificationDto } from '../dto/update-certification.dto.js';

@Injectable()
export class CertificationService {
  constructor(
    @InjectRepository(Certification)
    private certificationRepository: Repository<Certification>,
  ) {}

  async create(
    createCertificationDto: CreateCertificationDto,
  ): Promise<Certification> {
    const certification = this.certificationRepository.create(
      createCertificationDto,
    );
    return await this.certificationRepository.save(certification);
  }

  async findAll(): Promise<Certification[]> {
    return await this.certificationRepository.find({
      order: { featured: 'DESC', order: 'ASC', completedDate: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Certification> {
    const certification = await this.certificationRepository.findOne({
      where: { id },
    });
    if (!certification) {
      throw new NotFoundException(`Certification with ID ${id} not found`);
    }
    return certification;
  }

  async update(
    id: number,
    updateCertificationDto: UpdateCertificationDto,
  ): Promise<Certification> {
    const certification = await this.findOne(id);
    Object.assign(certification, updateCertificationDto);
    return await this.certificationRepository.save(certification);
  }

  async remove(id: number): Promise<void> {
    const certification = await this.findOne(id);
    await this.certificationRepository.remove(certification);
  }
}
