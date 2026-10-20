import React, { useState } from 'react';
import { X, ArrowLeft, Trash2, Plus, Receipt } from 'lucide-react';
import { formatCurrency, formatDate } from '../services/storage';
import IconHelper from './IconHelper';
import ExpenseItem from './ExpenseItem';

export default function PaymentMethodDetailModal({
  isOpen,
  onClose,
  paymentMethod,
  expenses = [],
  categories = [],
  onDeleteExpense,
  onDeleteAllForMethod,
  onOpenAddExpenseWithMethod,
}) {
  if (!isOpen || !paymentMethod) return null;

  // Filter expenses for this payment method
  const methodExpenses = expenses.filter(
    (e) => e.paymentMethodId === paymentMethod.id
  );

  const totalSum = methodExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  const catMap = new Map(categories.map((c) => [c.id, c]));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '580px', maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="close-btn"
              onClick={onClose}
              title="Zurück"
            >
              <ArrowLeft size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                className="pm-icon-wrap"
                style={{
                  backgroundColor: paymentMethod.color || '#3b82f6',
                  width: '32px',
                  height: '32px',
                }}
              >
                <IconHelper name={paymentMethod.icon || 'CreditCard'} size={18} />
              </div>
              <h2 style={{ fontSize: '1.1rem' }}>{paymentMethod.name}</h2>
            </div>
          </div>

          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Header Card with Sum and Actions */}
          <div className="pm-detail-header" style={{ borderColor: `${paymentMethod.color}40` }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>
                Gesamtsumme dieser Bezahlart:
              </span>
              <div className="pm-detail-sum">{formatCurrency(totalSum)}</div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                {methodExpenses.length} {methodExpenses.length === 1 ? 'Artikel verbucht' : 'Artikel verbucht'}
              </span>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                onOpenAddExpenseWithMethod(paymentMethod.id);
                onClose();
              }}
            >
              <Plus size={16} />
              Ausgabe +
            </button>
          </div>

          {/* Action Row: Delete all for this method */}
          {methodExpenses.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                Verknüpfte Artikel ({methodExpenses.length}):
              </span>
              <button
                type="button"
                className="btn-ghost-danger btn-sm"
                onClick={() => onDeleteAllForMethod(paymentMethod, methodExpenses.length)}
                style={{ borderRadius: '6px', fontSize: '0.75rem', padding: '4px 8px' }}
              >
                <Trash2 size={13} />
                Alle für {paymentMethod.name} löschen
              </button>
            </div>
          )}

          {/* List of articles paid with this payment method */}
          {methodExpenses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Receipt size={26} />
              </div>
              <p>Noch keine Ausgaben mit {paymentMethod.name} bezahlt.</p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  onOpenAddExpenseWithMethod(paymentMethod.id);
                  onClose();
                }}
              >
                <Plus size={16} />
                Erste Ausgabe mit {paymentMethod.name} hinzufügen
              </button>
            </div>
          ) : (
            <div className="expense-list" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
              {methodExpenses.map((expense) => (
                <ExpenseItem
                  key={expense.id}
                  expense={expense}
                  paymentMethod={paymentMethod}
                  category={catMap.get(expense.categoryId)}
                  onDelete={onDeleteExpense}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
