import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { QuickCartDrawer } from './components/QuickCartDrawer';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { ThemeStyle } from './components/ThemeStyle';

import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';

import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout, AdminTab } from './pages/admin/AdminLayout';
import { AdminDashboardOverview } from './pages/admin/AdminDashboardOverview';
import { AdminProductsManager } from './pages/admin/AdminProductsManager';
import { AdminOrdersManager } from './pages/admin/AdminOrdersManager';
import { AdminCategoriesManager } from './pages/admin/AdminCategoriesManager';
import { AdminCustomersManager } from './pages/admin/AdminCustomersManager';
import { AdminPromotionsManager } from './pages/admin/AdminPromotionsManager';
import { AdminDeliveryManager } from './pages/admin/AdminDeliveryManager';
import { AdminSettingsManager } from './pages/admin/AdminSettingsManager';

import { api } from './services/api';
import type { Product, Category, DeliveryZone, StoreSettings, Order, DashboardStats, Customer, Promotion } from './types';
import { Home, Grid, Truck, ShoppingBag, ShieldCheck } from 'lucide-react';

function MainApp() {
  const { isAuthenticated } = useAuth();
  const { itemCount, openCartDrawer } = useCart();

  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'product' | 'cart' | 'checkout' | 'order-success' | 'track' | 'admin'>('home');
  const [viewParams, setViewParams] = useState<any>({});
  const [adminTab, setAdminTab] = useState<AdminTab>('overview');

  // Modal State
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [trackerInitialOrder, setTrackerInitialOrder] = useState('');

  // App Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);

  // Admin Data State
  const [adminStats, setAdminStats] = useState<DashboardStats | null>(null);
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [adminCustomers, setAdminCustomers] = useState<Customer[]>([]);
  const [adminPromotions, setAdminPromotions] = useState<Promotion[]>([]);

  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Fetch Core Public Data
  const loadPublicData = useCallback(async () => {
    try {
      const [prodsData, catsData, zonesData, settingsData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getDeliveryZones(),
        api.getSettings()
      ]);
      setProducts(prodsData);
      setCategories(catsData);
      setDeliveryZones(zonesData);
      setSettings(settingsData);
    } catch (err) {
      console.error('Failed to load public data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Admin Data
  const loadAdminData = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const [statsData, ordersData, custsData, promosData, prodsData, catsData, zonesData, settingsData] = await Promise.all([
        api.getDashboardStats(),
        api.getOrders(),
        api.getCustomers(),
        api.getPromotions(),
        api.getProducts(),
        api.getCategories(),
        api.getDeliveryZones(),
        api.getSettings()
      ]);
      setAdminStats(statsData);
      setAdminOrders(ordersData);
      setAdminCustomers(custsData);
      setAdminPromotions(promosData);
      setProducts(prodsData);
      setCategories(catsData);
      setDeliveryZones(zonesData);
      setSettings(settingsData);
    } catch (err) {
      console.error('Failed to load admin data', err);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadPublicData();
  }, [loadPublicData]);

  useEffect(() => {
    if (isAuthenticated && currentView === 'admin') {
      loadAdminData();
    }
  }, [isAuthenticated, currentView, loadAdminData]);

  // Navigation Helper
  const navigate = (view: any, params: any = {}) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setViewParams(params);

    if (view === 'product' && params.id) {
      const prod = products.find((p) => p.id === params.id);
      if (prod) setSelectedProduct(prod);
    }

    setCurrentView(view);
  };

  const handleOpenTracker = (orderNumber = '') => {
    setTrackerInitialOrder(orderNumber);
    setIsTrackerModalOpen(true);
  };

  const handleOrderCompleted = (order: Order) => {
    setCompletedOrder(order);
    navigate('order-success');
    loadPublicData();
  };

  const handleOrderStatusChange = async (orderId: string, newStatus: any) => {
    await api.updateOrderStatus(orderId, newStatus);
    loadAdminData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#5A5A40] text-white flex items-center justify-center font-bold text-xl tracking-tighter shadow-md animate-pulse">
          DA
        </div>
        <p className="text-xs font-semibold text-[#5A5A40]">Chargement de la boutique DjiAccess...</p>
      </div>
    );
  }

  // --- ADMIN VIEW ---
  if (currentView === 'admin') {
    if (!isAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={() => loadAdminData()}
          onNavigateHome={() => navigate('home')}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        onTabChange={(tab) => setAdminTab(tab)}
        onNavigateHome={() => navigate('home')}
      >
        {adminTab === 'overview' && (
          <AdminDashboardOverview
            stats={adminStats}
            recentOrders={adminOrders}
            onNavigateTab={(tab) => setAdminTab(tab)}
            onStatusChange={handleOrderStatusChange}
          />
        )}
        {adminTab === 'products' && (
          <AdminProductsManager
            products={products}
            categories={categories}
            onRefresh={loadAdminData}
          />
        )}
        {adminTab === 'orders' && (
          <AdminOrdersManager
            orders={adminOrders}
            onRefresh={loadAdminData}
          />
        )}
        {adminTab === 'categories' && (
          <AdminCategoriesManager
            categories={categories}
            onRefresh={loadAdminData}
          />
        )}
        {adminTab === 'customers' && (
          <AdminCustomersManager
            customers={adminCustomers}
          />
        )}
        {adminTab === 'promotions' && (
          <AdminPromotionsManager
            promotions={adminPromotions}
            onRefresh={loadAdminData}
          />
        )}
        {adminTab === 'delivery' && (
          <AdminDeliveryManager
            zones={deliveryZones}
            onRefresh={loadAdminData}
          />
        )}
        {adminTab === 'settings' && (
          <AdminSettingsManager
            settings={settings}
            onRefresh={loadAdminData}
          />
        )}
      </AdminLayout>
    );
  }

  // --- PUBLIC VIEWS ---
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#3D3A35] font-sans">
      {/* Dynamic Theme Injector */}
      <ThemeStyle settings={settings} />

      {/* Header */}
      <Header
        currentView={currentView}
        onNavigate={navigate}
        categories={categories}
        settings={settings}
        onOpenTracker={() => handleOpenTracker()}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            products={products}
            categories={categories}
            settings={settings}
            onNavigate={navigate}
            onOpenTracker={() => handleOpenTracker()}
          />
        )}

        {currentView === 'catalog' && (
          <CatalogPage
            products={products}
            categories={categories}
            initialCategory={viewParams.category}
            initialSearch={viewParams.search}
            initialIsPromo={viewParams.isPromo}
            initialIsNew={viewParams.isNew}
            onNavigateToDetail={(prod) => {
              setSelectedProduct(prod);
              navigate('product', { id: prod.id });
            }}
          />
        )}

        {currentView === 'product' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            categories={categories}
            settings={settings}
            onNavigateBack={() => navigate('catalog')}
            onNavigateToProduct={(p) => {
              setSelectedProduct(p);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToCategory={(catId) => navigate('catalog', { category: catId })}
          />
        )}

        {currentView === 'cart' && (
          <CartPage
            deliveryZones={deliveryZones}
            settings={settings}
            onNavigateToCheckout={() => navigate('checkout')}
            onNavigateToCatalog={() => navigate('catalog')}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            deliveryZones={deliveryZones}
            settings={settings}
            onOrderCompleted={handleOrderCompleted}
            onNavigateBack={() => navigate('cart')}
          />
        )}

        {currentView === 'order-success' && completedOrder && (
          <OrderSuccessPage
            order={completedOrder}
            settings={settings}
            onNavigateHome={() => navigate('home')}
            onTrackOrder={(orderNum) => navigate('track', { orderNumber: orderNum })}
          />
        )}

        {currentView === 'track' && (
          <OrderTrackingPage
            initialOrderNumber={viewParams.orderNumber}
            onNavigateHome={() => navigate('home')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        categories={categories}
        onNavigate={navigate}
        onOpenTracker={() => handleOpenTracker()}
      />

      {/* Quick Cart Slide-Over Drawer */}
      <QuickCartDrawer
        settings={settings}
        onNavigateToCheckout={() => navigate('checkout')}
        onNavigateToCatalog={() => navigate('catalog')}
      />

      {/* Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerModalOpen}
        onClose={() => setIsTrackerModalOpen(false)}
        initialOrderNumber={trackerInitialOrder}
      />

      {/* Mobile Bottom Navigation Bar (1-thumb operation on smartphones) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE7E0] px-3 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => navigate('home')}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            currentView === 'home' ? 'text-[#5A5A40] font-bold' : 'text-[#7A766F] hover:text-[#5A5A40]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Accueil</span>
        </button>

        <button
          onClick={() => navigate('catalog')}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            currentView === 'catalog' ? 'text-[#5A5A40] font-bold' : 'text-[#7A766F] hover:text-[#5A5A40]'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span>Explorer</span>
        </button>

        <button
          onClick={() => handleOpenTracker()}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            currentView === 'track' ? 'text-[#5A5A40] font-bold' : 'text-[#7A766F] hover:text-[#5A5A40]'
          }`}
        >
          <Truck className="w-5 h-5" />
          <span>Suivi</span>
        </button>

        <button
          onClick={openCartDrawer}
          className="relative flex flex-col items-center gap-1 text-[10px] font-medium text-[#7A766F] hover:text-[#5A5A40]"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#5A5A40] text-white font-bold text-[9px] flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </div>
          <span>Panier</span>
        </button>

        <button
          onClick={() => navigate('admin')}
          className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
            currentView === 'admin' ? 'text-[#5A5A40] font-bold' : 'text-[#7A766F] hover:text-[#5A5A40]'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span>Admin</span>
        </button>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
