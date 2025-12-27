export interface Video {
  id?: string;
  description?: string;
  imageFile: any;
  category?: string;
  coverImage?: string;
  videoLink?: string;
  status?: boolean;
  isSeries?: boolean;
  videoLinkSeries: string[];
}

export interface VideoIndex {
  id?: string;
  description?: string;
  category?: string;
  coverImage?: string;
  videoLink?: string;
  status?: boolean;
}
