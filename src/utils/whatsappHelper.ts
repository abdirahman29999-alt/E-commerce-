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
 * Generate WhatsApp message URL for a single product order
 */
export function generateProductWhatsAppUrl(params: {
  product: Product;
  quantity?: number;
  settings?: StoreSettings | null;
  selectedVariant?: string;
}): string {
  const { product, quantity = 1, settings, selectedVariant } = params;
  const storeName = settings?.storeName || 'DjiAccess Boutique';
  const waNumber = getCleanWhatsAppNumber(settings);

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : '';
  const totalAmount = formatFDJ(product.price * quantity);
  const cleanDescription = product.description
    ? product.description.replace(/<[^>]*>?/gm, '').trim()
    : 'Accessoire de haute qualité garanti.';

  let msg = `🛍️ *COMMANDE - ${storeName} (DJIBOUTI)*\n\n`;
  msg += `Bonjour, je souhaite commander l'accessoire suivant :\n\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📦 *PRODUIT :* ${product.name}\n`;
  msg += `🏷️ *Réf / SKU :* ${product.sku || 'DJI-ACC'}\n`;
  if (product.categoryName) {
    msg += `📁 *Catégorie :* ${product.categoryName}\n`;
  }
  if (selectedVariant) {
    msg += `🎨 *Option / Modèle :* ${selectedVariant}\n`;
  }
  msg += `💵 *Prix unitaire :* ${formatFDJ(product.price)}\n`;
  msg += `🔢 *Quantité :* ${quantity}\n`;
  msg += `💰 *MONTANT TOTAL :* *${totalAmount}*\n\n`;

  msg += `📝 *DÉTAIL & DESCRIPTION :*\n`;
  msg += `${cleanDescription}\n\n`;

  if (mainImage) {
    msg += `🖼️ *PHOTO DU PRODUIT :*\n${mainImage}\n\n`;
  }

  if (product.images && product.images.length > 1) {
    msg += `📷 *Autres photos :*\n`;
    product.images.slice(1, 4).forEach((img, idx) => {
      msg += `• Vue ${idx + 2} : ${img}\n`;
    });
    msg += `\n`;
  }

  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📍 *MES COORDONNÉES DE LIVRAISON (À compléter) :*\n`;
  msg += `👤 *Nom & Prénom :* \n`;
  msg += `📞 *Téléphone :* \n`;
  msg += `🏙️ *Quartier à Djibouti :* (ex: Héron, Balbala, Centre-Ville, etc.)\n`;
  msg += `🏠 *Adresse / Repère :* \n`;
  msg += `💳 *Mode de paiement :* [ ] Espèces à la livraison  [ ] D-Money  [ ] Waafi\n\n`;
  msg += `Merci de me confirmer la disponibilité et le délai de livraison !`;

  return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
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
  const { cart, subtotal, deliveryFee = 0, total, deliveryZone, settings, customerInfo } = params;
  const storeName = settings?.storeName || 'DjiAccess Boutique';
  const waNumber = getCleanWhatsAppNumber(settings);

  let msg = `🛍️ *NOUVELLE COMMANDE - ${storeName}*\n\n`;
  msg += `Bonjour, je souhaite valider la commande de mon panier :\n\n`;
  msg += `📋 *RÉCAPITULATIF DES ARTICLES (${cart.length}) :*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;

  cart.forEach((item, index) => {
    const itemTotal = item.product.price * item.quantity;
    const photo = item.product.images?.[0] || '';
    const desc = item.product.description
      ? item.product.description.replace(/<[^>]*>?/gm, '').slice(0, 120) + '...'
      : '';

    msg += `*${index + 1}. ${item.product.name}*\n`;
    msg += `   • Réf : ${item.product.sku || 'DJI-ACC'}\n`;
    msg += `   • Quantité : ${item.quantity} x ${formatFDJ(item.product.price)} = *${formatFDJ(itemTotal)}*\n`;
    if (desc) {
      msg += `   • Détail : ${desc}\n`;
    }
    if (photo) {
      msg += `   • 🖼️ Photo : ${photo}\n`;
    }
    msg += `\n`;
  });

  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📊 *TOTAL COMMANDE :*\n`;
  msg += `• Sous-total : ${formatFDJ(subtotal)}\n`;
  if (deliveryZone) {
    msg += `• Livraison (${deliveryZone.name}) : ${formatFDJ(deliveryFee)}\n`;
  } else if (deliveryFee > 0) {
    msg += `• Livraison estimée : ${formatFDJ(deliveryFee)}\n`;
  }
  msg += `💰 *TOTAL À PAYER :* *${formatFDJ(total)}*\n\n`;

  msg += `📍 *INFORMATIONS DE LIVRAISON :*\n`;
  msg += `👤 *Nom :* ${customerInfo?.name || ''}\n`;
  msg += `📞 *Téléphone :* ${customerInfo?.phone || ''}\n`;
  msg += `🏙️ *Quartier :* ${customerInfo?.district || (deliveryZone?.name || '')}\n`;
  msg += `🏠 *Adresse / Repère :* ${customerInfo?.address || ''}\n`;
  if (customerInfo?.paymentMethod) {
    msg += `💳 *Paiement :* ${customerInfo.paymentMethod}\n`;
  }
  if (customerInfo?.notes) {
    msg += `📝 *Instructions :* ${customerInfo.notes}\n`;
  }

  msg += `\nMerci de me confirmer la prise en charge de ma commande !`;

  return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
}

/**
 * Generate WhatsApp message URL for an existing order confirmation
 */
export function generateOrderWhatsAppUrl(params: {
  order: Order;
  settings?: StoreSettings | null;
}): string {
  const { order, settings } = params;
  const storeName = settings?.storeName || 'DjiAccess Boutique';
  const waNumber = getCleanWhatsAppNumber(settings);

  let msg = `📦 *COMMANDE CONFIRMÉE #${order.orderNumber} - ${storeName}*\n\n`;
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
    msg += `   • Quantité : ${item.quantity} x ${formatFDJ(item.price)} = ${formatFDJ(item.total)}\n`;
    if (item.image) {
      msg += `   • 🖼️ Photo : ${item.image}\n`;
    }
  });

  msg += `\n💰 *MONTANT TOTAL :* *${formatFDJ(order.total)}*\n\n`;
  msg += `Merci de m'informer dès que le coursier est en route !`;

  return `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
}
