// src/main.ts - Final Fixed Version
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
import { Contact } from './modules/content/entities/contact.entity.js';
import session from 'express-session';
import express from 'express';

AdminJS.registerAdapter({ Database, Resource });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:5173'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // ✅ ENHANCED AdminJS with proper Profile configuration
  const adminJs = new AdminJS({
    rootPath: '/admin',
    resources: [
      {
        resource: Profile,
        options: {
          // ✅ FIX: Remove 'name' from listProperties since it doesn't exist
          listProperties: ['id', 'title', 'email', 'phone', 'location'],
          showProperties: ['id', 'title', 'email', 'phone', 'location', 'heroContent', 'preHeroContent', 'aboutContent', 'description', 'resumeUrl', 'profileImageUrl', 'socialLinks'],
          editProperties: ['title', 'email', 'phone', 'location', 'heroContent', 'preHeroContent', 'aboutContent', 'description', 'resumeUrl', 'profileImageUrl', 'socialLinks'],
          
          // ✅ FIX: Disable create/delete for Profile (singleton)
          actions: {
            new: {
              isVisible: false, // Hide "Create New" button
              isAccessible: false,
            },
            delete: {
              isVisible: false, // Hide "Delete" button
              isAccessible: false,
            },
            bulkDelete: {
              isVisible: false,
              isAccessible: false,
            },
            edit: {
              isVisible: true, // Keep edit functionality
              isAccessible: true,
            },
            show: {
              isVisible: true, // Keep view functionality
              isAccessible: true,
            },
            list: {
              isVisible: true, // Keep list functionality
              isAccessible: true,
            }
          },
          
          // ✅ Custom properties for JSON fields
          properties: {
            socialLinks: {
              type: 'mixed',
              description: 'JSON object for social media links (github, linkedin, twitter, etc.)'
            },
          },
        }
      },
      {
        resource: Project,
        options: {
          listProperties: ['id', 'title', 'category', 'featured', 'order'],
          editProperties: ['title', 'description', 'githubUrl', 'liveUrl', 'imageUrl', 'featured', 'techStack', 'category', 'order', 'status'],
          properties: {
            category: {
              availableValues: [
                { value: 'Academic', label: 'Academic' },
                { value: 'Professional', label: 'Professional' },
                { value: 'Personal', label: 'Personal' },
              ],
            },
            techStack: {
              isArray: true,
              type: 'mixed',
              description: 'JSON array of technologies used'
            },
          },
        }
      },
      {
        resource: Skill,
        options: {
          listProperties: ['id', 'name', 'category', 'proficiency'],
          properties: {
            category: {
              availableValues: [
                { value: 'Programming Languages', label: 'Programming Languages' },
                { value: 'Frameworks & Tools', label: 'Frameworks & Tools' },
                { value: 'Cloud & Databases', label: 'Cloud & Databases' },
              ],
            },
          },
        }
      },
      {
        resource: Experience,
        options: {
          listProperties: ['id', 'company', 'position', 'type', 'isCurrent'],
          editProperties: ['company', 'position', 'description', 'startDate', 'endDate', 'isCurrent', 'location', 'technologies', 'type', 'institution', 'degree'],
          properties: {
            type: {
              availableValues: [
                { value: 'Work', label: 'Work' },
                { value: 'Education', label: 'Education' },
                { value: 'Volunteer', label: 'Volunteer' },
              ],
            },
            technologies: {
              isArray: true,
              type: 'mixed',
              description: 'JSON array of technologies used'
            },
          },
        }
      },
      {
        resource: Contact,
        options: {
          listProperties: ['id', 'name', 'email', 'subject', 'status', 'createdAt'],
          showProperties: ['id', 'name', 'email', 'subject', 'message', 'status', 'createdAt'],
          editProperties: ['status'], // Only allow editing status
          actions: {
            new: {
              isVisible: false, // Don't allow creating contacts through admin
              isAccessible: false,
            },
            delete: {
              isVisible: true, // Allow deleting old messages
              isAccessible: true,
            },
          },
          properties: {
            status: {
              availableValues: [
                { value: 'unread', label: 'Unread' },
                { value: 'read', label: 'Read' },
                { value: 'replied', label: 'Replied' },
              ],
            },
            message: {
              type: 'textarea',
              props: {
                rows: 4,
              },
            },
          },
        }
      },
      ContentBlock,
    ],
  });

  // Build AdminJS router with authentication
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

  app.use(adminJs.options.rootPath, adminRouter);

  await app.listen(3000);
  console.log('Backend running on: http://localhost:3000');
  console.log('AdminJS available at http://localhost:3000/admin');
  console.log('API available at http://localhost:3000/api/*');
}
bootstrap();
