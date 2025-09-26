import { Controller, Post, Body, UsePipes, ValidationPipe,Get } from '@nestjs/common';
import { ContactService } from '../services/contact.service.js';
import { CreateContactDto } from '../dto/create-contact.dto.js';
import { EmailService as emailService } from '../../email/email.service.js';
@Controller('api')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('contact')
  @UsePipes(new ValidationPipe())
  async sendContactMessage(@Body() createContactDto: CreateContactDto) {
    return await this.contactService.sendContactMessage(createContactDto);
  }
  // Add this to your contact.service.ts
@Get('contact/test-email')
async testEmail() {
  try {
    const result = await this.contactService.testEmail();
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
}

