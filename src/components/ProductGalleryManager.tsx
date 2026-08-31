import React, { useState, useRef } from 'react';
import {
  Upload,
  Link2,
  X,
  Star,
  ChevronLeft,
  ChevronRight,
  Plus,
  Image as ImageIcon,
  Sparkles,
  Check
} from 'lucide-react';
import { fileToDataUrl } from '../utils/imageUtils';

interface ProductGalleryManagerProps {
  images: string[];
  onChange: (images: string[]) => void;
}

const SAMPLE_TECH_PHOTOS = [
  {
    name: 'Écouteurs TWS ANC',
    url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Smartwatch AMOLED',
    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Powerbank 20K',
    url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Chargeur GaN 65W',
    url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Câble Tressé USB-C',
    url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Support Voiture MagSafe',
    url: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Lunettes Polarisées',
    url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: 'Coque de Protection',
    url: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&auto=format&fit=crop&q=80'
  }
];

export const ProductGalleryManager: React.FC<ProductGalleryManagerProps> = ({
  images,
  onChange
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlForm, setShowUrlForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setLoading(true);

    try {
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const dataUrl = await fileToDataUrl(file, 1400, 0.85);
          newUrls.push(dataUrl);
        }
      }

      if (newUrls.length > 0) {
        onChange([...images, ...newUrls]);
      }
    } catch (err) {
      console.error('Erreur chargement photos:', err);
      alert('Erreur lors du traitement de certaines photos.');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleAddUrl = () => {
    if (urlInput.trim()) {
      onChange([...images, urlInput.trim()]);
      setUrlInput('');
      setShowUrlForm(false);
    }
  };

  const handleRemove = (index: number) => {
    const next = [...images];
    next.splice(index, 1);
    onChange(next);
  };

  const handleSetMain = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    const item = next.splice(index, 1)[0];
    next.unshift(item);
    onChange(next);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const next = [...images];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    onChange(next);
  };

  const handleAddSample = (url: string) => {
    if (!images.includes(url)) {
      onChange([...images, url]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-[#2D2926] flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-[#5A5A40]" />
            Photos du Produit ({images.length})
          </label>
          <p className="text-[11px] text-[#7A766F]">
            La 1ère photo sera utilisée comme couverture principale du catalogue.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUrlForm(!showUrlForm)}
            className="text-[11px] font-semibold text-[#5A5A40] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>{showUrlForm ? 'Fermer URL' : 'Ajouter par URL'}</span>
          </button>
        </div>
      </div>

      {/* URL Input Form */}
      {showUrlForm && (
        <div className="flex gap-2 p-2.5 bg-[#F4F2EB] rounded-2xl border border-[#EAE7E0]">
          <input
            id="product-photo-url-input"
            type="url"
            placeholder="https://images.unsplash.com/... ou lien direct d'image"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddUrl();
              }
            }}
            className="flex-1 px-3 py-2 text-xs bg-white rounded-xl border border-[#EAE7E0] text-[#2D2926] focus:outline-hidden focus:ring-2 focus:ring-[#5A5A40]"
          />
          <button
            type="button"
            onClick={handleAddUrl}
            className="px-4 py-2 bg-[#5A5A40] hover:bg-[#4A4A30] text-white text-xs font-bold rounded-xl flex items-center gap-1 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter</span>
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        id="product-photo-file-input"
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Upload Dropzone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-3 ${
          isDragging
            ? 'border-[#5A5A40] bg-[#5A5A40]/10 scale-99'
            : 'border-[#EAE7E0] bg-[#FAF9F6] hover:bg-[#F4F2EB] hover:border-[#5A5A40]/50'
        }`}
      >
        <div className="w-10 h-10 rounded-xl bg-[#5A5A40]/10 text-[#5A5A40] flex items-center justify-center shrink-0">
          {loading ? (
            <div className="w-5 h-5 border-2 border-[#5A5A40] border-t-transparent rounded-full animate-spin" />
          ) : (
            <Upload className="w-5 h-5" />
          )}
        </div>
        <div className="text-left">
          <p className="text-xs font-bold text-[#2D2926]">
            Cliquez pour choisir une ou plusieurs photos, ou glissez-déposez vos fichiers ici
          </p>
          <p className="text-[11px] text-[#7A766F]">
            Formats acceptés : JPG, PNG, WEBP, GIF. Vous pouvez en sélectionner plusieurs simultanément.
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="p-4 text-center rounded-2xl border border-dashed border-[#EAE7E0] bg-white text-[#7A766F] text-xs">
          <p className="font-medium text-[#2D2926]">Aucune photo ajoutée pour l'instant</p>
          <p className="text-[11px] text-[#7A766F] mt-0.5">
            Glissez vos photos ci-dessus ou cliquez pour en importer depuis votre appareil. Vous pourrez ensuite choisir librement l'image principale et ajuster leur ordre de priorité.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#7A766F] px-1">
            <span className="font-semibold text-[#2D2926]">
              {images.length} photo{images.length > 1 ? 's' : ''} • L'image #1 est la photo principale du produit
            </span>
            <span className="text-[11px]">Utilisez les flèches pour changer l'ordre de priorité</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {images.map((imgUrl, index) => (
              <div
                key={index}
                className={`relative group rounded-2xl overflow-hidden border bg-white shadow-xs transition-all flex flex-col ${
                  index === 0
                    ? 'border-[#5A5A40] ring-2 ring-[#5A5A40]/30 shadow-md'
                    : 'border-[#EAE7E0] hover:border-[#5A5A40]/40'
                }`}
              >
                {/* Image Preview & Cover Badge */}
                <div className="relative aspect-4/3 w-full bg-[#F2F1ED] overflow-hidden">
                  <img
                    src={imgUrl}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />

                  {/* Priority Tag */}
                  <div className="absolute top-2 left-2">
                    {index === 0 ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#5A5A40] text-white text-[11px] font-bold shadow-md">
                        <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                        <span>Principale (#1)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold">
                        Priorité #{index + 1}
                      </span>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="absolute top-2 right-2 p-1.5 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white shadow-md transition-opacity cursor-pointer"
                    title="Supprimer cette photo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Bottom Control Bar */}
                <div className="p-2 bg-stone-50/80 border-t border-[#EAE7E0] flex items-center justify-between gap-1 text-xs">
                  {index !== 0 ? (
                    <button
                      type="button"
                      onClick={() => handleSetMain(index)}
                      className="px-2 py-1 rounded-lg bg-white border border-[#EAE7E0] text-[#5A5A40] hover:bg-[#5A5A40] hover:text-white text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                      title="Définir comme photo principale"
                    >
                      <Star className="w-3 h-3" />
                      <span>Mettre Principale</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1 px-1">
                      <Check className="w-3 h-3" />
                      <span>Photo de couverture</span>
                    </span>
                  )}

                  {/* Priority Move Arrows */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'left')}
                      className="p-1 rounded-lg bg-white border border-[#EAE7E0] hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-[#2D2926]"
                      title="Monter la priorité (Déplacer à gauche)"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      onClick={() => handleMove(index, 'right')}
                      className="p-1 rounded-lg bg-white border border-[#EAE7E0] hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-[#2D2926]"
                      title="Baisser la priorité (Déplacer à droite)"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pre-made Samples for Quick Djibouti Testing */}
      <div className="p-3 bg-[#F4F2EB] rounded-2xl border border-[#EAE7E0] space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D2926]">
          <Sparkles className="w-3.5 h-3.5 text-[#5A5A40]" />
          <span>Photos d'exemples d'accessoires (Ajout rapide en 1 clic) :</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SAMPLE_TECH_PHOTOS.map((sample, i) => {
            const isAdded = images.includes(sample.url);
            return (
              <button
                key={i}
                type="button"
                onClick={() => (isAdded ? null : handleAddSample(sample.url))}
                disabled={isAdded}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                  isAdded
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 opacity-70 cursor-default'
                    : 'bg-white text-[#2D2926] border border-[#EAE7E0] hover:bg-[#FAF9F6] hover:border-[#5A5A40]'
                }`}
              >
                {isAdded ? <Check className="w-3 h-3 text-emerald-600" /> : <Plus className="w-3 h-3 text-[#5A5A40]" />}
                <span>{sample.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
