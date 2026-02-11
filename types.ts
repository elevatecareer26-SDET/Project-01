
export interface KpiData {
  label: string;
  value: string;
  trend?: string;
  trendLabel?: string;
  icon: string;
  color: string;
  bgLight: string;
}

export interface SaleItem {
  id: string;
  name: string;
  barcode: string;
  brand: string;
  model: string;
  storage: string;
  color: string;
  price: number;
  costPrice: number;
  stock: number;
  category: string;
  image?: string;
}

export interface CartItem extends SaleItem {
  cartQuantity: number;
  itemDiscount: number;
}

export interface Transaction {
  slNo: number;
  id: string; // Invoice No
  date: string;
  customer: string;
  phone: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
  cashPaid: number;
  onlinePaid: number;
  change: number;
  gotGift: boolean;
  salesman: string;
  status: 'completed' | 'void' | 'returned';
}

export interface ServiceTicket {
  id: string;
  customer: string;
  device: string;
  problem: string;
  tech: string;
  charges: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  avatar?: string;
}
