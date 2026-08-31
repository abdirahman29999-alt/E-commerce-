export type ProductStatus = 'active' | 'draft' | 'archived';

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number; // in FDJ
  compareAtPrice?: number; // former price in FDJ
  discountPercent?: number;
  stock: number;
  lowStockThreshold: number;
  categoryId: string;
  categoryName?: string;
  description: string;
  images: string[];
  status: ProductStatus;
  isFeatured: boolean;
  isNew: boolean;
  isPromo: boolean;
  rating: number;
  reviewsCount: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  description?: string;
  isActive: boolean;
  productCount?: number;
}

export interface DeliveryZone {
  id: string;
  name: string;
  price: number; // in FDJ
  estimatedHours: string;
  description?: string;
  isActive: boolean;
}

export type OrderStatus =
  | 'nouvelle'
  | 'confirmee'
  | 'preparation'
  | 'prete'
  | 'en_livraison'
  | 'livree'
  | 'annulee';

export type PaymentMethod = 'cash_on_delivery' | 'd_money' | 'waafi' | 'card';

export interface OrderItem {
  productId: string;
  productName: string;
  sku?: string;
  price: number;
  quantity: number;
  image: string;
  total: number;
}

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  district: string; // Quartier à Djibouti
  address: string;
  city: string;
  deliveryNotes?: string;
  deliveryZoneId: string;
  deliveryZoneName: string;
  deliveryFee: number;
  subtotal: number;
  discountTotal?: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  status: OrderStatus;
  items: OrderItem[];
  statusHistory: OrderStatusHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  district?: string;
  address?: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate?: string;
  createdAt: string;
}

export interface Promotion {
  id: string;
  code: string;
  title: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageCount: number;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  logo: string;
  logoText?: string;
  logoSubtitle?: string;
  favicon?: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  openingHours: string;
  currency: string;
  currencySymbol: string;
  aboutText: string;
  announcementBar: string;
  isAnnouncementActive: boolean;
  announcementTag?: string;
  
  // Hero Homepage Customization
  heroImage?: string;
  heroBadge?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  heroPrimaryBtnText?: string;
  heroPrimaryBtnLink?: string;
  heroSecondaryBtnText?: string;
  heroSecondaryBtnLink?: string;
  heroTrust1Number?: string;
  heroTrust1Label?: string;
  heroTrust2Number?: string;
  heroTrust2Label?: string;
  heroTrust3Number?: string;
  heroTrust3Label?: string;

  // Hero Card Showcase Customization
  heroCardImage?: string;
  heroCardTag?: string;
  heroCardDiscount?: string;
  heroCardTitle?: string;
  heroCardDesc?: string;
  heroCardPrice?: number;
  heroCardOldPrice?: number;
  heroCardProductId?: string;

  // Colors & Theme Customization
  primaryColor?: string;
  primaryHoverColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  colorPreset?: string;

  // Reassurance Customization
  reassurance1Title?: string;
  reassurance1Desc?: string;
  reassurance2Title?: string;
  reassurance2Desc?: string;
  reassurance3Title?: string;
  reassurance3Desc?: string;
  reassurance4Title?: string;
  reassurance4Desc?: string;

  // Payments & Social
  enableCashOnDelivery: boolean;
  enableDMoney: boolean;
  enableWaafi: boolean;
  dMoneyNumber: string;
  waafiNumber: string;
  facebookUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'manager';
}

export interface DashboardStats {
  revenueToday: number;
  revenueThisMonth: number;
  ordersToday: number;
  pendingOrdersCount: number;
  totalProductsCount: number;
  lowStockProductsCount: number;
  totalCustomersCount: number;
  recentOrders: Order[];
  topSellingProducts: {
    product: Product;
    soldUnits: number;
    revenue: number;
  }[];
  dailySales: { date: string; revenue: number; orders: number }[];
  categoryDistribution: { name: string; value: number }[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}
