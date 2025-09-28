// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

// Import entities
import { Profile } from './modules/content/entities/profile.entity.js';
import { Project } from './modules/content/entities/project.entity.js';
import { Skill } from './modules/content/entities/skill.entity.js';
import { Experience } from './modules/content/entities/experience.entity.js';
import { ContentBlock } from './modules/content/entities/content-block.entity.js';
import { Contact } from './modules/content/entities/contact.entity.js'; 
import { Certification } from './modules/content/entities/certification.entity.js'; // ✅ ADD


// Import modules
import { ContentModule } from './modules/content/content.module.js';
import { AuthModule } from './modules/auth/auth.module.js';

import AdminJS from 'adminjs';
import * as AdminJSTypeorm from '@adminjs/typeorm';

AdminJS.registerAdapter({
  Resource: AdminJSTypeorm.Resource,
  Database: AdminJSTypeorm.Database,
});

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'portfiodb',
      entities: [Profile, Project, Skill, Experience, ContentBlock, Contact, Certification], // ✅ Add Certification
      synchronize: false, // ✅ Using migrations now
      logging: ['error'],
      retryAttempts: 3,
      retryDelay: 3000,
    }),
    ContentModule,
    AuthModule,
    import('@adminjs/nestjs').then(({ AdminModule }) => AdminModule.createAdminAsync({
      useFactory: () => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [Profile, Project, Skill, Experience, ContentBlock, Contact], // ✅ Added Contact
        },
        auth: {
          authenticate: async (email: string, password: string) => {
            if (email === 'admin@admin.com' && password === 'password') {
              return Promise.resolve({ email: 'admin@admin.com' });
            }
            return null;
          },
          cookieName: 'adminjs',
          cookiePassword: 'supersecret-cookie-password-32-chars-min',
        },
        sessionOptions: {
          resave: true,
          saveUninitialized: true,
          secret: 'supersecret-session-key-32-chars-min',
        },
      }),
    })),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
