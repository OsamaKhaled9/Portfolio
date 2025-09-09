import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ nullable: true })
  githubUrl?: string;

  @Column({ nullable: true })
  liveUrl?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ default: false })
  featured: boolean;
}
