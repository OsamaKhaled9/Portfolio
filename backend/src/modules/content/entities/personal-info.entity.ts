import { BaseEntity,Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('personal_info')
export class PersonalInfo extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  resumeUrl?: string;
}
