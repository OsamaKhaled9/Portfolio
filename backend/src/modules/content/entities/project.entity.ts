import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
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

  @Column({ type: 'simple-array', nullable: true })
  techStack?: string[];

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}