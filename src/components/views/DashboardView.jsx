import React, { useMemo, useState } from 'react';
import { Plus, ArrowRight, Receipt, CreditCard, PieChart, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '../../services/storage';
import IconHelper from '../IconHelper';
import ExpenseItem from '../ExpenseItem';

export default function DashboardView({
  expenses = [],
  paymentMethods = [],
  categories = [],
  stores = [],
  onSelectPaymentMethod,
  onOpenAddExpense,
  onDeleteExpense,
  onGoToExpenses,
  onSelectExpense,
}) {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const totalSpent = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const averageSpent = expenses.length > 0 ? totalSpent / expenses.length : 0;

  // Pre-calculate sums per payment method
  const pmStats = paymentMethods.map((pm) => {
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

  // Pre-calculate sums per category (including count and percentage)
  const catStats = useMemo(() => {
    return categories
      .map((c) => {
        const cExpenses = expenses.filter((e) => e.categoryId === c.id);
        const sum = cExpenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
        const percentage = totalSpent > 0 ? (sum / totalSpent) * 100 : 0;
        return {
          ...c,
          sum,
          count: cExpenses.length,
          percentage,
        };
      })
      .filter((c) => c.sum > 0)
      .sort((a, b) => b.sum - a.sum);
  }, [categories, expenses, totalSpent]);

  // Recent 5 expenses
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 5);

  const pmMap = useMemo(() => new Map(paymentMethods.map((pm) => [pm.id, pm])), [paymentMethods]);
  const catMap = useMemo(() => new Map(categories.map((c) => [c.id, c])), [categories]);
  const storeMap = useMemo(() => new Map(stores.map((s) => [s.id, s])), [stores]);

  const displayedCategories = showAllCategories ? catStats : catStats.slice(0, 5);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Hero Card */}
      <div className="hero-card">
        <div className="hero-label">Gesamtausgaben</div>
        <div className="hero-amount">{formatCurrency(totalSpent)}</div>
        <div className="hero-stats">
          <div className="hero-stat-item">
            <span className="hero-stat-value">{expenses.length}</span>
            <span className="hero-stat-label">Artikel erfasst</span>
          </div>
          <div className="hero-stat-item" style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
            <span className="hero-stat-value">{formatCurrency(averageSpent)}</span>
            <span className="hero-stat-label">Durchschnitt / Artikel</span>
          </div>
        </div>
      </div>

      {/* Payment Methods Section (Clickable Cards with Sums) */}
      <section>
        <div className="card-title-row">
          <div className="card-title">
            <CreditCard size={18} color="#818cf8" />
            <span>Bezahlarten Übersicht</span>
          </div>
          <span className="card-subtitle">Klicke für alle Artikel</span>
        </div>

        <div className="pm-grid">
          {pmStats.map((pm) => (
            <div
              key={pm.id}
              className="pm-card"
              onClick={() => onSelectPaymentMethod(pm)}
              title={`Klicke, um alle ${pm.count} Artikel mit ${pm.name} anzuzeigen`}
            >
              <div>
                <div className="pm-card-top">
                  <div
                    className="pm-icon-wrap"
                    style={{ backgroundColor: pm.color || '#3b82f6' }}
                  >
                    <IconHelper name={pm.icon || 'CreditCard'} size={18} />
                  </div>
                  <span className="pm-badge-count">{pm.count} Artikel</span>
                </div>
                <div className="pm-name">{pm.name}</div>
                <div className="pm-sum">{formatCurrency(pm.sum)}</div>
              </div>

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
      </section>

      {/* Category breakdown (All categories with total sums & percentages) */}
      {catStats.length > 0 && (
        <section className="card">
          <div className="card-title-row">
            <div className="card-title">
              <PieChart size={18} color="#34d399" />
              <span>Kategorien & Gesamtausgaben</span>
            </div>
            <span className="card-subtitle">{catStats.length} mit Ausgaben</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {displayedCategories.map((c) => (
              <div key={c.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem', marginBottom: '4px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    <span
                      style={{
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        backgroundColor: c.color,
                        flexShrink: 0,
                      }}
                    />
                    <span>{c.name}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 500 }}>
                      ({c.count} {c.count === 1 ? 'Ausgabe' : 'Ausgaben'})
                    </span>
                  </span>
                  <span style={{ color: 'var(--text-main)', fontWeight: 800 }}>
                    {formatCurrency(c.sum)} <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500 }}>({c.percentage.toFixed(1)}%)</span>
                  </span>
                </div>
                <div className="pm-progress-bg" style={{ marginTop: 0, height: '6px' }}>
                  <div
                    className="pm-progress-bar"
                    style={{
                      width: `${c.percentage}%`,
                      backgroundColor: c.color,
                    }}
                  />
                </div>
              </div>
            ))}

            {catStats.length > 5 && (
              <button
                type="button"
                className="btn-link"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  paddingTop: '6px',
                  fontSize: '0.8rem',
                }}
                onClick={() => setShowAllCategories((prev) => !prev)}
              >
                {showAllCategories ? (
                  <>
                    <span>Weniger anzeigen</span>
                    <ChevronUp size={15} />
                  </>
                ) : (
                  <>
                    <span>Alle {catStats.length} Kategorien anzeigen</span>
                    <ChevronDown size={15} />
                  </>
                )}
              </button>
            )}
          </div>
        </section>
      )}

      {/* Recent Expenses */}
      <section>
        <div className="card-title-row">
          <div className="card-title">
            <Receipt size={18} color="#f59e0b" />
            <span>Neueste Ausgaben</span>
          </div>
          {expenses.length > 0 && (
            <button
              type="button"
              className="btn-link"
              onClick={onGoToExpenses}
              style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Alle anzeigen ({expenses.length})
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {recentExpenses.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">
                <Receipt size={24} />
              </div>
              <p>Noch keine Ausgaben eingetragen.</p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onOpenAddExpense}
              >
                <Plus size={16} />
                Erste Ausgabe hinzufügen
              </button>
            </div>
          </div>
        ) : (
          <div className="expense-list">
            {recentExpenses.map((expense) => (
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
      </section>
    </div>
  );
}
