import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { Profile } from './modules/content/entities/profile.entity.js';
import { Project } from './modules/content/entities/project.entity.js';
import { Skill } from './modules/content/entities/skill.entity.js';
import { Experience } from './modules/content/entities/experience.entity.js';
import { ContentBlock } from './modules/content/entities/content-block.entity.js';
import AdminJS from 'adminjs';
import * as AdminJSTypeorm from '@adminjs/typeorm';
import { ContentModule } from './modules/content/content.module.js';
import { AuthModule } from './modules/auth/auth.module.js';

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
      database: process.env.DB_DATABASE || 'PortfolioDB',
      entities: [Profile, Project, Skill, Experience, ContentBlock],
      
      // ✅ DEVELOPMENT SETTINGS (preserves data while updating schema)
      synchronize: true,
      logging: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
      dropSchema: false, // ✅ CRITICAL: Never drop schema
      
      // ✅ CONNECTION STABILITY
      retryAttempts: 3,
      retryDelay: 3000,
      autoLoadEntities: true,
      
      // ✅ MIGRATION SUPPORT (for production)
      migrations: ['dist/migrations/*.js'],
      migrationsTableName: 'migrations',
      migrationsRun: false, // Don't auto-run migrations
    }),
    ContentModule,
    AuthModule,
    import('@adminjs/nestjs').then(({ AdminModule }) => AdminModule.createAdminAsync({
      useFactory: () => ({
        adminJsOptions: {
          rootPath: '/admin',
          resources: [Profile, Project, Skill, Experience, ContentBlock],
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
