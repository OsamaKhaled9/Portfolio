// src/modules/content/dto/profile-response.dto.ts
export class ProfileResponseDto {
  success: boolean;
  data: any;
  message?: string;
}

export class PortfolioResponseDto {
  success: boolean;
  data: {
    profile: any;
    projects: any[];
    skills: any[];
    experience: any[];
  };
  message?: string;
}
