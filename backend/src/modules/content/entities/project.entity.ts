// src/modules/content/entities/project.entity.ts
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  githubUrl?: string;

  @Column({ nullable: true })
  liveUrl?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ default: false })
  featured: boolean;

  // ✅ CHANGED: simple-array → json
  @Column({ type: 'json', nullable: true })
  techStack?: string[];

  @Column({ default: 'active' })
  status: string;

  // ✅ NEW: Project category
  @Column({ default: 'Personal' })
  category: 'Academic' | 'Professional' | 'Personal';

  // ✅ NEW: For custom sorting
  @Column({ default: 0 })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
