import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { formatCurrency } from '../services/storage';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  type = 'single', // 'single' | 'all' | 'payment-method'
  item = null,
  count = 0,
  extraName = '',
}) {
  if (!isOpen) return null;

  let title = 'Löschen bestätigen';
  let description = '';
  let confirmLabel = 'Löschen';

  if (type === 'single' && item) {
    title = 'Ausgabe löschen?';
    description = `Möchtest du "${item.title}" über ${formatCurrency(item.amount)} wirklich entfernen?`;
    confirmLabel = 'Eintrag löschen';
  } else if (type === 'all') {
    title = 'Alle Ausgaben löschen?';
    description = `Möchtest du wirklich alle ${count} Ausgaben gleichzeitig unwiderruflich löschen? Deine konfigurierten Kategorien und Bezahlarten bleiben dabei erhalten.`;
    confirmLabel = `Ja, alle ${count} Ausgaben löschen`;
  } else if (type === 'payment-method') {
    title = `Ausgaben für "${extraName}" löschen?`;
    description = `Möchtest du wirklich alle ${count} Ausgaben dieser Bezahlart entfernen?`;
    confirmLabel = 'Ausgaben dieser Bezahlart löschen';
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ color: '#ef4444' }}>
            <AlertTriangle size={20} color="#ef4444" />
            {title}
          </h2>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
            {description}
          </p>

          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={onClose}
            >
              Abbrechen
            </button>
            <button
              type="button"
              className="btn btn-danger"
              style={{ flex: 1.5 }}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              <Trash2 size={16} />
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
