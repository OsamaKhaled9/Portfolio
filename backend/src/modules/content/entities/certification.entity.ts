import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Certification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  issuer: string;

  @Column({ type: 'date' })
  completedDate: Date;

  @Column({ nullable: true })
  credlyUrl?: string;

  @Column({ nullable: true })
  certificateImage?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: false })
  featured: boolean;

  @Column({ default: 0 })
  order: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
