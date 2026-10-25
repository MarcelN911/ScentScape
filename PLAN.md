# ScentScape Redesign: Plan

Ziel: Die Seite sieht am Ende genau so aus wie die Vorlage aus Claude Design
(Handoff `design_handoff_scentscape_web/`, 14 Seiten), mit allen Animationen und Effekten,
aber mit echten Daten aus der nexomar-API.

## Entscheidungen

| Thema           | Entscheidung                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------------- |
| Framework       | **Astro 7**, statische Ausgabe (`dist/`), kein React im Browser                                 |
| Interaktion     | normales JavaScript (ES-Module) in `src/scripts/`                                               |
| Animationen     | **GSAP 3** mit ScrollTrigger                                                                    |
| Hosting         | **Hostinger** (wie nexomar). `dist/` wird hochgeladen                                           |
| Produkt-URLs    | `/producto/<nombre-del-producto>/`, z. B. `/producto/khamrah/`                                  |
| Familie & Noten | in der nexomar-API bereits eingebaut (muss dort noch committet werden)                          |
| Bezahlen        | Bestellung an nexomar, Abschluss über WhatsApp (wie in der Vorlage)                             |
| Alte Seite      | liegt unverändert in `legacy/` als Vorlage für die Logik; `main` bleibt bis zum Livegang online |

### Neue Produkte ohne Handarbeit

Weil die Seite statisch gebaut wird, entstehen Produktseiten beim Build. Ablauf (Phase 8):

1. GitHub Action baut die Seite und lädt `dist/` per FTP zu Hostinger hoch.
2. nexomar ruft beim Speichern eines Produkts einen GitHub-Webhook auf (`repository_dispatch`), dann baut die Seite neu.
3. Preise, Verfügbarkeit und Bewertungen sind so aktuell wie der letzte Build. Der Rabattcode und die Bestellung
   laufen live gegen nexomar (der Server rechnet die Preise selbst nach).

### Slugs aus dem Produktnamen

`KHAMRAH` → `khamrah`, `Club de Nuit Intense NDT` → `club-de-nuit-intense-ndt`.
Akzente werden entfernt, alles klein geschrieben, Sonderzeichen werden zu `-`.
Gibt es einen Namen doppelt, bekommt der zweite die Marke angehängt.

## Code-Regeln

Werden von `npm run check` automatisch geprüft:

- Eine Funktion hat genau eine Aufgabe und höchstens **14 Zeilen** (inklusive Kopf- und Schlusszeile).
- Eine Datei hat höchstens **400 Zeilen**, gilt auch für `.astro` und `.css`.
- höchstens 4 Parameter, Verschachtelungstiefe 3, Komplexität 8
- Stile gehören ins CSS. JavaScript schaltet nur Klassen (`is-open`, `is-active`) oder setzt CSS-Variablen.
- sprechende Namen statt Kommentare. Kommentare nur, wenn sie das _Warum_ erklären.
- Hilfsfunktionen (Preis formatieren, Text, DOM) gibt es genau einmal in `src/scripts/utils/`.

## Befehle

| Befehl            | Was passiert                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Entwicklungsserver auf http://localhost:4321  |
| `npm run build`   | fertige Seite nach `dist/` bauen              |
| `npm run preview` | gebaute Seite lokal ansehen                   |
| `npm run check`   | ESLint + Zeilen-Grenzen + Formatierung prüfen |
| `npm run format`  | Code automatisch formatieren                  |

## Ordnerstruktur

