import React from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Phone,
  MessageCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import type { Order, StoreSettings } from '../types';
import { formatFDJ } from '../services/api';
import { generateOrderWhatsAppUrl } from '../utils/whatsappHelper';

interface OrderSuccessPageProps {
  order: Order;
  settings?: StoreSettings | null;
  onNavigateHome: () => void;
  onTrackOrder: (orderNumber: string) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  order,
  settings,
  onNavigateHome,
  onTrackOrder
}) => {
  const whatsappUrl = generateOrderWhatsAppUrl({ order, settings });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-8">
      
      {/* Success Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-[#F2F1ED] text-[#5A5A40] mx-auto flex items-center justify-center shadow-xs">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-widest text-[#5A5A40]">
          Commande enregistrée avec succès !
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2926] font-serif">
          Merci pour votre commande, {order.customerName.split(' ')[0]} !
        </h1>
        <p className="text-xs sm:text-sm text-[#7A766F] max-w-md mx-auto">
          Votre numéro de référence est <strong className="text-[#2D2926] font-mono bg-[#F2F1ED] px-2 py-0.5 rounded-md">#{order.orderNumber}</strong>. Un coursier va préparer votre colis pour la livraison à Djibouti.
        </p>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl border border-[#EAE7E0] p-6 sm:p-8 shadow-sm space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#EAE7E0]">
          <div>
            <span className="text-xs text-[#7A766F] block font-medium">Numéro de Commande</span>
            <span className="text-lg font-bold text-[#2D2926] font-mono">#{order.orderNumber}</span>
          </div>
          <div>
            <span className="text-xs text-[#7A766F] block font-medium">Statut actuel</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#F2F1ED] text-[#5A5A40] border border-[#EAE7E0]">
              Commande reçue
            </span>
          </div>
          <div>
            <span className="text-xs text-[#7A766F] block font-medium">Montant Total</span>
            <span className="text-lg font-bold text-[#5A5A40]">{formatFDJ(order.total)}</span>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE7E0] space-y-1.5">
            <span className="font-semibold text-[#2D2926] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#5A5A40]" />
              Lieu de livraison
            </span>
            <p className="text-[#2D2926] font-semibold">{order.district}</p>
            <p className="text-[#7A766F]">{order.address}</p>
            <p className="text-[#7A766F] pt-1 flex items-center gap-1">
              <Phone className="w-3 h-3 text-[#5A5A40]" />
              {order.customerPhone}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE7E0] space-y-1.5">
            <span className="font-semibold text-[#2D2926] flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#5A5A40]" />
              Paiement & Délai estimé
            </span>
            <p className="text-[#2D2926] font-semibold capitalize">
              {order.paymentMethod === 'cash_on_delivery'
                ? '💵 Espèces à la livraison'
                : order.paymentMethod === 'd_money'
                ? '📱 D-Money'
                : '⚡ Waafi'}
            </p>
            <p className="text-[#7A766F]">Zone : {order.deliveryZoneName}</p>
            <p className="text-[#5A5A40] font-bold pt-1">
              Livraison estimée en 2 à 4 heures
            </p>
          </div>
        </div>

        {/* Ordered items */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-[#7A766F] uppercase tracking-wider">
            Articles commandés ({order.items.length})
          </h3>
          <div className="divide-y divide-[#EAE7E0]">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-12 h-12 rounded-xl object-cover bg-[#F2F1ED] shrink-0 border border-[#EAE7E0]"
                  />
                  <div>
                    <p className="font-semibold text-[#2D2926] line-clamp-1">{item.productName}</p>
                    <p className="text-[#7A766F]">Quantité : {item.quantity} × {formatFDJ(item.price)}</p>
                  </div>
                </div>
                <span className="font-bold text-[#5A5A40]">{formatFDJ(item.total)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-[#EAE7E0] space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Envoyer le récapitulatif avec photos sur WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => onTrackOrder(order.orderNumber)}
              className="py-3 px-4 rounded-full bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>Suivre ma commande en direct</span>
            </button>

            <button
              onClick={onNavigateHome}
              className="py-3 px-4 rounded-full bg-[#F2F1ED] hover:bg-[#EAE7E0] text-[#2D2926] font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <span>Retourner à l'accueil</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
