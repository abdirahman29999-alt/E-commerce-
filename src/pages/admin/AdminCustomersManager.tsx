import React, { useState } from 'react';
import { Users, Search, Phone, MapPin, ShoppingBag, DollarSign, MessageCircle } from 'lucide-react';
import type { Customer } from '../../types';
import { formatFDJ } from '../../services/api';

interface AdminCustomersManagerProps {
  customers: Customer[];
}

export const AdminCustomersManager: React.FC<AdminCustomersManagerProps> = ({
  customers
}) => {
  const [search, setSearch] = useState('');

  const filteredCustomers = customers.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.district?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-stone-950">
          Répertoire Clients & Fidélité
        </h1>
        <p className="text-xs text-stone-500">
          Consultez l'historique d'achat de vos clients à Djibouti et contactez-les directement
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher un client par nom, numéro de téléphone, quartier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 bg-white text-xs sm:text-sm rounded-2xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 shadow-2xs"
        />
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase">
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Téléphone</th>
                <th className="py-3 px-4">Quartier Principal</th>
                <th className="py-3 px-4">Nb Commandes</th>
                <th className="py-3 px-4">Total Dépensé (FDJ)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-400">
                    Aucun client enregistré pour le moment.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const cleanPhone = cust.phone.replace(/[^0-9]/g, '');
                  const waNumber = cleanPhone.startsWith('253') ? cleanPhone : `253${cleanPhone}`;

                  return (
                    <tr key={cust.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">
                            {cust.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-stone-900">{cust.name}</p>
                            {cust.email && <p className="text-[11px] text-stone-400">{cust.email}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-stone-800">
                        {cust.phone}
                      </td>
                      <td className="py-3 px-4 text-stone-700">
                        {cust.district || 'Djibouti-Ville'}
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900">
                        {cust.totalOrders} commande{cust.totalOrders > 1 ? 's' : ''}
                      </td>
                      <td className="py-3 px-4 font-black text-stone-950">
                        {formatFDJ(cust.totalSpent)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`https://wa.me/${waNumber}?text=Bonjour%20${encodeURIComponent(cust.name)},%20ici%20DjiAccess.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            title="Envoyer un message WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`tel:${cust.phone}`}
                            className="p-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200"
                            title="Appeler le client"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
