export interface Category {
  id: number;
  name: string;
}

export interface ShortURL {
  id: number;
  original_url: string;
  short_code: string;
  short_url: string;
  category: number | null;
  click_count: number;
  created_at: string;
  updated_at: string;
  active: boolean;
  owner: number;
}

export interface CreateShortURL {
  original_url: string;
  category_id?: number | null;
}

export interface UpdateShortURL {
  original_url?: string;
  category_id?: number | null;
}
