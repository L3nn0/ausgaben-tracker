import React, { useState, useEffect } from 'react';
import { X, Check, Plus, Edit2, Trash2, Tag } from 'lucide-react';
import IconHelper, { AVAILABLE_ICONS } from './IconHelper';

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

export default function CategoryModal({
  isOpen,
  onClose,
  category = null, // if set, editing mode
  onSaveCategory,
  onDeleteCategory,
  usageCount = 0,
}) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLOR_PALETTE[0]);
  const [icon, setIcon] = useState('Tag');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setColor(category.color || COLOR_PALETTE[0]);
      setIcon(category.icon || 'Tag');
    } else {
      setName('');
      setColor(COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)]);
      setIcon('Tag');
    }
    setErrorMsg('');
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Bitte einen Namen eingeben.');
      return;
    }

    const payload = {
      id: category ? category.id : `cat_${Date.now()}`,
      name: name.trim(),
      color,
      icon,
    };

    onSaveCategory(payload);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <Tag size={20} color={color} />
            {category ? 'Kategorie bearbeiten' : 'Neue Kategorie konfigurieren'}
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
              <label className="form-label">Name der Kategorie *</label>
              <input
                type="text"
                className="form-input"
                placeholder="z.B. Urlaub, Haustiere, Hobbys"
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
              {category && (
                <button
                  type="button"
                  className="btn btn-ghost-danger btn-sm"
                  onClick={() => {
                    if (window.confirm(`Möchtest du die Kategorie "${category.name}" wirklich löschen? (${usageCount} Ausgaben verknüpft)`)) {
                      onDeleteCategory(category.id);
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
