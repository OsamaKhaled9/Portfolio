import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity.js';
import { CreateContactDto } from '../dto/create-contact.dto.js';
import { EmailService } from '../../email/email.service.js';

/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment */
const sanitizeHtml: (
  text: string,
  options?: any,
) => string = require('sanitize-html');
/* eslint-enable @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment */

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
    private emailService: EmailService,
  ) {}

  async sendContactMessage(
    createContactDto: CreateContactDto,
  ): Promise<{ success: boolean; message: string }> {
    try {
      const sanitizedDto = this.sanitizeContactDto(createContactDto);

      if (!this.isValidEmailDomain(sanitizedDto.email)) {
        throw new HttpException(
          'Please use a valid email address',
          HttpStatus.BAD_REQUEST,
        );
      }

      const contact = this.contactRepository.create(sanitizedDto);
      await this.contactRepository.save(contact);

      this.logger.log(
        `Contact message saved from: ${sanitizedDto.email} (ID: ${contact.id})`,
      );

      const emailSent = await this.emailService.sendContactEmail({
        name: sanitizedDto.name,
        email: sanitizedDto.email,
        subject: sanitizedDto.subject || 'Contact Form Submission',
        message: sanitizedDto.message,
      });

      if (emailSent) {
        this.logger.log(
          `Email sent successfully for contact ID: ${contact.id}`,
        );
        return {
          success: true,
          message: 'Your message has been sent successfully!',
        };
      } else {
        this.logger.warn(
          `Email sending failed for contact ID: ${contact.id}, but message was saved`,
        );
        return {
          success: false,
          message:
            'Message saved but email sending failed. We will respond soon.',
        };
      }
    } catch (error) {
      this.logger.error(
        `Contact service error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          success: false,
          message: 'Failed to send message. Please try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private sanitizeContactDto(dto: CreateContactDto): CreateContactDto {
    return {
      name: this.sanitizeText(dto.name),
      email: dto.email.trim().toLowerCase(),
      subject: dto.subject
        ? this.sanitizeText(dto.subject)
        : 'Contact Form Submission',
      message: this.sanitizeText(dto.message),
    };
  }

  private sanitizeText(text: string): string {
    const cleaned = sanitizeHtml(text, {
      allowedTags: [],
      allowedAttributes: {},
      disallowedTagsMode: 'recursiveEscape',
    });
    return cleaned.trim();
  }

  private isValidEmailDomain(email: string): boolean {
    const disposableDomains = [
      'tempmail.com',
      'throwaway.email',
      'guerrillamail.com',
      'mailinator.com',
      '10minutemail.com',
      'trashmail.com',
      'temp-mail.org',
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    return !disposableDomains.includes(domain);
  }

  async getAllContacts(): Promise<Contact[]> {
    try {
      return await this.contactRepository.find({
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error(
        `Failed to fetch contacts: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw new HttpException(
        'Failed to retrieve contacts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async markAsRead(id: number): Promise<boolean> {
    try {
      const result = await this.contactRepository.update(id, {
        status: 'read',
      });

      if (result.affected === 0) {
        this.logger.warn(
          `Attempted to mark non-existent contact as read: ${id}`,
        );
        return false;
      }

      this.logger.log(`Contact marked as read: ${id}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Failed to mark contact as read: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return false;
    }
  }
}
