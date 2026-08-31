import React from 'react';
import {
  DollarSign,
  ShoppingCart,
  Clock,
  Plus,
  Package,
  TrendingUp,
  Truck,
  CheckCircle,
  Eye,
  Phone,
  MessageCircle,
  ArrowRight,
  Layers,
  Percent
} from 'lucide-react';
import type { DashboardStats, Order, Product } from '../../types';
import { formatFDJ } from '../../services/api';
import type { AdminTab } from './AdminLayout';

interface AdminDashboardOverviewProps {
  stats: DashboardStats | null;
  recentOrders: Order[];
  onNavigateTab: (tab: AdminTab) => void;
  onOpenProductModal?: () => void;
  onStatusChange: (orderId: string, newStatus: any) => Promise<void>;
}

export const AdminDashboardOverview: React.FC<AdminDashboardOverviewProps> = ({
  stats,
  recentOrders,
  onNavigateTab,
  onOpenProductModal,
  onStatusChange
}) => {
  return (
    <div className="space-y-8">
      
      {/* Welcome & Quick CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2D2926] font-serif">
            Tableau de Bord Commerçant
          </h1>
          <p className="text-xs sm:text-sm text-[#7A766F] mt-0.5">
            Aperçu en direct de vos ventes, commandes et performances à Djibouti
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => onNavigateTab('products')}
            className="px-4 py-2.5 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Produit</span>
          </button>
          <button
            onClick={() => onNavigateTab('orders')}
            className="px-4 py-2.5 rounded-xl bg-[#2D2926] hover:bg-[#3D3A35] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Toutes les Commandes</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Total Revenue */}
        <div className="p-5 rounded-3xl bg-white border border-[#EAE7E0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#7A766F] uppercase tracking-wider">
              Chiffre d'Affaires
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#2D2926]">
            {formatFDJ(stats?.totalSales || 0)}
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            Ventes en Francs Djibouti (FDJ)
          </p>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-3xl bg-white border border-[#EAE7E0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#7A766F] uppercase tracking-wider">
              Total Commandes
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-[#5A5A40]">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#2D2926]">
            {stats?.totalOrders || 0}
          </p>
          <p className="text-[11px] text-[#7A766F]">
            Passées sur la boutique
          </p>
        </div>

        {/* Pending Orders */}
        <div className="p-5 rounded-3xl bg-white border border-[#EAE7E0] shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#7A766F] uppercase tracking-wider">
              Commandes en Cours
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-[#2D2926]">
            {stats?.pendingOrders || 0}
          </p>
          <p className="text-[11px] text-blue-700 font-semibold">
            À préparer ou livrer
          </p>
        </div>

      </div>

      {/* Recent Orders Section */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#EAE7E0] shadow-2xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-base font-black text-[#2D2926] font-serif">
              Dernières Commandes Clients
            </h2>
            <p className="text-xs text-[#7A766F]">
              Commandes passées récemment par les clients à Djibouti
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs font-bold text-[#5A5A40] hover:text-[#4A4A30] flex items-center gap-1 cursor-pointer"
          >
            <span>Voir toutes les commandes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-xs text-stone-400 text-center py-8">Aucune commande enregistrée pour le moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-[#7A766F] font-bold uppercase">
                  <th className="py-2.5 pr-3">N° Commande</th>
                  <th className="py-2.5 px-3">Client & Quartier</th>
                  <th className="py-2.5 px-3">Articles</th>
                  <th className="py-2.5 px-3">Total (FDJ)</th>
                  <th className="py-2.5 px-3">Statut</th>
                  <th className="py-2.5 pl-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentOrders.slice(0, 8).map((order) => (
                  <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 pr-3 font-mono font-bold text-[#2D2926]">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-[#2D2926]">{order.customerName}</p>
                      <p className="text-[11px] text-[#7A766F]">{order.district}</p>
                    </td>
                    <td className="py-3 px-3 text-[#3D3A35]">
                      {order.items.length} article{order.items.length > 1 ? 's' : ''}
                    </td>
                    <td className="py-3 px-3 font-black text-[#2D2926]">
                      {formatFDJ(order.total)}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'livree'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.status === 'en_livraison'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'preparation'
                            ? 'bg-amber-100 text-amber-800'
                            : order.status === 'confirmee'
                            ? 'bg-purple-100 text-purple-800'
                            : order.status === 'annulee'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-stone-200 text-stone-800'
                        }`}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 pl-3 text-right">
                      <button
                        onClick={() => onNavigateTab('orders')}
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 cursor-pointer"
                        title="Gérer la commande"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
