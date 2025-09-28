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
import { Certification } from './modules/content/entities/certification.entity.js'; // ✅ ADD
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

  // ✅ FIXED AdminJS configuration
  const adminJs = new AdminJS({
    rootPath: '/admin',
    resources: [
      {
        resource: Profile,
        options: {
          listProperties: ['id', 'name', 'title', 'email', 'phone', 'location'], // ✅ Added name
          showProperties: ['id', 'name', 'title', 'email', 'phone', 'location', 'heroContent', 'preHeroContent', 'aboutContent', 'description', 'resumeUrl', 'profileImageUrl', 'socialLinks'],
          editProperties: ['name', 'title', 'email', 'phone', 'location', 'heroContent', 'preHeroContent', 'aboutContent', 'description', 'resumeUrl', 'profileImageUrl', 'socialLinks'],
          
          // Profile singleton restrictions
          actions: {
            new: { isVisible: false, isAccessible: false },
            delete: { isVisible: false, isAccessible: false },
            bulkDelete: { isVisible: false, isAccessible: false },
            edit: { isVisible: true, isAccessible: true },
            show: { isVisible: true, isAccessible: true },
            list: { isVisible: true, isAccessible: true }
          },
          
          // ✅ FIXED: Simple property definitions
          properties: {
            socialLinks: {
              type: 'mixed',
              description: 'JSON object: {"github": "url", "linkedin": "url", "twitter": "url"}'
            }
          }
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
              type: 'mixed',
              description: 'JSON array: ["React", "Node.js", "MySQL"]'
            }
          }
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
              type: 'mixed',
              description: 'JSON array: ["JavaScript", "Python", "Docker"]'
            }
          }
        }
      },
      {
        resource: Contact,
        options: {
          listProperties: ['id', 'name', 'email', 'subject', 'status', 'createdAt'],
          showProperties: ['id', 'name', 'email', 'subject', 'message', 'status', 'createdAt'],
          editProperties: ['status'],
          actions: {
            new: { isVisible: false, isAccessible: false },
            delete: { isVisible: true, isAccessible: true },
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
              props: { rows: 4 }
            }
          }
        }
      },
      // ✅ NEW: Certification resource
      {
        resource: Certification,
        options: {
          listProperties: ['id', 'name', 'issuer', 'completedDate', 'featured'],
          editProperties: ['name', 'issuer', 'completedDate', 'credlyUrl', 'certificateImage', 'description', 'featured', 'order'],
          properties: {
            completedDate: {
              type: 'date',
            },
            credlyUrl: {
              type: 'url',
              description: 'Optional Credly badge URL'
            },
            certificateImage: {
              type: 'url',
              description: 'Optional certificate image URL'
            }
          }
        }
      },
      ContentBlock
    ]
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
