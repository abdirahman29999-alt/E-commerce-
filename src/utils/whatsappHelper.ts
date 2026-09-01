import type { Product, StoreSettings, CartItem, Order, DeliveryZone } from '../types';
import { formatFDJ } from '../services/api';

/**
 * Clean phone number for WhatsApp link
 */
export function getCleanWhatsAppNumber(settings?: StoreSettings | null): string {
  const raw = settings?.whatsapp || '+253 77 12 34 56';
  const digitsOnly = raw.replace(/[^0-9]/g, '');
  // Default to Djibouti prefix 253 if missing
  if (digitsOnly.length === 8) {
    return `253${digitsOnly}`;
  }
  return digitsOnly || '25377123456';
}

/**
 * Generate WhatsApp message text for a single product order (without long description, without url link)
 */
export function generateProductWhatsAppText(params: {
  product: Product;
  quantity?: number;
  settings?: StoreSettings | null;
  selectedVariant?: string;
}): string {
  const { product, quantity = 1, settings, selectedVariant } = params;
  const storeName = settings?.storeName || 'DjiAccess';
  const totalAmount = formatFDJ(product.price * quantity);

  let msg = `🛍️ *NOUVELLE COMMANDE - ${storeName} (DJIBOUTI 🇩🇯)*\n\n`;
  msg += `Bonjour, je souhaite passer commande de l'article suivant :\n\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📦 *PRODUIT :* ${product.name}\n`;
  msg += `🏷️ *Réf / Modèle :* ${product.sku || 'DJI-ACC'}\n`;
  if (product.categoryName) {
    msg += `📁 *Catégorie :* ${product.categoryName}\n`;
  }
  if (selectedVariant) {
    msg += `🎨 *Option / Couleur / Taille :* ${selectedVariant}\n`;
  }
  msg += `💵 *Prix unitaire :* ${formatFDJ(product.price)}\n`;
  msg += `🔢 *Quantité :* ${quantity}\n`;
  msg += `💰 *MONTANT TOTAL :* *${totalAmount}*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  msg += `📍 *MES COORDONNÉES POUR LA LIVRAISON :*\n`;
  msg += `👤 *Nom & Prénom :* \n`;
  msg += `📞 *Numéro de téléphone :* \n`;
  msg += `🏙️ *Quartier à Djibouti :* (ex: Héron, Balbala, Centre-Ville, Haramous, Gabode, PK12...)\n`;
  msg += `🏠 *Adresse précise / Repère :* \n`;
  msg += `💳 *Mode de paiement :* [ ] Espèces à la livraison  [ ] D-Money  [ ] Waafi\n\n`;
  msg += `Merci de me confirmer la prise en charge et l'heure de livraison !`;

  return msg;
}

/**
 * Generate WhatsApp message URL for a single product order
 */
export function generateProductWhatsAppUrl(params: {
  product: Product;
  quantity?: number;
  settings?: StoreSettings | null;
  selectedVariant?: string;
}): string {
  const { settings } = params;
  const waNumber = getCleanWhatsAppNumber(settings);
  const msg = generateProductWhatsAppText(params);
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
}

/**
 * Generate WhatsApp message text for cart checkout (without long description, without url link)
 */
