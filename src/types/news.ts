export interface New {
  id?: string;
  countryCode?: string;
  notificationType?: string;
  category?: string;
  title?: string;
  type?: string;
  body?: any;
  writtenBy?: string;
  videoLink?: string;
  externalLink?: string;
  imageFiles: File[];
  url?: string[];
  urlList?: string[];
}

export interface NewIndex {
  id?: string;
  countryCode?: string;
  urlList?: string;
  notificationType?: string;
  category?: string;
  title?: string;
  type?: string;
  body?: string;
  writtenBy?: string;
  videoLink?: string;
  externalLink?: string;
}
