export interface Client {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  adresse: string;
  numTel: string;
  cin: string;
  image: {
    imageUrl: string;
  };  interet: string;
  rating: number;
  role: string;
  isBanned: boolean;
}
