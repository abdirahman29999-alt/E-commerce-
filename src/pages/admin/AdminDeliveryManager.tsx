import React, { useState } from 'react';
import { Truck, Plus, Edit2, Trash2, X, CheckCircle2 } from 'lucide-react';
import type { DeliveryZone } from '../../types';
import { api, formatFDJ } from '../../services/api';

interface AdminDeliveryManagerProps {
  zones: DeliveryZone[];
  onRefresh: () => void;
}

export const AdminDeliveryManager: React.FC<AdminDeliveryManagerProps> = ({
  zones,
  onRefresh
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<DeliveryZone | null>(null);

  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(800);
  const [estimatedHours, setEstimatedHours] = useState('2 à 4 heures');
  const [description, setDescription] = useState('Djibouti-Ville, Héron, Plateau');
  const [saving, setSaving] = useState(false);

  const openCreateModal = () => {
    setEditingZone(null);
    setName('');
    setPrice(1000);
    setEstimatedHours('2 à 4 heures');
    setDescription('Quartiers desservis par cette zone');
    setModalOpen(true);
  };

  const openEditModal = (z: DeliveryZone) => {
    setEditingZone(z);
    setName(z.name);
    setPrice(z.price);
    setEstimatedHours(z.estimatedHours);
    setDescription(z.description || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      let updatedList: DeliveryZone[] = [];
      if (editingZone) {
        updatedList = zones.map((z) =>
          z.id === editingZone.id
            ? {
                ...z,
                name: name.trim(),
                price: Number(price),
                estimatedHours: estimatedHours.trim(),
                description: description.trim()
              }
            : z
        );
      } else {
        const newZone: DeliveryZone = {
          id: `zone_${Date.now()}`,
          name: name.trim(),
          price: Number(price),
          estimatedHours: estimatedHours.trim(),
          description: description.trim(),
          isActive: true
        };
        updatedList = [...zones, newZone];
      }

      await api.updateDeliveryZones(updatedList);
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Supprimer la zone de livraison "${name}" ?`)) {
      try {
        const updatedList = zones.filter((z) => z.id !== id);
        await api.updateDeliveryZones(updatedList);
        onRefresh();
      } catch (err: any) {
        alert(err.message || 'Erreur lors de la suppression.');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-950">
            Frais & Zones de Livraison à Djibouti
          </h1>
          <p className="text-xs text-stone-500">
            Configurez les tarifs de livraison en FDJ et les délais selon les quartiers
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une Zone</span>
        </button>
      </div>

      {/* Zones list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-stone-900">{zone.name}</h3>
                <span className="text-base font-black text-stone-950 px-3 py-1 bg-stone-100 rounded-xl">
                  {zone.price === 0 ? 'Gratuit' : formatFDJ(zone.price)}
                </span>
              </div>

              <p className="text-xs text-amber-800 font-semibold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                Délai estimé : {zone.estimatedHours}
              </p>

              {zone.description && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                    Détails / Quartiers :
                  </span>
                  <p className="text-xs text-stone-600 bg-stone-50 p-2 rounded-xl border border-stone-100">
                    {zone.description}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(zone)}
                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Modifier</span>
              </button>
              <button
                onClick={() => handleDelete(zone.id, zone.name)}
                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Supprimer</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="p-5 bg-stone-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">
                {editingZone ? 'Modifier la Zone' : 'Nouvelle Zone de Livraison'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Nom de la zone *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Balbala & Périphérie"
                  className="w-full p-2.5 text-xs bg-stone-50 rounded-xl border border-stone-300 focus:bg-white font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Tarif de livraison (FDJ) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full p-2.5 text-xs bg-stone-50 rounded-xl border border-stone-300 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Délai estimé *</label>
                <input
                  type="text"
                  required
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                  placeholder="Ex: 2 à 4 heures / Le jour même"
                  className="w-full p-2.5 text-xs bg-stone-50 rounded-xl border border-stone-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">
                  Quartiers couverts / Précisions
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Balbala T1, Hayabley, Cheik Moussa..."
                  className="w-full p-2.5 text-xs bg-stone-50 rounded-xl border border-stone-300"
                />
              </div>

              <div className="pt-4 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-stone-600 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-sm"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
