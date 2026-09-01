import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Phone,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronRight,
  Package
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { Category, StoreSettings } from '../types';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, param?: any) => void;
  categories: Category[];
  settings: StoreSettings | null;
  onOpenTracker: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  categories,
  settings,
  onOpenTracker
}) => {
  const { itemCount, openCartDrawer } = useCart();
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('catalog', { search: searchQuery.trim() });
      setIsMobileMenuOpen(false);
    }
  };

  const storePhone = settings?.phone || '+253 77 12 34 56';
  const whatsappNumber = settings?.whatsapp?.replace(/[^0-9]/g, '') || '25377123456';

  return (
    <>
      {/* Top Announcement Bar */}
      {settings?.isAnnouncementActive && (
        <div className="bg-[#5A5A40] text-white px-4 py-2 text-xs font-medium border-b border-[#4A4A30]">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/20 text-white font-bold text-[10px] tracking-wider">
                {settings.announcementTag || 'DJIBOUTI 🇩🇯'}
              </span>
              <span className="truncate text-stone-100">{settings.announcementBar}</span>
            </div>
            <div className="hidden md:flex items-center gap-5 text-stone-200 text-xs shrink-0">
              <a
                href={`tel:${storePhone}`}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-stone-200" />
                <span>{storePhone}</span>
              </a>
              <button
                id="header-track-order-top"
                onClick={onOpenTracker}
                className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Suivre ma commande</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#EAE7E0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
            
            {/* Mobile Menu Toggle & Brand Logo */}
            <div className="flex items-center gap-3">
              <button
                id="btn-mobile-menu-toggle"
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 -ml-2 text-[#3D3A35] hover:text-[#5A5A40] rounded-lg lg:hidden cursor-pointer"
                aria-label="Ouvrir le menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <button
                id="header-brand-logo"
                onClick={() => onNavigate('home')}
                className="flex items-center gap-2.5 text-left group cursor-pointer"
              >
                {settings?.logo ? (
                  <img
                    src={settings.logo}
                    alt={settings.storeName || 'Logo'}
                    className="h-10 sm:h-12 w-auto max-w-[150px] object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-[#5A5A40] flex items-center justify-center text-white font-bold text-lg shadow-xs group-hover:bg-[#4A4A30] transition-colors font-serif">
                    {settings?.storeName ? settings.storeName.slice(0, 2).toUpperCase() : 'DA'}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-lg sm:text-xl font-bold tracking-tight text-[#2D2926] flex items-center gap-1 font-serif">
                    {settings?.storeName || 'DjiAccess'}
                  </span>
                  <span className="text-[10px] font-semibold tracking-wider text-[#7A766F] uppercase -mt-0.5">
                    {settings?.logoSubtitle || 'Accessoires • Djibouti'}
                  </span>
                </div>
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#7A766F]">
              <button
                id="nav-link-home"
                onClick={() => onNavigate('home')}
                className={`transition-colors hover:text-[#5A5A40] ${
                  currentView === 'home' ? 'text-[#5A5A40] font-bold' : ''
                }`}
              >
                Accueil
              </button>
              <button
                id="nav-link-catalog"
                onClick={() => onNavigate('catalog')}
                className={`transition-colors hover:text-[#5A5A40] ${
                  currentView === 'catalog' ? 'text-[#5A5A40] font-bold' : ''
                }`}
              >
                Explorer la Collection
              </button>
              <button
                id="nav-link-promos"
                onClick={() => onNavigate('catalog', { isPromo: true })}
                className="flex items-center gap-1.5 text-[#5A5A40] hover:text-[#4A4A30] transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" />
                Offres Spéciales
              </button>
              <button
                id="nav-link-track"
                onClick={onOpenTracker}
                className="hover:text-[#5A5A40] transition-colors flex items-center gap-1.5"
              >
                <Package className="w-4 h-4 text-[#7A766F]" />
                Suivi Colis
              </button>
            </nav>

            {/* Search Bar on Tablet/Desktop */}
            <div className="hidden sm:flex flex-1 max-w-xs lg:max-w-md mx-2">
              <form onSubmit={handleSearchSubmit} className="w-full relative">
                <input
                  id="header-search-input"
                  type="text"
                  placeholder="Rechercher écouteur, coque, montre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-[#F2F1ED] rounded-full border border-transparent focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]/30 focus:border-[#5A5A40] transition-all placeholder:text-[#7A766F]"
                />
                <Search className="w-4 h-4 text-[#7A766F] absolute left-3 top-1/2 -translate-y-1/2" />
              </form>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* WhatsApp Quick Order Button */}
              <a
                id="btn-header-whatsapp"
                href={`https://wa.me/${whatsappNumber}?text=Bonjour%20DjiAccess,%20je%20souhaite%20des%20renseignements%20sur%20vos%20accessoires.`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-[#F2F1ED] text-[#5A5A40] border border-[#EAE7E0] hover:bg-[#EAE7E0] transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-[#5A5A40] animate-pulse"></span>
                WhatsApp Direct
              </a>

              {/* Discreet Admin indicator if already authenticated */}
              {isAuthenticated && (
                <button
                  id="btn-header-admin"
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="p-2 rounded-xl text-[#5A5A40] bg-[#F2F1ED] border border-[#5A5A40]/30 hover:bg-[#EAE7E0] transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
                  title="Tableau de Bord Admin"
                >
                  <ShieldCheck className="w-4 h-4 text-[#5A5A40]" />
                  <span className="hidden xl:inline">Admin</span>
                </button>
              )}

              {/* Shopping Cart Button */}
              <button
                id="btn-header-cart"
                type="button"
                onClick={openCartDrawer}
                className="relative p-2.5 rounded-xl bg-[#5A5A40] text-white hover:bg-[#4A4A30] transition-all duration-200 flex items-center justify-center shadow-xs active:scale-95 cursor-pointer"
                aria-label={`Panier (${itemCount} articles)`}
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-[#2D2926] text-white font-bold text-xs flex items-center justify-center shadow-xs animate-in zoom-in-50">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar below header for small screens */}
          <div className="pb-3 sm:hidden">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                id="mobile-search-input"
                type="text"
                placeholder="Rechercher à Djibouti (ex: powerbank, montre...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-[#F2F1ED] rounded-xl border border-[#EAE7E0] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
              />
              <Search className="w-4 h-4 text-[#7A766F] absolute left-3 top-1/2 -translate-y-1/2" />
            </form>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#EAE7E0] bg-[#FAF9F6] px-4 pt-3 pb-6 space-y-4 shadow-xl">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onNavigate('home');
                  setIsMobileMenuOpen(false);
                }}
                className="p-3 text-left font-medium text-[#2D2926] bg-white border border-[#EAE7E0] rounded-xl hover:bg-[#F2F1ED] transition-colors"
              >
                Accueil
              </button>
              <button
                onClick={() => {
                  onNavigate('catalog');
                  setIsMobileMenuOpen(false);
                }}
                className="p-3 text-left font-medium text-[#2D2926] bg-white border border-[#EAE7E0] rounded-xl hover:bg-[#F2F1ED] transition-colors"
              >
                Tous les Produits
              </button>
              <button
                onClick={() => {
                  onNavigate('catalog', { isPromo: true });
                  setIsMobileMenuOpen(false);
                }}
                className="p-3 text-left font-medium text-[#5A5A40] bg-white border border-[#EAE7E0] rounded-xl hover:bg-[#F2F1ED] transition-colors flex items-center justify-between"
              >
                <span>Promotions</span>
                <Sparkles className="w-4 h-4 text-[#5A5A40]" />
              </button>
              <button
                onClick={() => {
                  onOpenTracker();
                  setIsMobileMenuOpen(false);
                }}
                className="p-3 text-left font-medium text-[#2D2926] bg-white border border-[#EAE7E0] rounded-xl hover:bg-[#F2F1ED] transition-colors flex items-center justify-between"
              >
                <span>Suivre Colis</span>
                <Truck className="w-4 h-4 text-[#5A5A40]" />
              </button>
            </div>

            {/* Categories in mobile menu */}
            <div>
              <h4 className="text-xs font-bold text-[#7A766F] uppercase tracking-wider mb-2">
                Catégories
              </h4>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      onNavigate('catalog', { category: cat.id });
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg text-sm text-[#3D3A35] hover:bg-white transition-colors"
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="w-4 h-4 text-[#7A766F]" />
                  </button>
                ))}
              </div>
            </div>

            {/* Footer info in mobile drawer */}
            <div className="pt-3 border-t border-[#EAE7E0] flex items-center justify-between">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    onNavigate('admin');
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-xs font-semibold text-[#5A5A40] flex items-center gap-1.5 p-2 bg-white border border-[#EAE7E0] rounded-lg cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Tableau Admin
                </button>
              ) : (
                <span className="text-[11px] text-[#7A766F]">Livraison Express Djibouti 🇩🇯</span>
              )}
              <a
                href={`tel:${storePhone}`}
                className="text-xs font-semibold text-[#7A766F] flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5 text-[#7A766F]" />
                {storePhone}
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
