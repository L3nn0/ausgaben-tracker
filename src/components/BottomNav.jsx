import React from 'react';
import { LayoutDashboard, CreditCard, Receipt, Settings } from 'lucide-react';

export default function BottomNav({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'dashboard', label: 'Übersicht', icon: LayoutDashboard },
    { id: 'payment-methods', label: 'Bezahlarten', icon: CreditCard },
    { id: 'expenses', label: 'Ausgaben', icon: Receipt },
    { id: 'settings', label: 'Optionen', icon: Settings },
  ];

  return (
    <nav className="bottom-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onSelectTab(tab.id)}
          >
            <Icon size={20} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
