export interface RegistrationRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  numTel: string;
  cin: string;
  userType?: string;
  expertise?: string;
  DomaineId?: number;
  biographie?: string;
  interet?: string;
  address?: string;
  point?: string;
}
