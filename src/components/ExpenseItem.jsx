import React from 'react';
import { Trash2, Store } from 'lucide-react';
import { formatCurrency, formatDate } from '../services/storage';
import IconHelper from './IconHelper';

export default function ExpenseItem({
  expense,
  paymentMethod,
  category,
  store,
  onDelete,
  onClick,
}) {
  const catColor = category?.color || '#64748b';
  const pmColor = paymentMethod?.color || '#3b82f6';
  const storeColor = store?.color || '#0ea5e9';

  return (
    <div
      className="expense-item"
      onClick={() => onClick && onClick(expense)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      title={onClick ? 'Klicke, um vollständige Details & Notizen anzuzeigen' : ''}
    >
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
            
            {/* Store / Geschäft Badge */}
            {store && (
              <span
                className="badge"
                style={{
                  backgroundColor: `${storeColor}20`,
                  color: storeColor,
                  border: `1px solid ${storeColor}40`,
                  fontWeight: 600,
                }}
                title={`Geschäft: ${store.name}`}
              >
                <Store size={12} />
                {store.name}
              </span>
            )}

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
          onClick={(e) => {
            e.stopPropagation();
            onDelete(expense);
          }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
