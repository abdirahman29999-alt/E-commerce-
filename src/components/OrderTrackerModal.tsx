import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  Phone,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { api, formatFDJ } from '../services/api';
import type { Order, OrderStatus } from '../types';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderNumber?: string;
}

const statusSteps: { key: OrderStatus; label: string; description: string }[] = [
  { key: 'nouvelle', label: 'Commande reçue', description: 'Enregistrée dans le système' },
  { key: 'confirmee', label: 'Confirmée', description: 'Validée par le commerçant' },
  { key: 'preparation', label: 'En préparation', description: 'Articles emballés soigneusement' },
  { key: 'en_livraison', label: 'En livraison', description: 'Remise au coursier à Djibouti' },
  { key: 'livree', label: 'Livrée', description: 'Remise au client et payée' }
];

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  initialOrderNumber = ''
}) => {
  const [orderQuery, setOrderQuery] = useState(initialOrderNumber);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialOrderNumber) {
      setOrderQuery(initialOrderNumber);
      fetchOrder(initialOrderNumber);
    }
  }, [initialOrderNumber]);

  const fetchOrder = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.getOrder(query.trim());
      setOrder(res);
    } catch (err: any) {
      setOrder(null);
      setError(err.message || 'Commande introuvable. Veuillez vérifier le numéro (#DJ-xxxx).');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrder(orderQuery);
  };

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'annulee') return -1;
    return statusSteps.findIndex((s) => s.key === status);
  };

  const currentStepIdx = order ? getStepIndex(order.status) : -1;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#2D2926]/60 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#EAE7E0] z-10 my-8"
          >
            {/* Header */}
            <div className="p-5 sm:p-6 bg-[#2D2926] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-full bg-[#5A5A40] text-white">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-serif">Suivi de Commande en direct</h3>
              <p className="text-xs text-[#EAE7E0]/80">
                Entrez votre numéro de commande pour suivre la livraison à Djibouti
              </p>
            </div>
          </div>
          <button
            id="btn-close-tracker-modal"
            onClick={onClose}
            className="p-2 text-[#EAE7E0] hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-5 sm:p-6 border-b border-[#EAE7E0] bg-[#FAF9F6]">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                id="tracker-modal-input"
                type="text"
                placeholder="Ex: DJ-1025"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white rounded-full border border-[#EAE7E0] text-sm font-semibold uppercase placeholder:normal-case placeholder:font-normal focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
              />
              <Search className="w-4 h-4 text-[#7A766F] absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              id="btn-tracker-modal-search"
              type="submit"
              disabled={loading || !orderQuery.trim()}
              className="px-5 py-2.5 bg-[#5A5A40] text-white font-semibold text-xs rounded-full hover:bg-[#4A4A30] transition-colors disabled:opacity-50"
            >
              {loading ? 'Recherche...' : 'Suivre'}
            </button>
          </form>
        </div>

        {/* Result Area */}
        <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-[#F2F1ED] border border-[#E05353] text-[#E05353] flex items-center gap-3 text-xs">
              <AlertCircle className="w-5 h-5 text-[#E05353] shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!order && !error && !loading && (
            <div className="text-center py-6 text-[#7A766F] text-xs">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-40 text-[#5A5A40]" />
              <p>Entrez votre référence reçue par SMS/WhatsApp (ex: DJ-1024, DJ-1025)</p>
            </div>
          )}

          {order && (
            <div className="space-y-6">
              
              {/* Order Status Banner */}
              <div className="p-4 rounded-2xl bg-[#F2F1ED] border border-[#EAE7E0] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-[#5A5A40]">
                    Commande #{order.orderNumber}
                  </span>
                  <p className="text-xs text-[#7A766F]">
                    Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold text-[#7A766F] uppercase block">Total</span>
                  <span className="text-base font-bold text-[#5A5A40]">{formatFDJ(order.total)}</span>
                </div>
              </div>

              {/* Status Timeline */}
              {order.status === 'annulee' ? (
                <div className="p-4 rounded-xl bg-[#F2F1ED] text-[#E05353] text-center font-semibold text-xs">
                  Cette commande a été annulée.
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-[#7A766F] uppercase tracking-wider">
                    Progression de la livraison
                  </h4>
                  <div className="space-y-3 relative pl-6 border-l-2 border-[#EAE7E0] ml-3">
                    {statusSteps.map((step, idx) => {
                      const isDone = currentStepIdx >= idx;
                      const isCurrent = currentStepIdx === idx;

                      return (
                        <div key={step.key} className="relative group">
                          {/* Dot */}
                          <div
                            className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                              isDone
                                ? 'bg-[#5A5A40] shadow-xs'
                                : 'bg-[#EAE7E0] text-[#7A766F]'
                            }`}
                          >
                            {isDone ? '✓' : idx + 1}
                          </div>

                          <div className="pl-1">
                            <p
                              className={`text-xs font-semibold ${
                                isCurrent ? 'text-[#2D2926] font-bold' : isDone ? 'text-[#2D2926]' : 'text-[#7A766F]'
                              }`}
                            >
                              {step.label}
                            </p>
                            <p className="text-[11px] text-[#7A766F]">{step.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Delivery Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EAE7E0]">
                  <span className="font-semibold text-[#2D2926] flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#5A5A40]" />
                    Adresse de livraison
                  </span>
                  <p className="text-[#2D2926] font-semibold">{order.customerName}</p>
                  <p className="text-[#7A766F]">{order.district}, {order.address}</p>
                  <p className="text-[#7A766F] mt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#7A766F]" />
                    {order.customerPhone}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EAE7E0]">
                  <span className="font-semibold text-[#2D2926] flex items-center gap-1.5 mb-1">
                    <Package className="w-3.5 h-3.5 text-[#5A5A40]" />
                    Paiement & Mode
                  </span>
                  <p className="text-[#2D2926] font-medium capitalize">
                    {order.paymentMethod === 'cash_on_delivery'
                      ? '💵 Espèces à la livraison'
                      : order.paymentMethod === 'd_money'
                      ? '📱 D-Money'
                      : order.paymentMethod === 'waafi'
                      ? '⚡ Waafi'
                      : 'Carte'}
                  </p>
                  <p className="text-[#7A766F] mt-0.5">
                    Zone : {order.deliveryZoneName} ({formatFDJ(order.deliveryFee)})
                  </p>
                </div>
              </div>

              {/* Items in this order */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#7A766F] uppercase tracking-wider">
                  Articles ({order.items.length})
                </h4>
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F6] border border-[#EAE7E0] text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-10 h-10 rounded-lg object-cover bg-[#F2F1ED] border border-[#EAE7E0]"
                        />
                        <div>
                          <p className="font-semibold text-[#2D2926] line-clamp-1">
                            {item.productName}
                          </p>
                          <p className="text-[#7A766F]">Quantité : {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-[#5A5A40]">{formatFDJ(item.total)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* WhatsApp Help */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/25377123456?text=Bonjour%20DjiAccess,%20je%20vous%20contacte%20concernant%20ma%20commande%20n°%20${order.orderNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-full bg-[#25D366] text-white font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors"
                >
                  <span>Besoin d'aide sur WhatsApp pour cette commande ?</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          )}
        </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
