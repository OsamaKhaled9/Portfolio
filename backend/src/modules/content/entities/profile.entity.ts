import { BaseEntity,Entity, PrimaryColumn, Column,UpdateDateColumn,CreateDateColumn  } from 'typeorm';

@Entity('profile')
export class Profile extends BaseEntity {
  @PrimaryColumn()
   id: number = 1; // Always 1 - singleton record

  @Column()
  title: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  location?: string;

  // Content Sections
  @Column({ type: 'text', nullable: true })
  heroContent?: string;

  @Column({ type: 'text', nullable: true })
  preHeroContent?: string;

  @Column({ type: 'text' })
  aboutContent: string;

  @Column({ type: 'text', nullable: true })
  description?: string; // Short bio for hero section

  // Assets
  @Column({ nullable: true })
  resumeUrl?: string;

  @Column({ nullable: true })
  profileImageUrl?: string;

  // Social Links (stored as JSON)
  @Column({ type: 'json', nullable: true })
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
    instagram?: string;
  };

  // Metadata
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}