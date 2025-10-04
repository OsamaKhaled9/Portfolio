// src/modules/content/entities/experience.entity.ts
import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Experience extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company: string;

  @Column()
  position: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ default: false })
  isCurrent: boolean;

  @Column({ nullable: true })
  location?: string;

  // ✅ CHANGED: simple-array → json
  @Column({ type: 'json', nullable: true })
  technologies?: string[];

  // ✅ ENHANCED: Restricted to specific values
  @Column({ default: 'Work' })
  type: 'Work' | 'Education' | 'Volunteer';

  // ✅ NEW: For education entries
  @Column({ nullable: true })
  institution?: string;

  // ✅ NEW: For education entries
  @Column({ nullable: true })
  degree?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
