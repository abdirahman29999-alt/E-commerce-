import React, { useState } from 'react';
import {
  ShoppingBag,
  Check,
  Truck,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  Share2,
  Phone,
  MessageCircle,
  Star,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import type { Product, Category, StoreSettings } from '../types';
import { formatFDJ } from '../services/api';
import { generateProductWhatsAppUrl, getCleanWhatsAppNumber } from '../utils/whatsappHelper';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/ProductCard';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  categories: Category[];
  settings: StoreSettings | null;
  onNavigateBack: () => void;
  onNavigateToProduct: (prod: Product) => void;
  onNavigateToCategory: (catId: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  categories,
  settings,
  onNavigateBack,
  onNavigateToProduct,
  onNavigateToCategory
}) => {
  const { addToCart } = useCart();
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 5);

  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'];

  const discount =
    product.discountPercent ||
    (product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Découvrez ${product.name} sur DjiAccess Djibouti au prix de ${formatFDJ(product.price)}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappNumber = getCleanWhatsAppNumber(settings);
  const whatsappOrderUrl = generateProductWhatsAppUrl({
    product,
    quantity,
    settings
  });

  // Related products
  const similarProducts = allProducts
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId && p.status === 'active')
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-10">
      
      {/* Breadcrumbs & Back Button */}
      <div className="flex items-center justify-between text-xs text-[#7A766F]">
        <button
          onClick={onNavigateBack}
          className="flex items-center gap-1.5 font-semibold text-[#2D2926] hover:text-[#5A5A40] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au catalogue</span>
        </button>

        <div className="hidden sm:flex items-center gap-1">
          <span>Accueil</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#7A766F]" />
          <button
            onClick={() => onNavigateToCategory(product.categoryId)}
            className="hover:underline text-[#3D3A35]"
          >
            {product.categoryName || 'Accessoires'}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-[#7A766F]" />
          <span className="font-semibold text-[#2D2926] truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* Main Product Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start bg-white p-5 sm:p-8 rounded-3xl border border-[#EAE7E0] shadow-2xs">
        
        {/* Left: Photos Gallery (5 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#F2F1ED] border border-[#EAE7E0]">
            <img
              src={images[selectedImageIdx]}
              alt={product.name}
              className="w-full h-full object-cover object-center"
            />
            {discount && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-[#E05353] text-white shadow-md">
                -{discount}% PROMO
              </span>
            )}
            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 text-[#3D3A35] hover:text-[#2D2926] backdrop-blur-xs shadow-md transition-transform active:scale-95"
              title="Partager ce produit"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copied && (
              <span className="absolute top-16 right-4 px-2.5 py-1 bg-[#2D2926] text-white text-[10px] rounded-md">
                Lien copié !
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`w-18 h-18 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImageIdx === idx
                      ? 'border-[#5A5A40] ring-2 ring-[#5A5A40]/20'
                      : 'border-[#EAE7E0] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Actions (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#7A766F] tracking-wider uppercase">
                {product.categoryName || 'Accessoire'}
              </span>
              <span className="text-xs text-[#7A766F] font-mono">
                SKU: {product.sku}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#2D2926] font-serif leading-tight">
              {product.name}
            </h1>

            {/* Ratings and Reviews */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex text-[#5A5A40]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#5A5A40] text-[#5A5A40]" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#2D2926]">{product.rating || 4.9}</span>
              <span className="text-xs text-[#7A766F]">({product.reviewsCount || 24} avis clients)</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE7E0] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs text-[#7A766F] block">Prix à Djibouti</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-[#5A5A40]">
                  {formatFDJ(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-sm sm:text-base text-[#7A766F] line-through">
                    {formatFDJ(product.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Stock status badge */}
            <div>
              {isOutOfStock ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#2D2926] text-white">
                  Rupture de stock
                </span>
              ) : isLowStock ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FAF9F6] text-[#5A5A40] border border-[#EAE7E0] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#5A5A40]" />
                  Stock faible ({product.stock} restants)
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#F2F1ED] text-[#5A5A40] border border-[#EAE7E0] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#5A5A40]" />
                  En stock ({product.stock} disponibles)
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#7A766F] uppercase tracking-wider">
              Description & Caractéristiques
            </h3>
            <p className="text-xs sm:text-sm text-[#3D3A35] leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Quantity and Actions */}
          {!isOutOfStock ? (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-[#3D3A35]">Quantité :</span>
                <div className="flex items-center border border-[#EAE7E0] rounded-full bg-[#FAF9F6]">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 text-[#3D3A35] hover:text-[#2D2926] font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-sm font-bold text-[#2D2926]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3.5 py-1.5 text-[#3D3A35] hover:text-[#2D2926] font-bold disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-[#7A766F]">
                  Total : <strong className="text-[#5A5A40] font-bold">{formatFDJ(product.price * quantity)}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Add to Cart */}
                <button
                  id="btn-product-detail-add-cart"
                  type="button"
                  onClick={handleAddToCart}
                  className={`w-full py-3.5 px-4 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98 ${
                    added
                      ? 'bg-[#5A5A40] text-white'
                      : 'bg-[#5A5A40] hover:bg-[#4A4A30] text-white'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Ajouté au panier !</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Ajouter au panier</span>
                    </>
                  )}
                </button>

                {/* Instant WhatsApp Order */}
                <a
                  id="btn-product-whatsapp-order"
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-xs text-center"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Commander sur WhatsApp</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#F2F1ED] border border-[#EAE7E0] text-center space-y-2">
              <span className="text-sm font-bold text-[#2D2926] block">
                Article temporairement indisponible
              </span>
              <p className="text-xs text-[#7A766F]">
                Ce produit est en cours de réapprovisionnement à Djibouti. Vous pouvez nous contacter sur WhatsApp pour réserver le prochain arrivage.
              </p>
              <a
                href={`https://wa.me/${whatsappNumber}?text=Bonjour%20DjiAccess,%20je%20souhaite%20savoir%20quand%20sera%20disponible%20le%20produit%20:${product.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5A5A40] hover:underline pt-1"
              >
                <span>Être alerté du retour en stock</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Delivery & Guarantees info box */}
          <div className="p-4 rounded-2xl bg-[#F2F1ED] border border-[#EAE7E0] space-y-2 text-xs text-[#3D3A35]">
            <div className="flex items-center gap-2 font-semibold text-[#2D2926]">
              <Truck className="w-4 h-4 text-[#5A5A40]" />
              <span>Livraison à Djibouti :</span>
            </div>
            <ul className="space-y-1 pl-6 list-disc text-[#7A766F]">
              <li>Djibouti-Ville Centre, Héron, Plateau : <strong>2 à 4 heures</strong> (800 FDJ)</li>
              <li>Balbala, Hayabley, Cheik Moussa : <strong>Le jour même</strong> (1 000 FDJ)</li>
              <li>Retrait gratuit disponible en boutique au Centre-Ville.</li>
              <li>Paiement à la réception en espèces ou D-Money / Waafi.</li>
            </ul>
          </div>

        </div>

      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="space-y-4 pt-6">
          <div className="flex items-end justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-[#2D2926] font-serif">
              Produits Similaires dans cette catégorie
            </h3>
            <button
              onClick={() => onNavigateToCategory(product.categoryId)}
              className="text-xs font-semibold text-[#5A5A40] hover:underline"
            >
              Voir la catégorie
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {similarProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onNavigateToDetail={onNavigateToProduct}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
