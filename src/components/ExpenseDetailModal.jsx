import React from 'react';
import { X, Calendar, Store, Tag, CreditCard, Trash2, FileText } from 'lucide-react';
import { formatCurrency, formatDate } from '../services/storage';
import IconHelper from './IconHelper';

export default function ExpenseDetailModal({
  isOpen,
  onClose,
  expense,
  category,
  paymentMethod,
  store,
  onDeleteExpense,
}) {
  if (!isOpen || !expense) return null;

  const catColor = category?.color || '#64748b';
  const pmColor = paymentMethod?.color || '#3b82f6';
  const storeColor = store?.color || '#0ea5e9';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '500px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>
            <FileText size={20} color="#6366f1" />
            Ausgabendetails
          </h2>
          <button type="button" className="close-btn" onClick={onClose} title="Schließen">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: '18px' }}>
          {/* Big Amount Card */}
          <div
            style={{
              textAlign: 'center',
              padding: '16px',
              backgroundColor: 'var(--bg-card-subtle)',
              border: '1px solid var(--border-color)',
              borderRadius: '18px',
            }}
          >
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
              Betrag
            </span>
            <div
              style={{
                fontSize: '2.4rem',
                fontWeight: 800,
                color: 'var(--text-main)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              {formatCurrency(expense.amount)}
            </div>
            <div
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-dim)',
                marginTop: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Calendar size={14} />
              <span>{formatDate(expense.date)}</span>
            </div>
          </div>

          {/* Full Title (Non-truncated, wraps gracefully) */}
          <div className="form-group">
            <label className="form-label">Artikel / Bezeichnung</label>
            <div
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                backgroundColor: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '12px 14px',
                wordBreak: 'break-word',
                lineHeight: 1.4,
              }}
            >
              {expense.title}
            </div>
          </div>

          {/* Metadata Grid (Store, Category, Payment Method) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
            {/* Store / Geschäft */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                backgroundColor: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
              }}
            >
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Store size={15} color={storeColor} />
                Geschäft / Verkäufer:
              </span>
              {store ? (
                <span
                  className="badge"
                  style={{
                    backgroundColor: `${storeColor}20`,
                    color: storeColor,
                    border: `1px solid ${storeColor}40`,
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    padding: '4px 10px',
                  }}
                >
                  <Store size={13} />
                  {store.name}
                </span>
              ) : (
                <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>Kein Geschäft zugewiesen</span>
              )}
            </div>

            {/* Category */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                backgroundColor: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
              }}
            >
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Tag size={15} color={catColor} />
                Kategorie:
              </span>
              <span
                className="badge"
                style={{
                  backgroundColor: `${catColor}20`,
                  color: catColor,
                  border: `1px solid ${catColor}40`,
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  padding: '4px 10px',
                }}
              >
                {category?.name || 'Allgemein'}
              </span>
            </div>

            {/* Payment Method */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                backgroundColor: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
              }}
            >
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CreditCard size={15} color={pmColor} />
                Bezahlart:
              </span>
              <span
                className="badge"
                style={{
                  backgroundColor: `${pmColor}20`,
                  color: pmColor,
                  border: `1px solid ${pmColor}40`,
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  padding: '4px 10px',
                }}
              >
                <IconHelper name={paymentMethod?.icon || 'CreditCard'} size={13} />
                {paymentMethod?.name || 'Bezahlart'}
              </span>
            </div>
          </div>

          {/* Full Note / Details (Word-wrapped and complete) */}
          <div className="form-group">
            <label className="form-label">Notiz & Details</label>
            <div
              style={{
                fontSize: '0.92rem',
                color: expense.note ? 'var(--text-main)' : 'var(--text-dim)',
                backgroundColor: 'var(--bg-card-subtle)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '12px 14px',
                wordBreak: 'break-word',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                minHeight: '48px',
              }}
            >
              {expense.note || 'Keine Notiz hinterlegt.'}
            </div>
          </div>

          {/* Bottom Actions */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              type="button"
              className="btn btn-ghost-danger btn-sm"
              style={{ flex: 1 }}
              onClick={() => {
                onClose();
                onDeleteExpense(expense);
              }}
            >
              <Trash2 size={16} />
              Löschen
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{ flex: 2 }}
              onClick={onClose}
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
