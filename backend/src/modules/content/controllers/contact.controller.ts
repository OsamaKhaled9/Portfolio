import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { ContactService } from '../services/contact.service.js';
import { CreateContactDto } from '../dto/create-contact.dto.js';

@Controller('api')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('contact')
  @UsePipes(new ValidationPipe())
  async sendContactMessage(@Body() createContactDto: CreateContactDto) {
    return await this.contactService.sendContactMessage(createContactDto);
  }
}
