import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Layers, X, Upload } from 'lucide-react';
import type { Category } from '../../types';
import { api } from '../../services/api';

interface AdminCategoriesManagerProps {
  categories: Category[];
  onRefresh: () => void;
}

export const AdminCategoriesManager: React.FC<AdminCategoriesManagerProps> = ({
  categories,
  onRefresh
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [saving, setSaving] = useState(false);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600');
    setModalOpen(true);
  };

  const openEditModal = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setDescription(c.description || '');
    setImage(c.image || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const payload: Partial<Category> = {
        name: name.trim(),
        slug,
        description: description.trim(),
        image: image.trim()
      };

      if (editingCategory) {
        await api.updateCategory(editingCategory.id, payload);
      } else {
        await api.createCategory(payload);
      }
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Supprimer la catégorie "${name}" ? Les produits associés ne seront pas supprimés.`)) {
      try {
        await api.deleteCategory(id);
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
            Gestion des Catégories
          </h1>
          <p className="text-xs text-stone-500">
            Organisez vos accessoires par rayons (Écouteurs, Coques, Montres...)
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Catégorie</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div
            key={c.id}
            className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col justify-between space-y-3"
          >
            <div className="flex items-start gap-3">
              <img
                src={c.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
                alt={c.name}
                className="w-16 h-16 rounded-xl object-cover bg-stone-100 shrink-0"
              />
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-stone-900">{c.name}</h3>
                <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">
                  {c.description || 'Aucune description'}
                </p>
                <span className="inline-block px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-bold mt-1">
                  {c.productCount || 0} produit(s)
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                onClick={() => openEditModal(c)}
                className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Modifier</span>
              </button>
              <button
                onClick={() => handleDelete(c.id, c.name)}
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
                {editingCategory ? 'Modifier la Catégorie' : 'Créer une Catégorie'}
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
                <label className="text-xs font-bold text-stone-700">Nom de la catégorie *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Écouteurs & Audio"
                  className="w-full p-2.5 text-xs bg-stone-50 rounded-xl border border-stone-300 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description courte de la catégorie"
                  className="w-full p-2.5 text-xs bg-stone-50 rounded-xl border border-stone-300 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">URL Image d'illustration</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full p-2.5 text-xs bg-stone-50 rounded-xl border border-stone-300 focus:bg-white font-mono text-[11px]"
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
