export interface Image {
  id: number;
  name: string;
  imageUrl: string;
  imageId: string;
}

export interface Domaine {
  id: number;
  name: string;
  image: Image;
}
