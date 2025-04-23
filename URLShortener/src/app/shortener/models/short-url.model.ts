export interface ShortURL {
  id: number;
  original_url: string;
  short_code: string;
  short_url: string;
  click_count: number;
  created_at: string;
  updated_at: string;
  active: boolean;
  owner: number;
}

export interface CreateShortURL {
  original_url: string;
}
