export type CategoryId = 'essential-tools' | 'movies' | 'social-media' | string;

export interface CategoryItem {
  id: CategoryId;
  name: string;
  tagline: string;
  description: string;
  itemCount: string;
  iconName: string;
  badge?: string;
  color: string;
}

export interface ToolItem {
  id: string;
  name: string;
  shortDescription: string;
  category: string;
  iconName: string;
  isPopular?: boolean;
  isNew?: boolean;
  tags: string[];
}

export interface MovieItem {
  id: string;
  title: string;
  releaseYear: number;
  genre: string[];
  rating: number;
  duration: string;
  backdropUrl: string;
  shortDescription: string;
  director?: string;
  isPopular?: boolean;
  isNew?: boolean;
}

export interface SocialPlatformItem {
  id: string;
  name: string;
  shortDescription: string;
  iconName: string;
  url: string;
  badge?: string;
  color: string;
  isPopular?: boolean;
  isNew?: boolean;
}

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  category: 'Essential Tools' | 'Movies' | 'Social Media' | 'Web & Platform';
  sourceDomain: string;
  url: string;
  rating?: number;
  tags: string[];
  type: 'tool' | 'movie' | 'social' | 'external';
}

export interface UserProfile {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  created_at?: string;
  updated_at?: string;
}
