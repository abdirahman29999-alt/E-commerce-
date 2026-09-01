import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShoppingBag,
  MapPin,
  Phone,
  User,
  FileText,
  MessageCircle,
  Send
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api, formatFDJ } from '../services/api';
import type { DeliveryZone, PaymentMethod, Order, StoreSettings } from '../types';
import { handleWhatsAppOrderWithPhoto, generateCartWhatsAppUrl } from '../utils/whatsappHelper';

interface CheckoutPageProps {
  deliveryZones: DeliveryZone[];
  settings?: StoreSettings | null;
  onOrderCompleted: (order: Order) => void;
  onNavigateBack: () => void;
}

const DJIBOUTI_DISTRICTS = [
  'Djibouti-Ville (Centre / Place du 27 Juin / Ménélik)',
  'Héron',
  'Plateau / Marabout',
  'Boulaos',
  'Quartier 1 à 7',
  'Ambouli / Cité Progrès',
  'Balbala (T1, T2, T3)',
  'Balbala (Hayabley / Cheik Moussa)',
  'Haramous',
  'Gabode 1 / 2 / 3 / 4 / 5',
  'PK12 / Nagad / Palmeraie',
  'Doraleh / Zone Franche',
  'Autre quartier de Djibouti'
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  deliveryZones,
  settings,
  onOrderCompleted,
  onNavigateBack
}) => {
  const { cart, subtotal, discountAmount, appliedPromo, clearCart } = useCart();

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('+253 77 ');
  const [customerEmail, setCustomerEmail] = useState('');
  const [district, setDistrict] = useState(DJIBOUTI_DISTRICTS[0]);
  const [customDistrict, setCustomDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [deliveryZoneId, setDeliveryZoneId] = useState(deliveryZones[0]?.id || 'zone-centre');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedZone = deliveryZones.find((z) => z.id === deliveryZoneId) || deliveryZones[0];
  const deliveryFee = selectedZone ? selectedZone.price : 800;
  const total = Math.max(0, subtotal - discountAmount + deliveryFee);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-sm font-semibold text-stone-700">Votre panier est vide.</p>
        <button
          onClick={onNavigateBack}
          className="px-5 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs"
        >
          Retourner aux achats
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanPhone = customerPhone.trim();
    if (!customerName.trim()) {
      setErrorMessage('Veuillez renseigner votre nom complet.');
      return;
    }
    if (cleanPhone.length < 8) {
      setErrorMessage('Veuillez renseigner un numéro de téléphone valide à Djibouti.');
      return;
    }
    if (!address.trim()) {
      setErrorMessage('Veuillez préciser votre adresse ou un repère connu.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        customerEmail: customerEmail.trim() || undefined,
        district: district === 'Autre quartier de Djibouti' && customDistrict ? customDistrict : district,
        address: address.trim(),
        city: 'Djibouti',
        deliveryNotes: deliveryNotes.trim() || undefined,
        deliveryZoneId: selectedZone?.id || 'zone-centre',
        paymentMethod,
        items: cart.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity
        })),
        couponCode: appliedPromo?.code
      };

      const newOrder = await api.createOrder(orderPayload);
      clearCart();
      onOrderCompleted(newOrder);
    } catch (err: any) {
      setErrorMessage(err.message || 'Une erreur est survenue lors de l\'enregistrement de votre commande.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onNavigateBack}
          className="p-2 rounded-xl border border-[#EAE7E0] text-[#3D3A35] hover:text-[#2D2926] hover:bg-[#F2F1ED] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2926] font-serif">
            Finaliser ma Commande
          </h1>
          <p className="text-xs text-[#7A766F]">
            Passez commande en tant qu'invité sans création de compte
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-[#F2F1ED] border border-[#E05353] text-[#E05353] text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#E05353] shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Form Fields (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Client Information */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EAE7E0] shadow-2xs space-y-4">
            <h2 className="text-sm font-semibold text-[#2D2926] uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-[#5A5A40]" />
              1. Informations de contact
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-[#3D3A35]">
                  Nom complet <span className="text-[#E05353]">*</span>
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  placeholder="Ex: Mohamed Ali Hassan"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] rounded-xl border border-[#EAE7E0] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#3D3A35]">
                  Téléphone (Djibouti) <span className="text-[#E05353]">*</span>
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  placeholder="+253 77 xx xx xx"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] rounded-xl border border-[#EAE7E0] font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#3D3A35]">
                  Email <span className="text-[#7A766F] font-normal">(Optionnel)</span>
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  placeholder="nom@gmail.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] rounded-xl border border-[#EAE7E0] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
                />
              </div>
            </div>
          </div>

          {/* 2. Delivery Address in Djibouti */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EAE7E0] shadow-2xs space-y-4">
            <h2 className="text-sm font-semibold text-[#2D2926] uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#5A5A40]" />
              2. Adresse de livraison à Djibouti
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#3D3A35]">
                  Quartier à Djibouti <span className="text-[#E05353]">*</span>
                </label>
                <select
                  id="checkout-district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] rounded-xl border border-[#EAE7E0] font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
                >
                  {DJIBOUTI_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              {district === 'Autre quartier de Djibouti' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#3D3A35]">
                    Précisez le nom de votre quartier :
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: PK20, Damerjog, Arta..."
                    value={customDistrict}
                    onChange={(e) => setCustomDistrict(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F6] rounded-xl border border-[#EAE7E0] focus:bg-white"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#3D3A35]">
                  Adresse précise & Repères <span className="text-[#E05353]">*</span>
                </label>
                <textarea
                  id="checkout-address"
                  required
                  rows={2}
                  placeholder="Ex: Rue 14, en face de la pharmacie, portail bleu / Immeuble XYZ, 2ème étage"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#FAF9F6] rounded-xl border border-[#EAE7E0] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#3D3A35]">
                  Zone tarifaire & Délai
                </label>
                <div className="space-y-2">
                  {deliveryZones.map((zone) => (
                    <label
                      key={zone.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer text-xs transition-colors ${
                        deliveryZoneId === zone.id
                          ? 'border-[#5A5A40] bg-[#F2F1ED] font-semibold'
                          : 'border-[#EAE7E0] bg-[#FAF9F6]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="deliveryZone"
                          value={zone.id}
                          checked={deliveryZoneId === zone.id}
                          onChange={() => setDeliveryZoneId(zone.id)}
                          className="text-[#5A5A40] focus:ring-[#5A5A40]"
                        />
                        <div>
                          <p className="text-[#2D2926]">{zone.name}</p>
                          <p className="text-[11px] text-[#7A766F]">{zone.estimatedHours}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#5A5A40]">
                        {zone.price === 0 ? 'Gratuit' : formatFDJ(zone.price)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#3D3A35]">
                  Instructions pour le livreur <span className="text-[#7A766F] font-normal">(Optionnel)</span>
                </label>
                <input
                  id="checkout-notes"
                  type="text"
                  placeholder="Ex: Appeler 10 min avant d’arriver / Livrer après 17h"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF9F6] rounded-xl border border-[#EAE7E0] focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-[#EAE7E0] shadow-2xs space-y-4">
            <h2 className="text-sm font-semibold text-[#2D2926] uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#5A5A40]" />
              3. Mode de règlement à Djibouti
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cash_on_delivery'
                    ? 'border-[#5A5A40] bg-[#F2F1ED] ring-1 ring-[#5A5A40]'
                    : 'border-[#EAE7E0] bg-[#FAF9F6]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={paymentMethod === 'cash_on_delivery'}
                  onChange={() => setPaymentMethod('cash_on_delivery')}
                  className="mt-0.5 text-[#5A5A40] focus:ring-[#5A5A40]"
                />
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#2D2926]">
                    💵 Paiement en espèces à la livraison (Recommandé)
                  </p>
                  <p className="text-xs text-[#7A766F] mt-0.5">
                    Payez directement au livreur après avoir vérifié votre colis.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'd_money'
                    ? 'border-[#5A5A40] bg-[#F2F1ED] ring-1 ring-[#5A5A40]'
                    : 'border-[#EAE7E0] bg-[#FAF9F6]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="d_money"
                  checked={paymentMethod === 'd_money'}
                  onChange={() => setPaymentMethod('d_money')}
                  className="mt-0.5 text-[#5A5A40] focus:ring-[#5A5A40]"
                />
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#2D2926]">
                    📱 D-Money (Djibouti Telecom)
                  </p>
                  <p className="text-xs text-[#7A766F] mt-0.5">
                    Transfert sécurisé vers notre numéro marchand lors de la remise.
                  </p>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'waafi'
                    ? 'border-[#5A5A40] bg-[#F2F1ED] ring-1 ring-[#5A5A40]'
                    : 'border-[#EAE7E0] bg-[#FAF9F6]'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="waafi"
                  checked={paymentMethod === 'waafi'}
                  onChange={() => setPaymentMethod('waafi')}
                  className="mt-0.5 text-[#5A5A40] focus:ring-[#5A5A40]"
                />
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#2D2926]">
                    ⚡ Waafi (Salaam Bank)
                  </p>
                  <p className="text-xs text-[#7A766F] mt-0.5">
                    Paiement direct instantané via l'application Waafi.
                  </p>
                </div>
              </label>
            </div>
          </div>

        </div>

        {/* Right: Sticky Order Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-[#EAE7E0] shadow-sm space-y-5 sticky top-24">
            <h3 className="text-base font-bold text-[#2D2926] font-serif pb-3 border-b border-[#EAE7E0]">
              Votre Commande ({cart.reduce((s, i) => s + i.quantity, 0)} articles)
            </h3>

            {/* Items mini list */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={item.product.images[0] || ''}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-[#F2F1ED] shrink-0"
                    />
                    <div>
                      <p className="font-bold text-[#2D2926] line-clamp-1">{item.product.name}</p>
                      <p className="text-[#7A766F]">Qté : {item.quantity} × {formatFDJ(item.product.price)}</p>
                    </div>
                  </div>
                  <span className="font-bold text-[#5A5A40] shrink-0">
                    {formatFDJ(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-4 border-t border-[#EAE7E0] space-y-2 text-xs">
              <div className="flex justify-between text-[#7A766F]">
                <span>Sous-total</span>
                <span className="font-semibold text-[#2D2926]">{formatFDJ(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#5A5A40] font-semibold">
                  <span>Remise ({appliedPromo?.code})</span>
                  <span>-{formatFDJ(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#7A766F]">
                <span>Frais de livraison</span>
                <span className="font-semibold text-[#2D2926]">
                  {deliveryFee === 0 ? 'Gratuit' : formatFDJ(deliveryFee)}
                </span>
              </div>

              <div className="pt-3 border-t border-[#EAE7E0] flex justify-between items-baseline">
                <span className="text-sm font-bold text-[#2D2926]">Total à payer</span>
                <span className="text-2xl font-bold text-[#5A5A40]">
                  {formatFDJ(total)}
                </span>
              </div>
            </div>

            {/* Submit Order Button */}
            <div className="space-y-2.5">
              <button
                id="btn-checkout-whatsapp"
                type="button"
                onClick={() =>
                  handleWhatsAppOrderWithPhoto({
                    cart,
                    subtotal,
                    deliveryFee,
                    total,
                    deliveryZone: selectedZone,
                    settings,
                    customerInfo: {
                      name: customerName,
                      phone: customerPhone,
                      district: district === 'Autre quartier de Djibouti' && customDistrict ? customDistrict : district,
                      address,
                      paymentMethod:
                        paymentMethod === 'cash_on_delivery'
                          ? 'Espèces à la livraison'
                          : paymentMethod === 'd_money'
                          ? 'D-Money'
                          : 'Waafi',
                      notes: deliveryNotes
                    }
                  })
                }
                className="w-full py-4 px-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all text-center cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-white/20 shrink-0" />
                <span>Passer la commande sur WhatsApp</span>
                <Send className="w-4 h-4 shrink-0 opacity-80" />
              </button>

              <button
                id="btn-submit-order"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-full bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 active:scale-98 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Enregistrement en cours...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Enregistrer la commande sur le site ({formatFDJ(total)})</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-center text-[#7A766F]">
              En confirmant votre commande, vous acceptez notre service de livraison locale à Djibouti.
            </p>
          </div>
        </div>

      </form>

    </div>
  );
};
