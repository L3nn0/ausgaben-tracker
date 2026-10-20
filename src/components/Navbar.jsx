import React, { useState, useEffect } from 'react';
import { Download, Wifi, WifiOff } from 'lucide-react';
import { formatCurrency } from '../services/storage';

export default function Navbar({ totalSpent = 0, expensesCount = 0 }) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Listen for PWA install prompt
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      alert('Tipp zum Installieren:\n\n• iOS (Safari): Tippe auf das Teilen-Symbol und wähle "Zum Home-Bildschirm".\n• Android/Chrome: Öffne das Menü (3 Punkte) und wähle "App installieren".');
      return;
    }
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setInstallPrompt(null);
    }
  };

  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="app-logo">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
          </svg>
        </div>
        <div className="app-title-group">
          <h1>Ausgaben Tracker</h1>
          <span className="app-subtitle">
            {expensesCount} {expensesCount === 1 ? 'Eintrag' : 'Einträge'} • {formatCurrency(totalSpent)}
          </span>
        </div>
      </div>

      <div className="header-actions">
        {/* Network status */}
        <div className={`status-badge ${isOnline ? 'online' : 'offline'}`} title={isOnline ? 'Online - Daten werden lokal synchronisiert' : 'Offline - Daten werden lokal gespeichert'}>
          <span className="status-dot"></span>
          <span>{isOnline ? 'PWA' : 'Offline'}</span>
        </div>

        {/* PWA Install Button if available */}
        {!isInstalled && (
          <button 
            type="button" 
            className="install-btn" 
            onClick={handleInstallClick}
            title="App auf Startbildschirm installieren"
          >
            <Download size={14} />
            <span>App holen</span>
          </button>
        )}
      </div>
    </header>
  );
}
