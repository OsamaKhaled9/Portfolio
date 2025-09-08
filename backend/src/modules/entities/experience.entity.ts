import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Experience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  company: string;

  @Column()
  position: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;
}
