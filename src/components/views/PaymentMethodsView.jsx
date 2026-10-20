import React, { useState } from 'react';
import { Plus, CreditCard, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import { formatCurrency } from '../../services/storage';
import IconHelper from '../IconHelper';

export default function PaymentMethodsView({
  paymentMethods = [],
  expenses = [],
  onSelectPaymentMethod,
  onOpenAddPaymentMethod,
  onEditPaymentMethod,
  onDeletePaymentMethod,
}) {
  const totalSpent = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const stats = paymentMethods.map((pm) => {
    const pmExpenses = expenses.filter((e) => e.paymentMethodId === pm.id);
    const sum = pmExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const percentage = totalSpent > 0 ? (sum / totalSpent) * 100 : 0;
    return {
      ...pm,
      sum,
      count: pmExpenses.length,
      percentage,
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header with action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>
            Bezahlarten & Summen
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Klicke auf eine Bezahlart, um alle zugehörigen Artikel zu sehen
          </span>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={onOpenAddPaymentMethod}
        >
          <Plus size={16} />
          Neu konfigurieren
        </button>
      </div>

      {/* List of Payment Methods */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {stats.map((pm) => (
          <div
            key={pm.id}
            className="card"
            style={{
              cursor: 'pointer',
              borderLeft: `4px solid ${pm.color || '#3b82f6'}`,
              transition: 'transform 0.15s ease, background-color 0.15s ease',
            }}
            onClick={() => onSelectPaymentMethod(pm)}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  className="pm-icon-wrap"
                  style={{ backgroundColor: pm.color || '#3b82f6' }}
                >
                  <IconHelper name={pm.icon || 'CreditCard'} size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>
                    {pm.name}
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {pm.count} {pm.count === 1 ? 'Artikel' : 'Artikel'} verbucht
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {formatCurrency(pm.sum)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {pm.percentage.toFixed(1)}% aller Ausgaben
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginLeft: '8px',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="delete-btn"
                    title="Bezahlart bearbeiten"
                    onClick={() => onEditPaymentMethod(pm)}
                  >
                    <Edit2 size={15} />
                  </button>
                </div>

                <ChevronRight size={18} color="var(--text-dim)" />
              </div>
            </div>

            {/* Percentage Bar */}
            <div className="pm-progress-bg">
              <div
                className="pm-progress-bar"
                style={{
                  width: `${pm.percentage}%`,
                  backgroundColor: pm.color || '#3b82f6',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
