export interface AuthenticationResponse {
  token: string;
  userId: string;
  role: string;
  isActive: boolean;
  isBanned: boolean;
  isValidated: boolean;
  refreshToken: string;
}
