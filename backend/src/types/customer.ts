export interface Customer {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCustomerDto {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface UpdateCustomerDto {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
}
