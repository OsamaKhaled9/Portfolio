import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity.js';
import { CreateContactDto } from '../dto/create-contact.dto.js';
import { EmailService } from '../../email/email.service.js';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    private emailService: EmailService,
  ) {}

  async sendContactMessage(createContactDto: CreateContactDto): Promise<{ success: boolean; message: string }> {
    try {
      // Save to database
      const contact = this.contactRepository.create(createContactDto);
      await this.contactRepository.save(contact);

      // Send email
      const emailSent = await this.emailService.sendContactEmail(createContactDto);

      if (emailSent) {
        return {
          success: true,
          message: 'Your message has been sent successfully!'
        };
      } else {
        return {
          success: false,
          message: 'Message saved but email sending failed. We will respond soon.'
        };
      }
    } catch (error) {
      console.error('Contact service error:', error);
      return {
        success: false,
        message: 'Failed to send message. Please try again later.'
      };
    }
  }

  // Admin functions (for future use)
  async getAllContacts(): Promise<Contact[]> {
    return await this.contactRepository.find({ order: { createdAt: 'DESC' } });
  }

  async markAsRead(id: number): Promise<boolean> {
    try {
      await this.contactRepository.update(id, { status: 'read' });
      return true;
    } catch (error) {
      return false;
    }
  }

// Add this to your contact.service.ts
async testEmail() {
  return await this.emailService.sendContactEmail({
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Email',
    message: 'This is a test email from your portfolio contact form.'
  });
}
}
