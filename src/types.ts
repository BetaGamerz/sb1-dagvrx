export interface Material {
  name: string;
  price: number;
  quantity: string;
}

export interface Fabric {
  type: string;
  usage: string;
  pricePerMeter: number;
}

export interface Design {
  id: string;
  designNumber: string;
  image: string;
  fabrics: Fabric[];
  cuttingSize: string;
  materials: Material[];
  totalPrice: number;
  createdAt: string;
  notes?: string;
}

export interface AuthContextType {
  isAdmin: boolean;
  login: (password: string) => void;
  logout: () => void;
}

export interface BillItem {
  id: string;
  designNumber: string;
  quantity: number;
  price: number;
  amount: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  date: string;
  customerName: string;
  items: BillItem[];
  gstPercentage: number;
  subtotal: number;
  gstAmount: number;
  total: number;
}