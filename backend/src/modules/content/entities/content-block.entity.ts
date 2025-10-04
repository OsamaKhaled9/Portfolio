import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class ContentBlock extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  section: string;

  @Column()
  key: string;

  @Column('text')
  value: string;

  @Column({ default: 'text' })
  type: string; // e.g., text/html/markdown
}
