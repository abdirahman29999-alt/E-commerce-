import React, { useState, useEffect } from 'react';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  Phone,
  ArrowLeft,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { api, formatFDJ } from '../services/api';
import type { Order, OrderStatus } from '../types';

interface OrderTrackingPageProps {
  initialOrderNumber?: string;
  onNavigateHome: () => void;
}

const statusSteps: { key: OrderStatus; label: string; description: string }[] = [
  { key: 'nouvelle', label: 'Commande reçue', description: 'Enregistrée dans le système' },
  { key: 'confirmee', label: 'Confirmée', description: 'Validée par le commerçant' },
  { key: 'preparation', label: 'En préparation', description: 'Articles emballés soigneusement' },
  { key: 'en_livraison', label: 'En livraison', description: 'Remise au coursier à Djibouti' },
  { key: 'livree', label: 'Livrée & Encaissée', description: 'Remise au client' }
];

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  initialOrderNumber = '',
  onNavigateHome
}) => {
  const [orderQuery, setOrderQuery] = useState(initialOrderNumber);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.getOrder(query.trim());
      setOrder(res);
    } catch (err: any) {
      setOrder(null);
      setError(err.message || 'Aucune commande trouvée avec ce numéro.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      setOrderQuery(initialOrderNumber);
      fetchOrder(initialOrderNumber);
    }
  }, [initialOrderNumber]);

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Back button */}
      <button
        onClick={onNavigateHome}
        className="flex items-center gap-1.5 text-xs font-semibold text-[#3D3A35] hover:text-[#2D2926] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Retour à la boutique</span>
      </button>

      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="w-14 h-14 rounded-full bg-[#F2F1ED] text-[#5A5A40] mx-auto flex items-center justify-center">
          <Truck className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#2D2926] font-serif">
          Suivi de Commande en Temps Réel
        </h1>
        <p className="text-xs sm:text-sm text-[#7A766F]">
          Entrez votre référence (#DJ-xxxx) pour connaître l'état d'avancement de votre livraison
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#EAE7E0] shadow-2xs max-w-xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Ex: DJ-1025"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value.toUpperCase())}
              className="w-full pl-9 pr-4 py-3 bg-[#FAF9F6] rounded-full border border-[#EAE7E0] text-sm font-semibold uppercase focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
            />
            <Search className="w-4 h-4 text-[#7A766F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
          <button
            type="submit"
            disabled={loading || !orderQuery.trim()}
            className="px-6 py-3 bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-semibold text-xs sm:text-sm rounded-full transition-colors disabled:opacity-50"
          >
            {loading ? '...' : 'Suivre'}
          </button>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-[#F2F1ED] border border-[#E05353] text-[#E05353] text-xs flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-[#E05353] shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results Card */}
      {order && (
        <div className="bg-white rounded-3xl border border-[#EAE7E0] p-6 sm:p-8 shadow-sm space-y-8 animate-in fade-in-50 duration-300">
          
          {/* Header summary */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#EAE7E0]">
            <div>
              <span className="text-xs font-semibold text-[#7A766F] uppercase">Référence Commande</span>
              <p className="text-xl font-bold text-[#2D2926] font-mono">#{order.orderNumber}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-[#7A766F] uppercase">Date</span>
              <p className="text-xs font-semibold text-[#3D3A35]">
                {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <span className="text-xs font-semibold text-[#7A766F] uppercase">Montant Total</span>
              <p className="text-xl font-bold text-[#5A5A40]">{formatFDJ(order.total)}</p>
            </div>
          </div>

          {/* Timeline steps */}
          {order.status === 'annulee' ? (
            <div className="p-4 rounded-2xl bg-[#F2F1ED] text-[#E05353] font-bold text-center text-xs">
              Cette commande a été annulée. Contactez notre support pour toute question.
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#7A766F] uppercase tracking-wider">
                Étapes de la livraison
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {statusSteps.map((step, idx) => {
                  const isDone = currentStepIdx >= idx;
                  const isCurrent = currentStepIdx === idx;

                  return (
                    <div
                      key={step.key}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'border-[#5A5A40] bg-[#F2F1ED] ring-1 ring-[#5A5A40]'
                          : isDone
                          ? 'border-[#EAE7E0] bg-[#FAF9F6] text-[#2D2926]'
                          : 'border-[#EAE7E0] bg-[#FAF9F6] opacity-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                            isDone ? 'bg-[#5A5A40]' : 'bg-[#7A766F]'
                          }`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            isCurrent ? 'text-[#2D2926] font-bold' : isDone ? 'text-[#2D2926]' : 'text-[#7A766F]'
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7A766F] leading-tight">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Delivery & Items details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#EAE7E0]">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#7A766F] uppercase tracking-wider">
                Informations Destinataire
              </h4>
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE7E0] space-y-1.5 text-xs">
                <p className="font-semibold text-[#2D2926]">{order.customerName}</p>
                <p className="text-[#3D3A35] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#5A5A40] shrink-0" />
                  {order.district}, {order.address}
                </p>
                <p className="text-[#3D3A35] flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#7A766F]" />
                  {order.customerPhone}
                </p>
                <p className="text-[#7A766F] pt-1">
                  Mode de règlement :{' '}
                  <strong className="text-[#2D2926] capitalize">
                    {order.paymentMethod === 'cash_on_delivery'
                      ? 'Espèces à la livraison'
                      : order.paymentMethod === 'd_money'
                      ? 'D-Money'
                      : 'Waafi'}
                  </strong>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#7A766F] uppercase tracking-wider">
                Articles dans le colis ({order.items.length})
              </h4>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#EAE7E0] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-10 h-10 rounded-lg object-cover bg-[#F2F1ED] border border-[#EAE7E0]"
                      />
                      <div>
                        <p className="font-semibold text-[#2D2926] line-clamp-1">{item.productName}</p>
                        <p className="text-[#7A766F]">Qté : {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#5A5A40]">{formatFDJ(item.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* WhatsApp Support CTA */}
          <div className="pt-4 border-t border-[#EAE7E0]">
            <a
              href={`https://wa.me/25377123456?text=Bonjour%20DjiAccess,%20je%20vous%20contacte%20concernant%20le%20suivi%20de%20ma%20commande%20n°%20${order.orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full py-3.5 rounded-full bg-[#25D366] text-white text-xs font-semibold hover:bg-[#20bd5a] transition-colors gap-2"
            >
              <span>Contacter le service coursier sur WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      )}

    </div>
  );
};
