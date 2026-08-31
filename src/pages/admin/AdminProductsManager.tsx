import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Upload,
  X,
  Sparkles,
  Tag,
  Package,
  Layers
} from 'lucide-react';
import type { Product, Category } from '../../types';
import { api, formatFDJ } from '../../services/api';
import { ProductGalleryManager } from '../../components/ProductGalleryManager';

interface AdminProductsManagerProps {
  products: Product[];
  categories: Category[];
  onRefresh: () => void;
}

export const AdminProductsManager: React.FC<AdminProductsManagerProps> = ({
  products,
  categories,
  onRefresh
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [compareAtPrice, setCompareAtPrice] = useState<number | undefined>(undefined);
  const [stock, setStock] = useState<number>(10);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || '');
  const [description, setDescription] = useState('');
  const [productImages, setProductImages] = useState<string[]>([]);
  const [sku, setSku] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPromo, setIsPromo] = useState(false);
  const [isNew, setIsNew] = useState(true);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== 'all' && p.categoryId !== selectedCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.categoryName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setPrice(3500);
    setCompareAtPrice(undefined);
    setStock(15);
    setLowStockThreshold(5);
    setCategoryId(categories[0]?.id || '');
    setDescription('');
    setProductImages([]);
    setSku(`DJI-${Math.floor(1000 + Math.random() * 9000)}`);
    setStatus('active');
    setIsFeatured(false);
    setIsPromo(false);
    setIsNew(true);
    setFormError(null);
    setModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setPrice(p.price);
    setCompareAtPrice(p.compareAtPrice);
    setStock(p.stock);
    setLowStockThreshold(p.lowStockThreshold || 5);
    setCategoryId(p.categoryId);
    setDescription(p.description);
    setProductImages(p.images && p.images.length > 0 ? [...p.images] : []);
    setSku(p.sku);
    setStatus(p.status);
    setIsFeatured(p.isFeatured || false);
    setIsPromo(p.isPromo || false);
    setIsNew(p.isNew || false);
    setFormError(null);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Le nom du produit est obligatoire.');
      return;
    }
    if (price <= 0) {
      setFormError('Le prix doit être supérieur à 0 FDJ.');
      return;
    }
    if (productImages.length === 0) {
      setFormError('Veuillez ajouter au moins une photo pour le produit. La première photo servira d\'image principale.');
      return;
    }

    setSaving(true);
    setFormError(null);

    const productData: Partial<Product> = {
      name: name.trim(),
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      stock: Number(stock),
      lowStockThreshold: Number(lowStockThreshold),
      categoryId,
      description: description.trim(),
      images: productImages,
      sku: sku.trim() || `DJI-${Math.floor(1000 + Math.random() * 9000)}`,
      status,
      isFeatured,
      isPromo,
      isNew
    };

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, productData);
      } else {
        await api.createProduct(productData);
      }
      setModalOpen(false);
      onRefresh();
    } catch (err: any) {
      setFormError(err.message || 'Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement "${name}" ?`)) {
      try {
        await api.deleteProduct(id);
        onRefresh();
      } catch (err: any) {
        alert(err.message || 'Erreur lors de la suppression.');
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & New Product CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-950">
            Gestion du Catalogue Produits
          </h1>
          <p className="text-xs text-stone-500">
            Ajoutez, modifiez, gérez les prix en FDJ et les stocks de vos accessoires
          </p>
        </div>

        <button
          id="btn-admin-add-product"
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Produit</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-stone-200">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Rechercher par nom, référence SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 rounded-xl border border-stone-300 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 text-xs font-semibold bg-stone-50 rounded-xl border border-stone-300 focus:bg-white"
        >
          <option value="all">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase">
                <th className="py-3 px-4">Produit</th>
                <th className="py-3 px-4">Catégorie</th>
                <th className="py-3 px-4">Prix (FDJ)</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0] || ''}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover bg-stone-100 shrink-0 border border-stone-100"
                      />
                      <div>
                        <p className="font-bold text-stone-900 line-clamp-1">{p.name}</p>
                        <span className="text-[11px] text-stone-400 font-mono">SKU: {p.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-stone-600 font-medium">
                    {p.categoryName || '—'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-black text-stone-950 block">{formatFDJ(p.price)}</span>
                    {p.compareAtPrice && p.compareAtPrice > p.price && (
                      <span className="text-[10px] text-stone-400 line-through">
                        {formatFDJ(p.compareAtPrice)}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {p.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700"
                        title="Modifier ce produit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setModalOpen(false)}
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
                <h3 className="text-base font-bold font-serif">
                  {editingProduct ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
                </h3>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {formError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-stone-700">Nom de l'accessoire *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Écouteurs Bluetooth Pro 5.3 ANC"
                      className="w-full p-2.5 text-xs bg-stone-50 rounded-xl border border-stone-300 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Prix de vente (FDJ) *</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full p-2.5 text-xs bg-stone-50 rounded-xl border border-stone-300 focus:bg-white font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Prix barré / Ancien prix (Optionnel)</label>
                    <input
                      type="number"
                      value={compareAtPrice || ''}
                      onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Ex: 12000"
                      className="w-full p-2.5 text-xs bg-stone-50 rounded-xl border border-stone-300 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Catégorie *</label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full p-2.5 text-xs bg-stone-50 rounded-xl border border-stone-300 focus:bg-white font-semibold"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">Référence SKU (Optionnel)</label>
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full p-2.5 text-xs bg-stone-50 rounded-xl border border-stone-300 focus:bg-white font-mono"
                      placeholder="Ex: DJI-8842"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-stone-700">Description détaillée</label>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full p-2.5 text-xs bg-stone-50 rounded-xl border border-stone-300 focus:bg-white"
                      placeholder="Décrivez les atouts majeurs, la compatibilité, la garantie..."
                    />
                  </div>

                  <div className="sm:col-span-2 pt-2 border-t border-stone-100">
                    <ProductGalleryManager
                      images={productImages}
                      onChange={setProductImages}
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="pt-3 border-t border-stone-100 flex flex-wrap gap-4 text-xs font-semibold text-stone-800">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={status === 'active'}
                      onChange={(e) => setStatus(e.target.checked ? 'active' : 'inactive')}
                      className="rounded text-[#5A5A40]"
                    />
                    <span>Produit Actif (Visible en boutique)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded text-[#5A5A40]"
                    />
                    <span>Mettre en avant (Coup de cœur)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-rose-700">
                    <input
                      type="checkbox"
                      checked={isPromo}
                      onChange={(e) => setIsPromo(e.target.checked)}
                      className="rounded text-rose-600"
                    />
                    <span>Badge Promo</span>
                  </label>
                </div>

                <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-full text-stone-600 hover:bg-stone-100 text-xs font-bold transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-full bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-bold text-xs shadow-sm disabled:opacity-50 transition-colors"
                  >
                    {saving ? 'Enregistrement...' : editingProduct ? 'Mettre à jour' : 'Créer le produit'}
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