```
src/
  layouts/       BaseLayout.astro (Head, SEO, Header, Footer, Warenkorb, Musik-Player, Vorhang)
  components/    kleine Bausteine, nach Bereich: layout/ cart/ product/ shop/ home/ quiz/ gift/
                 regalo/ catalogo/ original/ reviews/ ritual/ chat/ page/ ui/ …
  sections/      größere Abschnitte einer Seite, nach Seite: home/ shop/ product/ quiz/ gift/ …
  pages/         index, productos, producto/[slug], test-olfativo, gift-card, regalo, catalogo (+ imprimir),
                 original, resenas, servicios, te-asesoramos, el-ritual, nosotros, contacto,
                 terminos, privacidad, 404
  data/          Texte und feste Listen (Familien, Noten, FAQ, Navigation, Gift Card, Ritual …)
  scripts/
    core/        Seiten-Lebenszyklus, Events, Klick-Aktionen
    api/         Zugriff auf nexomar
    catalog/     Produkte laden, aufbereiten, Slugs, Abfragen, Einträge für den Browser
    cart/        Warenkorb, Preise, Rabattcodes (+ ui/ für den Drawer)
    checkout/    Formular, WhatsApp-Nachricht, Bestellung speichern
    effects/     GSAP, Scroll-Fortschritt, Einblenden, Parallax, Laufband
    features/    eine Ordner je Seite: home/ shop/ product/ quiz/ gift/ regalo/ catalogo/ reviews/ …
    layout/      Header, Dropdown, Vorhang, Wortmarke im Footer
    seo/         schema.org-Daten
    utils/       format, text, image, whatsapp, storage, motion, qr
  styles/        tokens, base, animations, page (gemeinsame Formular-Bausteine)
integrations/    erzeugt beim Build sitemap.xml, robots.txt, .htaccess
public/assets/   Logos, Bilder, Videos
tools/           Hilfsskripte (check-lines.js)
legacy/          alte Seite, nur als Vorlage
```

## Deploy (Hostinger)

Die GitHub Action `.github/workflows/deploy.yml` baut die Seite und lädt `dist/` per FTP hoch.
Sie startet bei jedem Push auf `main`, per Knopf („Run workflow“) und wenn nexomar sie anstößt.

**Einmalig einrichten** (GitHub → Settings → Secrets and variables → Actions):

| Secret           | Inhalt                                                 |
| ---------------- | ------------------------------------------------------ |
| `FTP_SERVER`     | FTP-Host aus Hostinger (z. B. `ftp.scentscape.com.co`) |
| `FTP_USERNAME`   | FTP-Benutzer                                           |
| `FTP_PASSWORD`   | FTP-Passwort                                           |
| `FTP_SERVER_DIR` | optional, Standard `public_html/`                      |

**nexomar stößt den Build an**, wenn ein Produkt gespeichert wird:

```
POST https://api.github.com/repos/MarcelN911/ElixirS-B/dispatches
Authorization: Bearer <GitHub-Token mit Recht "Contents: write" für dieses Repo>
Accept: application/vnd.github+json

{ "event_type": "nexomar-update" }
```

Den Token nur auf dem nexomar-Server speichern, nie im Browser-Code.

## Phasen

Die erste Runde (Phasen 0–8) folgte der älteren Vorlage v7. Mit dem neuen Handoff wurde die Seite
noch einmal neu aufgebaut (Phasen A–G). Mega-Menü, eigene Checkout-Seite, Quiz-Modal, Berater-Button,
eigener Mauszeiger und die Startseiten-Abschnitte Descubre, Reseñas und FAQ sind dabei entfallen.

### Erste Runde (v7) ✅

- [x] Astro, GSAP, ESLint/Prettier, Zeilen-Prüfung
- [x] Daten aus nexomar: Produkte, Bewertungen, Bestellung, Rabattcode, Slugs
- [x] Warenkorb, Wunschliste, alte URLs weiterleiten, sitemap/robots, GitHub Action für Hostinger

### Phase A: Fundament ✅

- [x] Tokens, Schriften (Instrument Serif, Instrument Sans, Pinyon Script), Header mit Servicios-Menü
- [x] Handy-Menü, Footer mit SCENTSCAPE-Wortmarke, Vorhang, Toast, Scroll-Balken
- [x] Warenkorb mit Checkout im Drawer (Bestellung an nexomar + WhatsApp), fliegendes Produktbild
- [x] Musik-Player „ScentScape Sessions“ (4 Titel, im Browser erzeugt, keine Audiodateien nötig)

