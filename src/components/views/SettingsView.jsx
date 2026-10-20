import React, { useRef } from 'react';
import {
  Tag,
  Store,
  CreditCard,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
  FileSpreadsheet,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import {
  downloadBackupJSON,
  downloadExpensesCSV,
} from '../../services/storage';
import IconHelper from '../IconHelper';

export default function SettingsView({
  categories = [],
  paymentMethods = [],
  stores = [],
  expenses = [],
  onOpenAddCategory,
  onEditCategory,
  onDeleteCategory,
  onOpenAddStore,
  onEditStore,
  onDeleteStore,
  onOpenAddPaymentMethod,
  onEditPaymentMethod,
  onDeletePaymentMethod,
  onRestoreBackup,
  onResetAll,
}) {
  const fileInputRef = useRef(null);

  // Calculate usage counts
  const catUsage = new Map();
  const pmUsage = new Map();
  const storeUsage = new Map();
  expenses.forEach((e) => {
    catUsage.set(e.categoryId, (catUsage.get(e.categoryId) || 0) + 1);
    pmUsage.set(e.paymentMethodId, (pmUsage.get(e.paymentMethodId) || 0) + 1);
    if (e.storeId) {
      storeUsage.set(e.storeId, (storeUsage.get(e.storeId) || 0) + 1);
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result);
        if (parsed && (parsed.expenses || parsed.categories || parsed.paymentMethods || parsed.stores)) {
          if (
            window.confirm(
              'Möchtest du dieses Backup wirklich wiederherstellen? Vorhandene Daten werden überschrieben.'
            )
          ) {
            onRestoreBackup(parsed);
          }
        } else {
          alert('Ungültiges Backup-Format.');
        }
      } catch (err) {
        alert('Fehler beim Einlesen der Backup-Datei: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stores Section (Geschäfte & Verkäufer) */}
      <section className="card">
        <div className="card-title-row">
          <div className="card-title">
            <Store size={18} color="#0ea5e9" />
            <span>Geschäfte & Verkäufer konfigurieren</span>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenAddStore}
          >
            <Plus size={14} />
            Neu
          </button>
        </div>

        <div className="settings-group">
          {stores.map((s) => (
            <div key={s.id} className="settings-list-item">
              <div className="settings-list-left">
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: s.color,
                  }}
                />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {storeUsage.get(s.id) || 0} verknüpfte Ausgaben
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  className="delete-btn"
                  title="Bearbeiten"
                  onClick={() => onEditStore(s)}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  type="button"
                  className="delete-btn"
                  title="Löschen"
                  onClick={() => onDeleteStore(s.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="card">
        <div className="card-title-row">
          <div className="card-title">
            <Tag size={18} color="#f59e0b" />
            <span>Kategorien konfigurieren</span>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenAddCategory}
          >
            <Plus size={14} />
            Neu
          </button>
        </div>

        <div className="settings-group">
          {categories.map((c) => (
            <div key={c.id} className="settings-list-item">
              <div className="settings-list-left">
                <span
                  style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: c.color,
                  }}
                />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {catUsage.get(c.id) || 0} verknüpfte Ausgaben
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  className="delete-btn"
                  title="Bearbeiten"
                  onClick={() => onEditCategory(c)}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  type="button"
                  className="delete-btn"
                  title="Löschen"
                  onClick={() => onDeleteCategory(c.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="card">
        <div className="card-title-row">
          <div className="card-title">
            <CreditCard size={18} color="#6366f1" />
            <span>Bezahlarten konfigurieren</span>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onOpenAddPaymentMethod}
          >
            <Plus size={14} />
            Neu
          </button>
        </div>

        <div className="settings-group">
          {paymentMethods.map((pm) => (
            <div key={pm.id} className="settings-list-item">
              <div className="settings-list-left">
                <div
                  className="pm-icon-wrap"
                  style={{
                    backgroundColor: pm.color || '#3b82f6',
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                  }}
                >
                  <IconHelper name={pm.icon || 'CreditCard'} size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>
                    {pm.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {pmUsage.get(pm.id) || 0} verknüpfte Ausgaben
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  type="button"
                  className="delete-btn"
                  title="Bearbeiten"
                  onClick={() => onEditPaymentMethod(pm)}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  type="button"
                  className="delete-btn"
                  title="Löschen"
                  onClick={() => onDeletePaymentMethod(pm.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Data Export & Backup Section */}
      <section className="card">
        <div className="card-title-row">
          <div className="card-title">
            <Download size={18} color="#10b981" />
            <span>Daten herunterladen & Backup</span>
          </div>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
          Deine Daten werden sicher und persistent in deiner PWA (im lokalen Speicher deines Geräts) aufbewahrt. 
          Hier kannst du deine Daten jederzeit als Backup oder für Excel herunterladen.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Download JSON */}
          <button
            type="button"
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start' }}
            onClick={() =>
              downloadBackupJSON({
                expenses,
                paymentMethods,
                categories,
                stores,
                exportedAt: new Date().toISOString(),
              })
            }
          >
            <Download size={16} color="#10b981" />
            <span>Vollständiges Backup herunterladen (JSON)</span>
          </button>

          {/* Download CSV */}
          <button
            type="button"
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start' }}
            onClick={() => downloadExpensesCSV(expenses, paymentMethods, categories, stores)}
          >
            <FileSpreadsheet size={16} color="#3b82f6" />
            <span>Ausgaben für Excel herunterladen (CSV)</span>
          </button>

          {/* Restore JSON */}
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button
            type="button"
            className="btn btn-secondary"
            style={{ justifyContent: 'flex-start' }}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} color="#818cf8" />
            <span>Backup wiederherstellen (JSON hochladen)</span>
          </button>
        </div>
      </section>

      {/* PWA & Local Storage Info */}
      <section className="card" style={{ backgroundColor: 'rgba(99, 102, 241, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <ShieldCheck size={20} color="#818cf8" />
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>
            PWA Offline-Speicherung
          </h3>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
          Diese App ist eine vollständige <strong>Progressive Web App (PWA)</strong>. Sie funktioniert 
          vollständig offline. Alle Artikel, Bezahlarten, Kategorien und Geschäfte bleiben dauerhaft auf deinem Smartphone oder Computer 
          gespeichert, selbst wenn du die App schließt oder das Gerät neu startest.
        </p>
      </section>

      {/* Danger Zone: Reset to Factory Defaults */}
      <section className="card" style={{ borderColor: 'rgba(239, 68, 68, 0.25)' }}>
        <div className="card-title-row">
          <div className="card-title" style={{ color: '#ef4444' }}>
            <RefreshCw size={18} color="#ef4444" />
            <span>Zurücksetzen</span>
          </div>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Setzt alle Ausgaben, Kategorien, Geschäfte und Bezahlarten auf die Standard-Einstellungen zurück.
        </p>
        <button
          type="button"
          className="btn btn-ghost-danger btn-sm"
          onClick={onResetAll}
        >
          Auf Werkseinstellungen zurücksetzen
        </button>
      </section>
    </div>
  );
}
