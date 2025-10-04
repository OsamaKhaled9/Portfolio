import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  async sendContactEmail(contactData: ContactData): Promise<boolean> {
    try {
      const brevoApiKey = this.configService.get<string>('BREVO_API_KEY');
      const ownerEmail = this.configService.get<string>('OWNER_EMAIL');

      if (!brevoApiKey) {
        console.error('BREVO_API_KEY not found in environment variables');
        return false;
      }

      if (!ownerEmail) {
        console.error('OWNER_EMAIL not found in environment variables');
        return false;
      }

      const emailData = {
        sender: {
          name: 'Portfolio Contact Form',
          email: ownerEmail,
        },
        to: [
          {
            email: ownerEmail,
            name: 'Portfolio Owner',
          },
        ],
        subject: contactData.subject || 'New Contact Form Submission',
        htmlContent: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Subject:</strong> ${contactData.subject || 'No subject'}</p>
          <p><strong>Message:</strong></p>
          <p>${contactData.message}</p>
          <hr>
          <p><small>Sent from your portfolio contact form</small></p>
        `,
        replyTo: {
          email: contactData.email,
          name: contactData.name,
        },
      };

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'api-key': brevoApiKey,
        },
        body: JSON.stringify(emailData),
      });

      const responseText = await response.text();
      console.log('Brevo API Response:', responseText);

      if (!response.ok) {
        console.error('Brevo API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: responseText,
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Email sending failed with exception:', error);
      return false;
    }
  }
}
