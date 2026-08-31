import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Tag,
  Truck,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  MessageCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatFDJ } from '../services/api';
import type { DeliveryZone, StoreSettings } from '../types';
import { generateCartWhatsAppUrl } from '../utils/whatsappHelper';

interface CartPageProps {
  deliveryZones: DeliveryZone[];
  settings?: StoreSettings | null;
  onNavigateToCheckout: () => void;
  onNavigateToCatalog: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  deliveryZones,
  settings,
  onNavigateToCheckout,
  onNavigateToCatalog
}) => {
  const {
    cart,
    itemCount,
    subtotal,
    discountAmount,
    appliedPromo,
    selectedZone,
    deliveryFee,
    total,
    updateQuantity,
    removeFromCart,
    clearCart,
    setSelectedZone,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ success: boolean; text: string } | null>(null);
  const [loadingPromo, setLoadingPromo] = useState(false);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCodeInput.trim()) return;
    setLoadingPromo(true);
    setPromoMessage(null);
    const res = await applyCoupon(promoCodeInput.trim());
    setPromoMessage({ success: res.success, text: res.message });
    setLoadingPromo(false);
    if (res.success) {
      setPromoCodeInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#F2F1ED] text-[#5A5A40] mx-auto flex items-center justify-center shadow-xs">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#2D2926] font-serif">
            Votre panier est actuellement vide
          </h1>
          <p className="text-sm text-[#7A766F] max-w-md mx-auto">
            Découvrez nos accessoires de téléphonie, montres, câbles et gadgets disponibles avec livraison express à Djibouti.
          </p>
        </div>
        <button
          id="btn-empty-cart-catalog"
          onClick={onNavigateToCatalog}
          className="px-7 py-3.5 rounded-full bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-semibold text-sm shadow-sm transition-colors"
        >
          Parcourir les produits
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2926] font-serif">
            Mon Panier d'Achat
          </h1>
          <p className="text-xs sm:text-sm text-[#7A766F]">
            {itemCount} article{itemCount > 1 ? 's' : ''} sélectionné{itemCount > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-[#E05353] hover:underline transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Vider le panier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-[#EAE7E0] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.product.images[0] || ''}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover bg-[#F2F1ED] shrink-0 border border-[#EAE7E0]"
                />
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7A766F]">
                    {item.product.categoryName || 'Accessoire'}
                  </span>
                  <h3 className="text-sm font-bold text-[#2D2926] leading-snug">
                    {item.product.name}
                  </h3>
                  <p className="text-xs font-medium text-[#7A766F]">
                    Prix unitaire : <span className="text-[#5A5A40] font-bold">{formatFDJ(item.product.price)}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#EAE7E0]">
                {/* Quantity */}
                <div className="flex items-center border border-[#EAE7E0] rounded-full bg-[#FAF9F6]">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="p-2 text-[#3D3A35] hover:text-[#2D2926]"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-[#2D2926]">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    disabled={item.quantity >= item.product.stock}
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="p-2 text-[#3D3A35] hover:text-[#2D2926] disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right min-w-[100px]">
                  <span className="text-base font-bold text-[#5A5A40] block">
                    {formatFDJ(item.product.price * item.quantity)}
                  </span>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-2 text-[#7A766F] hover:text-[#E05353] transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Delivery Zone Selector Box */}
          <div className="p-5 rounded-2xl bg-white border border-[#EAE7E0] space-y-3 shadow-2xs">
            <h3 className="text-xs font-semibold text-[#7A766F] uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#5A5A40]" />
              Sélectionnez votre zone de livraison à Djibouti
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {deliveryZones.map((zone) => {
                const isSelected = selectedZone?.id === zone.id || (!selectedZone && zone.id === 'zone-centre');
                return (
                  <button
                    key={zone.id}
                    type="button"
                    onClick={() => setSelectedZone(zone)}
                    className={`p-3.5 rounded-xl border text-left flex items-start justify-between gap-2 transition-all ${
                      isSelected
                        ? 'border-[#5A5A40] bg-[#F2F1ED] ring-1 ring-[#5A5A40]'
                        : 'border-[#EAE7E0] bg-[#FAF9F6] hover:bg-[#F2F1ED]'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-[#2D2926]">{zone.name}</p>
                      <p className="text-[11px] text-[#7A766F]">{zone.estimatedHours}</p>
                    </div>
                    <span className="text-xs font-bold text-[#5A5A40] shrink-0">
                      {zone.price === 0 ? 'Gratuit' : formatFDJ(zone.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Summary Box (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-[#EAE7E0] shadow-sm space-y-5 sticky top-24">
            <h3 className="text-base font-bold text-[#2D2926] font-serif pb-3 border-b border-[#EAE7E0]">
              Récapitulatif de la commande
            </h3>

            {/* Price lines */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-[#7A766F]">
                <span>Sous-total articles</span>
                <span className="font-semibold text-[#2D2926]">{formatFDJ(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#5A5A40] font-semibold">
                  <span>Remise promo ({appliedPromo?.code})</span>
                  <span>-{formatFDJ(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#7A766F]">
                <span>Frais de livraison ({selectedZone?.name || 'Djibouti-Ville'})</span>
                <span className="font-semibold text-[#2D2926]">
                  {deliveryFee === 0 ? 'Gratuit' : formatFDJ(deliveryFee)}
                </span>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="pt-3 border-t border-[#EAE7E0]">
              {appliedPromo ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F2F1ED] border border-[#EAE7E0] text-xs">
                  <span className="font-semibold text-[#5A5A40] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    Code appliqué : {appliedPromo.code}
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-[#E05353] font-semibold hover:underline"
                  >
                    Retirer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Code promo (ex: DJIBOUTI2026)"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 text-xs bg-[#FAF9F6] rounded-full border border-[#EAE7E0] uppercase font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
                    />
                    <button
                      type="submit"
                      disabled={loadingPromo || !promoCodeInput.trim()}
                      className="px-5 py-2 bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-semibold text-xs rounded-full transition-colors disabled:opacity-50"
                    >
                      {loadingPromo ? '...' : 'Appliquer'}
                    </button>
                  </div>
                  {promoMessage && (
                    <p
                      className={`text-xs ${
                        promoMessage.success ? 'text-[#5A5A40]' : 'text-[#E05353]'
                      }`}
                    >
                      {promoMessage.text}
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-[#EAE7E0] flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-[#2D2926] block">Total à payer</span>
                <span className="text-[11px] text-[#7A766F]">Paiement à la réception</span>
              </div>
              <span className="text-2xl font-bold text-[#5A5A40]">
                {formatFDJ(total)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                id="btn-cart-checkout"
                type="button"
                onClick={onNavigateToCheckout}
                className="w-full py-3.5 px-4 rounded-full bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
              >
                <span>Passer la commande (Formulaire)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                id="btn-cart-whatsapp-checkout"
                href={generateCartWhatsAppUrl({
                  cart,
                  subtotal,
                  deliveryFee,
                  total,
                  deliveryZone: selectedZone,
                  settings
                })}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors text-center cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Commander directement par WhatsApp</span>
              </a>
            </div>

            {/* Security Guarantee */}
            <div className="p-3 rounded-2xl bg-[#FAF9F6] border border-[#EAE7E0] flex items-center gap-2 text-[11px] text-[#7A766F]">
              <ShieldCheck className="w-4 h-4 text-[#5A5A40] shrink-0" />
              <span>Commande sans compte requise. Paiement sécurisé à Djibouti.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
