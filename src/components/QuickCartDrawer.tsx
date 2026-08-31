import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatFDJ } from '../services/api';
import type { StoreSettings } from '../types';
import { generateCartWhatsAppUrl } from '../utils/whatsappHelper';

interface QuickCartDrawerProps {
  settings?: StoreSettings | null;
  onNavigateToCheckout: () => void;
  onNavigateToCatalog: () => void;
}

export const QuickCartDrawer: React.FC<QuickCartDrawerProps> = ({
  settings,
  onNavigateToCheckout,
  onNavigateToCatalog
}) => {
  const {
    cart,
    isCartDrawerOpen,
    closeCartDrawer,
    updateQuantity,
    removeFromCart,
    subtotal,
    itemCount
  } = useCart();

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-[#2D2926]/60 backdrop-blur-xs"
            onClick={closeCartDrawer}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="w-screen max-w-md bg-[#FAF9F6] text-[#3D3A35] shadow-2xl flex flex-col justify-between border-l border-[#EAE7E0] relative z-10"
            >
              {/* Header */}
              <div className="p-4 sm:p-6 border-b border-[#EAE7E0] flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#5A5A40]" />
                  <h2 className="text-lg font-bold text-[#2D2926] font-serif">
                    Mon Panier ({itemCount})
                  </h2>
                </div>
                <button
                  id="btn-close-cart-drawer"
                  type="button"
                  onClick={closeCartDrawer}
                  className="p-2 text-[#7A766F] hover:text-[#2D2926] rounded-full hover:bg-[#F2F1ED] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                {cart.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#F2F1ED] text-[#5A5A40] mx-auto flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-[#2D2926]">
                        Votre panier est vide
                      </p>
                      <p className="text-xs text-[#7A766F] mt-1">
                        Découvrez nos nouveautés et accessoires de qualité disponibles à Djibouti.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        closeCartDrawer();
                        onNavigateToCatalog();
                      }}
                      className="px-6 py-2.5 rounded-full bg-[#5A5A40] text-white text-xs font-semibold hover:bg-[#4A4A30] transition-colors"
                    >
                      Découvrir les produits
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center gap-3 p-3 rounded-2xl border border-[#EAE7E0] bg-white shadow-2xs"
                    >
                      <img
                        src={item.product.images[0] || ''}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover bg-[#F2F1ED] border border-[#EAE7E0] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-[#2D2926] line-clamp-2 leading-tight">
                          {item.product.name}
                        </h4>
                        <p className="text-xs font-bold text-[#5A5A40] mt-1">
                          {formatFDJ(item.product.price)}
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-[#EAE7E0] rounded-lg bg-[#FAF9F6]">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 text-[#7A766F] hover:text-[#2D2926]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-[#2D2926]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              disabled={item.quantity >= item.product.stock}
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 text-[#7A766F] hover:text-[#2D2926] disabled:opacity-30"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 text-[#7A766F] hover:text-[#E05353] transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#2D2926]">
                          {formatFDJ(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer & Checkout Action */}
              {cart.length > 0 && (
                <div className="p-4 sm:p-6 border-t border-[#EAE7E0] bg-white space-y-4">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-[#7A766F]">
                      <span>Sous-total</span>
                      <span className="font-semibold text-[#2D2926]">
                        {formatFDJ(subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[#7A766F]">
                      <span>Livraison estimée</span>
                      <span className="text-[#5A5A40] font-semibold">
                        Calculée au paiement
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#EAE7E0] flex justify-between items-baseline">
                    <span className="text-sm font-semibold text-[#2D2926]">Sous-total</span>
                    <span className="text-lg font-bold text-[#5A5A40]">
                      {formatFDJ(subtotal)}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <button
                      id="btn-drawer-checkout"
                      type="button"
                      onClick={() => {
                        closeCartDrawer();
                        onNavigateToCheckout();
                      }}
                      className="w-full py-3.5 px-4 rounded-full bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer"
                    >
                      <span>Passer la commande</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <a
                      id="btn-drawer-whatsapp-checkout"
                      href={generateCartWhatsAppUrl({
                        cart,
                        subtotal,
                        total: subtotal,
                        settings
                      })}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors text-center cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Commander directement par WhatsApp</span>
                    </a>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#7A766F]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5A5A40]" />
                    <span>Paiement à la livraison ou par D-Money / Waafi</span>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
