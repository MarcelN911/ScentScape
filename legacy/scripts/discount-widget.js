// ── NEXOMAR Discount Widget ─────────────────────────────────────────────────
// Self-contained, shopId-driven promo widget for NEXOMAR storefronts.
// Fetches the shop's featured discount from /api/public/discount and injects
// an announcement bar + an offer modal. Renders nothing if the shop has no
// discounts configured for the storefront (no destacado, no enLeiste, no
// extraItems).
//
// The modal is an offer card: what the code is worth (percentage, fixed
// amount or free shipping), its conditions (minimum purchase, deadline with
// countdown, remaining coupons, per-customer limit, scope), the lead form,
// and — once unlocked — the code as a coupon that can be copied or sent
// straight to the cart.
//
// Per-site look is done entirely in discount-widget.css; per-site config
// (shopId, apiBase, extra non-discount bar lines, header selector) is set via
// window.NXDW_CONFIG, defined in a small script before this file loads.
// Falls back to window._shopId / window._apiBase when present.
//
// Talking to the host page: "Usar en mi carrito" dispatches a window event
// `nxdw:apply-code` with detail { codigo }. The host's cart listens for it;
// the widget itself knows nothing about the cart. Enable the button with
// NXDW_CONFIG.canApplyToCart = true.
(function () {
    'use strict';

    const CFG = window.NXDW_CONFIG || {};

    // Host pages declare `const _shopId`/`const _apiBase` at the top level of a
    // classic <script> — that creates a shared global binding other scripts can
    // read as a bare identifier, but NOT a window.* property. So we read the raw
    // identifier here, guarded for pages that never declare it at all (those
    // must set window.NXDW_CONFIG explicitly instead).
    let hostShopId, hostApiBase;
    try { hostShopId = _shopId; } catch (_) { hostShopId = undefined; }
    try { hostApiBase = _apiBase; } catch (_) { hostApiBase = undefined; }

    const shopId          = CFG.shopId  || hostShopId;
    const apiBase         = CFG.apiBase || hostApiBase;
    const headerSelector  = CFG.headerSelector  || 'header';
    const extraItems      = CFG.extraItems      || [];
    const scrollThreshold = CFG.scrollThreshold || 30;
    const autoOpenDelay   = CFG.autoOpenDelay   || 4000;
    const reopenDelay     = CFG.reopenDelay     || 120000; // 2 min — how long after a dismiss before it tries once more
    const rotateInterval  = CFG.rotateInterval  || 4500;
    const privacyUrl      = CFG.privacyUrl      || 'privacidad.html';
    const eyebrowText     = CFG.eyebrowText     || 'Oferta especial';
    const canApplyToCart  = !!CFG.canApplyToCart;
    // Below this many hours left, the deadline turns into a live countdown.
    const countdownHours  = CFG.countdownHours  || 72;
    // At or below this many coupons left, the exact number is shown.
    const scarcityLimit   = CFG.scarcityLimit   || 20;

    if (!shopId || !apiBase) return;

    // Colombia first (and preselected) since that's where most customers are;
    // the rest cover the other countries this storefront currently ships to.
    const COUNTRIES = [
        { iso: 'CO', dial: '+57',  flag: '🇨🇴', name: 'Colombia' },
        { iso: 'PE', dial: '+51',  flag: '🇵🇪', name: 'Perú' },
        { iso: 'VE', dial: '+58',  flag: '🇻🇪', name: 'Venezuela' },
        { iso: 'EC', dial: '+593', flag: '🇪🇨', name: 'Ecuador' },
        { iso: 'CL', dial: '+56',  flag: '🇨🇱', name: 'Chile' }
    ];

    const STORAGE_KEY   = 'nxdw_registrado_' + shopId;
    const CLOSES_KEY    = 'nxdw_cierres_' + shopId;
    const NEXT_OPEN_KEY = 'nxdw_reintento_' + shopId;
    const discountUrl   = apiBase + '/api/public/discount?shopId=' + shopId;
    const registerUrl   = apiBase + '/api/public/register';

    // { codigo, tipo, porcentaje, valor, minimo, vence, restantes, maxUsosPorCliente,
    //   sobreSale, categorias, marcas, generos, productos, descripcion, imagen }
    let destacado  = null;
    let barVisible = false;
    let countdownTimer = null;

    // ── Small helpers ───────────────────────────────────────────────────────

    const ICONS = {
        bag:   '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
        clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
        tag:   '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><path d="M7 7h.01"/>',
        user:  '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
        spark: '<path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4z"/>',
        grid:  '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'
    };

    function icon(name) {
        return '<svg class="nxdw-cond-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + '</svg>';
    }

    function fmtMoney(n) {
        return '$' + Math.round(Number(n) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    function escapeHtml(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function byId(id) { return document.getElementById(id); }

    /** The offer's headline: the big value and the words under it. */
    function heroText(d) {
        if (d.tipo === 'envio') return { value: 'Envío gratis', label: 'en tu pedido', compact: true };
        if (d.tipo === 'monto') return { value: fmtMoney(d.valor), label: 'de descuento', compact: true };
        return { value: (d.porcentaje || 0) + '%', label: 'de descuento', compact: false };
    }

    /** "2 d 4 h", "5 h 12 min", "8 min" — or '' once the deadline has passed. */
    function timeLeftText(ms) {
        if (ms <= 0) return '';
        const min = Math.floor(ms / 60000);
        const d   = Math.floor(min / 1440);
        const h   = Math.floor((min % 1440) / 60);
        const m   = min % 60;
        if (d > 0) return d + ' d ' + h + ' h';
        if (h > 0) return h + ' h ' + m + ' min';
        return Math.max(1, m) + ' min';
    }

    function deadlineCondition(d) {
        if (!d.vence) return null;
        const end = new Date(d.vence).getTime();
        if (isNaN(end)) return null;
        const left = end - Date.now();
        if (left <= countdownHours * 3600000) {
            const txt = timeLeftText(left);
            return { icon: 'clock', text: txt ? 'Termina en ' + txt : 'Termina hoy', urgent: true };
        }
        const fecha = new Date(end).toLocaleDateString('es-CO', { day: 'numeric', month: 'long' });
        return { icon: 'clock', text: 'Válido hasta el ' + fecha, urgent: false };
    }

    /** Everything the customer should know before using the code, most pressing first. */
    function buildConditions(d) {
        const list = [];
        const deadline = deadlineCondition(d);
        if (deadline && deadline.urgent) list.push(deadline);
        if (d.restantes != null) {
            if (d.restantes <= scarcityLimit) {
                list.push({ icon: 'spark', text: d.restantes === 1 ? 'Queda 1 cupón' : 'Solo quedan ' + d.restantes + ' cupones', urgent: true });
            } else {
                list.push({ icon: 'spark', text: 'Cupones limitados', urgent: false });
            }
        }
        if (d.minimo > 0) list.push({ icon: 'bag', text: 'En compras desde ' + fmtMoney(d.minimo), urgent: false });
        if (deadline && !deadline.urgent) list.push(deadline);

        // Category, brand and gender narrow the offer together ("Dior" +
        // "Caballeros"); a few names are spelled out, anything longer is summed up.
        const scope = (d.categorias || []).concat(d.marcas || [], d.generos || []);
        const prods = d.productos || [];
        if (scope.length && scope.length <= 3 && !prods.length) {
            list.push({ icon: 'grid', text: 'Válido en ' + scope.join(' · '), urgent: false });
        } else if (scope.length || prods.length) {
            list.push({ icon: 'grid', text: 'Válido en productos seleccionados', urgent: false });
        }
        if (d.sobreSale === false) list.push({ icon: 'tag', text: 'No acumulable con ofertas', urgent: false });
        if (d.maxUsosPorCliente != null) {
            list.push({ icon: 'user', text: d.maxUsosPorCliente === 1 ? 'Un uso por cliente' : d.maxUsosPorCliente + ' usos por cliente', urgent: false });
        }
        return list;
    }

    function conditionsHtml(d) {
        return buildConditions(d).map(function (c) {
            return '<li class="nxdw-cond' + (c.urgent ? ' nxdw-cond--urgent' : '') + '">' + icon(c.icon) + '<span>' + escapeHtml(c.text) + '</span></li>';
        }).join('');
    }

    // ── Markup injection ────────────────────────────────────────────────────

    function countryOptionsHtml() {
        return COUNTRIES.map(function (c, i) {
            return '<li class="nxdw-country-option" role="option" data-dial="' + c.dial + '" data-flag="' + c.flag + '" aria-selected="' + (i === 0 ? 'true' : 'false') + '">' +
                '<span class="nxdw-country-option-flag">' + c.flag + '</span>' +
                '<span class="nxdw-country-option-name">' + c.name + '</span>' +
                '<span class="nxdw-country-option-dial">' + c.dial + '</span>' +
            '</li>';
        }).join('');
    }

    function injectMarkup() {
        const bar = document.createElement('div');
        bar.className = 'nxdw-bar';
        bar.id = 'nxdwBar';
        bar.setAttribute('aria-live', 'polite');
        bar.innerHTML = '<div class="nxdw-bar-items" id="nxdwBarItems"></div>';
        document.body.appendChild(bar);

        const overlay = document.createElement('div');
        overlay.className = 'nxdw-overlay';
        overlay.id = 'nxdwOverlay';
        overlay.innerHTML =
            '<div class="nxdw-modal" role="dialog" aria-modal="true" aria-labelledby="nxdwHeroValue">' +
                '<button type="button" class="nxdw-close" id="nxdwClose" aria-label="Cerrar">&times;</button>' +
                '<div class="nxdw-img-wrap nxdw-hidden" id="nxdwImgWrap">' +
                    '<img id="nxdwImg" alt="">' +
                    '<span class="nxdw-img-badge" id="nxdwImgBadge"></span>' +
                '</div>' +
                '<div class="nxdw-body">' +

                    // ── Offer + form ──
                    '<div id="nxdwForm">' +
                        '<p class="nxdw-eyebrow"><span class="nxdw-eyebrow-dot"></span>' + escapeHtml(eyebrowText) + '</p>' +
                        '<div class="nxdw-hero" id="nxdwHero">' +
                            '<span class="nxdw-hero-value" id="nxdwHeroValue"></span>' +
                            '<span class="nxdw-hero-label" id="nxdwHeroLabel"></span>' +
                        '</div>' +
                        '<p class="nxdw-sub" id="nxdwSub"></p>' +
                        '<ul class="nxdw-conds" id="nxdwConds"></ul>' +
                        '<div class="nxdw-fields">' +
                            '<label class="nxdw-field">' +
                                '<span class="nxdw-field-label">Nombre</span>' +
                                '<input class="nxdw-input" type="text" id="nxdwNombre" placeholder="Tu nombre" autocomplete="name">' +
                            '</label>' +
                            '<div class="nxdw-field">' +
                                '<span class="nxdw-field-label">WhatsApp</span>' +
                                '<div class="nxdw-phone-group">' +
                                    '<div class="nxdw-country-select" id="nxdwCountryWrap">' +
                                        '<button type="button" class="nxdw-country-btn" id="nxdwCountryBtn" aria-haspopup="listbox" aria-expanded="false" data-dial="' + COUNTRIES[0].dial + '">' +
                                            '<span class="nxdw-country-flag" id="nxdwCountryFlag">' + COUNTRIES[0].flag + '</span>' +
                                            '<span class="nxdw-country-dial" id="nxdwCountryDial">' + COUNTRIES[0].dial + '</span>' +
                                            '<svg class="nxdw-country-arrow" width="9" height="6" viewBox="0 0 9 6"><path d="M1 1l3.5 3.5L8 1" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
                                        '</button>' +
                                        '<ul class="nxdw-country-list nxdw-hidden" id="nxdwCountryList" role="listbox" aria-label="Código de país">' +
                                            countryOptionsHtml() +
                                        '</ul>' +
                                    '</div>' +
                                    '<input class="nxdw-input nxdw-phone-input" type="tel" id="nxdwTelefono" placeholder="300 123 4567" autocomplete="tel" inputmode="tel" aria-label="Número de WhatsApp">' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="nxdw-error" id="nxdwError" role="alert"></div>' +
                        '<button type="button" class="nxdw-btn" id="nxdwSubmitBtn"><span>Desbloquear mi código</span><span class="nxdw-btn-spinner"></span></button>' +
                        '<p class="nxdw-privacy">Solo usamos tus datos para enviarte tu código. Sin spam. <a href="' + privacyUrl + '" target="_blank" rel="noopener">Política de privacidad</a></p>' +
                    '</div>' +

                    // ── Unlocked: the code as a coupon ──
                    '<div class="nxdw-success nxdw-hidden" id="nxdwSuccess">' +
                        '<p class="nxdw-eyebrow"><span class="nxdw-eyebrow-dot"></span>Tu código está listo</p>' +
                        '<h3 class="nxdw-success-title" id="nxdwSuccessTitle">¡Listo!</h3>' +
                        '<div class="nxdw-coupon">' +
                            '<div class="nxdw-coupon-value">' +
                                '<span class="nxdw-coupon-amount" id="nxdwCouponValue"></span>' +
                                '<span class="nxdw-coupon-label" id="nxdwCouponLabel"></span>' +
                            '</div>' +
                            '<div class="nxdw-coupon-code">' +
                                '<span class="nxdw-coupon-code-label">Código</span>' +
                                '<span class="nxdw-code-text" id="nxdwCodeText"></span>' +
                                '<button type="button" class="nxdw-copy-btn" id="nxdwCopyBtn">Copiar</button>' +
                            '</div>' +
                        '</div>' +
                        '<p class="nxdw-success-sub">Ingrésalo en tu carrito antes de finalizar la compra.</p>' +
                        '<ul class="nxdw-conds nxdw-conds--compact" id="nxdwSuccessConds"></ul>' +
                        '<div class="nxdw-success-actions">' +
                            (canApplyToCart ? '<button type="button" class="nxdw-btn" id="nxdwApplyBtn"><span>Usar en mi carrito</span></button>' : '') +
                            '<button type="button" class="nxdw-done-btn' + (canApplyToCart ? ' nxdw-done-btn--ghost' : '') + '" id="nxdwDoneBtn">Seguir comprando</button>' +
                        '</div>' +
                    '</div>' +

                '</div>' +
            '</div>';
        document.body.appendChild(overlay);
    }

    function removeMarkup() {
        const bar     = byId('nxdwBar');
        const overlay = byId('nxdwOverlay');
        if (bar) bar.parentNode.removeChild(bar);
        if (overlay) overlay.parentNode.removeChild(overlay);
    }

    // ── Announcement bar ─────────────────────────────────────────────────────

    function buildBarLines(barra) {
        const lines = extraItems.map(function (e) { return { texto: e.texto, clickable: false, codigo: null }; });
        (barra || []).forEach(function (b) {
            // The destacado code stays hidden behind the modal's form on purpose —
            // every other ("public") bar code gets a copy button since its code
            // is already shown in plain text right next to it.
            const isDestacado = !!(destacado && b.codigo === destacado.codigo);
            lines.push({ texto: b.texto, clickable: isDestacado, codigo: isDestacado ? null : b.codigo });
        });
        return lines;
    }

    function renderBar(barra) {
        const lines = buildBarLines(barra);
        if (!lines.length) return false;
        const wrap = byId('nxdwBarItems');
        wrap.innerHTML = lines.map(function (l) {
            const copyBtn = l.codigo
                ? '<button type="button" class="nxdw-bar-copy" data-code="' + escapeHtml(l.codigo) + '" aria-label="Copiar código" title="Copiar código">' +
                    '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>' +
                  '</button>'
                : '';
            return '<span class="nxdw-bar-item' + (l.clickable ? ' nxdw-bar-item--click' : '') + '" data-clickable="' + (l.clickable ? '1' : '0') + '">' +
                '<span class="nxdw-bar-gem">&#10022;</span><span>' + escapeHtml(l.texto) + '</span>' + copyBtn +
            '</span>';
        }).join('');
        if (wrap.firstElementChild) wrap.firstElementChild.classList.add('nxdw-active');
        return true;
    }

    function initBarCopy() {
        byId('nxdwBarItems').addEventListener('click', function (e) {
            const btn = e.target.closest ? e.target.closest('.nxdw-bar-copy') : null;
            if (!btn) return;
            e.stopPropagation();
            navigator.clipboard.writeText(btn.getAttribute('data-code')).then(function () {
                btn.classList.add('nxdw-bar-copy--done');
                setTimeout(function () { btn.classList.remove('nxdw-bar-copy--done'); }, 1400);
            }).catch(function () {});
        });
    }

    function cycleBar() {
        const wrap = byId('nxdwBarItems');
        const els  = wrap ? Array.prototype.slice.call(wrap.children) : [];
        if (els.length < 2) return;
        let idx = -1;
        for (let i = 0; i < els.length; i++) if (els[i].classList.contains('nxdw-active')) idx = i;
        if (idx > -1) els[idx].classList.remove('nxdw-active');
        els[(idx + 1) % els.length].classList.add('nxdw-active');
    }

    // Uses `top`, not `transform` — a transform on the header would make it the
    // containing block for any position:fixed descendant (e.g. a mobile menu
    // panel nested inside <header>), breaking that descendant's sizing/backdrop.
    function setHeaderOffset(px) {
        const header = document.querySelector(headerSelector);
        if (header) header.style.top = px ? px + 'px' : '';
    }

    function initScroll() {
        const bar = byId('nxdwBar');
        function onScroll() {
            const shouldShow = window.scrollY > scrollThreshold;
            if (shouldShow === barVisible) return;
            barVisible = shouldShow;
            bar.classList.toggle('nxdw-bar--visible', shouldShow);
            setHeaderOffset(shouldShow ? bar.offsetHeight : 0);
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ── Modal ────────────────────────────────────────────────────────────────

    function renderConditions() {
        const html = conditionsHtml(destacado);
        const formList    = byId('nxdwConds');
        const successList = byId('nxdwSuccessConds');
        if (formList) {
            formList.innerHTML = html;
            formList.classList.toggle('nxdw-hidden', !html);
        }
        if (successList) {
            successList.innerHTML = html;
            successList.classList.toggle('nxdw-hidden', !html);
        }
    }

    function populateModal() {
        const hero = heroText(destacado);
        byId('nxdwHeroValue').textContent = hero.value;
        byId('nxdwHeroLabel').textContent = hero.label;
        byId('nxdwHero').classList.toggle('nxdw-hero--compact', hero.compact);
        byId('nxdwCouponValue').textContent = hero.value;
        byId('nxdwCouponLabel').textContent = hero.label;
        byId('nxdwImgBadge').textContent    = hero.value;

        const sub = byId('nxdwSub');
        sub.textContent = destacado.descripcion || '';
        sub.classList.toggle('nxdw-hidden', !destacado.descripcion);

        renderConditions();

        const imgWrap = byId('nxdwImgWrap');
        const modal   = document.querySelector('#nxdwOverlay .nxdw-modal');
        if (destacado.imagen) {
            byId('nxdwImg').src = destacado.imagen;
            imgWrap.classList.remove('nxdw-hidden');
            if (modal) modal.classList.remove('nxdw-no-img');
        } else {
            imgWrap.classList.add('nxdw-hidden');
            if (modal) modal.classList.add('nxdw-no-img');
        }
    }

    /** The code this visitor already unlocked — only if it is still the current offer. */
    function savedCode() {
        try {
            const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
            return parsed && parsed.code && destacado && parsed.code === destacado.codigo ? parsed : null;
        } catch (_) {
            return null;
        }
    }

    function setSuccessView(on) {
        byId('nxdwForm').classList.toggle('nxdw-hidden', on);
        byId('nxdwSuccess').classList.toggle('nxdw-hidden', !on);
        const modal = document.querySelector('#nxdwOverlay .nxdw-modal');
        if (modal) modal.classList.toggle('nxdw-modal--success', on);
    }

    function showForm() {
        setSuccessView(false);
    }

    function showSuccess(code, nombre) {
        setSuccessView(true);
        byId('nxdwCodeText').textContent = code;
        const primerNombre = String(nombre || '').trim().split(/\s+/)[0];
        byId('nxdwSuccessTitle').textContent = primerNombre ? '¡Listo, ' + primerNombre + '!' : '¡Listo!';
    }

    function openModal() {
        const overlay = byId('nxdwOverlay');
        if (!overlay || !destacado) return;
        const saved = savedCode();
        if (saved) showSuccess(saved.code, saved.nombre); else showForm();
        renderConditions();
        // A deadline that is close ticks down while the modal is open.
        clearInterval(countdownTimer);
        countdownTimer = setInterval(renderConditions, 30000);
        overlay.classList.add('nxdw-open');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        const overlay = byId('nxdwOverlay');
        if (!overlay) return;
        overlay.classList.remove('nxdw-open');
        document.body.style.overflow = '';
        clearInterval(countdownTimer);
        closeCountryList();
    }

    // ── Country code dropdown ───────────────────────────────────────────────
    // Custom listbox instead of a native <select> — the native option panel
    // can't be styled (that's the cramped system list you get on mobile), so
    // this renders its own popup that matches the modal everywhere.

    function closeCountryList() {
        const list = byId('nxdwCountryList');
        const btn  = byId('nxdwCountryBtn');
        if (list) list.classList.add('nxdw-hidden');
        if (btn)  btn.setAttribute('aria-expanded', 'false');
    }

    // Caps the list's height to whatever room is left inside the modal below
    // the button — the modal itself doesn't clip/scroll, so without this the
    // list would visually spill out past the modal's own bottom edge.
    // The list keeps its own overflow-y: auto to scroll internally instead.
    function capCountryListHeight() {
        const btn   = byId('nxdwCountryBtn');
        const list  = byId('nxdwCountryList');
        const modal = document.querySelector('#nxdwOverlay .nxdw-modal');
        if (!modal) return;
        const space = modal.getBoundingClientRect().bottom - btn.getBoundingClientRect().bottom - 24;
        list.style.maxHeight = Math.max(80, Math.min(260, space)) + 'px';
    }

    function initCountryDropdown() {
        const wrap = byId('nxdwCountryWrap');
        const btn  = byId('nxdwCountryBtn');
        const list = byId('nxdwCountryList');
        const flag = byId('nxdwCountryFlag');
        const dial = byId('nxdwCountryDial');

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = !list.classList.contains('nxdw-hidden');
            if (isOpen) { closeCountryList(); return; }
            capCountryListHeight();
            list.classList.remove('nxdw-hidden');
            btn.setAttribute('aria-expanded', 'true');
        });

        list.addEventListener('click', function (e) {
            const opt = e.target.closest ? e.target.closest('.nxdw-country-option') : null;
            if (!opt) return;
            const options = list.querySelectorAll('.nxdw-country-option');
            for (let i = 0; i < options.length; i++) options[i].setAttribute('aria-selected', 'false');
            opt.setAttribute('aria-selected', 'true');
            btn.setAttribute('data-dial', opt.getAttribute('data-dial'));
            flag.textContent = opt.getAttribute('data-flag');
            dial.textContent = opt.getAttribute('data-dial');
            closeCountryList();
        });

        document.addEventListener('click', function (e) {
            if (!wrap.contains(e.target)) closeCountryList();
        });
    }

    // Re-checks dismiss state right before actually opening — guards against
    // a stray timer (e.g. one scheduled before a second dismiss just now)
    // still firing and reopening the modal after the visitor said "no" twice.
    // Manual opens (bar click) go through openModal() directly and skip this.
    function autoOpen() {
        if (localStorage.getItem(STORAGE_KEY)) return;
        if (parseInt(localStorage.getItem(CLOSES_KEY) || '0', 10) >= 2) return;
        openModal();
    }

    // First dismiss (without registering) → try once more in `reopenDelay`,
    // whether the visitor stays on this page (timer below) or navigates to
    // another one (the persisted timestamp picks up where it left off via
    // scheduleAutoOpen on the next page load). Second dismiss → stop
    // auto-opening for good. Registering cancels all of this.
    function handleUserClose() {
        if (!localStorage.getItem(STORAGE_KEY)) {
            const closes = parseInt(localStorage.getItem(CLOSES_KEY) || '0', 10) + 1;
            localStorage.setItem(CLOSES_KEY, String(closes));
            if (closes === 1) {
                localStorage.setItem(NEXT_OPEN_KEY, String(Date.now() + reopenDelay));
                setTimeout(autoOpen, reopenDelay);
            }
        }
        closeModal();
    }

    // Decides whether/when the modal should auto-open, based on past dismissals.
    function scheduleAutoOpen() {
        if (localStorage.getItem(STORAGE_KEY)) return; // already registered

        const closes = parseInt(localStorage.getItem(CLOSES_KEY) || '0', 10);
        if (closes === 0) { setTimeout(autoOpen, autoOpenDelay); return; }
        if (closes >= 2) return; // dismissed twice — stop bothering the visitor

        const nextOpenAt = parseInt(localStorage.getItem(NEXT_OPEN_KEY) || '0', 10);
        const remaining  = nextOpenAt - Date.now();
        setTimeout(autoOpen, remaining > 0 ? remaining : autoOpenDelay);
    }

    function setError(msg) {
        const el = byId('nxdwError');
        if (el) el.textContent = msg;
    }

    function handleSubmit() {
        const nombre      = byId('nxdwNombre').value.trim();
        const dial        = byId('nxdwCountryBtn').getAttribute('data-dial');
        // Strip everything but digits so "300 123 4567" / "300-123-4567" and a
        // leading trunk "0" all normalize to the same clean national number
        // before we prefix the dial code.
        const nationalNum = byId('nxdwTelefono').value.trim().replace(/\D/g, '').replace(/^0+/, '');
        const telefono    = nationalNum ? dial + nationalNum : '';

        setError('');
        if (!nombre) { setError('Por favor ingresa tu nombre.'); return; }
        if (!nationalNum || nationalNum.length < 7) { setError('Por favor ingresa un número de WhatsApp válido.'); return; }

        const btn = byId('nxdwSubmitBtn');
        btn.disabled = true;
        btn.classList.add('nxdw-loading');

        fetch(registerUrl, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ shopId: shopId, nombre: nombre, telefono: telefono, codigoDescuento: destacado.codigo })
        })
        .then(function (res) { return res.json().then(function (data) { return { ok: res.ok, data: data }; }); })
        .then(function (r) {
            if (!r.ok) { setError(r.data.error || 'Ocurrió un error. Intenta de nuevo.'); return; }
            const code = r.data.codigoDescuento || destacado.codigo;
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ code: code, nombre: r.data.nombre }));
            showSuccess(code, r.data.nombre);
        })
        .catch(function () { setError('Error de conexión. Intenta de nuevo.'); })
        .finally(function () {
            btn.disabled = false;
            btn.classList.remove('nxdw-loading');
        });
    }

    function initCopyBtn() {
        const btn  = byId('nxdwCopyBtn');
        const code = byId('nxdwCodeText');
        btn.addEventListener('click', function () {
            navigator.clipboard.writeText(code.textContent).then(function () {
                btn.textContent = '✓ Copiado';
                btn.classList.add('nxdw-copied');
                setTimeout(function () {
                    btn.textContent = 'Copiar';
                    btn.classList.remove('nxdw-copied');
                }, 2000);
            }).catch(function () {});
        });
    }

    /** Hands the code to the host page's cart and gets out of the way. */
    function applyToCart() {
        const codigo = byId('nxdwCodeText').textContent;
        closeModal();
        window.dispatchEvent(new CustomEvent('nxdw:apply-code', { detail: { codigo: codigo } }));
    }

    function wireEvents() {
        const overlay = byId('nxdwOverlay');
        const bar     = byId('nxdwBar');

        overlay.addEventListener('click', function (e) { if (e.target === overlay) handleUserClose(); });
        byId('nxdwClose').addEventListener('click', handleUserClose);
        byId('nxdwDoneBtn').addEventListener('click', closeModal);
        byId('nxdwSubmitBtn').addEventListener('click', handleSubmit);
        const applyBtn = byId('nxdwApplyBtn');
        if (applyBtn) applyBtn.addEventListener('click', applyToCart);

        ['nxdwNombre', 'nxdwTelefono'].forEach(function (id) {
            byId(id).addEventListener('keydown', function (e) {
                if (e.key === 'Enter') { e.preventDefault(); handleSubmit(); }
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key !== 'Escape') return;
            const list = byId('nxdwCountryList');
            if (list && !list.classList.contains('nxdw-hidden')) { closeCountryList(); return; }
            if (overlay.classList.contains('nxdw-open')) handleUserClose();
        });
        initCopyBtn();
        initBarCopy();
        initCountryDropdown();

        bar.addEventListener('click', function (e) {
            const item = e.target.closest ? e.target.closest('.nxdw-bar-item--click') : null;
            if (item) openModal();
        });
    }

    // ── Init ─────────────────────────────────────────────────────────────────

    /** Fills in what an older API version doesn't send, so the rest can rely on it. */
    function normalize(d) {
        if (!d) return null;
        return {
            codigo:            d.codigo,
            tipo:              d.tipo || 'porcentaje',
            porcentaje:        d.porcentaje || 0,
            valor:             d.valor || 0,
            minimo:            d.minimo || 0,
            vence:             d.vence || null,
            restantes:         d.restantes == null ? null : d.restantes,
            maxUsosPorCliente: d.maxUsosPorCliente == null ? null : d.maxUsosPorCliente,
            sobreSale:         d.sobreSale !== false,
            categorias:        d.categorias || [],
            marcas:            d.marcas || [],
            generos:           d.generos || [],
            productos:         d.productos || [],
            descripcion:       d.descripcion || '',
            imagen:            d.imagen || ''
        };
    }

    function init() {
        injectMarkup();

        fetch(discountUrl)
            .then(function (r) { return r.json(); })
            .catch(function () { return { found: false, destacado: null, barra: [] }; })
            .then(function (data) {
                destacado = normalize(data.destacado);
                const hasBar = renderBar(data.barra);

                if (!hasBar) { removeMarkup(); return; }

                wireEvents();
                initScroll();
                setInterval(cycleBar, rotateInterval);

                if (destacado) {
                    populateModal();
                    scheduleAutoOpen();
                } else {
                    const overlay = byId('nxdwOverlay');
                    if (overlay) overlay.parentNode.removeChild(overlay);
                }
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
