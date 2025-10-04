import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Skill extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category:
    | 'Programming Languages'
    | 'Frameworks & Tools'
    | 'Cloud & Databases';

  @Column({ nullable: true })
  proficiency?: string;

  @Column({ nullable: true })
  iconUrl?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: 0 })
  yearsOfExperience: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
