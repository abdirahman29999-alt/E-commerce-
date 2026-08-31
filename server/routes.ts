import { Router, Request, Response } from 'express';
import { db } from './db';
import { handleLogin, requireAdminAuth, AuthenticatedRequest } from './auth';

export const apiRouter = Router();

// ===================== HEALTH =====================
apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ===================== AUTH =====================
apiRouter.post('/auth/login', handleLogin);

apiRouter.get('/auth/me', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({ user: req.user });
});

// ===================== STORE SETTINGS =====================
apiRouter.get('/settings', (req, res) => {
  const settings = db.getSettings();
  res.json(settings);
});

apiRouter.put('/settings', requireAdminAuth, (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

// ===================== CATEGORIES =====================
apiRouter.get('/categories', (req, res) => {
  const categories = db.getCategories();
  res.json(categories);
});

apiRouter.post('/categories', requireAdminAuth, (req, res) => {
  const { name, description, icon, image } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Le nom de la catégorie est obligatoire.' });
  }
  const category = db.createCategory({
    name,
    slug: req.body.slug,
    description,
    icon: icon || 'Tag',
    image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
    isActive: req.body.isActive !== undefined ? req.body.isActive : true
  });
  res.status(201).json(category);
});

apiRouter.put('/categories/:id', requireAdminAuth, (req, res) => {
  const updated = db.updateCategory(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Catégorie non trouvée.' });
  }
  res.json(updated);
});

apiRouter.delete('/categories/:id', requireAdminAuth, (req, res) => {
  const success = db.deleteCategory(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Catégorie non trouvée.' });
  }
  res.json({ success: true, message: 'Catégorie supprimée.' });
});

// ===================== PRODUCTS =====================
apiRouter.get('/products', (req, res) => {
  const {
    category,
    search,
    status,
    isPromo,
    isFeatured,
    isNew,
    minPrice,
    maxPrice,
    sort,
    includeArchived
  } = req.query;

  const products = db.getProducts({
    categoryId: category as string,
    search: search as string,
    status: status as string,
    isPromo: isPromo === 'true',
    isFeatured: isFeatured === 'true',
    isNew: isNew === 'true',
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    sort: sort as any,
    includeArchived: includeArchived === 'true'
  });

  res.json(products);
});

apiRouter.get('/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Produit non trouvé.' });
  }
  res.json(product);
});

apiRouter.get('/products/slug/:slug', (req, res) => {
  const product = db.getProductBySlug(req.params.slug);
  if (!product) {
    return res.status(404).json({ error: 'Produit non trouvé.' });
  }
  res.json(product);
});

apiRouter.post('/products', requireAdminAuth, (req, res) => {
  const { name, price, stock, categoryId, description, images } = req.body;
  if (!name || price === undefined || stock === undefined || !categoryId) {
    return res.status(400).json({ error: 'Veuillez remplir tous les champs obligatoires (nom, prix, stock, catégorie).' });
  }

  const newProduct = db.createProduct({
    name,
    slug: req.body.slug,
    sku: req.body.sku || `DJI-${Math.floor(1000 + Math.random() * 9000)}`,
    price: Number(price),
    compareAtPrice: req.body.compareAtPrice ? Number(req.body.compareAtPrice) : undefined,
    discountPercent: req.body.discountPercent ? Number(req.body.discountPercent) : undefined,
    stock: Number(stock),
    lowStockThreshold: req.body.lowStockThreshold ? Number(req.body.lowStockThreshold) : 5,
    categoryId,
    description: description || '',
    images: images && images.length ? images : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
    status: req.body.status || 'active',
    isFeatured: req.body.isFeatured || false,
    isNew: req.body.isNew || false,
    isPromo: req.body.isPromo || false,
    rating: 5.0,
    reviewsCount: 0,
    tags: req.body.tags || []
  });

  res.status(201).json(newProduct);
});

apiRouter.put('/products/:id', requireAdminAuth, (req, res) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Produit non trouvé.' });
  }
  res.json(updated);
});

apiRouter.delete('/products/:id', requireAdminAuth, (req, res) => {
  const permanent = req.query.permanent === 'true';
  const success = db.deleteProduct(req.params.id, permanent);
  if (!success) {
    return res.status(404).json({ error: 'Produit non trouvé.' });
  }
  res.json({ success: true, message: permanent ? 'Produit définitivement supprimé.' : 'Produit archivé.' });
});

