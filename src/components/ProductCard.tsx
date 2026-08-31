import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Check, AlertTriangle, Eye } from 'lucide-react';
import type { Product } from '../types';
import { formatFDJ } from '../services/api';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onNavigateToDetail?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onNavigateToDetail
}) => {
  const { addToCart, cart } = useCart();
  const [added, setAdded] = React.useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 5);
  const cartItem = cart.find((i) => i.product.id === product.id);
  const qtyInCart = cartItem ? cartItem.quantity : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const discount =
    product.discountPercent ||
    (product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null);

  return (
    <motion.div
      id={`product-card-${product.id}`}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onNavigateToDetail && onNavigateToDetail(product)}
      className="group relative flex flex-col bg-white rounded-2xl border border-[#EAE7E0] shadow-2xs hover:border-[#5A5A40]/60 hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F2F1ED]">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {discount && discount > 0 ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E05353] text-white shadow-xs">
              -{discount}%
            </span>
          ) : null}
          {product.isNew && !discount && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#5A5A40] text-white shadow-xs">
              Nouveau
            </span>
          )}
        </div>

        {/* Stock Status Pill */}
        <div className="absolute top-2.5 right-2.5 z-10">
          {isOutOfStock ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#2D2926]/90 text-stone-200 backdrop-blur-xs">
              Épuisé
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#FAF9F6] text-[#5A5A40] border border-[#EAE7E0] shadow-xs">
              <AlertTriangle className="w-3 h-3 text-[#5A5A40]" />
              Plus que {product.stock}
            </span>
          ) : null}
        </div>

        {/* Quick View Button on Desktop Hover */}
        {onQuickView && (
          <button
            id={`btn-quickview-${product.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="absolute bottom-3 right-3 p-2 rounded-xl bg-white/95 text-[#3D3A35] backdrop-blur-xs shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-[#5A5A40] hover:text-white hidden sm:flex"
            title="Aperçu rapide"
          >
            <Eye className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col p-4 justify-between gap-3 bg-white">
        <div className="space-y-1">
          {product.categoryName && (
            <span className="text-[10px] font-semibold text-[#7A766F] tracking-wider uppercase">
              {product.categoryName}
            </span>
          )}
          <h3 className="text-sm font-semibold text-[#2D2926] line-clamp-2 leading-snug group-hover:text-[#5A5A40] transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="pt-2.5 border-t border-[#EAE7E0] flex items-center justify-between gap-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-base font-bold text-[#5A5A40]">
              {formatFDJ(product.price)}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price ? (
              <span className="text-xs text-[#7A766F] line-through">
                {formatFDJ(product.compareAtPrice)}
              </span>
            ) : (
              <span className="text-[11px] text-[#5A5A40]/80 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#5A5A40] inline-block"></span>
                En stock
              </span>
            )}
          </div>

          <button
            id={`btn-add-cart-${product.id}`}
            type="button"
            disabled={isOutOfStock}
            onClick={handleAdd}
            aria-label={`Ajouter ${product.name} au panier`}
            className={`relative flex items-center justify-center h-9 px-3.5 rounded-xl font-semibold text-xs transition-all duration-200 ${
              isOutOfStock
                ? 'bg-[#F2F1ED] text-[#7A766F] cursor-not-allowed'
                : added
                ? 'bg-[#5A5A40] text-white'
                : 'bg-[#5A5A40] text-white hover:bg-[#4A4A30] active:scale-95 shadow-xs'
            }`}
          >
            {added ? (
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Ajouté
              </span>
            ) : isOutOfStock ? (
              <span>Rupture</span>
            ) : (
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                {qtyInCart > 0 ? `+1 (${qtyInCart})` : 'Ajouter'}
              </span>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
