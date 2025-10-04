// src/modules/auth/services/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    // Simple hardcoded admin check (replace with database later)
    const adminEmail =
      this.configService.get<string>('ADMIN_EMAIL') || 'admin@admin.com';
    const adminPassword =
      this.configService.get<string>('ADMIN_PASSWORD') || 'password';

    if (email !== adminEmail || password !== adminPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email, sub: 'admin', role: 'admin' };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(payload: any): Promise<any> {
    // In a real app, you'd validate against database
    if (payload.role === 'admin') {
      return { email: payload.email, role: payload.role };
    }
    return null;
  }
}
