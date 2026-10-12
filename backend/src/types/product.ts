export interface ProductInput {
  name: string;
  category: string;
  price: number;
  stock_quantity: number;
  low_stock_threshold: number;
}

export interface Product extends ProductInput {
  id: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
}
