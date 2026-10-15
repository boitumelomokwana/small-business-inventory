export interface BusinessSettings {
  user_id: string;
  business_name: string;
  currency: string;
  tax_rate: number;
  notification_email?: string;
  updated_at: Date;
}

export interface UpdateSettingsDto {
  business_name?: string;
  currency?: string;
  tax_rate?: number;
  notification_email?: string;
}
