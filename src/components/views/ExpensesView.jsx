import React, { useState, useMemo } from 'react';
import { Search, Filter, Trash2, Plus, Receipt } from 'lucide-react';
import { formatCurrency } from '../../services/storage';
import ExpenseItem from '../ExpenseItem';

export default function ExpensesView({
  expenses = [],
  paymentMethods = [],
  categories = [],
  stores = [],
  onDeleteExpense,
  onRequestDeleteAll,
  onOpenAddExpense,
  onSelectExpense,
}) {
  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => (a.name || '').localeCompare(b.name || '', 'de')),
    [categories]
  );

  const sortedStores = useMemo(
    () => [...stores].sort((a, b) => (a.name || '').localeCompare(b.name || '', 'de')),
    [stores]
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPm, setSelectedPm] = useState('all');
  const [selectedCat, setSelectedCat] = useState('all');
  const [selectedStore, setSelectedStore] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');

  const pmMap = useMemo(() => new Map(paymentMethods.map((pm) => [pm.id, pm])), [paymentMethods]);
  const catMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);
  const storeMap = useMemo(() => new Map(stores.map((s) => [s.id, s])), [stores]);

  // Filtered & sorted expenses
  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((e) => {
        const storeName = storeMap.get(e.storeId)?.name || '';

        // Search filter: matches title, note, or store name
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchTitle = (e.title || '').toLowerCase().includes(query);
          const matchNote = (e.note || '').toLowerCase().includes(query);
          const matchStore = storeName.toLowerCase().includes(query);
          if (!matchTitle && !matchNote && !matchStore) return false;
        }

        // Store filter
        if (selectedStore !== 'all') {
          if (selectedStore === 'none' && e.storeId) return false;
          if (selectedStore !== 'none' && e.storeId !== selectedStore) return false;
        }

        // Payment method filter
        if (selectedPm !== 'all' && e.paymentMethodId !== selectedPm) {
          return false;
        }

        // Category filter
        if (selectedCat !== 'all' && e.categoryId !== selectedCat) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.date || 0) - new Date(a.date || 0);
        }
        if (sortBy === 'date-asc') {
          return new Date(a.date || 0) - new Date(b.date || 0);
        }
        if (sortBy === 'amount-desc') {
          return (Number(b.amount) || 0) - (Number(a.amount) || 0);
        }
        if (sortBy === 'amount-asc') {
          return (Number(a.amount) || 0) - (Number(b.amount) || 0);
        }
        return 0;
      });
  }, [expenses, searchTerm, selectedStore, selectedPm, selectedCat, sortBy, storeMap]);

  const filteredTotal = filteredExpenses.reduce(
    (sum, e) => sum + (Number(e.amount) || 0),
    0
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Search & Filter Bar */}
      <div className="search-filter-card">
        <div className="search-input-wrap">
          <Search size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Artikel, Geschäft oder Notiz suchen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-row">
          {/* Store / Geschäft filter */}
          <select
            className="filter-select"
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
          >
            <option value="all">Alle Geschäfte</option>
            {sortedStores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
            <option value="none">Ohne Geschäft</option>
          </select>

          {/* Category filter */}
          <select
            className="filter-select"
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
          >
            <option value="all">Alle Kategorien</option>
            {sortedCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Payment Method filter */}
          <select
            className="filter-select"
            value={selectedPm}
            onChange={(e) => setSelectedPm(e.target.value)}
          >
            <option value="all">Alle Bezahlarten</option>
            {paymentMethods.map((pm) => (
              <option key={pm.id} value={pm.id}>
                {pm.name}
              </option>
            ))}
          </select>

          {/* Sort order */}
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-desc">Datum (Neueste)</option>
            <option value="date-asc">Datum (Älteste)</option>
            <option value="amount-desc">Betrag (Höchster)</option>
            <option value="amount-asc">Betrag (Niedrigster)</option>
          </select>
        </div>
      </div>

      {/* Action Header: Results Count + Bulk Delete */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          padding: '0 4px',
        }}
      >
        <div>
          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
            {filteredExpenses.length} {filteredExpenses.length === 1 ? 'Artikel' : 'Artikel'}
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
            • Summe: <strong style={{ color: 'var(--text-main)' }}>{formatCurrency(filteredTotal)}</strong>
          </span>
        </div>

        {expenses.length > 0 && (
          <button
            type="button"
            className="btn-ghost-danger btn-sm"
            onClick={onRequestDeleteAll}
            title="Löscht alle gespeicherten Ausgaben auf einmal"
          >
            <Trash2 size={14} />
            Alle {expenses.length} Ausgaben löschen
          </button>
        )}
      </div>

      {/* Expenses List */}
      {filteredExpenses.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">
              <Receipt size={26} />
            </div>
            <p>
              {expenses.length === 0
                ? 'Noch keine Ausgaben vorhanden.'
                : 'Keine Ausgaben für die gewählten Filter gefunden.'}
            </p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={onOpenAddExpense}
            >
              <Plus size={16} />
              Neue Ausgabe hinzufügen
            </button>
          </div>
        </div>
      ) : (
        <div className="expense-list">
          {filteredExpenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              paymentMethod={pmMap.get(expense.paymentMethodId)}
              category={catMap.get(expense.categoryId)}
              store={storeMap.get(expense.storeId)}
              onDelete={onDeleteExpense}
              onClick={onSelectExpense}
            />
          ))}
        </div>
      )}
    </div>
  );
}
