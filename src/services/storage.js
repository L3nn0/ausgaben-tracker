// Storage Service for Expense Tracker PWA

const STORAGE_KEY = 'ausgaben_tracker_pwa_data_v1';

export const DEFAULT_PAYMENT_METHODS = [
  { id: 'pm_bar', name: 'Bar', color: '#10b981', icon: 'Banknote' },
  { id: 'pm_kreditkarte', name: 'Kreditkarte', color: '#6366f1', icon: 'CreditCard' },
  { id: 'pm_girocard', name: 'Girocard / EC', color: '#3b82f6', icon: 'CreditCard' },
  { id: 'pm_paypal', name: 'PayPal', color: '#06b6d4', icon: 'Wallet' },
];

export const DEFAULT_CATEGORIES = [
  { id: 'cat_lebensmittel', name: 'Lebensmittel & Supermarkt', color: '#f59e0b', icon: 'ShoppingBag' },
  { id: 'cat_haushalt', name: 'Haushalt & Wohnen', color: '#3b82f6', icon: 'Home' },
  { id: 'cat_mobilitaet', name: 'Mobilität & Tanken', color: '#0ea5e9', icon: 'Car' },
  { id: 'cat_freizeit', name: 'Freizeit & Restaurant', color: '#8b5cf6', icon: 'Coffee' },
  { id: 'cat_shopping', name: 'Shopping & Kleidung', color: '#ec4899', icon: 'Tag' },
  { id: 'cat_gesundheit', name: 'Gesundheit & Drogerie', color: '#ef4444', icon: 'Heart' },
  { id: 'cat_sonstiges', name: 'Sonstiges', color: '#64748b', icon: 'MoreHorizontal' },
];

export const DEFAULT_STORES = [
  { id: 'store_rewe', name: 'Rewe', color: '#ef4444', icon: 'Store' },
  { id: 'store_edeka', name: 'Edeka', color: '#f59e0b', icon: 'Store' },
  { id: 'store_lidl', name: 'Lidl', color: '#3b82f6', icon: 'Store' },
  { id: 'store_aldi', name: 'Aldi', color: '#0ea5e9', icon: 'Store' },
  { id: 'store_amazon', name: 'Amazon', color: '#f97316', icon: 'Store' },
  { id: 'store_dm', name: 'dm Drogerie', color: '#8b5cf6', icon: 'Store' },
  { id: 'store_aral', name: 'Aral', color: '#10b981', icon: 'Store' },
  { id: 'store_ikea', name: 'IKEA', color: '#eab308', icon: 'Store' },
];

export const INITIAL_SAMPLE_EXPENSES = [
  {
    id: 'exp_1',
    title: 'Wocheneinkauf',
    amount: 54.30,
    paymentMethodId: 'pm_girocard',
    categoryId: 'cat_lebensmittel',
    storeId: 'store_edeka',
    date: new Date().toISOString().split('T')[0],
    note: 'Frisches Obst & Gemüse',
  },
  {
    id: 'exp_2',
    title: 'Kaffee & Snack unterwegs',
    amount: 6.50,
    paymentMethodId: 'pm_bar',
    categoryId: 'cat_freizeit',
    storeId: 'store_rewe',
    date: new Date().toISOString().split('T')[0],
    note: 'Bäckerei im Markt',
  },
  {
    id: 'exp_3',
    title: 'Tanken',
    amount: 72.80,
    paymentMethodId: 'pm_kreditkarte',
    categoryId: 'cat_mobilitaet',
    storeId: 'store_aral',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    note: 'Super E10',
  },
  {
    id: 'exp_4',
    title: 'Online Bestellung',
    amount: 29.99,
    paymentMethodId: 'pm_paypal',
    categoryId: 'cat_shopping',
    storeId: 'store_amazon',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    note: 'Fachbuch & Notizheft',
  },
];

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialData = {
        expenses: INITIAL_SAMPLE_EXPENSES,
        paymentMethods: DEFAULT_PAYMENT_METHODS,
        categories: DEFAULT_CATEGORIES,
        stores: DEFAULT_STORES,
        createdAt: new Date().toISOString(),
      };
      saveData(initialData);
      return initialData;
    }
    const parsed = JSON.parse(raw);
    return {
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
      paymentMethods: Array.isArray(parsed.paymentMethods) && parsed.paymentMethods.length > 0 
        ? parsed.paymentMethods 
        : DEFAULT_PAYMENT_METHODS,
      categories: Array.isArray(parsed.categories) && parsed.categories.length > 0 
        ? parsed.categories 
        : DEFAULT_CATEGORIES,
      stores: Array.isArray(parsed.stores) && parsed.stores.length > 0
        ? parsed.stores
        : DEFAULT_STORES,
      createdAt: parsed.createdAt || new Date().toISOString(),
    };
  } catch (err) {
    console.error('Fehler beim Laden aus localStorage:', err);
    return {
      expenses: [],
      paymentMethods: DEFAULT_PAYMENT_METHODS,
      categories: DEFAULT_CATEGORIES,
      stores: DEFAULT_STORES,
      createdAt: new Date().toISOString(),
    };
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Fehler beim Speichern in localStorage:', err);
  }
}

// Download as JSON Backup
export function downloadBackupJSON(data) {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const dateStr = new Date().toISOString().split('T')[0];
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `ausgaben_backup_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

// Download as CSV (Excel compatible)
export function downloadExpensesCSV(expenses, paymentMethods, categories, stores = []) {
  const pmMap = new Map(paymentMethods.map(pm => [pm.id, pm.name]));
  const catMap = new Map(categories.map(c => [c.id, c.name]));
  const storeMap = new Map(stores.map(s => [s.id, s.name]));

  const headers = ['Datum', 'Artikel / Titel', 'Betrag (€)', 'Geschäft / Verkäufer', 'Bezahlart', 'Kategorie', 'Notiz'];
  
  const rows = expenses.map(e => {
    const pmName = pmMap.get(e.paymentMethodId) || 'Unbekannt';
    const catName = catMap.get(e.categoryId) || 'Ohne Kategorie';
    const storeName = storeMap.get(e.storeId) || '-';
    // Format amount with comma for German Excel
    const amountStr = Number(e.amount).toFixed(2).replace('.', ',');
    const safeTitle = `"${(e.title || '').replace(/"/g, '""')}"`;
    const safeNote = `"${(e.note || '').replace(/"/g, '""')}"`;
    const safeStore = `"${storeName.replace(/"/g, '""')}"`;
    const safePm = `"${pmName.replace(/"/g, '""')}"`;
    const safeCat = `"${catName.replace(/"/g, '""')}"`;
    return [e.date || '', safeTitle, amountStr, safeStore, safePm, safeCat, safeNote].join(';');
  });

  // UTF-8 BOM so Excel opens German Umlauts properly
  const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().split('T')[0];
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ausgaben_export_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount || 0);
}

// Format date
export function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-');
    if (year && month && day) {
      return `${day}.${month}.${year}`;
    }
    const d = new Date(dateStr);
    return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return dateStr;
  }
}
