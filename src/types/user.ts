export interface UserMetadata {
  full_name?: string;
  avatar_url?: string;
  [key: string]: any;
}

export interface UserSettings {
  theme?: 'light' | 'dark' | 'system';
  notifications_enabled?: boolean;
  [key: string]: any;
} 