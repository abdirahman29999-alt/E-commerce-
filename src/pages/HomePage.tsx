import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Truck,
  ShieldCheck,
  CreditCard,
  Headphones,
  Flame,
  Star,
  ChevronRight,
  TrendingUp,
  Search,
  CheckCircle
} from 'lucide-react';
import type { Product, Category, StoreSettings } from '../types';
import { ProductCard } from '../components/ProductCard';
import { formatFDJ } from '../services/api';

interface HomePageProps {
  products: Product[];
  categories: Category[];
  settings: StoreSettings | null;
  onNavigate: (view: string, param?: any) => void;
  onOpenTracker: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  categories,
  settings,
  onNavigate,
  onOpenTracker
}) => {
  const [trackInput, setTrackInput] = React.useState('');

  const featuredProducts = products.filter((p) => p.isFeatured && p.status === 'active').slice(0, 8);
  const promoProducts = products.filter((p) => (p.isPromo || (p.compareAtPrice && p.compareAtPrice > p.price)) && p.status === 'active').slice(0, 4);
  const newProducts = products.filter((p) => p.isNew && p.status === 'active').slice(0, 4);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackInput.trim()) {
      onNavigate('track', { orderNumber: trackInput.trim().toUpperCase() });
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative overflow-hidden bg-[#5A5A40] text-white rounded-3xl mx-3 sm:mx-6 lg:mx-8 mt-4 shadow-md border border-[#4A4A30]">
        {/* Optional Custom Grande Image d'Arrière-Plan */}
        {settings?.heroImage ? (
          <div className="absolute inset-0 z-0">
            <img
              src={settings.heroImage}
              alt="Bannière d'accueil"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-r from-[#2D2926]/95 via-[#2D2926]/85 to-[#2D2926]/75 backdrop-blur-2xs" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(#FAF9F6_1px,transparent_1px)] [background-size:28px_28px] opacity-10" />
        )}
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 sm:py-20 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-white border border-white/20 text-xs font-semibold tracking-wide backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-stone-200" />
              <span>{settings?.heroBadge || "COLLECTION PREMIUM D'ACCESSOIRES À DJIBOUTI"}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-[#FAF9F6] font-serif">
              {settings?.heroTitle || "L'excellence de l'accessoire au meilleur prix en FDJ."}
            </h1>

            <p className="text-sm sm:text-base text-stone-200 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {settings?.heroSubtitle ||
                "Powerbanks haute capacité, écouteurs sans fil avec réduction de bruit, montres connectées AMOLED, coques et chargeurs rapides. Livraison soignée en 2 à 4h partout à Djibouti !"}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                id="btn-hero-catalog"
                onClick={() => onNavigate('catalog')}
                className="px-7 py-3.5 rounded-full bg-[#FAF9F6] hover:bg-white text-[#5A5A40] font-bold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                <span>{settings?.heroPrimaryBtnText || 'Explorer la Collection'}</span>
                <ArrowRight className="w-4 h-4 text-[#5A5A40]" />
              </button>

              <button
                id="btn-hero-promos"
                onClick={() => onNavigate('catalog', { isPromo: true })}
                className="px-6 py-3.5 rounded-full bg-[#4A4A30]/80 hover:bg-[#383824] text-white font-medium text-sm border border-white/20 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4 text-[#FF6B6B]" />
                <span>{settings?.heroSecondaryBtnText || 'Offres du Moment'}</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-3 text-center lg:text-left">
              <div>
                <span className="text-lg sm:text-2xl font-bold text-[#FAF9F6]">
                  {settings?.heroTrust1Number || '2 - 4h'}
                </span>
                <p className="text-[11px] text-stone-300">
                  {settings?.heroTrust1Label || 'Livraison express'}
                </p>
              </div>
              <div>
                <span className="text-lg sm:text-2xl font-bold text-stone-100">
                  {settings?.heroTrust2Number || '100%'}
                </span>
                <p className="text-[11px] text-stone-300">
                  {settings?.heroTrust2Label || 'Testé & Garanti'}
                </p>
              </div>
              <div>
                <span className="text-lg sm:text-2xl font-bold text-stone-100">
                  {settings?.heroTrust3Number || 'Paiement'}
                </span>
                <p className="text-[11px] text-stone-300">
                  {settings?.heroTrust3Label || 'À la réception'}
                </p>
              </div>
            </div>
          </div>

          {/* Hero Visual Card Showcase */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="relative rounded-3xl bg-[#FAF9F6] text-[#3D3A35] border border-[#EAE7E0] p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#5A5A40] flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-[#5A5A40]" />
                    {settings?.heroCardTag || 'Coup de cœur de la semaine'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#5A5A40] text-white font-bold text-[10px]">
                    {settings?.heroCardDiscount || '-24%'}
                  </span>
                </div>

                <div className="aspect-video w-full rounded-2xl overflow-hidden bg-[#F2F1ED] border border-[#EAE7E0]">
                  <img
                    src={
                      settings?.heroCardImage ||
                      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
                    }
                    alt={settings?.heroCardTitle || 'Smartwatch Pro'}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#2D2926] leading-snug">
                    {settings?.heroCardTitle || 'Smartwatch Pro Écran AMOLED 1.43"'}
                  </h3>
                  <p className="text-xs text-[#7A766F] mt-1 line-clamp-2">
                    {settings?.heroCardDesc ||
                      'Appels Bluetooth, étanche IP68, autonomie 10 jours et suivi complet de santé.'}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#EAE7E0]">
                  <div>
                    {settings?.heroCardOldPrice ? (
                      <span className="text-xs text-[#7A766F] line-through mr-2">
                        {formatFDJ(settings.heroCardOldPrice)}
                      </span>
                    ) : null}
                    <span className="text-lg font-bold text-[#5A5A40]">
                      {formatFDJ(settings?.heroCardPrice || 14000)}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      onNavigate('product', {
                        id: settings?.heroCardProductId || 'prod-3'
                      })
                    }
                    className="px-4 py-2 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Commander
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. POPULAR CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-semibold text-[#7A766F] uppercase tracking-wider">
              Parcourir par rayon
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D2926] mt-0.5 font-serif">
              Catégories Populaires
            </h2>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs font-semibold text-[#5A5A40] hover:text-[#4A4A30] flex items-center gap-1 transition-colors"
          >
            <span>Voir tout</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('catalog', { category: cat.id })}
              className="group relative rounded-2xl overflow-hidden bg-white border border-[#EAE7E0] shadow-2xs hover:border-[#5A5A40]/60 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="aspect-square w-full overflow-hidden bg-[#F2F1ED]">
                <img
                  src={cat.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
              </div>
              <div className="p-3.5 bg-white flex flex-col justify-between">
                <h3 className="text-xs sm:text-sm font-semibold text-[#2D2926] group-hover:text-[#5A5A40] transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <span className="text-[11px] text-[#7A766F] mt-0.5">
                  {cat.productCount ? `${cat.productCount} articles` : 'Disponible'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PROMOTIONS FLASH SECTION */}
      {promoProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#2D2926] text-white border border-[#3D3A35] shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#5A5A40] text-white shadow-md">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-serif">
                    Offres Spéciales & Réductions
                  </h2>
                  <p className="text-xs text-stone-300 mt-0.5">
                    Profitez des meilleurs prix à Djibouti avant épuisement des stocks !
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('catalog', { isPromo: true })}
                className="self-start sm:self-auto px-4 py-2 rounded-full bg-[#FAF9F6] text-[#2D2926] font-semibold text-xs hover:bg-white transition-colors"
              >
                Toutes les offres →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {promoProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onNavigateToDetail={(prod) => onNavigate('product', { id: prod.id })}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. FEATURED PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-semibold text-[#7A766F] uppercase tracking-wider">
              Sélection du commerçant
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2D2926] mt-0.5 font-serif">
              Produits Populaires & Recommandés
            </h2>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs font-semibold text-[#5A5A40] hover:text-[#4A4A30] flex items-center gap-1 transition-colors"
          >
            <span>Voir tout</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {featuredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onNavigateToDetail={(prod) => onNavigate('product', { id: prod.id })}
            />
          ))}
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      {newProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-xs font-semibold text-[#7A766F] uppercase tracking-wider">
                Dernières nouveautés
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#2D2926] mt-0.5 font-serif">
                Nouveautés Récentes
              </h2>
            </div>
            <button
              onClick={() => onNavigate('catalog', { isNew: true })}
              className="text-xs font-semibold text-[#5A5A40] hover:text-[#4A4A30] flex items-center gap-1 transition-colors"
            >
              <span>Voir tout</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {newProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onNavigateToDetail={(prod) => onNavigate('product', { id: prod.id })}
              />
            ))}
          </div>
        </section>
      )}

      {/* 6. WHY BUY FROM US IN DJIBOUTI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#F2F1ED] border border-[#EAE7E0] space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold text-[#7A766F] uppercase tracking-wider">
              {settings?.tagline || `L'expérience ${settings?.storeName || 'DjiAccess'}`}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#2D2926] font-serif">
              Pourquoi nous faire confiance à Djibouti ?
            </h2>
            <p className="text-xs sm:text-sm text-[#7A766F]">
              Nous facilitons vos achats d'accessoires sans tracas ni mauvaise surprise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-[#EAE7E0] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#F2F1ED] text-[#5A5A40] flex items-center justify-center font-bold">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#2D2926]">
                {settings?.reassurance1Title || 'Livraison Express Locale'}
              </h3>
              <p className="text-xs text-[#7A766F] leading-relaxed">
                {settings?.reassurance1Desc ||
                  'Nos livreurs vous livrent directement chez vous ou à votre bureau à Djibouti-Ville, Balbala, Héron, Haramous ou PK12 en un temps record.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EAE7E0] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#F2F1ED] text-[#5A5A40] flex items-center justify-center font-bold">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#2D2926]">
                {settings?.reassurance2Title || 'Paiement 100% Flexible'}
              </h3>
              <p className="text-xs text-[#7A766F] leading-relaxed">
                {settings?.reassurance2Desc ||
                  'Réglez en toute confiance en espèces à la livraison une fois votre commande inspectée, ou par D-Money / Waafi sans frais cachés.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#EAE7E0] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#F2F1ED] text-[#5A5A40] flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#2D2926]">
                {settings?.reassurance3Title || 'Authenticité & Service Client'}
              </h3>
              <p className="text-xs text-[#7A766F] leading-relaxed">
                {settings?.reassurance3Desc ||
                  'Tous nos accessoires sont rigoureusement testés pour résister au climat de Djibouti. Une question ? Notre équipe vous répond immédiatement sur WhatsApp.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. QUICK ORDER TRACKER STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#5A5A40] text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-[#4A4A30]">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="p-3 rounded-2xl bg-white/20 text-white shrink-0 hidden sm:block">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-[#FAF9F6] font-serif">Vous avez déjà passé commande ?</h3>
              <p className="text-xs text-stone-200 mt-1">
                Suivez en temps réel l'avancement de votre livraison avec votre numéro de reçu (#DJ-xxxx).
              </p>
            </div>
          </div>

          <form onSubmit={handleTrackSubmit} className="flex w-full md:w-auto gap-2">
            <input
              type="text"
              placeholder="Ex: DJ-1025"
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
              className="px-4 py-2.5 rounded-full bg-white/15 border border-white/30 text-sm font-semibold uppercase text-white placeholder:normal-case placeholder:text-stone-300 focus:outline-hidden focus:ring-2 focus:ring-white w-full sm:w-48"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#FAF9F6] hover:bg-white text-[#5A5A40] font-bold text-xs shrink-0 transition-colors"
            >
              Suivre
            </button>
          </form>
        </div>
      </section>

      {/* 8. CLIENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 space-y-1">
          <span className="text-xs font-semibold text-[#7A766F] uppercase tracking-wider">
            Avis de nos clients
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2D2926] font-serif">
            Ce que disent nos acheteurs à Djibouti
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-white border border-[#EAE7E0] space-y-3 shadow-2xs">
            <div className="flex text-[#5A5A40] gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#5A5A40] text-[#5A5A40]" />
              ))}
            </div>
            <p className="text-xs text-[#3D3A35] italic leading-relaxed">
              « J'ai commandé la batterie externe 20 000 mAh le matin, livrée chez moi au Héron à 14h pile. Qualité impeccable et paiement facile avec D-Money. Bravo ! »
            </p>
            <div className="pt-2 border-t border-[#EAE7E0]">
              <span className="text-xs font-bold text-[#2D2926] block">Mohamed A.</span>
              <span className="text-[11px] text-[#7A766F]">Quartier Héron, Djibouti</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#EAE7E0] space-y-3 shadow-2xs">
            <div className="flex text-[#5A5A40] gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#5A5A40] text-[#5A5A40]" />
              ))}
            </div>
            <p className="text-xs text-[#3D3A35] italic leading-relaxed">
              « Les écouteurs Bluetooth avec réduction de bruit sont top pour le sport et le travail. Le son est clair et les basses puissantes. Je recommande sans hésiter. »
            </p>
            <div className="pt-2 border-t border-[#EAE7E0]">
              <span className="text-xs font-bold text-[#2D2926] block">Fatouma O.</span>
              <span className="text-[11px] text-[#7A766F]">Balbala, Djibouti</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#EAE7E0] space-y-3 shadow-2xs">
            <div className="flex text-[#5A5A40] gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#5A5A40] text-[#5A5A40]" />
              ))}
            </div>
            <p className="text-xs text-[#3D3A35] italic leading-relaxed">
              « Service client ultra réactif sur WhatsApp. Ils m'ont conseillé le bon câble 100W pour mon MacBook. Commande reçue en moins de 3h. »
            </p>
            <div className="pt-2 border-t border-[#EAE7E0]">
              <span className="text-xs font-bold text-[#2D2926] block">Ahmed Y.</span>
              <span className="text-[11px] text-[#7A766F]">Haramous, Djibouti</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
