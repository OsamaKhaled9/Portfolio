import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Contact extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  subject?: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ default: 'unread' })
  status: 'unread' | 'read' | 'replied';

  @CreateDateColumn()
  createdAt: Date;
}
