export interface SubscriberFindAllInput {
  status?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  sort_by?: 'created_at' | 'updated_at';
  order?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}