import React, { useState, useEffect } from 'react';
import { X, Check, Trash2, Store } from 'lucide-react';

const COLOR_PALETTE = [
  '#ef4444', // red
  '#f59e0b', // amber
  '#10b981', // emerald
  '#3b82f6', // blue
  '#0ea5e9', // cyan
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#f97316', // orange
  '#14b8a6', // teal
  '#64748b', // slate
];

export default function StoreModal({
  isOpen,
  onClose,
  store = null, // if set, editing
  onSaveStore,
  onDeleteStore,
  usageCount = 0,
}) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLOR_PALETTE[0]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (store) {
      setName(store.name || '');
      setColor(store.color || COLOR_PALETTE[0]);
    } else {
      setName('');
      setColor(COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)]);
    }
    setErrorMsg('');
  }, [store, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Bitte einen Namen für das Geschäft eingeben.');
      return;
    }

    const payload = {
      id: store ? store.id : `store_${Date.now()}`,
      name: name.trim(),
      color,
      icon: 'Store',
    };

    onSaveStore(payload);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <Store size={20} color={color} />
            {store ? 'Geschäft bearbeiten' : 'Neues Geschäft konfigurieren'}
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
              <label className="form-label">Name des Geschäfts / Verkäufers *</label>
              <input
                type="text"
                className="form-input"
                placeholder="z.B. Rewe, Amazon, Bäckerei, Apotheke"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                required
              />
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
              {store && (
                <button
                  type="button"
                  className="btn btn-ghost-danger btn-sm"
                  onClick={() => {
                    if (window.confirm(`Möchtest du das Geschäft "${store.name}" wirklich löschen? (${usageCount} Ausgaben verknüpft)`)) {
                      onDeleteStore(store.id);
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
