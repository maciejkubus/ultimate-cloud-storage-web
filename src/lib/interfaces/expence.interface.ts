export interface Expence {
  id?: number;
  created?: string;
  updated?: string;
  name: string;
  description?: string;
  category?: string;
  tags?: string;
  amount: number;
  isTransactionOut?: boolean;
}