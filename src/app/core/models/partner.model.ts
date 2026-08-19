export interface SportsWiseConfig {
  received: number;
  given: number;
  remaining: number;
}

export interface Partner {
  _id: string;
  partnerId: string;
  name: string;
  email?: string;
  phone?: string;
  level: number;
  parentId?: any; // Partner or ID
  uplines?: any[]; // Array of Partner objects or IDs
  status: 'Active' | 'Inactive' | 'Pending';
  sportsPartnership?: { [sportCode: string]: SportsWiseConfig } | Map<string, SportsWiseConfig>;
  children?: Partner[];
  createdAt?: string;
  updatedAt?: string;
}
