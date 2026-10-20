import React, { useState, useEffect } from 'react';
import { X, Check, Trash2, CreditCard } from 'lucide-react';
import IconHelper from './IconHelper';

const COLOR_PALETTE = [
  '#10b981', // emerald (Cash/Bar)
  '#6366f1', // indigo
  '#3b82f6', // blue (Girocard)
  '#06b6d4', // cyan (PayPal)
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#ef4444', // red
];

const ICONS = ['Banknote', 'CreditCard', 'Wallet', 'Smartphone', 'CircleDollarSign'];

export default function PaymentMethodModal({
  isOpen,
  onClose,
  paymentMethod = null,
  onSavePaymentMethod,
  onDeletePaymentMethod,
  usageCount = 0,
}) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLOR_PALETTE[0]);
  const [icon, setIcon] = useState('CreditCard');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (paymentMethod) {
      setName(paymentMethod.name || '');
      setColor(paymentMethod.color || COLOR_PALETTE[0]);
      setIcon(paymentMethod.icon || 'CreditCard');
    } else {
      setName('');
      setColor(COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)]);
      setIcon('CreditCard');
    }
    setErrorMsg('');
  }, [paymentMethod, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Bitte einen Namen für die Bezahlart eingeben.');
      return;
    }

    const payload = {
      id: paymentMethod ? paymentMethod.id : `pm_${Date.now()}`,
      name: name.trim(),
      color,
      icon,
    };

    onSavePaymentMethod(payload);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <CreditCard size={20} color={color} />
            {paymentMethod ? 'Bezahlart bearbeiten' : 'Neue Bezahlart konfigurieren'}
          </h2>
          <button type="button" className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMsg && (
              <div style={{ color: '#ef4444', fontSize: '0.85rem' }}>{errorMsg}</div>
            )}

            <div className="form-group">
              <label className="form-label">Name der Bezahlart *</label>
              <input
                type="text"
                className="form-input"
                placeholder="z.B. Bar, Mastercard, Amex, Apple Pay, PayPal"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Symbol / Icon</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    className={`btn ${icon === ic ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '8px 12px' }}
                    onClick={() => setIcon(ic)}
                  >
                    <IconHelper name={ic} size={18} />
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Farbe wählen</label>
              <div className="color-picker-row">
                {COLOR_PALETTE.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`color-chip ${color === c ? 'selected' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              {paymentMethod && (
                <button
                  type="button"
                  className="btn btn-ghost-danger btn-sm"
                  onClick={() => {
                    if (
                      window.confirm(
                        `Möchtest du die Bezahlart "${paymentMethod.name}" wirklich löschen? (${usageCount} verknüpfte Ausgaben)`
                      )
                    ) {
                      onDeletePaymentMethod(paymentMethod.id);
                      onClose();
                    }
                  }}
                >
                  <Trash2 size={16} />
                  Löschen
                </button>
              )}
              <div style={{ flex: 1 }} />
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Abbrechen
              </button>
              <button type="submit" className="btn btn-primary">
                <Check size={16} />
                Speichern
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
