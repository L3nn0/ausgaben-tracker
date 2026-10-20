# Ausgaben Tracker PWA 📱💳

Eine einfache, schnelle und moderne Progressive Web App (PWA) zum Tracken deiner täglichen Ausgaben mit Bezahlarten und Kategorien.

Vollständig konfiguriert für **GitHub Pages** (inklusive automatischer GitHub Actions CI/CD Pipeline).

---

## 🌐 Auf GitHub Pages veröffentlichen

Die App ist so eingerichtet, dass sie automatisch über GitHub Pages gebaut und veröffentlicht wird, sobald du den Code auf GitHub pushst.

### Schritt 1: Code zu GitHub pushen
Falls du das Repository noch nicht auf GitHub hochgeladen hast:
```bash
git add .
git commit -m "Initial commit: Ausgaben Tracker PWA mit GitHub Pages Workflow"
git branch -M main
git remote add origin https://github.com/<DEIN-GITHUB-BENUTZERNAME>/<DEIN-REPO-NAME>.git
git push -u origin main
```

### Schritt 2: GitHub Pages in den Repository-Einstellungen aktivieren
1. Gehe auf GitHub in dein Repository.
2. Klicke oben auf **Settings** (Einstellungen) ⚙️.
3. Klicke links in der Menüleiste auf **Pages**.
4. Wähle unter **Build and deployment** bei **Source** die Option:
   👉 **`GitHub Actions`**
5. Fertig! Der Workflow in `.github/workflows/deploy.yml` baut die App nun automatisch bei jedem Push und schaltet sie frei unter:
   `https://<DEIN-BENUTZERNAME>.github.io/<DEIN-REPO-NAME>/`

---

## ✨ Features der App

1. **Artikel / Ausgaben erfassen:**
   - Titel/Artikel, Preis (€), Bezahlart, Kategorie, Datum und Notiz.
   - **Inline Kategorie-Erstellung:** Direkt beim Erfassen einer Ausgabe kannst du mit einem Klick eine neue Kategorie anlegen (inkl. Farbwahl), die sofort gespeichert und vorausgewählt wird.

2. **Bezahlarten-Übersicht & Summen:**
   - Zeigt alle Bezahlarten (z.B. Bar, Kreditkarte, Girocard, PayPal).
   - Jede Bezahlart zeigt die **Gesamtsumme aller Ausgaben**, die Anzahl der Artikel und einen Fortschrittsbalken.
   - **Klick auf eine Bezahlart:** Zeigt alle Artikel an, die mit dieser Bezahlart bezahlt wurden.

3. **Löschfunktionen:**
   - Einzelne Artikel löschen.
   - **Alle Artikel gleichzeitig löschen** (mit Sicherheits-Bestätigungsdialog).
   - Alle Artikel einer bestimmten Bezahlart löschen.

4. **Konfiguration & Verwaltung:**
   - Kategorien frei konfigurieren (Hinzufügen, Bearbeiten, Löschen, Farben).
   - Bezahlarten frei konfigurieren (Hinzufügen, Bearbeiten, Löschen, Icons, Farben).

5. **PWA, Persistenz & Download:**
   - **Dauerhafte Speicherung:** Daten werden im lokalen Gerätespeicher (`localStorage`) aufbewahrt und bleiben bei jedem Neustart erhalten.
   - **100% Offline-fähig:** Funktioniert dank Service Worker auch ohne Netzverbindung.
   - **Installierbar:** Lässt sich direkt auf Smartphone und Desktop als native App installieren.
   - **Download / Backup:**
     - **JSON-Backup:** Vollständiges Backup herunterladen und wiederherstellen.
     - **CSV-Export:** Ausgaben für Microsoft Excel oder Google Sheets exportieren.

---

## 🛠️ Lokale Entwicklung

```bash
# Entwicklungsserver starten
npm run dev

# Für Produktion bauen
npm run build

# Produktions-Vorschau starten
npm run preview
```