### Phase B: Startseite ✅

- [x] Logo-Portal als Intro, Hero, Los más pedidos, Test- und Gift-Story, Familien, Reels mit Video-Ansicht

### Phase C: Productos ✅

- [x] Familien-Rad, Noten-Band, Filter, Raster und Index-Ansicht mit Vorschau

### Phase D: Produktseite ✅

- [x] Galerie mit Notenrad, Kaufkarte, Akkordeons, Bewertungen, Ähnliche, Beratung mit Handy-Chat

### Phase E: Servicios I ✅

- [x] Test Olfativo (Pyramide, Ergebnis mit Match-Ring)
- [x] Gift Card (3D-Karte, Farbwechsel, Zählwerk, Umdrehen)
- [x] Regalo: Umschlag öffnet sich, Angaben kommen aus dem Link (siehe `src/data/regalo.js`)
- [x] Catálogo Digital: Auswahl, echtes Vorladen der Fotos, PDF-Seite `/catalogo/imprimir/`, Teilen per WhatsApp
- [x] Original Garantizado: Schild-Scan, Bestätigung des Lote-Codes per WhatsApp

### Phase F: Servicios II ✅

- [x] Reseñas: Übersicht, Suche, 3D-Karussell, Formular mit Live-Vorschau (sendet an nexomar)
- [x] Servicios: Bewertungs-Karussell und Beratung
- [x] Te asesoramos: Fragen im Handy-Chat, eigenes Eingabefeld öffnet WhatsApp

### Phase G: Weitere Seiten ✅

- [x] El Ritual, Nosotros, Contacto, Términos, Privacidad, 404
- [x] Aufräumen: alte Komponenten, Styles und Tokens entfernt

### Livegang

- [ ] `redesign` in `main` zusammenführen, live schalten
- [ ] Gift Card als echtes Produkt mit Code in nexomar (heute: Code von Hand, Link zur Regalo-Seite von Hand)

## Was ich noch brauche

- [ ] Foto für El Ritual, Momento 01 „Manos envolviendo la seda“ (bis dahin zeigt die Fläche die Seidenfarbe)
- [ ] Feldnamen von Familie und Noten in der nexomar-API (heute leitet die Seite die Noten aus dem Text ab)
- [ ] FTP-Zugang als GitHub-Secrets, Webhook in nexomar

### Link für die Regalo-Seite

Nach dem Kauf einer Gift Card bekommt die beschenkte Person einen Link, z. B.:

```
https://scentscape.com.co/regalo/?para=María&de=Camila&monto=200000&codigo=SC-K7M2-9QXP&color=burdeos&hasta=2027-10-18&mensaje=Feliz%20cumpleaños
```

Pflicht sind `para`, `monto` und `codigo`. Farben: `burdeos`, `azul-noche`, `champan`, `negro`.
Ohne diese Angaben zeigt die Seite ein Beispiel. Der Saldo zeigt den vollen Betrag, weil nexomar
(noch) kein Kartenkonto führt.

## Vor dem Livegang klären

- Términos sagt „fragancias inspiradas en marcas de lujo“, die Vorlage verspricht „Original garantizado,
  sellado de fábrica, código de lote“. Beides zusammen geht nicht, eins muss angepasst werden.
- Privacidad sagt „ningún dato es almacenado“, aber Bestellungen und Bewertungen werden in nexomar gespeichert.
- Términos, Medios de pago: Platzhalter „[Otros medios … completar]“ ersetzen.
- Gift Card „Válida por 12 meses“ bestätigen.
- El Ritual verspricht „Pago contra entrega“ und „guía de seguimiento por WhatsApp“ (Texte aus der Vorlage): bestätigen.
