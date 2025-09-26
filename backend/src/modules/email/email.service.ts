import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  async sendContactEmail(contactData: any): Promise<boolean> {
    try {
      const brevoApiKey = this.configService.get<string>('BREVO_API_KEY');
      const ownerEmail = this.configService.get<string>('OWNER_EMAIL');

      const emailData = {
        sender: {
          name: 'Portfolio Contact Form',
          email: 'noreply@yourdomain.com'
        },
        to: [
          {
            email: ownerEmail,
            name: 'Portfolio Owner'
          }
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
          name: contactData.name
        }
      };

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': brevoApiKey!
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        throw new Error(`Brevo API error: ${response.status}`);
      }

      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }
}
