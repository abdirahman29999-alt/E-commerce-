import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Archive,
  ShoppingCart,
  Users,
  Tag,
  Truck,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Store,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type AdminTab =
  | 'overview'
  | 'products'
  | 'categories'
  | 'orders'
  | 'customers'
  | 'promotions'
  | 'delivery'
  | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  onNavigateHome: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onNavigateHome,
  children
}) => {
  const { user, logout } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const navItems: { tab: AdminTab; label: string; icon: any; badge?: string }[] = [
    { tab: 'overview', label: 'Tableau de Bord', icon: LayoutDashboard },
    { tab: 'products', label: 'Gestion Produits', icon: Package },
    { tab: 'orders', label: 'Commandes & Livraisons', icon: ShoppingCart },
    { tab: 'categories', label: 'Catégories', icon: Layers },
    { tab: 'customers', label: 'Clients', icon: Users },
    { tab: 'promotions', label: 'Promotions & Coupons', icon: Tag },
    { tab: 'delivery', label: 'Frais de Livraison', icon: Truck },
    { tab: 'settings', label: 'Personnalisation & Paramètres', icon: Settings }
  ];

  const handleSelectTab = (tab: AdminTab) => {
    onTabChange(tab);
    setIsMobileNavOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#3D3A35] flex flex-col">
      
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-30 bg-[#2D2926] text-white border-b border-[#3D3A35] px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="p-1.5 rounded-lg text-[#EAE7E0] hover:text-white hover:bg-white/10 lg:hidden"
          >
            {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#5A5A40] text-white flex items-center justify-center font-bold text-sm">
              DA
            </div>
            <span className="font-bold text-sm sm:text-base tracking-tight font-serif">
              Espace Gestion Commerçant
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-[#5A5A40]/40 text-[#EAE7E0] text-[10px] font-semibold">
              DJIBOUTI 🇩🇯
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold text-[#FAF9F6]/80 hover:text-white transition-colors"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Voir la boutique</span>
            <ExternalLink className="w-3 h-3 text-[#FAF9F6]/50" />
          </button>

          <div className="h-4 w-px bg-[#3D3A35] hidden sm:block" />

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#3D3A35] text-[#FAF9F6] hover:text-white hover:bg-[#4A463F] text-xs font-semibold transition-colors"
            title="Se déconnecter"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#EAE7E0] p-4 justify-between shrink-0">
          <div className="space-y-1">
            <span className="text-[10px] font-bold tracking-wider text-[#7A766F] uppercase px-3 py-2 block">
              Menu d'administration
            </span>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => handleSelectTab(item.tab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#5A5A40] text-white shadow-xs'
                      : 'text-[#3D3A35] hover:bg-[#F2F1ED] hover:text-[#2D2926]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>

          {/* User info footer */}
          <div className="pt-4 border-t border-[#EAE7E0] text-xs space-y-1 px-2">
            <p className="font-semibold text-[#2D2926] truncate">{user?.name || 'Commerçant'}</p>
            <p className="text-[#7A766F] text-[11px] truncate">{user?.email}</p>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileNavOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div
              className="fixed inset-0 bg-stone-950/60"
              onClick={() => setIsMobileNavOpen(false)}
            />
            <div className="relative w-64 max-w-full bg-white p-4 flex flex-col justify-between z-50">
              <div className="space-y-1">
                <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#EAE7E0]">
                  <span className="text-xs font-bold text-[#2D2926] uppercase">
                    Navigation
                  </span>
                  <button
                    onClick={() => setIsMobileNavOpen(false)}
                    className="p-1 text-[#7A766F] hover:text-[#2D2926]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.tab;
                  return (
                    <button
                      key={item.tab}
                      onClick={() => handleSelectTab(item.tab)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#5A5A40] text-white'
                          : 'text-[#3D3A35] hover:bg-[#F2F1ED]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[#EAE7E0] space-y-2">
                <button
                  onClick={() => {
                    setIsMobileNavOpen(false);
                    onNavigateHome();
                  }}
                  className="w-full py-2.5 px-3 bg-[#F2F1ED] text-[#2D2926] text-xs font-semibold rounded-full flex items-center justify-center gap-2"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Voir la boutique publique</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#FAF9F6]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
};