// ===================== DELIVERY ZONES =====================
apiRouter.get('/delivery-zones', (req, res) => {
  const zones = db.getDeliveryZones();
  res.json(zones);
});

apiRouter.put('/delivery-zones', requireAdminAuth, (req, res) => {
  const zones = db.saveDeliveryZones(req.body);
  res.json(zones);
});

// ===================== PROMOTIONS =====================
apiRouter.get('/promotions', (req, res) => {
  const promos = db.getPromotions();
  res.json(promos);
});

apiRouter.post('/promotions/validate', (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Code promo requis.' });
  }
  const promos = db.getPromotions();
  const promo = promos.find((p) => p.code.toUpperCase() === code.trim().toUpperCase() && p.isActive);

  if (!promo) {
    return res.status(404).json({ error: 'Ce code promo n\'existe pas ou a expiré.' });
  }

  if (subtotal && subtotal < promo.minOrderAmount) {
    return res.status(400).json({
      error: `Ce code promo nécessite un montant minimum d'achat de ${promo.minOrderAmount.toLocaleString('fr-FR')} FDJ.`
    });
  }

  let discountAmount = 0;
  if (promo.discountType === 'percentage') {
    discountAmount = Math.round(((subtotal || 0) * promo.discountValue) / 100);
  } else {
    discountAmount = promo.discountValue;
  }

  res.json({
    valid: true,
    promo,
    discountAmount
  });
});

apiRouter.post('/promotions', requireAdminAuth, (req, res) => {
  const newPromo = db.createPromotion(req.body);
  res.status(201).json(newPromo);
});

apiRouter.put('/promotions/:id', requireAdminAuth, (req, res) => {
  const updated = db.updatePromotion(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Promotion non trouvée.' });
  res.json(updated);
});

apiRouter.delete('/promotions/:id', requireAdminAuth, (req, res) => {
  const success = db.deletePromotion(req.params.id);
  if (!success) return res.status(404).json({ error: 'Promotion non trouvée.' });
  res.json({ success: true });
});

// ===================== ORDERS =====================
apiRouter.get('/orders', requireAdminAuth, (req, res) => {
  const { status, search } = req.query;
  const orders = db.getOrders({
    status: status as any,
    search: search as string
  });
  res.json(orders);
});

apiRouter.get('/orders/:idOrNumber', (req, res) => {
  const order = db.getOrderById(req.params.idOrNumber);
  if (!order) {
    return res.status(404).json({ error: 'Commande non trouvée. Veuillez vérifier votre numéro de commande.' });
  }
  res.json(order);
});

apiRouter.post('/orders', (req, res) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      district,
      address,
      city,
      deliveryNotes,
      deliveryZoneId,
      paymentMethod,
      items,
      couponCode
    } = req.body;

    if (!customerName || !customerPhone || !district || !address || !items || !items.length) {
      return res.status(400).json({ error: 'Veuillez renseigner tous les champs obligatoires (nom, téléphone, quartier, adresse, articles).' });
    }

    const order = db.createOrder({
      customerName,
      customerPhone,
      customerEmail,
      district,
      address,
      city,
      deliveryNotes,
      deliveryZoneId,
      paymentMethod: paymentMethod || 'cash_on_delivery',
      items,
      couponCode
    });

    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Impossible de créer la commande.' });
  }
});

apiRouter.patch('/orders/:id/status', requireAdminAuth, (req, res) => {
  const { status, note } = req.body;
  if (!status) {
    return res.status(400).json({ error: 'Nouveau statut requis.' });
  }

  const updated = db.updateOrderStatus(req.params.id, status, note);
  if (!updated) {
    return res.status(404).json({ error: 'Commande non trouvée.' });
  }

  res.json(updated);
});

// ===================== CUSTOMERS =====================
apiRouter.get('/customers', requireAdminAuth, (req, res) => {
  const customers = db.getCustomers();
  res.json(customers);
});

// ===================== DASHBOARD STATS =====================
apiRouter.get('/stats', requireAdminAuth, (req, res) => {
  const stats = db.getDashboardStats();
  res.json(stats);
});

// ===================== RESET / SEED =====================
apiRouter.post('/seed/reset', requireAdminAuth, (req, res) => {
  db.resetDatabase();
  res.json({ success: true, message: 'Base de données réinitialisée avec les données de démonstration de Djibouti.' });
});
