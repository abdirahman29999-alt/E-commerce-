import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import type {
  Product,
  Category,
  DeliveryZone,
  Order,
  Customer,
  Promotion,
  StoreSettings,
  AdminUser,
  DashboardStats,
  OrderStatus
} from '../src/types';

interface DatabaseSchema {
  products: Product[];
  categories: Category[];
  deliveryZones: DeliveryZone[];
  orders: Order[];
  customers: Customer[];
  promotions: Promotion[];
  settings: StoreSettings;
  users: (AdminUser & { passwordHash: string })[];
}

let DB_DIR = path.join(process.cwd(), 'data');
let DB_FILE = path.join(DB_DIR, 'store_db.json');

// Ensure directory exists without crashing on read-only environments like Vercel
try {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
} catch (e) {
  // If filesystem is read-only (such as Vercel AWS Lambda /var/task), fallback to /tmp
  DB_DIR = '/tmp';
  DB_FILE = path.join(DB_DIR, 'store_db.json');
}

const defaultCategories: Category[] = [
  {
    id: 'cat-tel',
    name: 'Téléphonie & Câbles',
    slug: 'telephonie-cables',
    icon: 'Smartphone',
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80',
    description: 'Chargeurs rapides, câbles renforcés, supports et adaptateurs pour tous smartphones.',
    isActive: true,
    productCount: 5
  },
  {
    id: 'cat-audio',
    name: 'Écouteurs & Audio',
    slug: 'ecouteurs-audio',
    icon: 'Headphones',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    description: 'Écouteurs sans fil Bluetooth, casques réducteurs de bruit et enceintes portables.',
    isActive: true,
    productCount: 4
  },
  {
    id: 'cat-montres',
    name: 'Montres & Smartwatches',
    slug: 'montres-smartwatches',
    icon: 'Watch',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    description: 'Montres connectées AMOLED, bracelets sportifs et montres élégantes pour hommes et femmes.',
    isActive: true,
    productCount: 4
  },
  {
    id: 'cat-mode',
    name: 'Mode, Sacs & Bijoux',
    slug: 'mode-sacs-bijoux',
    icon: 'Glasses',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&auto=format&fit=crop&q=80',
    description: 'Lunettes de soleil UV400, sacoches étanches, portefeuilles et bijoux en acier inoxydable.',
    isActive: true,
    productCount: 4
  },
  {
    id: 'cat-auto',
    name: 'Accessoires Auto & Bureau',
    slug: 'accessoires-auto-bureau',
    icon: 'Car',
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=80',
    description: 'Supports magnétiques de voiture, chargeurs allume-cigare rapides et hubs USB-C.',
    isActive: true,
    productCount: 3
  }
];

const defaultDeliveryZones: DeliveryZone[] = [
  {
    id: 'zone-centre',
    name: 'Djibouti-Ville Centre / Héron / Plateau / Marabout',
    price: 800,
    estimatedHours: 'Livraison en 2 à 4 heures',
    description: 'Livraison express à domicile ou au bureau dans le centre de Djibouti.',
    isActive: true
  },
  {
    id: 'zone-balbala',
    name: 'Balbala / Hayabley / Cheik Moussa',
    price: 1000,
    estimatedHours: 'Livraison le jour même',
    description: 'Livraison rapide assurée par nos coursiers moto.',
    isActive: true
  },
  {
    id: 'zone-haramous',
    name: 'Haramous / Gabode / Ambouli / Aéroport',
    price: 1000,
    estimatedHours: 'Livraison en 2 à 4 heures',
    description: 'Livraison directe sécurisée.',
    isActive: true
  },
  {
    id: 'zone-pk12',
    name: 'PK12 / Nagad / Palmeraie / Doraleh',
    price: 1500,
    estimatedHours: 'Livraison en 24h',
    description: 'Livraison en périphérie de Djibouti-ville.',
    isActive: true
  }
];

const defaultProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Powerbank 20 000 mAh Charge Rapide 22.5W avec Affichage LED',
    slug: 'powerbank-20000mah-charge-rapide',
    sku: 'PWR-20K-BLK',
    price: 6500,
    compareAtPrice: 8500,
    discountPercent: 24,
    stock: 18,
    lowStockThreshold: 5,
    categoryId: 'cat-tel',
    categoryName: 'Téléphonie & Câbles',
    description: 'Batterie externe haute capacité 20 000 mAh avec charge ultra-rapide 22.5W Power Delivery & QuickCharge 3.0. Écran numérique LED affichant le pourcentage exact de batterie. 2 ports USB-A et 1 port USB-C bidirectionnel. Parfait pour les déplacements sous la chaleur de Djibouti.',
    images: [
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    isFeatured: true,
    isNew: false,
    isPromo: true,
    rating: 4.9,
    reviewsCount: 38,
    tags: ['Batterie', 'Charge Rapide', 'USB-C'],
    createdAt: '2026-08-01T10:00:00.000Z',
    updatedAt: '2026-08-25T14:30:00.000Z'
  },
  {
    id: 'prod-2',
    name: 'Écouteurs Sans Fil Pro TWS avec Réduction Active du Bruit (ANC)',
    slug: 'ecouteurs-sans-fil-pro-tws-anc',
    sku: 'AUD-TWS-PRO',
    price: 9500,
    compareAtPrice: 13000,
    discountPercent: 27,
    stock: 12,
    lowStockThreshold: 4,
    categoryId: 'cat-audio',
    categoryName: 'Écouteurs & Audio',
    description: 'Son haute fidélité avec basses puissantes et réduction active du bruit ambiant. Autonomie de 30 heures avec le boîtier de charge sans fil. Microphones HD avec isolation vocale pour des appels cristallins même dans le vent.',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    isFeatured: true,
    isNew: true,
    isPromo: true,
    rating: 4.8,
    reviewsCount: 52,
    tags: ['Audio', 'Bluetooth 5.3', 'ANC'],
    createdAt: '2026-08-05T09:00:00.000Z',
    updatedAt: '2026-08-28T11:00:00.000Z'
  },
  {
    id: 'prod-3',
    name: 'Smartwatch Pro Écran AMOLED 1.43" avec Appel Bluetooth & Suivi Santé',
    slug: 'smartwatch-pro-ecran-amoled',
    sku: 'WTC-SMART-01',
    price: 14000,
    compareAtPrice: 18500,
    discountPercent: 24,
    stock: 8,
    lowStockThreshold: 3,
    categoryId: 'cat-montres',
    categoryName: 'Montres & Smartwatches',
    description: 'Montre connectée haut de gamme avec superbe écran tactile AMOLED Always-On. Passez et recevez des appels en direct via haut-parleur et micro intégrés. Suivi cardiaque 24/7, SpO2, suivi sommeil et plus de 100 modes sportifs. Boîtier en alliage de zinc étanche IP68.',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    isFeatured: true,
    isNew: true,
    isPromo: true,
    rating: 4.9,
    reviewsCount: 29,
    tags: ['Montre connectée', 'AMOLED', 'Santé'],
    createdAt: '2026-08-10T12:00:00.000Z',
    updatedAt: '2026-08-29T16:00:00.000Z'
  },
  {
    id: 'prod-4',
    name: 'Chargeur Mural GaN 65W Ultra-Compact 3 Ports (2 USB-C + 1 USB-A)',
    slug: 'chargeur-mural-gan-65w',
    sku: 'CHR-GAN-65W',
    price: 5500,
    compareAtPrice: 7000,
    discountPercent: 21,
    stock: 25,
    lowStockThreshold: 5,
    categoryId: 'cat-tel',
    categoryName: 'Téléphonie & Câbles',
    description: 'Technologie GaN III dernière génération permettant de recharger simultanément votre ordinateur portable (MacBook, Dell, HP), tablette et smartphone à pleine vitesse sans surchauffe.',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    isFeatured: false,
    isNew: false,
    isPromo: true,
    rating: 4.7,
    reviewsCount: 22,
    tags: ['Chargeur', 'GaN', 'Fast Charge'],
    createdAt: '2026-08-02T10:00:00.000Z',
    updatedAt: '2026-08-20T10:00:00.000Z'
  },
  {
    id: 'prod-5',
    name: 'Câble Renforcé en Nylon Tressé Type-C vers Type-C 100W (2 Mètres)',
    slug: 'cable-renforce-type-c-100w',
    sku: 'CBL-TC-100W',
    price: 2200,
    compareAtPrice: 3000,
    discountPercent: 26,
    stock: 45,
    lowStockThreshold: 10,
    categoryId: 'cat-tel',
    categoryName: 'Téléphonie & Câbles',
    description: 'Câble ultra-résistant testé pour plus de 25 000 pliages. Prise en charge de la charge ultra-rapide jusqu’à 100W (20V/5A) et transfert de données haute vitesse.',
    images: [
      'https://images.unsplash.com/photo-1541689592655-f5f52825a3b8?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    isFeatured: false,
    isNew: false,
    isPromo: false,
    rating: 4.9,
    reviewsCount: 64,
    tags: ['Câble', 'USB-C', '100W'],
    createdAt: '2026-07-20T08:00:00.000Z',
    updatedAt: '2026-08-15T09:00:00.000Z'
  },
  {
    id: 'prod-6',
    name: 'Casque Audio Bluetooth Over-Ear Hi-Res avec Coussinets à Mémoire de Forme',
    slug: 'casque-audio-bluetooth-over-ear',
    sku: 'AUD-HD-OVER',
    price: 12500,
    compareAtPrice: 16000,
    discountPercent: 22,
    stock: 7,
    lowStockThreshold: 3,
    categoryId: 'cat-audio',
    categoryName: 'Écouteurs & Audio',
    description: 'Casque audio circum-auriculaire offrant une immersion sonore exceptionnelle. Transducteurs de 40mm, autonomie record de 50 heures, microphone intégré et entrée jack 3.5mm de secours.',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    isFeatured: true,
    isNew: false,
    isPromo: true,
    rating: 4.8,
    reviewsCount: 19,
    tags: ['Casque', 'Bluetooth', 'Hi-Res'],
    createdAt: '2026-08-04T11:00:00.000Z',
    updatedAt: '2026-08-25T11:00:00.000Z'
  },
  {
    id: 'prod-7',
    name: 'Enceinte Portable Étanche IPX7 Bluetooth 5.3 avec Bass Boost (15W)',
    slug: 'enceinte-portable-etanche-ipx7',
    sku: 'AUD-SPK-IPX7',
    price: 7800,
    compareAtPrice: 10000,
    discountPercent: 22,
    stock: 14,
    lowStockThreshold: 4,
    categoryId: 'cat-audio',
    categoryName: 'Écouteurs & Audio',
    description: 'Enceinte tout-terrain résistante à l’eau et au sable de plage (idéale pour les sorties à Doraleh ou Khor Ambado). 12h de musique non-stop et jeu de lumières LED d’ambiance.',
    images: [
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    isFeatured: false,
    isNew: true,
    isPromo: true,
    rating: 4.6,
    reviewsCount: 31,
    tags: ['Enceinte', 'Étanche', 'Bass Boost'],
    createdAt: '2026-08-12T14:00:00.000Z',
    updatedAt: '2026-08-27T10:00:00.000Z'
  },
  {
    id: 'prod-8',
    name: 'Montre Homme Chronographe Luxe en Acier Inoxydable Noir & Or',
    slug: 'montre-homme-chronographe-luxe',
    sku: 'WTC-LUX-M01',
    price: 16500,
    compareAtPrice: 22000,
    discountPercent: 25,
    stock: 5,
    lowStockThreshold: 2,
    categoryId: 'cat-montres',
    categoryName: 'Montres & Smartwatches',
    description: 'Mouvement à quartz haute précision japonais. Verre minéral trempé anti-rayures, cadran 42mm avec chronomètre et guichet date. Étanche 30M avec bracelet réglable à boucle déployante.',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    isFeatured: true,
    isNew: false,
    isPromo: true,
    rating: 5.0,
    reviewsCount: 16,
    tags: ['Montre Classique', 'Acier Inox', 'Cadeau'],
    createdAt: '2026-08-01T15:00:00.000Z',
    updatedAt: '2026-08-26T12:00:00.000Z'
  },
  {
    id: 'prod-9',
    name: 'Lunettes de Soleil Polarisées UV400 Monture Métallique Noire Mat',
    slug: 'lunettes-soleil-polarisees-uv400',
    sku: 'MOD-SUN-UV400',
    price: 4500,
    compareAtPrice: 6000,
    discountPercent: 25,
    stock: 22,
    lowStockThreshold: 5,
    categoryId: 'cat-mode',
    categoryName: 'Mode, Sacs & Bijoux',
    description: 'Protection maximale catégorie 3 contre l’éblouissement intense du soleil djiboutien. Verres polarisés TAC réduisant la fatigue visuelle lors de la conduite.',
    images: [
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    isFeatured: true,
    isNew: false,
    isPromo: false,
    rating: 4.7,
    reviewsCount: 42,
    tags: ['Lunettes', 'UV400', 'Polarisé'],
    createdAt: '2026-07-28T09:00:00.000Z',
    updatedAt: '2026-08-18T10:00:00.000Z'
  },
  {
    id: 'prod-10',
    name: 'Sacoche Bandoulière Antivol Imperméable avec Port de Charge USB',
    slug: 'sacoche-bandouliere-antivol',
    sku: 'MOD-BAG-ANTI',
    price: 6800,
    compareAtPrice: 9000,
    discountPercent: 24,
    stock: 11,
    lowStockThreshold: 4,
    categoryId: 'cat-mode',
    categoryName: 'Mode, Sacs & Bijoux',
    description: 'Sacoche urbaine compacte et sécurisée avec fermeture à combinaison TSA et compartiment caché. Tissu Oxford haute densité résistant aux coupures et aux éclaboussures. Compartiment pour tablette 9.7".',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    isFeatured: false,
    isNew: true,
    isPromo: true,
    rating: 4.8,
    reviewsCount: 25,
    tags: ['Sacoche', 'Antivol', 'Imperméable'],
    createdAt: '2026-08-14T11:00:00.000Z',
    updatedAt: '2026-08-28T10:00:00.000Z'
  },
  {
    id: 'prod-11',
    name: 'Support Smartphone Voiture Magnétique Rotatif 360° pour Grille d’Aération',
    slug: 'support-voiture-magnetique-360',
    sku: 'AUT-HLD-MAG',
    price: 2500,
    compareAtPrice: 3500,
    discountPercent: 28,
    stock: 30,
    lowStockThreshold: 5,
    categoryId: 'cat-auto',
    categoryName: 'Accessoires Auto & Bureau',
    description: '6 puissants aimants néodyme N52 maintenant fermement votre smartphone même sur routes cahoteuses. Rotation libre à 360 degrés pour navigation GPS aisée.',
    images: [
      'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    isFeatured: false,
    isNew: false,
    isPromo: false,
    rating: 4.9,
    reviewsCount: 77,
    tags: ['Auto', 'Support GPS', 'Aimant'],
    createdAt: '2026-07-15T12:00:00.000Z',
    updatedAt: '2026-08-10T14:00:00.000Z'
  },
  {
    id: 'prod-12',
    name: 'Chargeur Allume-Cigare Métallique Rapide 45W Double Port USB-C PD & QC3.0',
    slug: 'chargeur-allume-cigare-45w',
    sku: 'AUT-CHR-45W',
    price: 3200,
    compareAtPrice: 4200,
    discountPercent: 23,
    stock: 19,
    lowStockThreshold: 5,
    categoryId: 'cat-auto',
    categoryName: 'Accessoires Auto & Bureau',
    description: 'Corps compact en alliage d’aluminium dissipant la chaleur. Rétro-éclairage LED discret pour insertion nocturne sans distraction. Protection contre surtensions.',
    images: [
      'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    isFeatured: false,
    isNew: false,
    isPromo: true,
    rating: 4.8,
    reviewsCount: 34,
    tags: ['Auto', 'Chargeur', 'Aluminium'],
    createdAt: '2026-08-03T10:00:00.000Z',
    updatedAt: '2026-08-20T11:00:00.000Z'
  },
  {
    id: 'prod-13',
    name: 'Hub Adaptateur USB-C 7-en-1 HDMI 4K, 3x USB 3.0, Lecteur SD & PD 100W',
    slug: 'hub-adaptateur-usb-c-7en1',
    sku: 'ACC-HUB-7IN1',
    price: 8500,
    compareAtPrice: 11000,
    discountPercent: 22,
    stock: 9,
    lowStockThreshold: 3,
    categoryId: 'cat-tel',
    categoryName: 'Téléphonie & Câbles',
    description: 'Connectez instantanément votre laptop, tablette ou smartphone à un écran TV/Projecteur 4K, transférez vos photos et branchez vos clés USB tout en chargeant votre appareil.',
    images: [
      'https://images.unsplash.com/photo-1544652478-6653e09f18a2?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    isFeatured: false,
    isNew: true,
    isPromo: false,
    rating: 4.9,
    reviewsCount: 15,
    tags: ['Adaptateur', 'HDMI 4K', 'USB 3.0'],
    createdAt: '2026-08-16T14:00:00.000Z',
    updatedAt: '2026-08-28T09:00:00.000Z'
  },
  {
    id: 'prod-14',
    name: 'Bracelet Homme en Cuir Véritable Tressé avec Fermoir Magnétique Inox',
    slug: 'bracelet-homme-cuir-fermoir-inox',
    sku: 'MOD-BRC-CUIR',
    price: 3500,
    compareAtPrice: 4800,
    discountPercent: 27,
    stock: 14,
    lowStockThreshold: 4,
    categoryId: 'cat-mode',
    categoryName: 'Mode, Sacs & Bijoux',
    description: 'Accessoire moderne et raffiné en cuir véritable marron foncé / noir avec insert gravé en acier inoxydable résistant à la transpiration et à l’eau.',
    images: [
      'https://images.unsplash.com/photo-1611591475155-4286423ce657?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    isFeatured: false,
    isNew: false,
    isPromo: true,
    rating: 4.6,
    reviewsCount: 28,
    tags: ['Bijoux', 'Cuir', 'Élégance'],
    createdAt: '2026-08-08T15:00:00.000Z',
    updatedAt: '2026-08-25T16:00:00.000Z'
  },
  {
    id: 'prod-15',
    name: 'Trépied Selfie Stick Bluetooth avec Télécommande Détachable & Lumière LED',
    slug: 'trepied-selfie-stick-bluetooth',
    sku: 'ACC-SLF-TRP',
    price: 4200,
    compareAtPrice: 5500,
    discountPercent: 23,
    stock: 16,
    lowStockThreshold: 4,
    categoryId: 'cat-tel',
    categoryName: 'Téléphonie & Câbles',
    description: 'Extension jusqu’à 105 cm, pieds de trépied renforcés, rotation 360° et mini anneau lumineux intégré à 3 niveaux de luminosité pour vidéos TikTok, réceptions et voyages.',
    images: [
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    isFeatured: false,
    isNew: false,
    isPromo: false,
    rating: 4.7,
    reviewsCount: 39,
    tags: ['Trépied', 'Selfie', 'TikTok'],
    createdAt: '2026-08-07T10:00:00.000Z',
    updatedAt: '2026-08-22T14:00:00.000Z'
  },
  {
    id: 'prod-16',
    name: 'Smart Band Tracker Sportif & Fréquence Cardiaque Étanche 5ATM',
    slug: 'smart-band-tracker-sportif',
    sku: 'WTC-BND-SPRT',
    price: 5900,
    compareAtPrice: 7500,
    discountPercent: 21,
    stock: 3, // Low stock test!
    lowStockThreshold: 5,
    categoryId: 'cat-montres',
    categoryName: 'Montres & Smartwatches',
    description: 'Bracelets légers avec écran tactile couleur, podomètre, suivi du sommeil et notifications d’appels WhatsApp/SMS. 14 jours d’autonomie sur une seule charge.',
    images: [
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80'
    ],
    status: 'active',
    isFeatured: false,
    isNew: false,
    isPromo: true,
    rating: 4.5,
    reviewsCount: 20,
    tags: ['Fitness', 'Tracker', '5ATM'],
    createdAt: '2026-07-22T11:00:00.000Z',
    updatedAt: '2026-08-24T12:00:00.000Z'
  }
];

const defaultSettings: StoreSettings = {
  storeName: 'DjiAccess Boutique',
  tagline: 'Le n°1 des accessoires high-tech & mode à Djibouti',
  logo: '',
  logoText: 'DjiAccess',
  logoSubtitle: 'Accessoires • Djibouti',
  favicon: '',
  phone: '+253 77 12 34 56',
  whatsapp: '+253 77 12 34 56',
  email: 'contact@djiaccess.dj',
  address: 'Boutique 100% en ligne • Service de Livraison Express à Djibouti-Ville, Balbala, Héron & Environs',
  currency: 'FDJ',
  currencySymbol: 'FDJ',
  primaryColor: '#5A5A40',
  primaryHoverColor: '#44442F',
  secondaryColor: '#2D2926',
  accentColor: '#C5A880',
  backgroundColor: '#FAF9F6',
  colorPreset: 'olive',
  aboutText: 'DjiAccess est la boutique djiboutienne de référence pour vos accessoires smartphones, écouteurs, montres connectées, chargeurs et articles de mode. Boutique 100% en ligne : commandez directement sur le site et recevez votre livraison express partout à Djibouti avec paiement sécurisé à la réception ou via D-Money / Waafi.',
  announcementBar: '🚚 Livraison express en moins de 3h à Djibouti-Ville & Balbala ! Paiement à la livraison accepté.',
  isAnnouncementActive: true,
  announcementTag: 'DJIBOUTI 🇩🇯',

  // Hero Homepage Customization
  heroImage: '',
  heroBadge: 'COLLECTION PREMIUM D\'ACCESSOIRES À DJIBOUTI',
  heroTitle: 'L\'excellence de l\'accessoire au meilleur prix en FDJ.',
  heroSubtitle: 'Powerbanks haute capacité, écouteurs sans fil avec réduction de bruit, montres connectées AMOLED, coques et chargeurs rapides. Livraison soignée en 2 à 4h partout à Djibouti !',
  heroPrimaryBtnText: 'Explorer la Collection',
  heroPrimaryBtnLink: 'catalog',
  heroSecondaryBtnText: 'Offres du Moment',
  heroSecondaryBtnLink: 'promos',
  heroTrust1Number: '2 - 4h',
  heroTrust1Label: 'Livraison express',
  heroTrust2Number: '100%',
  heroTrust2Label: 'Testé & Garanti',
  heroTrust3Number: 'Paiement',
  heroTrust3Label: 'À la réception',

  // Hero Card Showcase Customization
  heroCardImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
  heroCardTag: 'Coup de cœur de la semaine',
  heroCardDiscount: '-24%',
  heroCardTitle: 'Smartwatch Pro Écran AMOLED 1.43"',
  heroCardDesc: 'Appels Bluetooth, étanche IP68, autonomie 10 jours et suivi complet de santé.',
  heroCardPrice: 14000,
  heroCardOldPrice: 18500,
  heroCardProductId: 'prod-3',

  // Reassurance Customization
  reassurance1Title: 'Livraison Express Locale',
  reassurance1Desc: 'Nos livreurs vous livrent directement chez vous ou à votre bureau à Djibouti-Ville, Balbala, Héron, Haramous ou PK12 en un temps record.',
  reassurance2Title: 'Paiement 100% Flexible',
  reassurance2Desc: 'Réglez en toute confiance en espèces à la livraison une fois votre commande inspectée, ou par D-Money / Waafi sans frais cachés.',
  reassurance3Title: 'Authenticité & Service Client',
  reassurance3Desc: 'Tous nos accessoires sont rigoureusement testés pour résister au climat de Djibouti. Une question ? Notre équipe vous répond immédiatement sur WhatsApp.',
  reassurance4Title: 'Support Local 7j/7',
  reassurance4Desc: 'Une équipe locale basée à Djibouti pour répondre à toutes vos questions avant et après vos commandes.',

  enableCashOnDelivery: true,
  enableDMoney: true,
  enableWaafi: true,
  dMoneyNumber: '77 12 34 56',
  waafiNumber: '77 12 34 56',
  facebookUrl: 'https://facebook.com',
  instagramUrl: 'https://instagram.com',
  tiktokUrl: 'https://tiktok.com',
  seoTitle: 'DjiAccess Djibouti - Accessoires Téléphone, Montres, Audio & Mode à Djibouti',
  seoDescription: 'Achetez vos accessoires à Djibouti en Francs Djibouti (FDJ) : Powerbanks, Écouteurs sans fil, Smartwatches, Coques et Câbles. Livraison rapide à domicile.'
};

const defaultCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Mohamed Ali Hassan',
    phone: '+253 77 84 92 10',
    email: 'mohamed.ali@gmail.com',
    district: 'Héron',
    address: 'Avenue Maréchal Joffre, Villa 14',
    ordersCount: 4,
    totalSpent: 42000,
    lastOrderDate: '2026-08-29T18:30:00.000Z',
    createdAt: '2026-06-10T14:00:00.000Z'
  },
  {
    id: 'cust-2',
    name: 'Fatouma Omar Daher',
    phone: '+253 77 65 21 89',
    email: 'fatouma.daher@yahoo.fr',
    district: 'Balbala',
    address: 'Près du Lycée de Balbala',
    ordersCount: 3,
    totalSpent: 27500,
    lastOrderDate: '2026-08-30T10:15:00.000Z',
    createdAt: '2026-07-01T09:00:00.000Z'
  },
  {
    id: 'cust-3',
    name: 'Ahmed Youssouf Barkat',
    phone: '+253 77 33 44 55',
    email: 'ahmed.barkat@outlook.com',
    district: 'Haramous',
    address: 'Zone Ambassades, Rue 12',
    ordersCount: 2,
    totalSpent: 30500,
    lastOrderDate: '2026-08-28T16:45:00.000Z',
    createdAt: '2026-07-15T11:00:00.000Z'
  },
  {
    id: 'cust-4',
    name: 'Khadidja Ismael Aden',
    phone: '+253 77 99 88 77',
    email: 'khadidja.aden@gmail.com',
    district: 'Gabode 4',
    address: 'Cité Gabode, Immeuble B',
    ordersCount: 2,
    totalSpent: 19000,
    lastOrderDate: '2026-08-27T14:00:00.000Z',
    createdAt: '2026-07-20T10:00:00.000Z'
  },
  {
    id: 'cust-5',
    name: 'Ibrahim Moussa Doualeh',
    phone: '+253 77 55 66 77',
    district: 'Quartier 7',
    address: 'Boulevard de Gaulle',
    ordersCount: 1,
    totalSpent: 6500,
    lastOrderDate: '2026-08-30T14:00:00.000Z',
    createdAt: '2026-08-30T14:00:00.000Z'
  }
];

const defaultOrders: Order[] = [
  {
    id: 'ord-1025',
    orderNumber: 'DJ-1025',
    customerName: 'Ibrahim Moussa Doualeh',
    customerPhone: '+253 77 55 66 77',
    district: 'Quartier 7',
    address: 'Boulevard de Gaulle, en face de la pharmacie',
    city: 'Djibouti',
    deliveryNotes: 'Appeler 10 min avant d’arriver',
    deliveryZoneId: 'zone-centre',
    deliveryZoneName: 'Djibouti-Ville Centre',
    deliveryFee: 800,
    subtotal: 6500,
    total: 7300,
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'pending',
    status: 'nouvelle',
    items: [
      {
        productId: 'prod-1',
        productName: 'Powerbank 20 000 mAh Charge Rapide 22.5W',
        sku: 'PWR-20K-BLK',
        price: 6500,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&auto=format&fit=crop&q=80',
        total: 6500
      }
    ],
    statusHistory: [
      {
        status: 'nouvelle',
        timestamp: '2026-08-30T19:40:00.000Z',
        note: 'Commande reçue en ligne via smartphone'
      }
    ],
    createdAt: '2026-08-30T19:40:00.000Z',
    updatedAt: '2026-08-30T19:40:00.000Z'
  },
  {
    id: 'ord-1024',
    orderNumber: 'DJ-1024',
    customerName: 'Fatouma Omar Daher',
    customerPhone: '+253 77 65 21 89',
    customerEmail: 'fatouma.daher@yahoo.fr',
    district: 'Balbala',
    address: 'Près du Lycée de Balbala, Maison portail vert',
    city: 'Djibouti',
    deliveryNotes: 'Disponible à partir de 17h',
    deliveryZoneId: 'zone-balbala',
    deliveryZoneName: 'Balbala',
    deliveryFee: 1000,
    subtotal: 19000,
    total: 20000,
    paymentMethod: 'd_money',
    paymentStatus: 'paid',
    status: 'en_livraison',
    items: [
      {
        productId: 'prod-2',
        productName: 'Écouteurs Sans Fil Pro TWS ANC',
        sku: 'AUD-TWS-PRO',
        price: 9500,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
        total: 19000
      }
    ],
    statusHistory: [
      {
        status: 'nouvelle',
        timestamp: '2026-08-30T10:15:00.000Z',
        note: 'Paiement D-Money confirmé'
      },
      {
        status: 'confirmee',
        timestamp: '2026-08-30T10:30:00.000Z',
        note: 'Vérification stock et emballage'
      },
      {
        status: 'preparation',
        timestamp: '2026-08-30T11:00:00.000Z',
        note: 'Colis prêt'
      },
      {
        status: 'en_livraison',
        timestamp: '2026-08-30T15:00:00.000Z',
        note: 'Remis au coursier moto Balbala'
      }
    ],
    createdAt: '2026-08-30T10:15:00.000Z',
    updatedAt: '2026-08-30T15:00:00.000Z'
  },
  {
    id: 'ord-1023',
    orderNumber: 'DJ-1023',
    customerName: 'Mohamed Ali Hassan',
    customerPhone: '+253 77 84 92 10',
    customerEmail: 'mohamed.ali@gmail.com',
    district: 'Héron',
    address: 'Avenue Maréchal Joffre, Villa 14',
    city: 'Djibouti',
    deliveryZoneId: 'zone-centre',
    deliveryZoneName: 'Djibouti-Ville Centre / Héron',
    deliveryFee: 800,
    subtotal: 14000,
    total: 14800,
    paymentMethod: 'cash_on_delivery',
    paymentStatus: 'paid',
    status: 'livree',
    items: [
      {
        productId: 'prod-3',
        productName: 'Smartwatch Pro Écran AMOLED 1.43"',
        sku: 'WTC-SMART-01',
        price: 14000,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
        total: 14000
      }
    ],
    statusHistory: [
      { status: 'nouvelle', timestamp: '2026-08-29T18:30:00.000Z' },
      { status: 'confirmee', timestamp: '2026-08-29T18:45:00.000Z' },
      { status: 'en_livraison', timestamp: '2026-08-29T19:30:00.000Z' },
      { status: 'livree', timestamp: '2026-08-29T20:45:00.000Z', note: 'Reçu et payé en espèces' }
    ],
    createdAt: '2026-08-29T18:30:00.000Z',
    updatedAt: '2026-08-29T20:45:00.000Z'
  },
  {
    id: 'ord-1022',
    orderNumber: 'DJ-1022',
    customerName: 'Ahmed Youssouf Barkat',
    customerPhone: '+253 77 33 44 55',
    district: 'Haramous',
    address: 'Zone Ambassades, Rue 12',
    city: 'Djibouti',
    deliveryZoneId: 'zone-haramous',
    deliveryZoneName: 'Haramous',
    deliveryFee: 1000,
    subtotal: 21000,
    total: 22000,
    paymentMethod: 'waafi',
    paymentStatus: 'paid',
    status: 'livree',
    items: [
      {
        productId: 'prod-8',
        productName: 'Montre Homme Chronographe Luxe',
        sku: 'WTC-LUX-M01',
        price: 16500,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80',
        total: 16500
      },
      {
        productId: 'prod-9',
        productName: 'Lunettes de Soleil Polarisées UV400',
        sku: 'MOD-SUN-UV400',
        price: 4500,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&auto=format&fit=crop&q=80',
        total: 4500
      }
    ],
    statusHistory: [
      { status: 'nouvelle', timestamp: '2026-08-28T16:45:00.000Z' },
      { status: 'confirmee', timestamp: '2026-08-28T17:00:00.000Z' },
      { status: 'livree', timestamp: '2026-08-28T18:30:00.000Z' }
    ],
    createdAt: '2026-08-28T16:45:00.000Z',
    updatedAt: '2026-08-28T18:30:00.000Z'
  }
];

const defaultPromotions: Promotion[] = [
  {
    id: 'promo-1',
    code: 'DJIBOUTI2026',
    title: 'Offre Spéciale Bienvenue (-10%)',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 5000,
    startDate: '2026-08-01',
    endDate: '2026-12-31',
    isActive: true,
    usageCount: 42
  },
  {
    id: 'promo-2',
    code: 'LIVRAISONGRATUITE',
    title: 'Frais de livraison offerts dès 15 000 FDJ',
    discountType: 'fixed',
    discountValue: 1000,
    minOrderAmount: 15000,
    startDate: '2026-08-01',
    endDate: '2026-12-31',
    isActive: true,
    usageCount: 18
  }
];

class DatabaseManager {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    const tmpFile = '/tmp/store_db.json';

    // 1. Try reading from primary persistent storage (data/store_db.json)
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (!parsed.users || !Array.isArray(parsed.users) || parsed.users.length === 0) {
          const salt = bcrypt.genSaltSync(10);
          parsed.users = [
            {
              id: 'user-admin',
              username: 'admin',
              email: 'admin@djiaccess.dj',
              name: 'Commerçant DjiAccess',
              role: 'admin',
              passwordHash: bcrypt.hashSync('djibouti2026', salt)
            }
          ];
          this.saveData(parsed);
        }
        return parsed;
      }
    } catch (err) {
      console.warn('[DB] Could not read from primary DB_FILE, trying fallback...', err);
    }

    // 2. Try reading from serverless temporary storage (/tmp/store_db.json)
    try {
      if (fs.existsSync(tmpFile)) {
        const raw = fs.readFileSync(tmpFile, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && parsed.products && parsed.settings) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('[DB] Fallback tmp file not readable:', err);
    }

    // 3. Fallback to initial Djibouti default store seed
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('djibouti2026', salt);

    const initialData: DatabaseSchema = {
      products: defaultProducts,
      categories: defaultCategories,
      deliveryZones: defaultDeliveryZones,
      orders: defaultOrders,
      customers: defaultCustomers,
      promotions: defaultPromotions,
      settings: defaultSettings,
      users: [
        {
          id: 'user-admin',
          username: 'admin',
          email: 'admin@djiaccess.dj',
          name: 'Commerçant DjiAccess',
          role: 'admin',
          passwordHash: passwordHash
        }
      ]
    };

    this.saveData(initialData);
    return initialData;
  }

  private saveData(dataToSave: DatabaseSchema = this.data) {
    this.data = dataToSave;
    const jsonString = JSON.stringify(dataToSave, null, 2);

    // Try primary location
    let savedSuccessfully = false;
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, jsonString, 'utf-8');
      savedSuccessfully = true;
    } catch (err) {
      // In serverless environments (like Vercel read-only runtime), write to /tmp
      try {
        const tmpFile = '/tmp/store_db.json';
        fs.writeFileSync(tmpFile, jsonString, 'utf-8');
        savedSuccessfully = true;
      } catch (tmpErr) {
        // In-memory persistence remains intact in this.data
        console.warn('[DB] Persistence to disk skipped in read-only environment; state is held in-memory.');
      }
    }
  }

  // ===================== PRODUCTS =====================
  getProducts(params?: {
    categoryId?: string;
    search?: string;
    status?: string;
    isPromo?: boolean;
    isFeatured?: boolean;
    isNew?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
    includeArchived?: boolean;
  }): Product[] {
    let list = [...this.data.products];

    if (!params?.includeArchived) {
      list = list.filter((p) => p.status !== 'archived');
    }

    if (params?.status) {
      list = list.filter((p) => p.status === params.status);
    }

    if (params?.categoryId && params.categoryId !== 'all') {
      list = list.filter((p) => p.categoryId === params.categoryId);
    }

    if (params?.isPromo) {
      list = list.filter((p) => p.isPromo || (p.compareAtPrice && p.compareAtPrice > p.price));
    }

    if (params?.isFeatured) {
      list = list.filter((p) => p.isFeatured);
    }

    if (params?.isNew) {
      list = list.filter((p) => p.isNew);
    }

    if (params?.minPrice !== undefined) {
      list = list.filter((p) => p.price >= params.minPrice!);
    }

    if (params?.maxPrice !== undefined) {
      list = list.filter((p) => p.price <= params.maxPrice!);
    }

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q)) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort
    if (params?.sort === 'price_asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (params?.sort === 'price_desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (params?.sort === 'popular') {
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else {
      // Default: newest
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return list;
  }

  getProductById(id: string): Product | undefined {
    return this.data.products.find((p) => p.id === id);
  }

  getProductBySlug(slug: string): Product | undefined {
    return this.data.products.find((p) => p.slug === slug);
  }

  createProduct(item: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const category = this.data.categories.find((c) => c.id === item.categoryId);
    const id = `prod-${Date.now()}`;
    const slug =
      item.slug ||
      item.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const newProduct: Product = {
      ...item,
      id,
      slug,
      categoryName: category?.name || item.categoryName || '',
      rating: item.rating || 5.0,
      reviewsCount: item.reviewsCount || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.data.products.unshift(newProduct);
    this.updateCategoryProductCounts();
    this.saveData();
    return newProduct;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    if (updates.categoryId && updates.categoryId !== this.data.products[idx].categoryId) {
      const category = this.data.categories.find((c) => c.id === updates.categoryId);
      if (category) {
        updates.categoryName = category.name;
      }
    }

    this.data.products[idx] = {
      ...this.data.products[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.updateCategoryProductCounts();
    this.saveData();
    return this.data.products[idx];
  }

  deleteProduct(id: string, permanent: boolean = false): boolean {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;

    if (permanent) {
      this.data.products.splice(idx, 1);
    } else {
      this.data.products[idx].status = 'archived';
      this.data.products[idx].updatedAt = new Date().toISOString();
    }

    this.updateCategoryProductCounts();
    this.saveData();
    return true;
  }

  // ===================== CATEGORIES =====================
  getCategories(): Category[] {
    this.updateCategoryProductCounts();
    return this.data.categories;
  }

  createCategory(item: Omit<Category, 'id'>): Category {
    const id = `cat-${Date.now()}`;
    const slug =
      item.slug ||
      item.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const newCat: Category = {
      ...item,
      id,
      slug,
      productCount: 0
    };

    this.data.categories.push(newCat);
    this.saveData();
    return newCat;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    this.data.categories[idx] = {
      ...this.data.categories[idx],
      ...updates
    };

    // If name changed, update product categoryName
    if (updates.name) {
      this.data.products.forEach((p) => {
        if (p.categoryId === id) {
          p.categoryName = updates.name;
        }
      });
    }

    this.saveData();
    return this.data.categories[idx];
  }

  deleteCategory(id: string): boolean {
    const idx = this.data.categories.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    this.data.categories.splice(idx, 1);
    this.saveData();
    return true;
  }

  private updateCategoryProductCounts() {
    this.data.categories.forEach((cat) => {
      cat.productCount = this.data.products.filter(
        (p) => p.categoryId === cat.id && p.status === 'active'
      ).length;
    });
  }

  // ===================== ORDERS =====================
  getOrders(params?: { status?: OrderStatus; search?: string }): Order[] {
    let list = [...this.data.orders];

    if (params?.status) {
      list = list.filter((o) => o.status === params.status);
    }

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      list = list.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q) ||
          o.district.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  }

  getOrderById(idOrNumber: string): Order | undefined {
    return this.data.orders.find(
      (o) => o.id === idOrNumber || o.orderNumber.toLowerCase() === idOrNumber.toLowerCase()
    );
  }

  createOrder(orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    district: string;
    address: string;
    city?: string;
    deliveryNotes?: string;
    deliveryZoneId: string;
    paymentMethod: Order['paymentMethod'];
    items: { productId: string; quantity: number }[];
    couponCode?: string;
  }): Order {
    // 1. Verify and decrement stock
    const orderItems: Order['items'] = [];
    let subtotal = 0;

    for (const item of orderData.items) {
      const product = this.getProductById(item.productId);
      if (!product) {
        throw new Error(`Produit introuvable (ID: ${item.productId})`);
      }

      if (product.status !== 'active') {
        throw new Error(`Le produit "${product.name}" n'est plus disponible à la vente.`);
      }

      if (product.stock < item.quantity) {
        throw new Error(
          `Stock insuffisant pour "${product.name}". Disponible : ${product.stock}, Demandé : ${item.quantity}`
        );
      }

      // Decrement stock
      product.stock -= item.quantity;
      product.updatedAt = new Date().toISOString();

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0] || '',
        total: itemTotal
      });
    }

    // 2. Delivery Zone
    const zone = this.data.deliveryZones.find((z) => z.id === orderData.deliveryZoneId) || {
      id: 'custom',
      name: orderData.district,
      price: 1000,
      estimatedHours: '2-4 heures',
      isActive: true
    };

    let deliveryFee = zone.price;
    let discountTotal = 0;

    // 3. Optional Promo Code
    if (orderData.couponCode) {
      const promo = this.data.promotions.find(
        (p) => p.code.toUpperCase() === orderData.couponCode!.toUpperCase() && p.isActive
      );
      if (promo && subtotal >= promo.minOrderAmount) {
        if (promo.discountType === 'percentage') {
          discountTotal = Math.round((subtotal * promo.discountValue) / 100);
        } else {
          discountTotal = promo.discountValue;
        }
        promo.usageCount += 1;
      }
    }

    const total = Math.max(0, subtotal - discountTotal + deliveryFee);
    const orderNumber = `DJ-${1026 + this.data.orders.length}`;
    const id = `ord-${Date.now()}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id,
      orderNumber,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      district: orderData.district,
      address: orderData.address,
      city: orderData.city || 'Djibouti',
      deliveryNotes: orderData.deliveryNotes,
      deliveryZoneId: zone.id,
      deliveryZoneName: zone.name,
      deliveryFee,
      subtotal,
      discountTotal,
      total,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
      status: 'nouvelle',
      items: orderItems,
      statusHistory: [
        {
          status: 'nouvelle',
          timestamp: now,
          note: 'Commande enregistrée par le client.'
        }
      ],
      createdAt: now,
      updatedAt: now
    };

    this.data.orders.unshift(newOrder);

    // 4. Update or Create Customer Record
    this.upsertCustomerFromOrder(newOrder);

    this.saveData();
    return newOrder;
  }

  updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string): Order | null {
    const order = this.data.orders.find((o) => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    order.status = newStatus;
    if (newStatus === 'livree') {
      order.paymentStatus = 'paid';
    }

    const now = new Date().toISOString();
    order.statusHistory.push({
      status: newStatus,
      timestamp: now,
      note: note || `Statut mis à jour vers: ${newStatus}`
    });
    order.updatedAt = now;

    this.saveData();
    return order;
  }

  private upsertCustomerFromOrder(order: Order) {
    const existing = this.data.customers.find(
      (c) =>
        c.phone.replace(/\s+/g, '') === order.customerPhone.replace(/\s+/g, '') ||
        (order.customerEmail && c.email === order.customerEmail)
    );

    if (existing) {
      existing.ordersCount += 1;
      existing.totalSpent += order.total;
      existing.lastOrderDate = order.createdAt;
      existing.name = order.customerName || existing.name;
      existing.district = order.district || existing.district;
      existing.address = order.address || existing.address;
    } else {
      this.data.customers.push({
        id: `cust-${Date.now()}`,
        name: order.customerName,
        phone: order.customerPhone,
        email: order.customerEmail,
        district: order.district,
        address: order.address,
        ordersCount: 1,
        totalSpent: order.total,
        lastOrderDate: order.createdAt,
        createdAt: order.createdAt
      });
    }
  }

  // ===================== CUSTOMERS =====================
  getCustomers(): Customer[] {
    return this.data.customers.sort(
      (a, b) => new Date(b.lastOrderDate || 0).getTime() - new Date(a.lastOrderDate || 0).getTime()
    );
  }

  // ===================== DELIVERY ZONES =====================
  getDeliveryZones(): DeliveryZone[] {
    return this.data.deliveryZones;
  }

  saveDeliveryZones(zones: DeliveryZone[]) {
    this.data.deliveryZones = zones;
    this.saveData();
    return this.data.deliveryZones;
  }

  // ===================== PROMOTIONS =====================
  getPromotions(): Promotion[] {
    return this.data.promotions;
  }

  createPromotion(promo: Omit<Promotion, 'id' | 'usageCount'>): Promotion {
    const newPromo: Promotion = {
      ...promo,
      id: `promo-${Date.now()}`,
      usageCount: 0
    };
    this.data.promotions.push(newPromo);
    this.saveData();
    return newPromo;
  }

  updatePromotion(id: string, updates: Partial<Promotion>): Promotion | null {
    const idx = this.data.promotions.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.data.promotions[idx] = { ...this.data.promotions[idx], ...updates };
    this.saveData();
    return this.data.promotions[idx];
  }

  deletePromotion(id: string): boolean {
    const idx = this.data.promotions.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.data.promotions.splice(idx, 1);
    this.saveData();
    return true;
  }

  // ===================== SETTINGS =====================
  getSettings(): StoreSettings {
    return this.data.settings;
  }

  updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates
    };
    this.saveData();
    return this.data.settings;
  }

  // ===================== AUTH & USERS =====================
  findUserByUsername(username: string) {
    if (!this.data.users) return null;
    const clean = username.trim().toLowerCase();
    return this.data.users.find(
      (u) => u.username.toLowerCase() === clean || u.email.toLowerCase() === clean
    );
  }

  getUserById(id: string) {
    if (!this.data.users) return null;
    return this.data.users.find((u) => u.id === id);
  }

  updateUserPassword(id: string, newPlainPassword: string): boolean {
    if (!this.data.users) return false;
    const user = this.data.users.find((u) => u.id === id);
    if (!user) return false;
    const salt = bcrypt.genSaltSync(10);
    user.passwordHash = bcrypt.hashSync(newPlainPassword, salt);
    this.saveData();
    return true;
  }

  // ===================== DASHBOARD STATS =====================
  getDashboardStats(): DashboardStats {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    let revenueToday = 0;
    let revenueThisMonth = 0;
    let ordersToday = 0;
    let pendingOrdersCount = 0;

    this.data.orders.forEach((o) => {
      const orderTime = new Date(o.createdAt).getTime();

      if (o.status !== 'annulee') {
        if (orderTime >= startOfToday) {
          revenueToday += o.total;
          ordersToday += 1;
        }
        if (orderTime >= startOfMonth) {
          revenueThisMonth += o.total;
        }
      }

      if (o.status === 'nouvelle' || o.status === 'confirmee' || o.status === 'preparation') {
        pendingOrdersCount += 1;
      }
    });

    const lowStockProductsCount = this.data.products.filter(
      (p) => p.status === 'active' && p.stock <= p.lowStockThreshold
    ).length;

    // Daily sales last 7 days
    const dailySalesMap: { [key: string]: { revenue: number; orders: number } } = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      dailySalesMap[key] = { revenue: 0, orders: 0 };
    }

    this.data.orders.forEach((o) => {
      const d = new Date(o.createdAt);
      const key = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      if (dailySalesMap[key] && o.status !== 'annulee') {
        dailySalesMap[key].revenue += o.total;
        dailySalesMap[key].orders += 1;
      }
    });

    const dailySales = Object.entries(dailySalesMap).map(([date, val]) => ({
      date,
      revenue: val.revenue,
      orders: val.orders
    }));

    // Top selling products
    const productSales: { [id: string]: { product: Product; soldUnits: number; revenue: number } } = {};
    this.data.orders.forEach((o) => {
      if (o.status !== 'annulee') {
        o.items.forEach((item) => {
          if (!productSales[item.productId]) {
            const product = this.getProductById(item.productId) || {
              id: item.productId,
              name: item.productName,
              slug: '',
              sku: item.sku || '',
              price: item.price,
              stock: 0,
              lowStockThreshold: 5,
              categoryId: '',
              description: '',
              images: [item.image],
              status: 'active',
              isFeatured: false,
              isNew: false,
              isPromo: false,
              rating: 5,
              reviewsCount: 0,
              createdAt: '',
              updatedAt: ''
            };
            productSales[item.productId] = { product, soldUnits: 0, revenue: 0 };
          }
          productSales[item.productId].soldUnits += item.quantity;
          productSales[item.productId].revenue += item.total;
        });
      }
    });

    const topSellingProducts = Object.values(productSales)
      .sort((a, b) => b.soldUnits - a.soldUnits)
      .slice(0, 5);

    // Category distribution
    const categoryDistribution = this.data.categories.map((c) => ({
      name: c.name,
      value: this.data.products.filter((p) => p.categoryId === c.id && p.status === 'active').length
    }));

    return {
      revenueToday,
      revenueThisMonth,
      ordersToday,
      pendingOrdersCount,
      totalProductsCount: this.data.products.filter((p) => p.status === 'active').length,
      lowStockProductsCount,
      totalCustomersCount: this.data.customers.length,
      recentOrders: this.data.orders.slice(0, 6),
      topSellingProducts,
      dailySales,
      categoryDistribution
    };
  }

  // ===================== DATABASE EXPORT & IMPORT =====================
  exportDatabase(): {
    exportedAt: string;
    version: string;
    store: string;
    data: DatabaseSchema;
  } {
    return {
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
      store: this.data.settings?.storeName || 'DjiAccess Djibouti',
      data: {
        products: this.data.products || [],
        categories: this.data.categories || [],
        deliveryZones: this.data.deliveryZones || [],
        orders: this.data.orders || [],
        customers: this.data.customers || [],
        promotions: this.data.promotions || [],
        settings: this.data.settings || defaultSettings,
        users: (this.data.users || []).map((u) => ({
          id: u.id,
          username: u.username,
          email: u.email,
          name: u.name,
          role: u.role,
          passwordHash: u.passwordHash
        }))
      }
    };
  }

  importDatabase(imported: any): {
    success: boolean;
    message: string;
    counts: {
      products: number;
      categories: number;
      orders: number;
      customers: number;
      deliveryZones: number;
      promotions: number;
    };
  } {
    const payload = imported?.data ? imported.data : imported;

    if (!payload || typeof payload !== 'object') {
      throw new Error('Format de fichier JSON invalide.');
    }

    if (!Array.isArray(payload.products) || !Array.isArray(payload.categories)) {
      throw new Error('Le fichier doit contenir au minimum les listes de produits et de catégories.');
    }

    // Preserve existing admin user credentials if import lacks users
    const existingUsers = this.data.users && this.data.users.length > 0 ? this.data.users : [];
    const importedUsers = Array.isArray(payload.users) && payload.users.length > 0 ? payload.users : existingUsers;

    const newSchema: DatabaseSchema = {
      products: payload.products,
      categories: payload.categories,
      deliveryZones: Array.isArray(payload.deliveryZones) ? payload.deliveryZones : defaultDeliveryZones,
      orders: Array.isArray(payload.orders) ? payload.orders : [],
      customers: Array.isArray(payload.customers) ? payload.customers : [],
      promotions: Array.isArray(payload.promotions) ? payload.promotions : [],
      settings: payload.settings ? { ...defaultSettings, ...payload.settings } : defaultSettings,
      users: importedUsers
    };

    this.saveData(newSchema);

    return {
      success: true,
      message: 'Base de données restaurée avec succès.',
      counts: {
        products: newSchema.products.length,
        categories: newSchema.categories.length,
        orders: newSchema.orders.length,
        customers: newSchema.customers.length,
        deliveryZones: newSchema.deliveryZones.length,
        promotions: newSchema.promotions.length
      }
    };
  }

  // Reset / Reseed function for merchant or tests
  resetDatabase() {
    if (fs.existsSync(DB_FILE)) {
      try {
        fs.unlinkSync(DB_FILE);
      } catch (err) {
        console.warn('[DB] Could not delete file directly:', err);
      }
    }
    const tmpFile = '/tmp/store_db.json';
    if (fs.existsSync(tmpFile)) {
      try {
        fs.unlinkSync(tmpFile);
      } catch (err) {
        console.warn('[DB] Could not delete tmp file:', err);
      }
    }
    this.data = this.loadDatabase();
    return true;
  }
}

export const db = new DatabaseManager();