export function generateCartWhatsAppText(params: {
  cart: CartItem[];
  subtotal: number;
  deliveryFee?: number;
  total: number;
  deliveryZone?: DeliveryZone;
  settings?: StoreSettings | null;
  customerInfo?: {
    name?: string;
    phone?: string;
    district?: string;
    address?: string;
    paymentMethod?: string;
    notes?: string;
  };
}): string {
  const { cart, subtotal, deliveryFee = 0, total, deliveryZone, settings, customerInfo } = params;
  const storeName = settings?.storeName || 'DjiAccess';

  let msg = `🛍️ *NOUVELLE COMMANDE - ${storeName} (DJIBOUTI 🇩🇯)*\n\n`;
  msg += `Bonjour, je souhaite valider la commande de mon panier :\n\n`;
  msg += `📋 *DÉTAIL DES ARTICLES COMMANDÉS (${cart.length}) :*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

  cart.forEach((item, index) => {
    const itemTotal = item.product.price * item.quantity;

    msg += `*${index + 1}. ${item.product.name}*\n`;
    msg += `   • Réf : ${item.product.sku || 'DJI-ACC'}\n`;
    if (item.product.categoryName) {
      msg += `   • Catégorie : ${item.product.categoryName}\n`;
    }
    msg += `   • Quantité : ${item.quantity} × ${formatFDJ(item.product.price)} = *${formatFDJ(itemTotal)}*\n\n`;
  });

  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📊 *RÉCAPITULATIF FINANCIER :*\n`;
  msg += `• Sous-total articles : ${formatFDJ(subtotal)}\n`;
  if (deliveryZone) {
    msg += `• Frais de livraison (${deliveryZone.name}) : ${formatFDJ(deliveryFee)}\n`;
  } else if (deliveryFee > 0) {
    msg += `• Frais de livraison : ${formatFDJ(deliveryFee)}\n`;
  } else {
    msg += `• Livraison : Calculée selon votre quartier à Djibouti\n`;
  }
  msg += `💰 *MONTANT TOTAL À PAYER :* *${formatFDJ(total)}*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  msg += `📍 *INFORMATIONS DE LIVRAISON :*\n`;
  msg += `👤 *Nom & Prénom :* ${customerInfo?.name || ''}\n`;
  msg += `📞 *Téléphone :* ${customerInfo?.phone || ''}\n`;
  msg += `🏙️ *Quartier à Djibouti :* ${customerInfo?.district || (deliveryZone?.name || '')}\n`;
  msg += `🏠 *Adresse / Repère :* ${customerInfo?.address || ''}\n`;
  msg += `💳 *Mode de paiement :* ${
    customerInfo?.paymentMethod === 'd_money'
      ? 'D-Money'
      : customerInfo?.paymentMethod === 'waafi'
      ? 'Waafi'
      : customerInfo?.paymentMethod === 'cash_on_delivery'
      ? 'Espèces à la livraison'
      : '[ ] Espèces à la livraison  [ ] D-Money  [ ] Waafi'
  }\n`;
  if (customerInfo?.notes) {
    msg += `📝 *Remarques :* ${customerInfo.notes}\n`;
  }

  msg += `\nMerci de me confirmer la prise en charge de ma commande et le délai de livraison !`;

  return msg;
}

/**
 * Generate WhatsApp message URL for cart checkout
 */
export function generateCartWhatsAppUrl(params: {
  cart: CartItem[];
  subtotal: number;
  deliveryFee?: number;
  total: number;
  deliveryZone?: DeliveryZone;
  settings?: StoreSettings | null;
  customerInfo?: {
    name?: string;
    phone?: string;
    district?: string;
    address?: string;
    paymentMethod?: string;
    notes?: string;
  };
}): string {
  const { settings } = params;
  const waNumber = getCleanWhatsAppNumber(settings);
  const msg = generateCartWhatsAppText(params);
  return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
}

/**
 * Helper to convert an image URL or data URI to a File object for native Web Share API
 */
async function fetchImageAsFile(imageUrl: string, filename = 'produit-djiaccess.jpg'): Promise<File | null> {
  try {
    const res = await fetch(imageUrl, { mode: 'cors' });
    const blob = await res.blob();
    const mimeType = blob.type || 'image/jpeg';
    return new File([blob], filename, { type: mimeType });
  } catch (err) {
    console.warn('[WhatsApp] Impossible de convertir l\'image en fichier pour le partage direct:', err);
    return null;
  }
}

/**
 * Open WhatsApp with photo attached via Web Share API if supported, or fallback to wa.me link
 */
export async function handleWhatsAppOrderWithPhoto(params: {
  product?: Product;
  cart?: CartItem[];
  quantity?: number;
  selectedVariant?: string;
  subtotal?: number;
  deliveryFee?: number;
  total?: number;
  deliveryZone?: DeliveryZone;
  settings?: StoreSettings | null;
  customerInfo?: {
    name?: string;
    phone?: string;
    district?: string;
    address?: string;
    paymentMethod?: string;
    notes?: string;
  };
}): Promise<void> {
  const {
    product,
    cart,
    quantity = 1,
    selectedVariant,
    subtotal = product ? product.price * quantity : 0,
    deliveryFee = 0,
    total = subtotal + deliveryFee,
    deliveryZone,
    settings,
    customerInfo
  } = params;

  let messageText = '';
  let imageUrl = '';
  let waUrl = '';

  if (product) {
    messageText = generateProductWhatsAppText({
      product,
      quantity,
      settings,
      selectedVariant
    });
    imageUrl = product.images?.[0] || '';
    waUrl = generateProductWhatsAppUrl({
      product,
      quantity,
      settings,
      selectedVariant
    });
  } else if (cart && cart.length > 0) {
    messageText = generateCartWhatsAppText({
      cart,
      subtotal,
      deliveryFee,
      total,
      deliveryZone,
      settings,
      customerInfo
    });
    imageUrl = cart[0]?.product?.images?.[0] || '';
    waUrl = generateCartWhatsAppUrl({
      cart,
      subtotal,
      deliveryFee,
      total,
      deliveryZone,
      settings,
      customerInfo
    });
  }

  // 1. Try sharing image file directly with text caption on supported mobile devices
  if (imageUrl && typeof navigator !== 'undefined' && navigator.share && navigator.canShare) {
    try {
      const file = await fetchImageAsFile(imageUrl, `${product?.name || 'commande-djiaccess'}.jpg`);
      if (file && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Commande ${settings?.storeName || 'DjiAccess'}`,
          text: messageText,
          files: [file]
        });
        return;
      }
    } catch (err: any) {
      // User cancelled share sheet or browser prevented it
      if (err?.name === 'AbortError') {
        return;
      }
      console.warn('[WhatsApp] Web share error, fallback to direct link', err);
    }
  }

  // 2. Direct fallback to WhatsApp URL scheme
  if (waUrl) {
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  }
}

