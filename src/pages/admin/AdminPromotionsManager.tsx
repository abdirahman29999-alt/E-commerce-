import React, { useState } from 'react';
import { Plus, Tag, Trash2, Edit2, CheckCircle2, XCircle, X } from 'lucide-react';
import type { Promotion } from '../../types';
import { api, formatFDJ } from '../../services/api';

interface AdminPromotionsManagerProps {
  promotions: Promotion[];
  onRefresh: () => void;
}

export const AdminPromotionsManager: React.FC<AdminPromotionsManagerProps> = ({
  promotions,
  onRefresh
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(5000);
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const openCreateModal = () => {
    setEditingPromo(null);
    setCode('PROMO' + Math.floor(100 + Math.random() * 900));
    setDiscountType('percentage');
    setDiscountValue(15);
    setMinOrderAmount(3000);
    setIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (p: Promotion) => {
    setEditingPromo(p);
    setCode(p.code);
    setDiscountType(p.discountType);
    setDiscountValue(p.discountValue);
    setMinOrderAmount(p.minOrderAmount);
    setIsActive(p.isActive);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setSaving(true);
    try {
      const payload: Partial<Promotion> = {
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount),
        isActive
      };

      if (editingPromo) {
        await api.updatePromotion(editingPromo.id, payload);
      } else {
        await api.createPromotion(payload);
      }
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (window.confirm(`Supprimer le code promotionnel "${code}" ?`)) {
      try {
        await api.deletePromotion(id);
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
            Codes Promo & Réductions
          </h1>
          <p className="text-xs text-stone-500">
            Créez des codes promotionnels pour vos campagnes WhatsApp et réseaux sociaux
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Créer un Code Promo</span>
        </button>
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className={`p-5 rounded-3xl border bg-white shadow-2xs space-y-4 flex flex-col justify-between ${
              promo.isActive ? 'border-amber-300 ring-1 ring-amber-100' : 'border-stone-200 opacity-60'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-mono font-black text-sm tracking-wider">
                  {promo.code}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    promo.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {promo.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>

              <div className="pt-2">
                <p className="text-lg font-black text-stone-950">
                  {promo.discountType === 'percentage'
                    ? `-${promo.discountValue}% de remise`
                    : `-${formatFDJ(promo.discountValue)}`}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  Dès {formatFDJ(promo.minOrderAmount)} d'achat
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-400">
                Utilisé {promo.usedCount || 0} fois
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(promo)}
                  className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(promo.id, promo.code)}
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
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
                {editingPromo ? 'Modifier la Promotion' : 'Nouveau Code Promotionnel'}
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
                <label className="text-xs font-bold text-stone-700">Code promo *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Ex: DJIBOUTI2026"
                  className="w-full p-2.5 text-xs bg-stone-50 rounded-xl border border-stone-300 font-mono font-bold uppercase focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Type de remise</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full p-2.5 text-xs bg-stone-50 rounded-xl border border-stone-300 font-semibold"
                  >
                    <option value="percentage">Pourcentage (%)</option>
                    <option value="fixed">Montant fixe (FDJ)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-stone-700">Valeur remise *</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-stone-50 rounded-xl border border-stone-300 font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Montant minimum d'achat (FDJ)</label>
                <input
                  type="number"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                  className="w-full p-2.5 text-xs bg-stone-50 rounded-xl border border-stone-300"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-stone-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-amber-600"
                  />
                  <span>Activer ce code promo immédiatement</span>
                </label>
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
