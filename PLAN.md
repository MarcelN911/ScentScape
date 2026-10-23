# ScentScape Redesign: Plan

Ziel: Die Seite sieht am Ende genau so aus wie die Vorlage aus Claude Design (`ScentScape Shop v7.dc.html`),
mit allen Animationen und Effekten, aber mit echten Daten aus der nexomar-API.

## Entscheidungen

| Thema           | Entscheidung                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------------- |
| Framework       | **Astro 7**, statische Ausgabe (`dist/`), kein React im Browser                                 |
| Interaktion     | normales JavaScript (ES-Module) in `src/scripts/`                                               |
| Animationen     | **GSAP 3** mit ScrollTrigger                                                                    |
| Hosting         | **Hostinger** (wie nexomar). `dist/` wird hochgeladen                                           |
| Produkt-URLs    | `/producto/<nombre-del-producto>/`, z. B. `/producto/khamrah/`                                  |
| Familie & Noten | in der nexomar-API bereits eingebaut (muss dort noch committet werden)                          |
| Bezahlen        | zuerst weiter über WhatsApp; Wompi und Addi in Phase 7                                          |
| Alte Seite      | liegt unverändert in `legacy/` als Vorlage für die Logik; `main` bleibt bis zum Livegang online |

### Neue Produkte ohne Handarbeit

Weil die Seite statisch gebaut wird, entstehen Produktseiten beim Build. Ablauf (Phase 8):

1. GitHub Action baut die Seite und lädt `dist/` per FTP zu Hostinger hoch.
2. nexomar ruft beim Speichern eines Produkts einen GitHub-Webhook auf (`repository_dispatch`), dann baut die Seite neu.
3. Preise, Verfügbarkeit und Bewertungen lädt die Seite zusätzlich live im Browser, sie sind also immer aktuell.

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
  layouts/       BaseLayout.astro (Head, SEO, Nav, Footer, Warenkorb)
  components/    Nav, MegaMenu, Footer, CartDrawer, Toast, Curtain, Cursor,
                 MusicPlayer, ProductCard, ProductRow, QuizModal, VideoModal …
  sections/      home/ · product/ · shop/
  pages/         index, productos, producto/[slug], nosotros, original, gift-card,
                 catalogo, checkout, resenas, contacto, terminos, privacidad, 404
  scripts/
    api/         client, products, reviews, orders
    cart/        store, pricing, discount, shipping, whatsapp, render
    effects/     reveal, scroll-progress, horizontal-track, families-pin, video-fan,
                 curtain, cursor, tilt, magnet, parallax
    features/    search, filters, quiz, gift-card, lot-check, chat-demo, faq, music
    utils/       format, text, dom, slug
  styles/        tokens, base, typography, buttons, animations …
