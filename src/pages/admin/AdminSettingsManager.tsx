import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Image as ImageIcon,
  Sparkles,
  LayoutTemplate,
  CreditCard,
  Globe,
  Share2,
  Layers,
  ShoppingBag,
  Info,
  Check
} from 'lucide-react';
import type { StoreSettings } from '../../types';
import { api, formatFDJ } from '../../services/api';
import { ImageUploadZone } from '../../components/ImageUploadZone';

interface AdminSettingsManagerProps {
  settings: StoreSettings | null;
  onRefresh: () => void;
}

type SectionKey = 'identity' | 'hero' | 'announcement' | 'contact' | 'payments';

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

  // 3. Bandeau Annonce
  const [announcementBar, setAnnouncementBar] = useState('');
  const [announcementTag, setAnnouncementTag] = useState('DJIBOUTI 🇩🇯');
  const [isAnnouncementActive, setIsAnnouncementActive] = useState(true);

  // 4. Contact & WhatsApp
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [email, setEmail] = useState('');

  // 5. Moyens de Paiement Locaux
  const [enableCashOnDelivery, setEnableCashOnDelivery] = useState(true);
  const [enableDMoney, setEnableDMoney] = useState(true);
  const [enableWaafi, setEnableWaafi] = useState(true);
  const [dMoneyNumber, setDMoneyNumber] = useState('');
  const [waafiNumber, setWaafiNumber] = useState('');

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

      setAnnouncementBar(settings.announcementBar || '🚚 Livraison express en moins de 3h à Djibouti-Ville & Balbala ! Paiement à la livraison.');
      setAnnouncementTag(settings.announcementTag || 'DJIBOUTI 🇩🇯');
      setIsAnnouncementActive(settings.isAnnouncementActive ?? true);

      setPhone(settings.phone || '+253 77 12 34 56');
      setWhatsapp(settings.whatsapp || '+253 77 12 34 56');
      setAddress(settings.address || 'Place du 27 Juin (Place Ménélik), Centre-Ville, Djibouti');
      setOpeningHours(settings.openingHours || 'Samedi au Jeudi : 08h30 - 13h00 & 16h30 - 22h00 | Vendredi : 17h00 - 22h00');
      setEmail(settings.email || 'contact@djiaccess.dj');

      setEnableCashOnDelivery(settings.enableCashOnDelivery ?? true);
      setEnableDMoney(settings.enableDMoney ?? true);
      setEnableWaafi(settings.enableWaafi ?? true);
      setDMoneyNumber(settings.dMoneyNumber || '77 12 34 56');
      setWaafiNumber(settings.waafiNumber || '77 12 34 56');
    }
  }, [settings]);

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

        announcementBar: announcementBar.trim(),
        announcementTag: announcementTag.trim(),
        isAnnouncementActive,

        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        address: address.trim(),
        openingHours: openingHours.trim(),
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
      key: 'announcement',
      title: 'Bandeau d’Annonce',
      subtitle: 'Message défilant tout en haut du site',
      icon: Globe
    },
    {
      key: 'contact',
      title: 'Contact & WhatsApp',
      subtitle: 'Téléphone, WhatsApp et adresse du magasin',
      icon: Phone
    },
    {
      key: 'payments',
      title: 'Paiements Djibouti',
      subtitle: 'Espèces, D-Money & Waafi',
      icon: CreditCard
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
            Interface ultra-simple pour changer vos photos, vos textes et vos coordonnées en un clic.
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

      {/* Modern 5-Step Simple Tab Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {sections.map((sec, idx) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.key;
          return (
            <button
              key={sec.key}
              type="button"
              onClick={() => setActiveSection(sec.key)}
              className={`p-3.5 rounded-2xl text-left transition-all border cursor-pointer flex flex-col justify-between ${
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
                    name: 'Ambiance Dark Minimaliste',
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
                4. Vos Coordonnées & Support Client à Djibouti
              </h2>
              <p className="text-xs text-[#7A766F] mt-0.5">
                Ces numéros permettent aux clients de vous joindre directement par appel ou WhatsApp.
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
                  Adresse du Magasin / Point de Retrait
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Place du 27 Juin (Place Ménélik), Centre-Ville, Djibouti"
                  className="w-full p-3 text-xs bg-[#FAF9F6] rounded-xl border border-[#EAE7E0] focus:bg-white text-[#2D2926]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2D2926] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Horaires d'Ouverture
                </label>
                <input
                  type="text"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  placeholder="Samedi au Jeudi : 08h30 - 22h00"
                  className="w-full p-3 text-xs bg-[#FAF9F6] rounded-xl border border-[#EAE7E0] focus:bg-white text-[#2D2926]"
                />
              </div>

              <div className="space-y-1">
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
