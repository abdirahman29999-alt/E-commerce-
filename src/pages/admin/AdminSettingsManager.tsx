import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  CheckCircle2,
  Phone,
  MessageCircle,
  MapPin,
  Image as ImageIcon,
  Sparkles,
  LayoutTemplate,
  CreditCard,
  Globe,
  Share2,
  Layers,
  ShoppingBag,
  Info,
  Check,
  Palette,
  RotateCcw,
  Database,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  FileCode,
  CheckCircle
} from 'lucide-react';
import type { StoreSettings } from '../../types';
import { api, formatFDJ } from '../../services/api';
import { ImageUploadZone } from '../../components/ImageUploadZone';
import { THEME_PRESETS } from '../../components/ThemeStyle';

interface AdminSettingsManagerProps {
  settings: StoreSettings | null;
  onRefresh: () => void;
}

type SectionKey = 'identity' | 'hero' | 'theme' | 'announcement' | 'contact' | 'payments' | 'database';

export const AdminSettingsManager: React.FC<AdminSettingsManagerProps> = ({
  settings,
  onRefresh
}) => {
  const [activeSection, setActiveSection] = useState<SectionKey>('identity');

  // 1. Logo & Nom
  const [storeName, setStoreName] = useState('');
  const [tagline, setTagline] = useState('');
  const [logo, setLogo] = useState('');
  const [aboutText, setAboutText] = useState('');

  // 2. Bannière & Accueil
  const [heroImage, setHeroImage] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroCardImage, setHeroCardImage] = useState('');
  const [heroCardTitle, setHeroCardTitle] = useState('');
  const [heroCardPrice, setHeroCardPrice] = useState<number>(14000);
  const [heroCardOldPrice, setHeroCardOldPrice] = useState<number>(18500);

  // 3. Couleurs & Thème du Site
  const [primaryColor, setPrimaryColor] = useState('#5A5A40');
  const [primaryHoverColor, setPrimaryHoverColor] = useState('#44442F');
  const [secondaryColor, setSecondaryColor] = useState('#2D2926');
  const [accentColor, setAccentColor] = useState('#C5A880');
  const [backgroundColor, setBackgroundColor] = useState('#FAF9F6');
  const [colorPreset, setColorPreset] = useState('olive');

  // 4. Bandeau Annonce
  const [announcementBar, setAnnouncementBar] = useState('');
  const [announcementTag, setAnnouncementTag] = useState('DJIBOUTI 🇩🇯');
  const [isAnnouncementActive, setIsAnnouncementActive] = useState(true);

  // 5. Contact & WhatsApp
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');

  // 6. Moyens de Paiement Locaux
  const [enableCashOnDelivery, setEnableCashOnDelivery] = useState(true);
  const [enableDMoney, setEnableDMoney] = useState(true);
  const [enableWaafi, setEnableWaafi] = useState(true);
  const [dMoneyNumber, setDMoneyNumber] = useState('');
  const [waafiNumber, setWaafiNumber] = useState('');

  // 7. Base de Données & Export
  const [exportingDb, setExportingDb] = useState(false);
  const [importingDb, setImportingDb] = useState(false);
  const [resettingDb, setResettingDb] = useState(false);
  const [dbStats, setDbStats] = useState<any>(null);
  const [dbNotification, setDbNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setStoreName(settings.storeName || 'DjiAccess Boutique');
      setTagline(settings.tagline || 'Le n°1 des accessoires high-tech & mode à Djibouti');
      setLogo(settings.logo || '');
      setAboutText(settings.aboutText || '');

      setHeroImage(settings.heroImage || '');
      setHeroTitle(settings.heroTitle || 'L\'excellence de l\'accessoire au meilleur prix en FDJ.');
      setHeroSubtitle(settings.heroSubtitle || 'Powerbanks haute capacité, écouteurs sans fil avec réduction de bruit, montres connectées AMOLED, coques et chargeurs rapides. Livraison soignée en 2 à 4h partout à Djibouti !');
      setHeroCardImage(settings.heroCardImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80');
      setHeroCardTitle(settings.heroCardTitle || 'Smartwatch Pro Écran AMOLED 1.43"');
      setHeroCardPrice(settings.heroCardPrice || 14000);
      setHeroCardOldPrice(settings.heroCardOldPrice || 18500);

      setPrimaryColor(settings.primaryColor || '#5A5A40');
      setPrimaryHoverColor(settings.primaryHoverColor || '#44442F');
      setSecondaryColor(settings.secondaryColor || '#2D2926');
      setAccentColor(settings.accentColor || '#C5A880');
      setBackgroundColor(settings.backgroundColor || '#FAF9F6');
      setColorPreset(settings.colorPreset || 'olive');

      setAnnouncementBar(settings.announcementBar || '🚚 Livraison express en moins de 3h à Djibouti-Ville & Balbala ! Paiement à la livraison.');
      setAnnouncementTag(settings.announcementTag || 'DJIBOUTI 🇩🇯');
      setIsAnnouncementActive(settings.isAnnouncementActive ?? true);

      setPhone(settings.phone || '+253 77 12 34 56');
      setWhatsapp(settings.whatsapp || '+253 77 12 34 56');
      setAddress(settings.address || 'Boutique 100% en ligne • Service de Livraison Express à Djibouti-Ville');
      setEmail(settings.email || 'contact@djiaccess.dj');

      setEnableCashOnDelivery(settings.enableCashOnDelivery ?? true);
      setEnableDMoney(settings.enableDMoney ?? true);
      setEnableWaafi(settings.enableWaafi ?? true);
      setDMoneyNumber(settings.dMoneyNumber || '77 12 34 56');
      setWaafiNumber(settings.waafiNumber || '77 12 34 56');
    }
  }, [settings]);

  const loadDbStats = async () => {
    try {
      const stats = await api.getDashboardStats();
      setDbStats(stats);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    if (activeSection === 'database') {
      loadDbStats();
    }
  }, [activeSection]);

  const handleExportDatabase = async () => {
    setExportingDb(true);
    setDbNotification(null);
    try {
      const dbBackup = await api.exportDatabase();
      const blob = new Blob([JSON.stringify(dbBackup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `djiaccess_database_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDbNotification({
        type: 'success',
        message: 'Fichier de base de données JSON téléchargé avec succès !'
      });
    } catch (err: any) {
      setDbNotification({
        type: 'error',
        message: err.message || 'Erreur lors du téléchargement de la base de données.'
      });
    } finally {
      setExportingDb(false);
    }
  };

  const handleImportFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportingDb(true);
    setDbNotification(null);
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const res = await api.importDatabase(parsed);
      setDbNotification({
        type: 'success',
        message: `Base de données restaurée avec succès (${res.counts.products} produits, ${res.counts.categories} catégories, ${res.counts.orders} commandes, ${res.counts.deliveryZones} zones de livraison).`
      });
      onRefresh();
      loadDbStats();
    } catch (err: any) {
      setDbNotification({
        type: 'error',
        message: err.message || 'Erreur lors de l\'importation. Vérifiez que le fichier JSON est valide.'
      });
    } finally {
      setImportingDb(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('Voulez-vous réinitialiser la base de données avec les données initiales de démonstration de Djibouti ?')) {
      return;
    }
    setResettingDb(true);
    setDbNotification(null);
    try {
      await api.resetDatabase();
      setDbNotification({
        type: 'success',
        message: 'Base de données réinitialisée avec succès aux données d\'origine.'
      });
      onRefresh();
      loadDbStats();
    } catch (err: any) {
      setDbNotification({
        type: 'error',
        message: err.message || 'Erreur lors de la réinitialisation.'
      });
    } finally {
      setResettingDb(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      await api.updateSettings({
        storeName: storeName.trim(),
        tagline: tagline.trim(),
        logo: logo.trim(),
        aboutText: aboutText.trim(),

        heroImage: heroImage.trim(),
        heroTitle: heroTitle.trim(),
        heroSubtitle: heroSubtitle.trim(),
        heroCardImage: heroCardImage.trim(),
        heroCardTitle: heroCardTitle.trim(),
        heroCardPrice: Number(heroCardPrice),
        heroCardOldPrice: Number(heroCardOldPrice),

        primaryColor: primaryColor.trim(),
        primaryHoverColor: primaryHoverColor.trim(),
        secondaryColor: secondaryColor.trim(),
        accentColor: accentColor.trim(),
        backgroundColor: backgroundColor.trim(),
        colorPreset,

        announcementBar: announcementBar.trim(),
        announcementTag: announcementTag.trim(),
        isAnnouncementActive,

        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        address: address.trim(),
        email: email.trim(),

        enableCashOnDelivery,
        enableDMoney,
        enableWaafi,
        dMoneyNumber: dMoneyNumber.trim(),
        waafiNumber: waafiNumber.trim()
      });

      setSavedSuccess(true);
      onRefresh();
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err: any) {
      alert(err.message || 'Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  const sections: { key: SectionKey; title: string; subtitle: string; icon: any }[] = [
    {
      key: 'identity',
      title: 'Logo & Nom',
      subtitle: 'Logo de votre boutique et nom affiché',
      icon: ImageIcon
    },
    {
      key: 'hero',
      title: 'Bannière d’Accueil',
      subtitle: 'Grande image, grand titre et produit vedette',
      icon: LayoutTemplate
    },
    {
      key: 'theme',
      title: 'Couleurs & Thème',
      subtitle: 'Couleurs principales, boutons et palettes',
      icon: Palette
    },
    {
      key: 'announcement',
      title: 'Bandeau d’Annonce',
      subtitle: 'Message défilant tout en haut du site',
      icon: Globe
    },
    {
      key: 'contact',
      title: 'Contact & WhatsApp',
      subtitle: 'Téléphone, WhatsApp et zone de service',
      icon: Phone
    },
    {
      key: 'payments',
      title: 'Paiements Djibouti',
      subtitle: 'Espèces, D-Money & Waafi',
      icon: CreditCard
    },
    {
      key: 'database',
      title: 'Base de Données & Export',
      subtitle: 'Sauvegarde JSON & Déploiement Vercel',
      icon: Database
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header with Quick Save */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-[#EAE7E0] shadow-2xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-[#2D2926] font-serif">
            Personnalisation de la Boutique
          </h1>
          <p className="text-xs sm:text-sm text-[#7A766F] mt-0.5">
            Interface ultra-simple pour changer vos photos, vos textes, vos couleurs et vos coordonnées en un clic.
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          disabled={saving}
          id="btn-save-settings-top"
          className="px-6 py-3 rounded-2xl bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Enregistrement...' : 'Enregistrer les Modifications'}</span>
        </button>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Modifications appliquées avec succès !</p>
            <p className="text-[11px] text-emerald-700 font-normal">
              Votre boutique a été mise à jour en direct.
            </p>
          </div>
        </div>
      )}

      {/* Modern 7-Step Simple Tab Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.key;
          return (
            <button
              key={sec.key}
              type="button"
              onClick={() => setActiveSection(sec.key)}
              className={`p-3 rounded-2xl text-left transition-all border cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-[#2D2926] text-white border-[#2D2926] shadow-sm'
                  : 'bg-white text-[#2D2926] border-[#EAE7E0] hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${isActive ? 'bg-white/15 text-white' : 'bg-[#FAF9F6] text-[#5A5A40]'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-white/60' : 'text-[#7A766F]'}`}>
                  0{idx + 1}
                </span>
              </div>
              <div>
                <p className="text-xs font-black tracking-tight">{sec.title}</p>
                <p className={`text-[10px] line-clamp-1 mt-0.5 ${isActive ? 'text-white/70' : 'text-[#7A766F]'}`}>
                  {sec.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* ================= 1. LOGO & IDENTITÉ ================= */}
        {activeSection === 'identity' && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EAE7E0] shadow-2xs space-y-6">
            <div className="border-b border-[#EAE7E0] pb-4">
              <h2 className="text-base font-bold text-[#2D2926] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#5A5A40]" />
                1. Logo & Identité de votre boutique
              </h2>
              <p className="text-xs text-[#7A766F] mt-0.5">
                Définissez le logo qui apparaît dans le menu du haut et en pied de page.
              </p>
            </div>

            {/* Logo Upload Zone */}
            <ImageUploadZone
              idPrefix="store-logo"
              label="Logo de la Boutique"
              sublabel="Glissez votre image de logo ou sélectionnez un fichier (PNG recommandé)"
              value={logo}
              onChange={setLogo}
              presetSamples={[
                {
                  name: 'Exemple Logo Tech Minimaliste',
                  url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80'
                }
              ]}
              aspectRatio="square"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-[#2D2926]">Nom de la Boutique *</label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Ex: DjiAccess Boutique"
                  className="w-full p-3 text-sm bg-[#FAF9F6] rounded-xl border border-[#EAE7E0] focus:bg-white font-bold text-[#2D2926]"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-[#2D2926]">Slogan ou Sous-titre</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Ex: Le n°1 des accessoires high-tech & mode à Djibouti"
                  className="w-full p-3 text-xs bg-[#FAF9F6] rounded-xl border border-[#EAE7E0] focus:bg-white text-[#2D2926]"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-[#2D2926]">Texte de Présentation (Bas de page)</label>
                <textarea
                  rows={2}
                  value={aboutText}
                  onChange={(e) => setAboutText(e.target.value)}
                  placeholder="Ex: Votre boutique spécialisée d'accessoires pour smartphones, montres et audio à Djibouti."
                  className="w-full p-3 text-xs bg-[#FAF9F6] rounded-xl border border-[#EAE7E0] focus:bg-white text-[#2D2926]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. BANNIÈRE D'ACCUEIL ================= */}
        {activeSection === 'hero' && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EAE7E0] shadow-2xs space-y-6">
            <div className="border-b border-[#EAE7E0] pb-4">
              <h2 className="text-base font-bold text-[#2D2926] flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4 text-[#5A5A40]" />
                2. Grande Bannière de la Page d'Accueil
              </h2>
              <p className="text-xs text-[#7A766F] mt-0.5">
                Changez facilement la photo de fond principale et l'accessoire vedette mis en avant.
              </p>
            </div>

            {/* Background Image Upload */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#2D2926] block">
                Grande Image de Fond (Bannière Principale)
              </label>
              <ImageUploadZone
                idPrefix="hero-bg-image"
                label="Photo d'arrière-plan du site"
                sublabel="Image large en haute définition (résolution idéale : 1920x800)"
                value={heroImage}
                onChange={setHeroImage}
                presetSamples={[
                  {
                    name: 'Ambiance Accessoires High-Tech',
                    url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1600&auto=format&fit=crop&q=80'
                  },
                  {
                    name: 'Ambiance Accessoires Élégants',
                    url: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1600&auto=format&fit=crop&q=80'
                  }
                ]}
                aspectRatio="banner"
              />
            </div>

            {/* Titles */}
            <div className="space-y-4 pt-2 border-t border-[#EAE7E0]">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2D2926]">Grand Titre d'Accueil *</label>
                <input
                  type="text"
                  required
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                  placeholder="Ex: L'excellence de l'accessoire au meilleur prix en FDJ."
                  className="w-full p-3 text-sm bg-[#FAF9F6] rounded-xl border border-[#EAE7E0] focus:bg-white font-bold text-[#2D2926]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2D2926]">Texte d'Explication sous le Titre</label>
                <textarea
                  rows={2}
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                  placeholder="Powerbanks haute capacité, écouteurs sans fil, montres AMOLED..."
                  className="w-full p-3 text-xs bg-[#FAF9F6] rounded-xl border border-[#EAE7E0] focus:bg-white text-[#2D2926]"
                />
              </div>
            </div>

            {/* Featured Product Box */}
            <div className="space-y-4 pt-4 border-t border-[#EAE7E0] bg-[#FAF9F6] p-4 sm:p-5 rounded-2xl">
              <h3 className="text-xs font-bold text-[#2D2926] flex items-center gap-1.5 uppercase">
                <Sparkles className="w-4 h-4 text-[#5A5A40]" />
                Accessoire Vedette (Carte affichée à droite de la bannière)
              </h3>

              <ImageUploadZone
                idPrefix="hero-card-img"
                label="Photo de l'accessoire vedette"
                value={heroCardImage}
                onChange={setHeroCardImage}
                presetSamples={[
                  {
                    name: 'Montre Connectée Pro',
                    url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
                  }
                ]}
                aspectRatio="video"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-3 space-y-1">
                  <label className="text-xs font-bold text-[#2D2926]">Nom de l'accessoire vedette</label>
                  <input
                    type="text"
                    value={heroCardTitle}
                    onChange={(e) => setHeroCardTitle(e.target.value)}
                    placeholder='Ex: Smartwatch Pro Écran AMOLED 1.43"'
                    className="w-full p-2.5 text-xs bg-white rounded-xl border border-[#EAE7E0] font-bold"
                  />
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <label className="text-xs font-bold text-[#2D2926]">Prix Promo (FDJ)</label>
                  <input
                    type="number"
                    value={heroCardPrice}
                    onChange={(e) => setHeroCardPrice(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-white rounded-xl border border-[#EAE7E0] font-bold"
                  />
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <label className="text-xs font-bold text-[#2D2926]">Ancien Prix (FDJ)</label>
                  <input
                    type="number"
                    value={heroCardOldPrice}
                    onChange={(e) => setHeroCardOldPrice(Number(e.target.value))}
                    className="w-full p-2.5 text-xs bg-white rounded-xl border border-[#EAE7E0]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. COULEURS & THÈME DU SITE ================= */}
        {activeSection === 'theme' && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EAE7E0] shadow-2xs space-y-6">
            <div className="border-b border-[#EAE7E0] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-[#2D2926] flex items-center gap-2">
                  <Palette className="w-4 h-4 text-[#5A5A40]" />
                  3. Couleurs & Style Visuel du Site
                </h2>
                <p className="text-xs text-[#7A766F] mt-0.5">
                  Choisissez une palette prédéfinie ou ajustez les couleurs individuellement (boutons, arrière-plan, accents).
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPrimaryColor('#5A5A40');
                  setPrimaryHoverColor('#44442F');
                  setSecondaryColor('#2D2926');
                  setAccentColor('#C5A880');
                  setBackgroundColor('#FAF9F6');
                  setColorPreset('olive');
                }}
                className="text-xs font-bold text-[#5A5A40] hover:text-[#2D2926] flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAE7E0] hover:bg-stone-50 transition-colors self-start sm:self-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Rétablir les couleurs d'origine</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-[#2D2926] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Palettes Prêtes à l'Emploi (Cliquez pour appliquer) :</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {THEME_PRESETS.map((preset) => {
                  const isSelected = colorPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setColorPreset(preset.id);
                        setPrimaryColor(preset.primary);
                        setPrimaryHoverColor(preset.primaryHover);
                        setSecondaryColor(preset.secondary);
                        setAccentColor(preset.accent);
                        setBackgroundColor(preset.bg);
                      }}
                      className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#2D2926] ring-2 ring-[#2D2926]/20 bg-stone-50 shadow-xs'
                          : 'border-[#EAE7E0] hover:border-stone-400 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-base">{preset.emoji}</span>
                        <div className="flex items-center gap-1">
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: preset.primary }}
                            title="Couleur Principale"
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: preset.accent }}
                            title="Couleur Accent"
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                            style={{ backgroundColor: preset.bg }}
                            title="Fond"
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#2D2926] line-clamp-1">{preset.name}</p>
                        <p className="text-[10px] text-[#7A766F] mt-0.5 line-clamp-1">{preset.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Color Pickers */}
            <div className="pt-4 border-t border-[#EAE7E0] space-y-4">
              <h3 className="text-xs font-bold text-[#2D2926] uppercase tracking-wider text-[#7A766F]">
                Personnalisation Avancée des Couleurs
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* 1. Primary Color */}
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE7E0] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#2D2926]">Couleur Principale (Boutons)</label>
                    <span className="text-[10px] font-mono text-[#7A766F] font-bold">{primaryColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => {
                        setPrimaryColor(e.target.value);
                        setColorPreset('custom');
                      }}
                      className="w-10 h-10 rounded-xl border border-[#EAE7E0] cursor-pointer p-0.5 bg-white shrink-0"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => {
                        setPrimaryColor(e.target.value);
                        setColorPreset('custom');
                      }}
                      className="flex-1 p-2 text-xs bg-white rounded-xl border border-[#EAE7E0] font-mono font-bold uppercase"
                    />
                  </div>
                  <p className="text-[10px] text-[#7A766F]">Boutons d'action, badges et éléments principaux</p>
                </div>

                {/* 2. Primary Hover Color */}
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE7E0] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#2D2926]">Survol des Boutons (Hover)</label>
                    <span className="text-[10px] font-mono text-[#7A766F] font-bold">{primaryHoverColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryHoverColor}
                      onChange={(e) => {
                        setPrimaryHoverColor(e.target.value);
                        setColorPreset('custom');
                      }}
                      className="w-10 h-10 rounded-xl border border-[#EAE7E0] cursor-pointer p-0.5 bg-white shrink-0"
                    />
                    <input
                      type="text"
                      value={primaryHoverColor}
                      onChange={(e) => {
                        setPrimaryHoverColor(e.target.value);
                        setColorPreset('custom');
                      }}
                      className="flex-1 p-2 text-xs bg-white rounded-xl border border-[#EAE7E0] font-mono font-bold uppercase"
                    />
                  </div>
                  <p className="text-[10px] text-[#7A766F]">Teinte légèrement plus sombre lors du survol de la souris</p>
                </div>

                {/* 3. Background Color */}
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE7E0] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#2D2926]">Fond Général du Site</label>
                    <span className="text-[10px] font-mono text-[#7A766F] font-bold">{backgroundColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => {
                        setBackgroundColor(e.target.value);
                        setColorPreset('custom');
                      }}
                      className="w-10 h-10 rounded-xl border border-[#EAE7E0] cursor-pointer p-0.5 bg-white shrink-0"
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => {
                        setBackgroundColor(e.target.value);
                        setColorPreset('custom');
                      }}
                      className="flex-1 p-2 text-xs bg-white rounded-xl border border-[#EAE7E0] font-mono font-bold uppercase"
                    />
                  </div>
                  <p className="text-[10px] text-[#7A766F]">Couleur douce d'arrière-plan de toutes les pages</p>
                </div>

                {/* 4. Secondary Color */}
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE7E0] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#2D2926]">Couleur des Titres & Textes</label>
                    <span className="text-[10px] font-mono text-[#7A766F] font-bold">{secondaryColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => {
                        setSecondaryColor(e.target.value);
                        setColorPreset('custom');
                      }}
                      className="w-10 h-10 rounded-xl border border-[#EAE7E0] cursor-pointer p-0.5 bg-white shrink-0"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => {
                        setSecondaryColor(e.target.value);
                        setColorPreset('custom');
                      }}
                      className="flex-1 p-2 text-xs bg-white rounded-xl border border-[#EAE7E0] font-mono font-bold uppercase"
                    />
                  </div>
                  <p className="text-[10px] text-[#7A766F]">Titres principaux et éléments foncés</p>
                </div>

                {/* 5. Accent Color */}
                <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE7E0] space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#2D2926]">Couleur d'Accentuation</label>
                    <span className="text-[10px] font-mono text-[#7A766F] font-bold">{accentColor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={accentColor}
                      onChange={(e) => {
                        setAccentColor(e.target.value);
                        setColorPreset('custom');
                      }}
                      className="w-10 h-10 rounded-xl border border-[#EAE7E0] cursor-pointer p-0.5 bg-white shrink-0"
                    />
                    <input
                      type="text"
                      value={accentColor}
                      onChange={(e) => {
                        setAccentColor(e.target.value);
                        setColorPreset('custom');
                      }}
                      className="flex-1 p-2 text-xs bg-white rounded-xl border border-[#EAE7E0] font-mono font-bold uppercase"
                    />
                  </div>
                  <p className="text-[10px] text-[#7A766F]">Détails dorés, sous-lignages et étoiles</p>
                </div>

                {/* Live Preview Sample */}
                <div className="p-4 rounded-2xl bg-white border border-[#EAE7E0] flex flex-col justify-between">
                  <span className="text-xs font-bold text-[#2D2926]">Aperçu du Bouton Client :</span>
                  <div className="py-2">
                    <button
                      type="button"
                      style={{ backgroundColor: primaryColor }}
                      className="w-full py-2.5 px-4 rounded-full text-white text-xs font-bold shadow-xs transition-opacity hover:opacity-90"
                    >
                      Ajouter au Panier • 4 500 FDJ
                    </button>
                  </div>
                  <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Aperçu instantané appliqué</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. BANDEAU D'ANNONCE ================= */}
        {activeSection === 'announcement' && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EAE7E0] shadow-2xs space-y-6">
            <div className="border-b border-[#EAE7E0] pb-4">
              <h2 className="text-base font-bold text-[#2D2926] flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#5A5A40]" />
                3. Bandeau Défilant Supérieur
              </h2>
              <p className="text-xs text-[#7A766F] mt-0.5">
                Affichez un message important ou promotionnel visible sur toutes les pages tout en haut.
              </p>
            </div>

            {/* Toggle switch */}
            <label className="flex items-center gap-3.5 p-4 bg-[#FAF9F6] rounded-2xl border border-[#EAE7E0] cursor-pointer hover:bg-stone-100/60 transition-colors">
              <input
                type="checkbox"
                checked={isAnnouncementActive}
                onChange={(e) => setIsAnnouncementActive(e.target.checked)}
                className="w-5 h-5 rounded text-[#5A5A40] accent-[#5A5A40] cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-[#2D2926] block">
                  Activer le bandeau d'annonce
                </span>
                <span className="text-[11px] text-[#7A766F]">
                  Cochez pour afficher le bandeau d'information en haut du site
                </span>
              </div>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-1 sm:col-span-1">
                <label className="text-xs font-bold text-[#2D2926]">Petit Badge</label>
                <input
                  type="text"
                  value={announcementTag}
                  onChange={(e) => setAnnouncementTag(e.target.value)}
                  placeholder="DJIBOUTI 🇩🇯"
                  className="w-full p-3 text-xs bg-[#FAF9F6] rounded-xl border border-[#EAE7E0] focus:bg-white font-bold text-[#2D2926]"
                />
              </div>

              <div className="space-y-1 sm:col-span-3">
                <label className="text-xs font-bold text-[#2D2926]">Message à Afficher *</label>
                <input
                  type="text"
                  value={announcementBar}
                  onChange={(e) => setAnnouncementBar(e.target.value)}
                  placeholder="Ex: 🚚 Livraison express en moins de 3h à Djibouti-Ville & Balbala ! Paiement à la réception."
                  className="w-full p-3 text-xs bg-[#FAF9F6] rounded-xl border border-[#EAE7E0] focus:bg-white text-[#2D2926]"
                />
              </div>
            </div>

            {/* Live Preview Bar */}
            {isAnnouncementActive && (
              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-bold text-[#7A766F] uppercase">Aperçu en Direct :</span>
                <div className="p-3 bg-[#5A5A40] text-white rounded-xl text-xs font-medium flex items-center gap-2 shadow-xs">
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-white font-bold text-[10px]">
                    {announcementTag || 'DJIBOUTI 🇩🇯'}
                  </span>
                  <span className="truncate">{announcementBar}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= 4. CONTACT & WHATSAPP ================= */}
        {activeSection === 'contact' && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EAE7E0] shadow-2xs space-y-6">
            <div className="border-b border-[#EAE7E0] pb-4">
              <h2 className="text-base font-bold text-[#2D2926] flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#5A5A40]" />
                4. Vos Coordonnées & Service Client (Boutique en Ligne)
              </h2>
              <p className="text-xs text-[#7A766F] mt-0.5">
                Boutique 100% en ligne sans magasin physique : les clients commandent directement sur le site et se font livrer à domicile ou au bureau.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2D2926] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#5A5A40]" />
                  Numéro de Téléphone (Appels) *
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+253 77 12 34 56"
                  className="w-full p-3 text-xs bg-[#FAF9F6] rounded-xl border border-[#EAE7E0] focus:bg-white font-bold text-[#2D2926]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2D2926] flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  Numéro WhatsApp (Commandes rapides) *
                </label>
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+253 77 12 34 56"
                  className="w-full p-3 text-xs bg-[#FAF9F6] rounded-xl border border-[#EAE7E0] focus:bg-white font-bold text-[#2D2926]"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-[#2D2926] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  Zone de Couverture & Siège des Livraisons (Djibouti)
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Boutique 100% en ligne • Service de Livraison Express à Djibouti-Ville, Balbala & Héron"
                  className="w-full p-3 text-xs bg-[#FAF9F6] rounded-xl border border-[#EAE7E0] focus:bg-white text-[#2D2926]"
                />
                <p className="text-[10px] text-[#7A766F] mt-1">
                  💡 Note : Pas de retrait en magasin. Toutes les commandes sont expédiées par nos livreurs à domicile.
                </p>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold text-[#2D2926]">Email de Contact</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@djiaccess.dj"
                  className="w-full p-3 text-xs bg-[#FAF9F6] rounded-xl border border-[#EAE7E0] focus:bg-white text-[#2D2926]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. MOYENS DE PAIEMENT LOCAUX ================= */}
        {activeSection === 'payments' && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EAE7E0] shadow-2xs space-y-6">
            <div className="border-b border-[#EAE7E0] pb-4">
              <h2 className="text-base font-bold text-[#2D2926] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#5A5A40]" />
                5. Modes de Paiement Acceptés à Djibouti
              </h2>
              <p className="text-xs text-[#7A766F] mt-0.5">
                Activez les modes de paiement et indiquez vos numéros D-Money et Waafi pour recevoir les règlements.
              </p>
            </div>

            <div className="space-y-4">
              
              {/* Espèces Cash */}
              <label className="flex items-center gap-3.5 p-4 bg-[#FAF9F6] rounded-2xl border border-[#EAE7E0] cursor-pointer hover:bg-stone-100/60 transition-colors">
                <input
                  type="checkbox"
                  checked={enableCashOnDelivery}
                  onChange={(e) => setEnableCashOnDelivery(e.target.checked)}
                  className="w-5 h-5 rounded text-[#5A5A40] accent-[#5A5A40] cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-[#2D2926] block">
                    💵 Paiement en Espèces (Cash à la Livraison)
                  </span>
                  <span className="text-[11px] text-[#7A766F]">
                    Le client paie au livreur à la réception de son colis
                  </span>
                </div>
              </label>

              {/* D-Money */}
              <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#EAE7E0] space-y-3">
                <label className="flex items-center gap-3.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableDMoney}
                    onChange={(e) => setEnableDMoney(e.target.checked)}
                    className="w-5 h-5 rounded text-[#5A5A40] accent-[#5A5A40] cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#2D2926] block">
                      📱 Paiement par D-Money (Djibouti Telecom)
                    </span>
                    <span className="text-[11px] text-[#7A766F]">
                      Transfert direct sur votre numéro marchand
                    </span>
                  </div>
                </label>

                {enableDMoney && (
                  <div className="pl-8 pt-1">
                    <label className="text-[11px] font-bold text-[#2D2926] block mb-1">
                      Votre Numéro de Téléphone D-Money :
                    </label>
                    <input
                      type="text"
                      value={dMoneyNumber}
                      onChange={(e) => setDMoneyNumber(e.target.value)}
                      placeholder="Ex: 77 12 34 56"
                      className="w-full max-w-xs p-2.5 text-xs bg-white rounded-xl border border-[#EAE7E0] font-mono font-bold"
                    />
                  </div>
                )}
              </div>

              {/* Waafi */}
              <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-[#EAE7E0] space-y-3">
                <label className="flex items-center gap-3.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableWaafi}
                    onChange={(e) => setEnableWaafi(e.target.checked)}
                    className="w-5 h-5 rounded text-[#5A5A40] accent-[#5A5A40] cursor-pointer"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#2D2926] block">
                      ⚡ Paiement par Waafi (Bred / Salaam)
                    </span>
                    <span className="text-[11px] text-[#7A766F]">
                      Transfert instantané via l'application Waafi
                    </span>
                  </div>
                </label>

                {enableWaafi && (
                  <div className="pl-8 pt-1">
                    <label className="text-[11px] font-bold text-[#2D2926] block mb-1">
                      Votre Numéro de Compte Waafi :
                    </label>
                    <input
                      type="text"
                      value={waafiNumber}
                      onChange={(e) => setWaafiNumber(e.target.value)}
                      placeholder="Ex: 77 12 34 56"
                      className="w-full max-w-xs p-2.5 text-xs bg-white rounded-xl border border-[#EAE7E0] font-mono font-bold"
                    />
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ================= 7. BASE DE DONNÉES & EXPORT GITHUB / VERCEL ================= */}
        {activeSection === 'database' && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EAE7E0] shadow-2xs space-y-6">
            <div className="border-b border-[#EAE7E0] pb-4">
              <h2 className="text-base font-bold text-[#2D2926] flex items-center gap-2">
                <Database className="w-4 h-4 text-[#5A5A40]" />
                7. Base de Données, Sauvegardes & Déploiement Vercel / GitHub
              </h2>
              <p className="text-xs text-[#7A766F] mt-0.5">
                Gérez facilement votre base de données : téléchargez une copie intégrale en JSON, restaurez vos données, ou exportez vers GitHub et Vercel sans risque d'erreur.
              </p>
            </div>

            {/* Notification alert */}
            {dbNotification && (
              <div
                className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-3 border shadow-2xs animate-in fade-in ${
                  dbNotification.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                {dbNotification.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <div>
                  <p className="font-bold">{dbNotification.message}</p>
                </div>
              </div>
            )}

            {/* Live Database Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE7E0] text-center">
                <span className="text-[10px] font-bold text-[#7A766F] uppercase tracking-wider block">Produits Actifs</span>
                <span className="text-xl font-black text-[#2D2926] font-mono mt-1 block">
                  {dbStats?.totalProductsCount ?? '...'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE7E0] text-center">
                <span className="text-[10px] font-bold text-[#7A766F] uppercase tracking-wider block">Catégories</span>
                <span className="text-xl font-black text-[#2D2926] font-mono mt-1 block">
                  {dbStats?.categoryDistribution?.length ?? '...'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE7E0] text-center">
                <span className="text-[10px] font-bold text-[#7A766F] uppercase tracking-wider block">Commandes</span>
                <span className="text-xl font-black text-[#2D2926] font-mono mt-1 block">
                  {dbStats?.ordersToday !== undefined ? dbStats.ordersToday + dbStats.pendingOrdersCount : '...'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE7E0] text-center">
                <span className="text-[10px] font-bold text-[#7A766F] uppercase tracking-wider block">Clients</span>
                <span className="text-xl font-black text-[#2D2926] font-mono mt-1 block">
                  {dbStats?.totalCustomersCount ?? '...'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE7E0] text-center col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-[#7A766F] uppercase tracking-wider block">Stock Faible</span>
                <span className={`text-xl font-black font-mono mt-1 block ${dbStats?.lowStockProductsCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {dbStats?.lowStockProductsCount ?? '0'}
                </span>
              </div>
            </div>

            {/* Action Grid: Export & Import */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              {/* 1. Export JSON */}
              <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#EAE7E0] flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-[#5A5A40]/10 text-[#5A5A40] rounded-xl">
                      <Download className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-[#2D2926]">
                      Exporter la Base de Données (JSON)
                    </h3>
                  </div>
                  <p className="text-xs text-[#7A766F] leading-relaxed">
                    Téléchargez un fichier de sauvegarde complet contenant tous vos produits, commandes, clients, catégories, zones de livraison et réglages.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExportDatabase}
                  disabled={exportingDb}
                  className="w-full py-3 px-4 rounded-xl bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{exportingDb ? 'Préparation du fichier...' : 'Télécharger la Sauvegarde (.JSON)'}</span>
                </button>
              </div>

              {/* 2. Import / Restore JSON */}
              <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#EAE7E0] flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-600/10 text-emerald-700 rounded-xl">
                      <Upload className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-[#2D2926]">
                      Importer / Restaurer un Fichier
                    </h3>
                  </div>
                  <p className="text-xs text-[#7A766F] leading-relaxed">
                    Restaurez instantanément vos données à partir d'un fichier de sauvegarde JSON sur n'importe quel hébergement (Vercel, Cloud Run, etc.).
                  </p>
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json,application/json"
                    onChange={handleImportFileSelected}
                    className="hidden"
                    id="db-file-import-input"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={importingDb}
                    className="w-full py-3 px-4 rounded-xl bg-white border border-[#EAE7E0] hover:bg-stone-50 text-[#2D2926] font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4 text-emerald-600" />
                    <span>{importingDb ? 'Importation en cours...' : 'Sélectionner un fichier JSON'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Vercel & GitHub Deployment Tips */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <FileCode className="w-4 h-4 text-amber-700" />
                <span>Compatibilité Déploiement GitHub & Vercel Sans Erreur :</span>
              </div>
              <ul className="text-xs text-amber-900/80 space-y-1.5 list-disc pl-5">
                <li>
                  <strong>Configuration Vercel incluse :</strong> Le fichier <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono text-[11px]">vercel.json</code> et le point d'entrée <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono text-[11px]">/api/index.ts</code> sont déjà préconfigurés pour un déploiement instantané sans erreur.
                </li>
                <li>
                  <strong>Fichier de données initial :</strong> Le fichier <code className="bg-amber-100/80 px-1 py-0.5 rounded font-mono text-[11px]">data/store_db.json</code> contient tous vos produits de démonstration en Francs Djibouti (FDJ).
                </li>
                <li>
                  <strong>Mode boutique en ligne :</strong> La boutique fonctionne 100% en commande en ligne avec livraison express dans tout Djibouti et paiement à la livraison (espèces, D-Money, Waafi).
                </li>
              </ul>
            </div>

            {/* Reset to initial Djibouti Seed */}
            <div className="pt-2 flex items-center justify-between border-t border-[#EAE7E0]">
              <div className="text-xs text-[#7A766F]">
                <span>Remettre les données d'exemple initiales de Djibouti</span>
              </div>
              <button
                type="button"
                onClick={handleResetDatabase}
                disabled={resettingDb}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resettingDb ? 'animate-spin' : ''}`} />
                <span>{resettingDb ? 'Réinitialisation...' : 'Réinitialiser aux Données Démo'}</span>
              </button>
            </div>

          </div>
        )}

        {/* Global Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#EAE7E0]">
          <p className="text-xs text-[#7A766F] text-center sm:text-left">
            Toutes les modifications sont immédiatement visibles par les clients sur le site.
          </p>

          <button
            type="submit"
            disabled={saving}
            id="btn-save-settings-bottom"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#5A5A40] hover:bg-[#4A4A30] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Enregistrement en cours...' : 'Enregistrer les Paramètres'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
