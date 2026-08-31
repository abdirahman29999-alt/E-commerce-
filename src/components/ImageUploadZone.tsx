import React, { useState, useRef } from 'react';
import { Upload, Link2, X, Image as ImageIcon, Check } from 'lucide-react';
import { fileToDataUrl } from '../utils/imageUtils';

interface ImageUploadZoneProps {
  label: string;
  sublabel?: string;
  value: string;
  onChange: (url: string) => void;
  presetSamples?: { name: string; url: string }[];
  aspectRatio?: 'video' | 'square' | 'banner' | 'auto';
  idPrefix?: string;
}

export const ImageUploadZone: React.FC<ImageUploadZoneProps> = ({
  label,
  sublabel,
  value,
  onChange,
  presetSamples = [],
  aspectRatio = 'auto',
  idPrefix = 'upload'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUrlInputOpen, setIsUrlInputOpen] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (PNG, JPG, WEBP, SVG).');
      return;
    }

    setLoading(true);
    try {
      const dataUrl = await fileToDataUrl(file, 1600, 0.88);
      onChange(dataUrl);
    } catch (err) {
      console.error('Erreur lecture image:', err);
      alert('Impossible de charger cette image.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleApplyUrl = () => {
    if (customUrl.trim()) {
      onChange(customUrl.trim());
      setCustomUrl('');
      setIsUrlInputOpen(false);
    }
  };

  const aspectClass =
    aspectRatio === 'video'
      ? 'aspect-video'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'banner'
      ? 'aspect-21/9'
      : 'min-h-[140px]';

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-bold text-[#2D2926] block">{label}</label>
          {sublabel && <p className="text-[11px] text-[#7A766F]">{sublabel}</p>}
        </div>

        <div className="flex items-center gap-2">
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3 h-3" />
              <span>Supprimer l'image</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsUrlInputOpen(!isUrlInputOpen)}
            className="text-[11px] font-semibold text-[#5A5A40] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Link2 className="w-3 h-3" />
            <span>{isUrlInputOpen ? 'Masquer URL' : 'Entrer un lien URL'}</span>
          </button>
        </div>
      </div>

      {isUrlInputOpen && (
        <div className="flex gap-2 p-2 bg-[#F4F2EB] rounded-xl border border-[#EAE7E0]">
          <input
            id={`${idPrefix}-url-input`}
            type="url"
            placeholder="https://images.unsplash.com/... ou lien d'image direct"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleApplyUrl();
              }
            }}
            className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-[#EAE7E0] text-[#2D2926] focus:outline-hidden focus:ring-1 focus:ring-[#5A5A40]"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-1.5 rounded-lg bg-[#5A5A40] text-white text-xs font-semibold hover:bg-[#4A4A30] cursor-pointer"
          >
            Appliquer
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        id={`${idPrefix}-file-input`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Drag & Drop Preview Zone */}
      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-[#EAE7E0] bg-[#FAF9F6] shadow-2xs">
          <div className={`${aspectClass} w-full flex items-center justify-center bg-stone-100 overflow-hidden`}>
            <img
              src={value}
              alt="Aperçu"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            />
          </div>

          <div className="absolute inset-0 bg-[#2D2926]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-full bg-white text-[#2D2926] text-xs font-semibold shadow-md hover:bg-stone-100 flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Changer la photo</span>
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-3 py-1.5 rounded-full bg-rose-600 text-white text-xs font-semibold shadow-md hover:bg-rose-700 flex items-center gap-1.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Retirer</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-[#5A5A40] bg-[#5A5A40]/10 scale-99'
              : 'border-[#EAE7E0] bg-[#FAF9F6] hover:bg-[#F4F2EB] hover:border-[#5A5A40]/50'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-[#5A5A40]/10 text-[#5A5A40] flex items-center justify-center">
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#5A5A40] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-[#2D2926]">
              Glissez-déposez votre image ici, ou <span className="text-[#5A5A40] underline">parcourez</span>
            </p>
            <p className="text-[11px] text-[#7A766F] mt-0.5">
              PNG, JPG, WEBP ou SVG (Recommandé : haute résolution)
            </p>
          </div>
        </div>
      )}

      {/* Preset Suggestions */}
      {presetSamples.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] font-semibold text-[#7A766F] uppercase tracking-wider block">
            Ou choisir un modèle prêt à l'emploi :
          </span>
          <div className="flex flex-wrap gap-2">
            {presetSamples.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(sample.url)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                  value === sample.url
                    ? 'bg-[#5A5A40] text-white border-[#5A5A40]'
                    : 'bg-white text-[#2D2926] border-[#EAE7E0] hover:bg-[#F4F2EB]'
                }`}
              >
                {value === sample.url && <Check className="w-3 h-3 text-white" />}
                <span>{sample.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
