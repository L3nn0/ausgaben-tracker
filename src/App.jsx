import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import './App.css';

import {
  loadData,
  saveData,
  DEFAULT_PAYMENT_METHODS,
  DEFAULT_CATEGORIES,
  DEFAULT_STORES,
} from './services/storage';

import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import AddExpenseModal from './components/AddExpenseModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import PaymentMethodDetailModal from './components/PaymentMethodDetailModal';
import CategoryModal from './components/CategoryModal';
import StoreModal from './components/StoreModal';
import PaymentMethodModal from './components/PaymentMethodModal';

import DashboardView from './components/views/DashboardView';
import ExpensesView from './components/views/ExpensesView';
import PaymentMethodsView from './components/views/PaymentMethodsView';
import SettingsView from './components/views/SettingsView';

export default function App() {
  const [data, setData] = useState(() => loadData());
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modals state
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [initialPmIdForAdd, setInitialPmIdForAdd] = useState(null);

  // Payment Method Drilldown Modal
  const [detailPaymentMethod, setDetailPaymentMethod] = useState(null);

  // Delete Confirmation Modal
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: 'single', // 'single' | 'all' | 'payment-method'
    item: null,
    count: 0,
    extraName: '',
    onConfirm: () => {},
  });

  // Category Configuration Modal
  const [categoryModal, setCategoryModal] = useState({
    isOpen: false,
    category: null,
  });

  // Store Configuration Modal
  const [storeModal, setStoreModal] = useState({
    isOpen: false,
    store: null,
  });

  // Payment Method Configuration Modal
  const [pmModal, setPmModal] = useState({
    isOpen: false,
    paymentMethod: null,
  });

  // Save to localStorage whenever data changes
  const updateData = (newData) => {
    setData(newData);
    saveData(newData);
  };

  const expenses = data.expenses || [];
  const paymentMethods = data.paymentMethods || [];
  const categories = data.categories || [];
  const stores = data.stores || DEFAULT_STORES;

  const totalSpent = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  // Add Expense
  const handleAddExpense = (newExpense) => {
    const updated = {
      ...data,
      expenses: [newExpense, ...expenses],
    };
    updateData(updated);
  };

  // Add / Edit Category
  const handleSaveCategory = (category) => {
    const exists = categories.some((c) => c.id === category.id);
    let updatedCats;
    if (exists) {
      updatedCats = categories.map((c) => (c.id === category.id ? category : c));
    } else {
      updatedCats = [...categories, category];
    }
    updateData({ ...data, categories: updatedCats });
  };

  // Delete Category
  const handleDeleteCategory = (catId) => {
    const updatedCats = categories.filter((c) => c.id !== catId);
    updateData({ ...data, categories: updatedCats });
  };

  // Add / Edit Store (Geschäft / Verkäufer)
  const handleSaveStore = (store) => {
    const exists = stores.some((s) => s.id === store.id);
    let updatedStores;
    if (exists) {
      updatedStores = stores.map((s) => (s.id === store.id ? store : s));
    } else {
      updatedStores = [...stores, store];
    }
    updateData({ ...data, stores: updatedStores });
  };

  // Delete Store
  const handleDeleteStore = (storeId) => {
    const updatedStores = stores.filter((s) => s.id !== storeId);
    updateData({ ...data, stores: updatedStores });
  };

  // Add or Edit Payment Method
  const handleSavePaymentMethod = (pm) => {
    const exists = paymentMethods.some((p) => p.id === pm.id);
    let updatedPms;
    if (exists) {
      updatedPms = paymentMethods.map((p) => (p.id === pm.id ? pm : p));
    } else {
      updatedPms = [...paymentMethods, pm];
    }
    updateData({ ...data, paymentMethods: updatedPms });
  };

  // Delete Payment Method
  const handleDeletePaymentMethod = (pmId) => {
    const updatedPms = paymentMethods.filter((p) => p.id !== pmId);
    updateData({ ...data, paymentMethods: updatedPms });
    if (detailPaymentMethod?.id === pmId) {
      setDetailPaymentMethod(null);
    }
  };

  // Delete single expense
  const handleRequestDeleteExpense = (expense) => {
    setDeleteModal({
      isOpen: true,
      type: 'single',
      item: expense,
      count: 1,
      extraName: '',
      onConfirm: () => {
        const updatedExpenses = expenses.filter((e) => e.id !== expense.id);
        updateData({ ...data, expenses: updatedExpenses });
      },
    });
  };

  // Delete all expenses simultaneously
  const handleRequestDeleteAllExpenses = () => {
    setDeleteModal({
      isOpen: true,
      type: 'all',
      item: null,
      count: expenses.length,
      extraName: '',
      onConfirm: () => {
        updateData({ ...data, expenses: [] });
      },
    });
  };

  // Delete all expenses for a specific payment method
  const handleRequestDeleteAllForMethod = (pm, count) => {
    setDeleteModal({
      isOpen: true,
      type: 'payment-method',
      item: null,
      count,
      extraName: pm.name,
      onConfirm: () => {
        const updatedExpenses = expenses.filter((e) => e.paymentMethodId !== pm.id);
        updateData({ ...data, expenses: updatedExpenses });
      },
    });
  };

  // Restore backup
  const handleRestoreBackup = (importedData) => {
    const merged = {
      expenses: Array.isArray(importedData.expenses) ? importedData.expenses : [],
      paymentMethods:
        Array.isArray(importedData.paymentMethods) && importedData.paymentMethods.length > 0
          ? importedData.paymentMethods
          : DEFAULT_PAYMENT_METHODS,
      categories:
        Array.isArray(importedData.categories) && importedData.categories.length > 0
          ? importedData.categories
          : DEFAULT_CATEGORIES,
      stores:
        Array.isArray(importedData.stores) && importedData.stores.length > 0
          ? importedData.stores
          : DEFAULT_STORES,
      createdAt: importedData.createdAt || new Date().toISOString(),
    };
    updateData(merged);
    alert('Backup erfolgreich wiederhergestellt!');
  };

  // Reset to factory defaults
  const handleResetAll = () => {
    if (
      window.confirm(
        'Möchtest du wirklich alle Daten zurücksetzen? Alle Ausgaben werden gelöscht und Standard-Kategorien, Geschäfte und Bezahlarten wiederhergestellt.'
      )
    ) {
      const initial = {
        expenses: [],
        paymentMethods: DEFAULT_PAYMENT_METHODS,
        categories: DEFAULT_CATEGORIES,
        stores: DEFAULT_STORES,
        createdAt: new Date().toISOString(),
      };
      updateData(initial);
      alert('App wurde auf Werkseinstellungen zurückgesetzt.');
    }
  };

  const openAddExpenseWithMethod = (pmId) => {
    setInitialPmIdForAdd(pmId);
    setIsAddExpenseOpen(true);
  };

  return (
    <div className="app-container">
      {/* Top Header */}
      <Navbar totalSpent={totalSpent} expensesCount={expenses.length} />

      {/* Main View Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <DashboardView
            expenses={expenses}
            paymentMethods={paymentMethods}
            categories={categories}
            stores={stores}
            onSelectPaymentMethod={(pm) => setDetailPaymentMethod(pm)}
            onOpenAddExpense={() => {
              setInitialPmIdForAdd(null);
              setIsAddExpenseOpen(true);
            }}
            onDeleteExpense={handleRequestDeleteExpense}
            onGoToExpenses={() => setActiveTab('expenses')}
          />
        )}

        {activeTab === 'payment-methods' && (
          <PaymentMethodsView
            paymentMethods={paymentMethods}
            expenses={expenses}
            onSelectPaymentMethod={(pm) => setDetailPaymentMethod(pm)}
            onOpenAddPaymentMethod={() => setPmModal({ isOpen: true, paymentMethod: null })}
            onEditPaymentMethod={(pm) => setPmModal({ isOpen: true, paymentMethod: pm })}
            onDeletePaymentMethod={handleDeletePaymentMethod}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpensesView
            expenses={expenses}
            paymentMethods={paymentMethods}
            categories={categories}
            stores={stores}
            onDeleteExpense={handleRequestDeleteExpense}
            onRequestDeleteAll={handleRequestDeleteAllExpenses}
            onOpenAddExpense={() => {
              setInitialPmIdForAdd(null);
              setIsAddExpenseOpen(true);
            }}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            categories={categories}
            paymentMethods={paymentMethods}
            stores={stores}
            expenses={expenses}
            onOpenAddCategory={() => setCategoryModal({ isOpen: true, category: null })}
            onEditCategory={(c) => setCategoryModal({ isOpen: true, category: c })}
            onDeleteCategory={handleDeleteCategory}
            onOpenAddStore={() => setStoreModal({ isOpen: true, store: null })}
            onEditStore={(s) => setStoreModal({ isOpen: true, store: s })}
            onDeleteStore={handleDeleteStore}
            onOpenAddPaymentMethod={() => setPmModal({ isOpen: true, paymentMethod: null })}
            onEditPaymentMethod={(pm) => setPmModal({ isOpen: true, paymentMethod: pm })}
            onDeletePaymentMethod={handleDeletePaymentMethod}
            onRestoreBackup={handleRestoreBackup}
            onResetAll={handleResetAll}
          />
        )}
      </main>

      {/* Floating Action Button (+ Ausgabe) */}
      <div className="fab-container">
        <button
          type="button"
          className="fab-btn"
          onClick={() => {
            setInitialPmIdForAdd(null);
            setIsAddExpenseOpen(true);
          }}
          title="Neue Ausgabe hinzufügen"
        >
          <Plus size={20} strokeWidth={3} />
          <span>Ausgabe</span>
        </button>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Modal: Add Expense */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onAddExpense={handleAddExpense}
        categories={categories}
        paymentMethods={paymentMethods}
        stores={stores}
        onAddNewCategory={handleSaveCategory}
        onAddNewStore={handleSaveStore}
        initialPaymentMethodId={initialPmIdForAdd}
      />

      {/* Modal: Payment Method Detail Drilldown */}
      <PaymentMethodDetailModal
        isOpen={Boolean(detailPaymentMethod)}
        onClose={() => setDetailPaymentMethod(null)}
        paymentMethod={detailPaymentMethod}
        expenses={expenses}
        categories={categories}
        stores={stores}
        onDeleteExpense={handleRequestDeleteExpense}
        onDeleteAllForMethod={handleRequestDeleteAllForMethod}
        onOpenAddExpenseWithMethod={openAddExpenseWithMethod}
      />

      {/* Modal: Delete Confirmation (Single or All) */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={deleteModal.onConfirm}
        type={deleteModal.type}
        item={deleteModal.item}
        count={deleteModal.count}
        extraName={deleteModal.extraName}
      />

      {/* Modal: Category Configuration (Add / Edit) */}
      <CategoryModal
        isOpen={categoryModal.isOpen}
        onClose={() => setCategoryModal({ isOpen: false, category: null })}
        category={categoryModal.category}
        onSaveCategory={handleSaveCategory}
        onDeleteCategory={handleDeleteCategory}
        usageCount={expenses.filter((e) => e.categoryId === categoryModal.category?.id).length}
      />

      {/* Modal: Store Configuration (Add / Edit) */}
      <StoreModal
        isOpen={storeModal.isOpen}
        onClose={() => setStoreModal({ isOpen: false, store: null })}
        store={storeModal.store}
        onSaveStore={handleSaveStore}
        onDeleteStore={handleDeleteStore}
        usageCount={expenses.filter((e) => e.storeId === storeModal.store?.id).length}
      />

      {/* Modal: Payment Method Configuration (Add / Edit) */}
      <PaymentMethodModal
        isOpen={pmModal.isOpen}
        onClose={() => setPmModal({ isOpen: false, paymentMethod: null })}
        paymentMethod={pmModal.paymentMethod}
        onSavePaymentMethod={handleSavePaymentMethod}
        onDeletePaymentMethod={handleDeletePaymentMethod}
        usageCount={
          expenses.filter((e) => e.paymentMethodId === pmModal.paymentMethod?.id).length
        }
      />
    </div>
  );
}
