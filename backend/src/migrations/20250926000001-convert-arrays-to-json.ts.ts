// src/migrations/20250926000001-convert-arrays-to-json.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ConvertArraysToJson20250926000001 implements MigrationInterface {
  name = 'ConvertArraysToJson20250926000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Convert Experience.technologies from simple-array to json
    await queryRunner.query(`ALTER TABLE \`experience\` MODIFY \`technologies\` JSON NULL`);
    
    // Convert Project.techStack from simple-array to json  
    await queryRunner.query(`ALTER TABLE \`project\` MODIFY \`techStack\` JSON NULL`);
    
    // Add new Project fields
    await queryRunner.query(`ALTER TABLE \`project\` ADD \`category\` VARCHAR(50) NULL DEFAULT 'Personal'`);
    await queryRunner.query(`ALTER TABLE \`project\` ADD \`order\` INT NULL DEFAULT 0`);
    
    // Add new Experience fields for education
    await queryRunner.query(`ALTER TABLE \`experience\` ADD \`institution\` VARCHAR(255) NULL`);
    await queryRunner.query(`ALTER TABLE \`experience\` ADD \`degree\` VARCHAR(255) NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert Experience fields
    await queryRunner.query(`ALTER TABLE \`experience\` DROP COLUMN \`degree\``);
    await queryRunner.query(`ALTER TABLE \`experience\` DROP COLUMN \`institution\``);
    
    // Revert Project fields
    await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`order\``);
    await queryRunner.query(`ALTER TABLE \`project\` DROP COLUMN \`category\``);
    
    // Revert to simple-array (data may be lost)
    await queryRunner.query(`ALTER TABLE \`project\` MODIFY \`techStack\` TEXT NULL`);
    await queryRunner.query(`ALTER TABLE \`experience\` MODIFY \`technologies\` TEXT NULL`);
  }
}
