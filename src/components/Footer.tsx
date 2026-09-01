import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Truck,
  Shield,
  CreditCard,
  Headphones,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import type { Category, StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings | null;
  categories: Category[];
  onNavigate: (view: string, param?: any) => void;
  onOpenTracker: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  categories,
  onNavigate,
  onOpenTracker
}) => {
  const storeName = settings?.storeName || 'DjiAccess Boutique';
  const whatsappNumber = settings?.whatsapp?.replace(/[^0-9]/g, '') || '25377123456';

  return (
    <footer className="bg-[#2D2926] text-[#FAF9F6]/80 border-t border-[#3D3A35] pt-12 pb-24 sm:pb-12">
      {/* Guarantees Ribbon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-b border-[#3D3A35]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#3D3A35] text-[#FAF9F6] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#FAF9F6]">Livraison Express</h4>
              <p className="text-xs text-[#FAF9F6]/60 mt-0.5">En 2 à 4h partout à Djibouti-Ville & Balbala.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#3D3A35] text-[#FAF9F6] shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#FAF9F6]">Paiement Flexible</h4>
              <p className="text-xs text-[#FAF9F6]/60 mt-0.5">À la livraison en espèces, D-Money ou Waafi.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#3D3A35] text-[#FAF9F6] shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#FAF9F6]">Qualité & Garantie</h4>
              <p className="text-xs text-[#FAF9F6]/60 mt-0.5">Produits testés et garantis fonctionnels.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-[#3D3A35] text-[#FAF9F6] shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-[#FAF9F6]">Support Local 7j/7</h4>
              <p className="text-xs text-[#FAF9F6]/60 mt-0.5">Assistance directe par téléphone ou WhatsApp.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand & About */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              {settings?.logo ? (
                <img
                  src={settings.logo}
                  alt={storeName}
                  className="h-9 w-auto max-w-[120px] object-contain rounded-lg bg-white/10 p-1"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#5A5A40] flex items-center justify-center text-[#FAF9F6] font-bold text-sm">
                  {storeName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span className="text-xl font-bold text-white tracking-tight font-serif">
                {storeName}
              </span>
            </div>
            <p className="text-xs text-[#FAF9F6]/70 leading-relaxed">
              {settings?.aboutText ||
                'Votre boutique spécialisée d’accessoires pour smartphones, audio, montres et mode à Djibouti. Des produits de qualité au juste prix en FDJ.'}
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs font-medium">
              {settings?.enableCashOnDelivery !== false && (
                <span className="px-2.5 py-1 rounded-full bg-[#3D3A35] border border-[#4A463F] text-[#FAF9F6]">
                  💵 Espèces (Cash)
                </span>
              )}
              {settings?.enableDMoney !== false && (
                <span className="px-2.5 py-1 rounded-full bg-[#3D3A35] border border-[#4A463F] text-[#FAF9F6]">
                  📱 D-Money
                </span>
              )}
              {settings?.enableWaafi !== false && (
                <span className="px-2.5 py-1 rounded-full bg-[#3D3A35] border border-[#4A463F] text-[#FAF9F6]">
                  ⚡ Waafi
                </span>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#FAF9F6] uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog')}
                  className="hover:text-white transition-colors"
                >
                  Tous les Produits
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('catalog', { isPromo: true })}
                  className="hover:text-white transition-colors"
                >
                  Offres & Promotions
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTracker}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Suivre ma Commande</span>
                  <ExternalLink className="w-3 h-3 text-[#FAF9F6]/50" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-[#FAF9F6]/60 hover:text-white transition-colors"
                >
                  Espace Administration Vendeur
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#FAF9F6] uppercase tracking-wider">
              Catégories
            </h4>
            <ul className="space-y-2 text-xs">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate('catalog', { category: cat.id })}
                    className="hover:text-white transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Client & Online Store */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-[#FAF9F6] uppercase tracking-wider">
              Service Client & Commandes
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FAF9F6]/70">
              <li className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />
                <span>Boutique 100% en ligne • Livraison express à domicile & bureau</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#5A5A40] shrink-0 mt-0.5" />
                <span>Djibouti-Ville, Balbala, Héron, Haramous, Gabode & PK12</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#5A5A40] shrink-0" />
                <a href={`tel:${settings?.phone || '+25377123456'}`} className="hover:text-white">
                  {settings?.phone || '+253 77 12 34 56'}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#5A5A40] shrink-0" />
                <span>{settings?.email || 'contact@djiaccess.dj'}</span>
              </li>
            </ul>

            {/* Direct WhatsApp button */}
            <div className="pt-2">
              <a
                href={`https://wa.me/${whatsappNumber}?text=Bonjour%20DjiAccess,%20je%20vous%20contacte%20depuis%20le%20site%20web.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full px-4 py-2.5 text-xs font-semibold rounded-full bg-[#25D366] text-white hover:bg-[#20bd5a] transition-colors shadow-xs"
              >
                Commander par WhatsApp 💬
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#3D3A35] text-center text-xs text-[#FAF9F6]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} {storeName} - République de Djibouti. Tous droits réservés.</p>
        <p className="text-[#FAF9F6]/50">Devise officielle : Franc Djibouti (DJF / FDJ)</p>
      </div>
    </footer>
  );
};
