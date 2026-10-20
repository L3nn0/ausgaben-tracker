import React, { useState } from 'react';
import { X, Plus, Check, Tag } from 'lucide-react';
import IconHelper from './IconHelper';

const COLOR_PALETTE = [
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#10b981', // emerald
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#06b6d4', // cyan
  '#ef4444', // red
  '#f97316', // orange
  '#14b8a6', // teal
  '#64748b', // slate
];

export default function AddExpenseModal({
  isOpen,
  onClose,
  onAddExpense,
  categories = [],
  paymentMethods = [],
  onAddNewCategory,
  initialPaymentMethodId = null,
}) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState(
    initialPaymentMethodId || paymentMethods[0]?.id || ''
  );
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');

  // Inline Quick Add Category state
  const [showQuickAddCat, setShowQuickAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatColor, setNewCatColor] = useState(COLOR_PALETTE[0]);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Handle Quick Add Category
  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      setErrorMsg('Bitte einen Namen für die Kategorie eingeben.');
      return;
    }

    const createdCategory = {
      id: `cat_${Date.now()}`,
      name: newCatName.trim(),
      color: newCatColor,
      icon: 'Tag',
    };

    onAddNewCategory(createdCategory);
    setCategoryId(createdCategory.id);
    setNewCatName('');
    setShowQuickAddCat(false);
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Bitte einen Titel / Artikelnamen eingeben.');
      return;
    }
    const numAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('Bitte einen gültigen Betrag größer als 0 € eingeben.');
      return;
    }
    if (!paymentMethodId) {
      setErrorMsg('Bitte eine Bezahlart wählen.');
      return;
    }

    const newExpense = {
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title: title.trim(),
      amount: numAmount,
      paymentMethodId,
      categoryId: categoryId || categories[0]?.id,
      date: date || new Date().toISOString().split('T')[0],
      note: note.trim(),
    };

    onAddExpense(newExpense);
    // Reset and close
    setTitle('');
    setAmount('');
    setNote('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <Plus size={20} color="#6366f1" />
            Neue Ausgabe hinzufügen
          </h2>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMsg && (
              <div
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* Title / Artikel */}
            <div className="form-group">
              <label className="form-label" htmlFor="expense-title">
                Artikel / Bezeichnung *
              </label>
              <input
                id="expense-title"
                type="text"
                className="form-input"
                placeholder="z.B. Mittagessen, Rewe, Kino, Tanken"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
                required
              />
            </div>

            {/* Amount / Preis */}
            <div className="form-group">
              <label className="form-label" htmlFor="expense-amount">
                Preis / Betrag (€) *
              </label>
              <input
                id="expense-amount"
                type="number"
                step="0.01"
                min="0.01"
                className="form-input"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            {/* Payment Method / Bezahlart */}
            <div className="form-group">
              <label className="form-label" htmlFor="expense-pm">
                Bezahlart *
              </label>
              <select
                id="expense-pm"
                className="form-select"
                value={paymentMethodId}
                onChange={(e) => setPaymentMethodId(e.target.value)}
                required
              >
                {paymentMethods.map((pm) => (
                  <option key={pm.id} value={pm.id}>
                    {pm.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category selection + inline create new category */}
            <div className="form-group">
              <div className="form-label">
                <span>Kategorie</span>
                {!showQuickAddCat && (
                  <button
                    type="button"
                    className="btn-link"
                    onClick={() => setShowQuickAddCat(true)}
                  >
                    + Neue Kategorie erstellen
                  </button>
                )}
              </div>

              {!showQuickAddCat ? (
                <select
                  className="form-select"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              ) : (
                /* Inline Quick Add Category Form */
                <div className="quick-add-cat-box">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#818cf8' }}>
                      Neue Kategorie sofort anlegen:
                    </span>
                    <button
                      type="button"
                      className="close-btn"
                      onClick={() => setShowQuickAddCat(false)}
                      style={{ padding: '2px' }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <input
                    type="text"
                    className="form-input"
                    placeholder="Kategoriename (z.B. Fitness, Urlaub)"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                  />

                  <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                      Farbe wählen:
                    </span>
                    <div className="color-picker-row">
                      {COLOR_PALETTE.map((c) => (
                        <button
                          key={c}
                          type="button"
                          className={`color-chip ${newCatColor === c ? 'selected' : ''}`}
                          style={{ backgroundColor: c }}
                          onClick={() => setNewCatColor(c)}
                        />
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={handleCreateCategory}
                      style={{ flex: 1 }}
                    >
                      <Check size={14} /> Speichern & Wählen
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowQuickAddCat(false)}
                    >
                      Abbrechen
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Date */}
            <div className="form-group">
              <label className="form-label" htmlFor="expense-date">
                Datum
              </label>
              <input
                id="expense-date"
                type="date"
                className="form-input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            {/* Note */}
            <div className="form-group">
              <label className="form-label" htmlFor="expense-note">
                Notiz / Laden (optional)
              </label>
              <input
                id="expense-note"
                type="text"
                className="form-input"
                placeholder="z.B. Notiz oder Ort"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={onClose}
              >
                Abbrechen
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 2 }}
              >
                <Plus size={18} />
                Ausgabe speichern
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
