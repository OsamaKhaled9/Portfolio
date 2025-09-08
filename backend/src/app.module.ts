import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import AdminJS from 'adminjs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as AdminJSTypeorm from '@adminjs/typeorm';
import { PersonalInfo, Project, Skill, Experience, ContentBlock } from './modules/content/entities';

AdminJS.registerAdapter({ Resource: AdminJSTypeorm.Resource, Database: AdminJSTypeorm.Database });

@Module({
  imports: [
    ConfigModule.forRoot(), // loads the .env file
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [], // Add your entity classes here
       synchronize: false, // MANDATORY for production!
    }),
     AdminJSModule.createAdminAsync({
       imports: [TypeOrmModule.forFeature([PersonalInfo, Project, Skill, Experience, ContentBlock])],
      useFactory: () => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [PersonalInfo, Project, Skill, Experience, ContentBlock],
     }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}