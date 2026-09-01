import type {
  Product,
  Category,
  DeliveryZone,
  Order,
  Customer,
  Promotion,
  StoreSettings,
  DashboardStats,
  OrderStatus
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('djiaccess_admin_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `Erreur serveur (${res.status})`);
  }
  return data as T;
}

export const api = {
  // Settings
  async getSettings(): Promise<StoreSettings> {
    const res = await fetch(`${API_BASE}/settings`);
    return handleResponse<StoreSettings>(res);
  },

  async updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(settings)
    });
    return handleResponse<StoreSettings>(res);
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    return handleResponse<Category[]>(res);
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<Category>(res);
  },

  async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<Category>(res);
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean }>(res);
  },

  // Products
  async getProducts(params?: {
    category?: string;
    search?: string;
    status?: string;
    isPromo?: boolean;
    isFeatured?: boolean;
    isNew?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    includeArchived?: boolean;
  }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.isPromo) query.set('isPromo', 'true');
    if (params?.isFeatured) query.set('isFeatured', 'true');
    if (params?.isNew) query.set('isNew', 'true');
    if (params?.minPrice !== undefined) query.set('minPrice', params.minPrice.toString());
    if (params?.maxPrice !== undefined) query.set('maxPrice', params.maxPrice.toString());
    if (params?.sort) query.set('sort', params.sort);
    if (params?.includeArchived) query.set('includeArchived', 'true');

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    return handleResponse<Product[]>(res);
  },

  async getProductById(id: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return handleResponse<Product>(res);
  },

  async getProductBySlug(slug: string): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/slug/${slug}`);
    return handleResponse<Product>(res);
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(product)
    });
    return handleResponse<Product>(res);
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(product)
    });
    return handleResponse<Product>(res);
  },

  async deleteProduct(id: string, permanent: boolean = false): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/products/${id}?permanent=${permanent}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean }>(res);
  },

  // Delivery Zones
  async getDeliveryZones(): Promise<DeliveryZone[]> {
    const res = await fetch(`${API_BASE}/delivery-zones`);
    return handleResponse<DeliveryZone[]>(res);
  },

  async updateDeliveryZones(zones: DeliveryZone[]): Promise<DeliveryZone[]> {
    const res = await fetch(`${API_BASE}/delivery-zones`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(zones)
    });
    return handleResponse<DeliveryZone[]>(res);
  },

  // Promotions
  async getPromotions(): Promise<Promotion[]> {
    const res = await fetch(`${API_BASE}/promotions`);
    return handleResponse<Promotion[]>(res);
  },

  async validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; promo: Promotion; discountAmount: number }> {
    const res = await fetch(`${API_BASE}/promotions/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal })
    });
    return handleResponse<{ valid: boolean; promo: Promotion; discountAmount: number }>(res);
  },

  async createPromotion(promo: Partial<Promotion>): Promise<Promotion> {
    const res = await fetch(`${API_BASE}/promotions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(promo)
    });
    return handleResponse<Promotion>(res);
  },

  async updatePromotion(id: string, promo: Partial<Promotion>): Promise<Promotion> {
    const res = await fetch(`${API_BASE}/promotions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(promo)
    });
    return handleResponse<Promotion>(res);
  },

  async deletePromotion(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/promotions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean }>(res);
  },

  // Orders
  async getOrders(params?: { status?: OrderStatus; search?: string }): Promise<Order[]> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);

    const res = await fetch(`${API_BASE}/orders?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<Order[]>(res);
  },

  async getOrder(idOrNumber: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${idOrNumber}`);
    return handleResponse<Order>(res);
  },

  async createOrder(orderData: any): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    return handleResponse<Order>(res);
  },

  async updateOrderStatus(id: string, status: OrderStatus, note?: string): Promise<Order> {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, note })
    });
    return handleResponse<Order>(res);
  },

  // Customers
  async getCustomers(): Promise<Customer[]> {
    const res = await fetch(`${API_BASE}/customers`, {
      headers: getAuthHeaders()
    });
    return handleResponse<Customer[]>(res);
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const res = await fetch(`${API_BASE}/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse<DashboardStats>(res);
  },

  // Database Export & Import
  async exportDatabase(): Promise<any> {
    const res = await fetch(`${API_BASE}/database/export`, {
      headers: getAuthHeaders()
    });
    return handleResponse<any>(res);
  },

  async importDatabase(data: any): Promise<{ success: boolean; message: string; counts: any }> {
    const res = await fetch(`${API_BASE}/database/import`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse<{ success: boolean; message: string; counts: any }>(res);
  },

  // Seed / Reset
  async resetDatabase(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/seed/reset`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  // Auth
  async login(username: string, password: string): Promise<{ token: string; user: any }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return handleResponse<{ token: string; user: any }>(res);
  },

  async checkAuth(): Promise<{ user: any }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ user: any }>(res);
  }
};

export function formatFDJ(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) return '0 FDJ';
  return `${Math.round(amount).toLocaleString('fr-FR')} FDJ`;
}
