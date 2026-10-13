export type PortfolioCategory =
  | 'all'
  | 'portraits'
  | 'graduation'
  | 'weddings'
  | 'outdoor'
  | 'birthdays'
  | 'product';

export interface PortfolioCategoryMeta {
  id: PortfolioCategory;
  label: string;
  description: string;
}

export interface PhotoTechnicalDetails {
  camera?: string;
  lens?: string;
  lighting?: string;
  sessionType: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: Exclude<PortfolioCategory, 'all'>;
  categoryLabel: string;
  src: string;
  alt: string;
  aspectRatio: '3:2' | '1:1' | '4:3' | '16:9' | '2:3';
  caption: string;
  details: PhotoTechnicalDetails;
}
