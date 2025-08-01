// components/Interface.tsx
export interface IProduct {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  discountPercent: number;
  isNew: boolean;
  colors: string[];
  sizes: string[];
  additionalImages?: string[];
}

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  selectedSize?: string;
  selectedColor?: string;
  quantity: number;
  imageUrl?: string;
  timestamp: number;
  description?: string;
  category?: string;
  discountPercent?: number;
  isNew?: boolean;
  slug?: { current: string };
}