public/assets/   Logos, Bilder, Videos, Musik
tools/           Hilfsskripte (z. B. check-lines.js)
legacy/          alte Seite, nur als Vorlage
```

## Phasen

### Phase 0: Vorbereitung ✅

- [x] Branch `redesign` anlegen
- [x] alte Seite nach `legacy/` verschieben, `assets/` → `public/assets/`
- [x] Astro 7 + GSAP installieren
- [x] ESLint (14 Zeilen / 400 Zeilen), Prettier, `tools/check-lines.js`
- [x] Platzhalter-Startseite, Build läuft

### Phase 1: Fundament ✅

- [x] `tokens.css`: Farben, Schriften (Bodoni Moda + Helvetica Neue), Abstände, Radien, Easing
- [x] `base.css`, `typography.css`: Reset, Eyebrows, Überschriften mit kursiver Zeile
- [x] `buttons.css`: Pill, Outline, Icon-Kreis, WhatsApp
- [x] Rahmenkarte (doppelte Linie + Schraffur) als wiederverwendbare Klasse
- [x] `animations.css`: alle `@keyframes` aus v7, ohne Duplikate
- [x] `prefers-reduced-motion` von Anfang an berücksichtigen
- [x] Schrift Bodoni Moda lokal eingebunden (`@fontsource-variable`), kein Google Fonts
- [x] Styleguide-Seite `/styleguide/` (noindex) zum Vergleichen mit der Vorlage

### Phase 2: Was jede Seite hat ✅

- [x] `BaseLayout.astro` mit SEO/OG aus den alten Seiten + Scroll-Fortschrittsbalken
- [x] Navigation, Mega-Menü „Descubre“ mit Hover-Vorschau, Handy-Menü
- [x] Footer: Chat-Demo, wechselnde Wörter, Zahlungsarten, Links
- [x] schwebender Berater-Button (WhatsApp)
- [x] Seitenwechsel-Vorhang mit Logo, eigener Mauszeiger, Toast
- [x] Musik-Player (Playlist, Lautstärke, sich drehende Platte); Audiodateien fehlen noch

### Phase 3: Daten und Warenkorb ✅

- [x] `api/`: Produkte, Bewertungen, Bestellung, Rabattcode (aus `legacy/script.js`)
- [x] Produktdaten normalisieren inkl. Familie + Noten, Slug aus dem Namen
- [x] `cart/` aus `legacy/scripts/cart.js` aufteilen: store, pricing, discount, shipping, whatsapp, render
- [x] Warenkorb-Drawer wie v7: Geschenk-Option, Rabattcode, Zahlungsart, Versandbalken
- [x] Wunschliste (Herzen)

### Phase 4: Shop-Seiten ✅

- [x] Productos: Hero, Noten-Band, Familien-Tabs, fixierte Filterleiste, Raster/Liste, FLIP-Animation, Listen-Vorschau
- [x] Produktseite `/producto/[slug]/`: Galerie (Fortschritt, Zoom, Wischen), Größen, Kaufbereich, Akkordeons, Pyramide, Bewertungen, Ähnliche, Kaufleiste
- [x] SEO pro Produkt (Meta + Schema aus `legacy/scripts/producto.js`)
- [x] Checkout-Seite (Schritte, Formular, Zusammenfassung), Bestellung an nexomar + Abschluss über WhatsApp

### Phase 5: Startseite ✅

- [x] Hero mit Video + zwei schräge Laufbänder
- [x] „Los más pedidos“: horizontaler Scroll, Zoom beim Hovern
- [x] „Descubre“-Karten mit Kipp- und Parallax-Effekt
- [x] „Familias olfativas“: fixierter Bereich, Flaschenwechsel
- [x] Video-Karussell mit Auffächern + Video-Modal
- [x] Bewertungen (einfliegende Karten, hochzählende Note), FAQ

### Phase 6: Weitere Seiten

- [ ] Nosotros
- [ ] Original garantizado mit Lot-Prüfung
- [ ] Test olfativo (Quiz-Modal)
- [ ] Gift Card (3D-Karte, Farben, Umdrehen)
- [ ] Catálogo + Druckversion für PDF
- [ ] Reseñas, Contacto, Términos, Privacidad, 404

### Phase 7: Neue Funktionen mit Backend

- [ ] Gift Card als echtes Produkt mit Code
- [ ] Wompi (Karte/PSE)
- [ ] Addi (4 Raten)

### Phase 8: Feinschliff und Livegang

- [ ] Handy-Ansichten, reduzierte Bewegung, Tastaturbedienung
- [ ] Performance: Cloudinary-Größen, Videos erst laden, wenn man hinscrollt
- [ ] alte URLs weiterleiten (`.htaccess`; `producto.html?id=…` → `/producto/<slug>/`)
- [ ] `sitemap.xml` + `robots.txt` automatisch erzeugen
- [ ] GitHub Action: Build + FTP-Upload zu Hostinger, Webhook von nexomar
- [ ] `redesign` in `main` zusammenführen, live schalten

## Was ich noch brauche

- [ ] Hero-Video (Vorlage: `uploads/hero5.mp4`)
- [ ] Musik-Dateien für die Playlist (4 Titel: Noche en El Poblado, Oud & Ámbar, Brisa de Bergamota, Terciopelo)
- [ ] Bild für „Original garantizado“ (Litografie der versiegelten Box)
- [ ] Feldnamen von Familie und Noten in der nexomar-API (sobald dort committet)