/**
 * Generate WhatsApp message URL for an existing order confirmation
 */
export function generateOrderWhatsAppUrl(params: {
  order: Order;
  settings?: StoreSettings | null;
}): string {
  const { order, settings } = params;
  const storeName = settings?.storeName || 'DjiAccess';
  const waNumber = getCleanWhatsAppNumber(settings);

  let msg = `📦 *COMMANDE CONFIRMÉE #${order.orderNumber} - ${storeName} (DJIBOUTI 🇩🇯)*\n\n`;
  msg += `Bonjour DjiAccess, j'ai validé ma commande sur votre boutique en ligne :\n\n`;
  msg += `• *Numéro de commande :* #${order.orderNumber}\n`;
  msg += `• *Client :* ${order.customerName} (${order.customerPhone})\n`;
  msg += `• *Quartier / Adresse :* ${order.district} - ${order.address}\n`;
  msg += `• *Mode de paiement :* ${
    order.paymentMethod === 'cash_on_delivery'
      ? 'Espèces à la livraison'
      : order.paymentMethod === 'd_money'
      ? 'D-Money'
      : order.paymentMethod === 'waafi'
      ? 'Waafi'
      : 'Carte bancaire'
  }\n\n`;

  msg += `📋 *DÉTAIL DES ARTICLES :*\n`;
  order.items.forEach((item, index) => {
    msg += `${index + 1}. *${item.productName}*\n`;
    msg += `   • Quantité : ${item.quantity} × ${formatFDJ(item.price)} = ${formatFDJ(item.total)}\n`;
  });

  msg += `\n💰 *MONTANT TOTAL :* *${formatFDJ(order.total)}*\n\n`;
  msg += `Merci de m'informer dès que le coursier est en route !`;

  return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
}

