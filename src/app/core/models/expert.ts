export class Expert{
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  adresse: string;
  numTel: string;
  cin: string;
  image: {
    imageUrl: string;
  };
  expertise: string;
  domaineExpertise: string;
  biographie: string;
  rating: number;
  role;
  isValidated: boolean;
  isBanned: boolean;
}
