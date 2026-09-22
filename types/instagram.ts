export interface InstagramPost {
  id: string;
  image: string;
  postUrl: string;
  caption: string;
  likes: string;
  displayOrder?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface InstagramPostFormData {
  image: string;
  postUrl: string;
  caption: string;
  likes: string;
  displayOrder?: number;
}
