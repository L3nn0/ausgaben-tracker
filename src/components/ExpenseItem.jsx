import React from 'react';
import { Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '../services/storage';
import IconHelper from './IconHelper';

export default function ExpenseItem({
  expense,
  paymentMethod,
  category,
  onDelete,
}) {
  const catColor = category?.color || '#64748b';
  const pmColor = paymentMethod?.color || '#3b82f6';

  return (
    <div className="expense-item">
      <div className="expense-left">
        <span
          className="cat-color-dot"
          style={{ backgroundColor: catColor }}
          title={category?.name || 'Kategorie'}
        />
        <div className="expense-info">
          <div className="expense-title">{expense.title}</div>
          <div className="expense-meta">
            <span>{formatDate(expense.date)}</span>
            
            {/* Category Badge */}
            <span
              className="badge"
              style={{
                backgroundColor: `${catColor}20`,
                color: catColor,
                border: `1px solid ${catColor}40`,
              }}
            >
              {category?.name || 'Allgemein'}
            </span>

            {/* Payment Method Badge */}
            <span
              className="badge"
              style={{
                backgroundColor: `${pmColor}20`,
                color: pmColor,
                border: `1px solid ${pmColor}40`,
              }}
            >
              <IconHelper name={paymentMethod?.icon || 'CreditCard'} size={12} />
              {paymentMethod?.name || 'Bezahlart'}
            </span>

            {expense.note && (
              <span style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>
                • {expense.note}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="expense-right">
        <span className="expense-amount">{formatCurrency(expense.amount)}</span>
        <button
          type="button"
          className="delete-btn"
          title="Ausgabe löschen"
          onClick={() => onDelete(expense)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
