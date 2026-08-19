import { Partner } from './partner.model';

export interface User {
  id: string;
  username: string;
  partnerId: string;
  partnerRef?: string | Partner;
  level: number;
  roleTitle: string;
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  lastLogin?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  user: User;
}

export interface LoginPayload {
  username: string;
  password?: string;
}
