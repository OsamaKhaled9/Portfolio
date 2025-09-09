import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/typeorm';
import AdminJSExpress from '@adminjs/express';
import { Profile } from './modules/content/entities/profile.entity.js';
import { Project } from './modules/content/entities/project.entity.js';
import { Skill } from './modules/content/entities/skill.entity.js';
import { Experience } from './modules/content/entities/experience.entity.js';
import { ContentBlock } from './modules/content/entities/content-block.entity.js';
import session from 'express-session';
import express from 'express';

AdminJS.registerAdapter({ Database, Resource });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Initialize AdminJS
  const adminJs = new AdminJS({
    rootPath: '/admin',
    resources: [Profile, Project, Skill, Experience, ContentBlock],
  });

  // Build AdminJS router with Express
  const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate: async (email: string, password: string) => {
        if (email === 'admin@admin.com' && password === 'password') {
          return { email: 'admin@admin.com' };
        }
        return null;
      },
      cookieName: 'adminjs',
      cookiePassword: 'supersecret-cookie-password-32-chars-min',
    },
    null,
    {
      resave: true,
      saveUninitialized: true,
      secret: 'supersecret-session-key-32-chars-min',
    }
  );

  // Add AdminJS router to Express app
  app.use(adminJs.options.rootPath, adminRouter);

  await app.listen(3000);
  console.log('AdminJS available at http://localhost:3000/admin');
}
bootstrap();