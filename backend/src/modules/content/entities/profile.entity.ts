import { BaseEntity,Entity, PrimaryColumn, Column,UpdateDateColumn,CreateDateColumn  } from 'typeorm';

@Entity('profile')
export class Profile extends BaseEntity {
  @PrimaryColumn()
   id: number = 1; // Always 1 - singleton record


  // ✅ NEW: Name field
  @Column({ nullable: true })
  name?: string;


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

  @Column({ type: 'json', nullable: true })
  socialLinks?: Record<string, string>;

  // Metadata
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}