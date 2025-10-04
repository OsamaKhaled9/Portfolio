import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ContactService } from '../services/contact.service.js';
import { CreateContactDto } from '../dto/create-contact.dto.js';

@Controller('api')
export class ContactController {
  private readonly logger = new Logger(ContactController.name);

  constructor(private readonly contactService: ContactService) {}

  @Post('contact')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute to prevent spam
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async sendContactMessage(@Body() createContactDto: CreateContactDto) {
    try {
      const result =
        await this.contactService.sendContactMessage(createContactDto);
      this.logger.log(
        `Contact message sent from: ${createContactDto.email || 'unknown'}`,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to send contact message: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      throw new HttpException(
        {
          success: false,
          message: 'Failed to send contact message. Please try again later.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
