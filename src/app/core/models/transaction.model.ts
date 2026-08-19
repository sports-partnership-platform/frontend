export interface PayoutBreakdownItem {
  level: number;
  partnerId: string;
  partnerCode?: string;
  partnerName: string;
  percentage: number;
  amount: number;
  formula?: string;
}

export interface Transaction {
  _id?: string;
  transactionId: string;
  partnerId: string;
  partnerName: string;
  partnerLevel: number;
  sport: string;
  sportName: string;
  amount: number;
  note?: string;
  breakdown: PayoutBreakdownItem[];
  createdAt?: string;
}
