export interface PaymentData {
  id: number;
  payment_id: string;
  user_id: number;
  enrollment_id: number | null;
  batch_id: number | null;
  amount: string;
  currency: string;
  payment_method: string;
  transaction_id: string | null;
  status: string;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
  };
  batch: {
    id: number;
    name: string;
  } | null;
}