export interface User {
  id: string;
  email: string;
  password?: string;
  profile_photo_url?: string;
  cover_photo_url?: string;
  first_name?: string;
  second_name?: string;
  qualification?: string;
  job_position?: string;
  company?: string;
  bio?: string;
  address?: string;
  phone?: string;
  website_url?: string;
  linkedin_url?: string;
  created_at: Date;
  updated_at?: Date;
}

export interface UpdateProfileInput {
  profile_photo_url?: string;
  cover_photo_url?: string;
  first_name?: string;
  second_name?: string;
  qualification?: string;
  job_position?: string;
  company?: string;
  bio?: string;
  address?: string;
  phone?: string;
  website_url?: string;
  linkedin_url?: string;
}
