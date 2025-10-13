export interface Customer {
  id: number;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  role: string;
  token?: string;
}