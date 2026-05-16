export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}
