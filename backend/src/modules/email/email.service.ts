// src/modules/email/email.service.ts - Debug Version
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {}

  async sendContactEmail(contactData: any): Promise<boolean> {
    try {
      const brevoApiKey = this.configService.get<string>('BREVO_API_KEY');
      const ownerEmail = this.configService.get<string>('OWNER_EMAIL');

      // ✅ DEBUG: Log environment variables
      console.log('🔍 EMAIL DEBUG - Environment Check:');
      console.log('📧 Owner Email:', ownerEmail);
      console.log('🔑 Brevo API Key exists:', !!brevoApiKey);
      console.log('🔑 API Key length:', brevoApiKey ? brevoApiKey.length : 0);
      
      // ✅ DEBUG: Log contact data
      console.log('📝 Contact Data:', {
        name: contactData.name,
        email: contactData.email,
        subject: contactData.subject,
        messageLength: contactData.message?.length
      });

      if (!brevoApiKey) {
        console.error('❌ BREVO_API_KEY not found in environment variables');
        return false;
      }

      if (!ownerEmail) {
        console.error('❌ OWNER_EMAIL not found in environment variables');
        return false;
      }

        const emailData = {
        sender: {
            name: 'Portfolio Contact Form',
            email: ownerEmail  // ✅ Use the same email for sender and recipient
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

      // ✅ DEBUG: Log email payload
      console.log('📤 Sending email with payload:', {
        sender: emailData.sender,
        to: emailData.to,
        subject: emailData.subject,
      });

      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': brevoApiKey
        },
        body: JSON.stringify(emailData)
      });

      // ✅ DEBUG: Log API response
      console.log('📡 Brevo API Response Status:', response.status);
      
      const responseText = await response.text();
      console.log('📡 Brevo API Response:', responseText);

      if (!response.ok) {
        console.error('❌ Brevo API Error:', {
          status: response.status,
          statusText: response.statusText,
          body: responseText
        });
        return false;
      }

      console.log('✅ Email sent successfully!');
      return true;
    } catch (error) {
      console.error('💥 Email sending failed with exception:', error);
      return false;
    }
  }
}
