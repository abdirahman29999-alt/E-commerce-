import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  Sparkles,
  CheckCircle,
  Tag,
  ShoppingBag
} from 'lucide-react';
import type { Product, Category } from '../types';
import { ProductCard } from '../components/ProductCard';
import { formatFDJ } from '../services/api';

interface CatalogPageProps {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
  initialSearch?: string;
  initialIsPromo?: boolean;
  initialIsNew?: boolean;
  onNavigateToDetail: (product: Product) => void;
}

export const CatalogPage: React.FC<CatalogPageProps> = ({
  products,
  categories,
  initialCategory,
  initialSearch = '',
  initialIsPromo = false,
  initialIsNew = false,
  onNavigateToDetail
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'popular'>('newest');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyPromo, setOnlyPromo] = useState(initialIsPromo);
  const [onlyNew, setOnlyNew] = useState(initialIsNew);
  const [maxPrice, setMaxPrice] = useState<number>(30000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter products locally or with computed memo
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (p.status !== 'active') return false;

        if (selectedCategory && selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
          return false;
        }

        if (onlyInStock && p.stock <= 0) {
          return false;
        }

        if (onlyPromo && !p.isPromo && (!p.compareAtPrice || p.compareAtPrice <= p.price)) {
          return false;
        }

        if (onlyNew && !p.isNew) {
          return false;
        }

        if (p.price > maxPrice) {
          return false;
        }

        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q);
          const matchDesc = p.description.toLowerCase().includes(q);
          const matchSku = p.sku.toLowerCase().includes(q);
          const matchCat = p.categoryName?.toLowerCase().includes(q);
          const matchTags = p.tags?.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchSku && !matchCat && !matchTags) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'popular') return (b.reviewsCount || 0) - (a.reviewsCount || 0);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, selectedCategory, onlyInStock, onlyPromo, onlyNew, maxPrice, search, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSortBy('newest');
    setOnlyInStock(false);
    setOnlyPromo(false);
    setOnlyNew(false);
    setMaxPrice(30000);
  };

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (onlyInStock ? 1 : 0) +
    (onlyPromo ? 1 : 0) +
    (onlyNew ? 1 : 0) +
    (maxPrice < 30000 ? 1 : 0) +
    (search ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Top Header & Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2926] font-serif">
              Catalogue d'Accessoires
            </h1>
            <p className="text-xs sm:text-sm text-[#7A766F] mt-0.5">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''} à Djibouti
            </p>
          </div>

          {/* Sort & Mobile Filter Trigger */}
          <div className="flex items-center gap-2">
            <button
              id="btn-mobile-filter-trigger"
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F2F1ED] border border-[#EAE7E0] text-xs font-semibold text-[#2D2926]"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#5A5A40]" />
              <span>Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            <div className="relative flex-1 sm:w-52">
              <select
                id="select-catalog-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full pl-8 pr-4 py-2 text-xs font-semibold bg-white rounded-xl border border-[#EAE7E0] text-[#2D2926] focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40] appearance-none"
              >
                <option value="newest">Plus récent</option>
                <option value="price_asc">Prix croissant (FDJ)</option>
                <option value="price_desc">Prix décroissant (FDJ)</option>
                <option value="popular">Plus populaire</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-[#7A766F] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            id="catalog-search-input"
            type="text"
            placeholder="Rechercher par nom, marque, référence SKU ou mot-clé..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white rounded-2xl border border-[#EAE7E0] shadow-2xs text-xs sm:text-sm text-[#2D2926] placeholder:text-[#7A766F] focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
          />
          <Search className="w-4 h-4 text-[#7A766F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="p-1.5 text-[#7A766F] hover:text-[#2D2926] absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#5A5A40] text-white shadow-xs'
                : 'bg-[#F2F1ED] text-[#3D3A35] hover:bg-[#EAE7E0]'
            }`}
          >
            Toutes les catégories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#5A5A40] text-white shadow-xs'
                  : 'bg-[#F2F1ED] text-[#3D3A35] hover:bg-[#EAE7E0]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid & Desktop Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-3xl border border-[#EAE7E0] space-y-6 shadow-2xs sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE7E0]">
            <h3 className="text-sm font-bold text-[#2D2926] flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#5A5A40]" />
              Filtres
            </h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#5A5A40] font-semibold hover:underline"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {/* Quick Filter Checkboxes */}
          <div className="space-y-3 text-xs font-medium text-[#3D3A35]">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded border-[#EAE7E0] text-[#5A5A40] focus:ring-[#5A5A40] w-4 h-4"
              />
              <span>Uniquement en stock</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none text-[#5A5A40]">
              <input
                type="checkbox"
                checked={onlyPromo}
                onChange={(e) => setOnlyPromo(e.target.checked)}
                className="rounded border-[#EAE7E0] text-[#5A5A40] focus:ring-[#5A5A40] w-4 h-4"
              />
              <span className="flex items-center gap-1 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" /> En promotion
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyNew}
                onChange={(e) => setOnlyNew(e.target.checked)}
                className="rounded border-[#EAE7E0] text-[#5A5A40] focus:ring-[#5A5A40] w-4 h-4"
              />
              <span>Nouveautés</span>
            </label>
          </div>

          {/* Max Price Range */}
          <div className="space-y-2 pt-4 border-t border-[#EAE7E0]">
            <div className="flex justify-between text-xs font-semibold text-[#2D2926]">
              <span>Prix maximum</span>
              <span className="text-[#5A5A40] font-bold">{formatFDJ(maxPrice)}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="30000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#5A5A40] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#7A766F]">
              <span>1 000 FDJ</span>
              <span>30 000 FDJ</span>
            </div>
          </div>

          {/* Delivery Note */}
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE7E0] text-xs text-[#3D3A35] space-y-1.5">
            <span className="font-bold text-[#2D2926] block">🚚 Livraison à Djibouti</span>
            <p className="text-[11px] text-[#7A766F] leading-tight">
              Tous nos articles sont en stock à Djibouti-Ville. Livraison rapide à domicile ou au bureau.
            </p>
          </div>
        </aside>

        {/* Product Cards Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#EAE7E0] p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#F2F1ED] text-[#7A766F] mx-auto flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#2D2926]">
                  Aucun produit trouvé
                </h3>
                <p className="text-xs text-[#7A766F] mt-1 max-w-sm mx-auto">
                  Aucun accessoire ne correspond à vos critères de recherche actuels.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-full bg-[#5A5A40] text-white font-semibold text-xs hover:bg-[#4A4A30] transition-colors"
              >
                Réinitialiser tous les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onNavigateToDetail={onNavigateToDetail}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-[#2D2926]/60 backdrop-blur-xs"
              onClick={() => setIsMobileFilterOpen(false)}
            />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 320 }}
                className="w-screen max-w-xs bg-[#FAF9F6] p-6 flex flex-col justify-between shadow-2xl relative z-10 border-l border-[#EAE7E0]"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#EAE7E0]">
                    <h3 className="text-base font-bold text-[#2D2926] font-serif">Filtres</h3>
                    <button
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="p-1.5 text-[#7A766F] rounded-full hover:bg-[#EAE7E0] transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Categories */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-[#7A766F] uppercase">Catégorie</h4>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-2.5 text-xs bg-white rounded-xl border border-[#EAE7E0] text-[#2D2926]"
                    >
                      <option value="all">Toutes les catégories</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Flags */}
                  <div className="space-y-3 text-xs font-medium text-[#3D3A35]">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={onlyInStock}
                        onChange={(e) => setOnlyInStock(e.target.checked)}
                        className="rounded text-[#5A5A40]"
                      />
                      <span>Uniquement en stock</span>
                    </label>
                    <label className="flex items-center gap-2 text-[#5A5A40]">
                      <input
                        type="checkbox"
                        checked={onlyPromo}
                        onChange={(e) => setOnlyPromo(e.target.checked)}
                        className="rounded text-[#5A5A40]"
                      />
                      <span className="font-semibold">En promotion</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={onlyNew}
                        onChange={(e) => setOnlyNew(e.target.checked)}
                        className="rounded text-[#5A5A40]"
                      />
                      <span>Nouveautés</span>
                    </label>
                  </div>

                  {/* Max Price */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-[#2D2926]">
                      <span>Prix max</span>
                      <span className="text-[#5A5A40]">{formatFDJ(maxPrice)}</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="30000"
                      step="500"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full accent-[#5A5A40]"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-[#EAE7E0] space-y-2">
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full py-3 rounded-full bg-[#5A5A40] text-white font-semibold text-xs hover:bg-[#4A4A30] transition-colors"
                  >
                    Voir les {filteredProducts.length} résultats
                  </button>
                  <button
                    onClick={handleResetFilters}
                    className="w-full py-2 text-xs font-semibold text-[#7A766F] hover:text-[#2D2926]"
                  >
                    Réinitialiser
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
