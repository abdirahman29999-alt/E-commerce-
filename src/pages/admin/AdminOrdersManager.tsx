import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Eye,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  MapPin,
  FileText,
  Printer,
  ChevronRight,
  ExternalLink,
  X
} from 'lucide-react';
import type { Order, OrderStatus } from '../../types';
import { api, formatFDJ } from '../../services/api';

interface AdminOrdersManagerProps {
  orders: Order[];
  onRefresh: () => void;
}

const statusOptions: { value: OrderStatus; label: string; color: string }[] = [
  { value: 'nouvelle', label: 'Nouvelle Commande', color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { value: 'confirmee', label: 'Confirmée', color: 'bg-purple-100 text-purple-900 border-purple-300' },
  { value: 'preparation', label: 'En Préparation', color: 'bg-blue-100 text-blue-900 border-blue-300' },
  { value: 'en_livraison', label: 'En Livraison', color: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
  { value: 'livree', label: 'Livrée & Encaissée', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { value: 'annulee', label: 'Annulée', color: 'bg-rose-100 text-rose-900 border-rose-300' }
];

export const AdminOrdersManager: React.FC<AdminOrdersManagerProps> = ({
  orders,
  onRefresh
}) => {
  const [search, setSearch] = useState('');
  const [selectedStatusTab, setSelectedStatusTab] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const filteredOrders = orders.filter((o) => {
    if (selectedStatusTab !== 'all' && o.status !== selectedStatusTab) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.district.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingStatus(true);
    try {
      await api.updateOrderStatus(orderId, newStatus);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Erreur lors du changement de statut.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    const opt = statusOptions.find((s) => s.value === status) || statusOptions[0];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${opt.color}`}>
        {opt.label}
      </span>
    );
  };

  const getWhatsAppMessage = (order: Order) => {
    const rawNumber = order.customerPhone.replace(/[^0-9]/g, '');
    const cleanPhone = rawNumber.startsWith('253') ? rawNumber : `253${rawNumber}`;
    const text = encodeURIComponent(
      `Bonjour ${order.customerName},\nIci la boutique DjiAccess.\nNous vous contactons concernant votre commande #${order.orderNumber} d'un montant de ${formatFDJ(order.total)} à livrer à ${order.district}.\nStatut actuel : ${order.status.toUpperCase()}.\nUn coursier prend en charge votre colis.`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-950">
            Gestion des Commandes & Livraisons
          </h1>
          <p className="text-xs text-stone-500">
            Suivez les commandes à Djibouti, contactez les clients et mettez à jour les statuts en 1 clic
          </p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedStatusTab('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            selectedStatusTab === 'all'
              ? 'bg-stone-950 text-white'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          Toutes ({orders.length})
        </button>
        {statusOptions.map((opt) => {
          const count = orders.filter((o) => o.status === opt.value).length;
          return (
            <button
              key={opt.value}
              onClick={() => setSelectedStatusTab(opt.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedStatusTab === opt.value
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {opt.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher par n° de commande (#DJ-xxxx), nom client, téléphone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white text-xs sm:text-sm rounded-2xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs"
        />
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase">
                <th className="py-3 px-4">Commande</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Client & Contact</th>
                <th className="py-3 px-4">Quartier</th>
                <th className="py-3 px-4">Paiement & Montant</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    Aucune commande trouvée pour ces filtres.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-900">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3 px-4 text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-stone-900">{order.customerName}</p>
                      <a
                        href={`tel:${order.customerPhone}`}
                        className="text-[11px] text-amber-700 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        {order.customerPhone}
                      </a>
                    </td>
                    <td className="py-3 px-4 text-stone-700 font-medium">
                      {order.district}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-black text-stone-950 block">{formatFDJ(order.total)}</span>
                      <span className="text-[10px] text-stone-500 capitalize">
                        {order.paymentMethod === 'cash_on_delivery'
                          ? 'Espèces'
                          : order.paymentMethod === 'd_money'
                          ? 'D-Money'
                          : 'Waafi'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="text-xs font-bold rounded-lg border border-stone-300 py-1 px-2 bg-stone-50 focus:bg-white"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={getWhatsAppMessage(order)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          title="Envoyer message WhatsApp au client"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                          title="Voir les détails complets"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-[#2D2926]/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#EAE7E0] overflow-hidden z-10 my-8"
            >
              
              <div className="p-5 bg-[#2D2926] text-white flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-serif">
                    Détail de la Commande #{selectedOrder.orderNumber}
                  </h3>
                  <p className="text-xs text-stone-300">
                    Passée le {new Date(selectedOrder.createdAt).toLocaleString('fr-FR')}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                
                {/* Quick Status Bar */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-stone-500 uppercase block">Statut Actuel</span>
                    <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-700">Changer statut :</span>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                      className="p-2 text-xs font-bold rounded-xl border border-stone-300 bg-white"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Customer and Delivery info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1.5">
                    <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                      Client & Contact
                    </h4>
                    <p className="text-stone-900 font-semibold">{selectedOrder.customerName}</p>
                    <p className="text-stone-700">Tél : {selectedOrder.customerPhone}</p>
                    {selectedOrder.customerEmail && (
                      <p className="text-stone-500">Email : {selectedOrder.customerEmail}</p>
                    )}
                    <div className="pt-2">
                      <a
                        href={getWhatsAppMessage(selectedOrder)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Écrire sur WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 space-y-1.5">
                    <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      Adresse de Livraison
                    </h4>
                    <p className="text-stone-900 font-semibold">{selectedOrder.district}</p>
                    <p className="text-stone-700">{selectedOrder.address}</p>
                    {selectedOrder.deliveryNotes && (
                      <p className="text-amber-800 bg-amber-50 p-1.5 rounded-md mt-1 italic">
                        Note client : "{selectedOrder.deliveryNotes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Articles Table */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Articles commandés
                  </h4>
                  <div className="divide-y divide-stone-100 border border-stone-100 rounded-2xl overflow-hidden">
                    {selectedOrder.items.map((item, i) => (
                      <div key={i} className="p-3 bg-stone-50/50 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-10 h-10 rounded-lg object-cover bg-stone-200"
                          />
                          <div>
                            <p className="font-bold text-stone-900">{item.productName}</p>
                            <p className="text-stone-500">
                              {item.quantity} × {formatFDJ(item.price)}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-stone-950">{formatFDJ(item.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price summary */}
                <div className="p-4 rounded-2xl bg-stone-50 space-y-1.5 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Sous-total articles</span>
                    <span className="font-semibold">{formatFDJ(selectedOrder.subtotal)}</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-rose-600 font-semibold">
                      <span>Remise ({selectedOrder.couponCode})</span>
                      <span>-{formatFDJ(selectedOrder.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-600">
                    <span>Frais de livraison ({selectedOrder.deliveryZoneName})</span>
                    <span className="font-semibold">{formatFDJ(selectedOrder.deliveryFee)}</span>
                  </div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between font-black text-sm text-stone-950">
                    <span>Montant Total</span>
                    <span>{formatFDJ(selectedOrder.total)}</span>
                  </div>
                </div>

              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-white border border-stone-300 rounded-full text-stone-700 text-xs font-bold flex items-center gap-1.5 hover:bg-stone-100 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer bon de livraison</span>
                </button>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 bg-[#5A5A40] text-white rounded-full text-xs font-bold hover:bg-[#4A4A30] transition-colors"
                >
                  Fermer
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
