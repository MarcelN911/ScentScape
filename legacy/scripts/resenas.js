// ============================================
// RESENAS.JS — ScentScape
// Review form page: star picker, live perfume
// search (brand + name), validation, submit
// to the NEXOMAR API
// ============================================

const rsForm       = document.getElementById('resenaForm');
const rsSubmit     = document.getElementById('resenaSubmit');
const rsFeedback   = document.getElementById('resenaFeedback');

let rsProducts = [];

/** Escapes text for safe insertion into HTML. */
function rsEsc(text) {
    return String(text == null ? '' : text)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── Stars ─────────────────────────────────────

const rsStarButtons = Array.prototype.slice.call(document.querySelectorAll('#resenaStarPicker .rs-star'));
const rsRatingInput = document.getElementById('resenaCalificacion');
let rsRating = 0;

const rsStarText = document.getElementById('resenaStarText');
const rsRatingLabels = ['Toca una estrella', 'Malo', 'Regular', 'Bueno', 'Muy bueno', 'Excelente'];

function rsPaintStars(value) {
    rsStarButtons.forEach(function(btn) {
        btn.classList.toggle('is-active', parseInt(btn.dataset.val, 10) <= value);
    });
    rsStarText.textContent = rsRatingLabels[value];
}

function rsSetRating(value) {
    rsRating = value;
    rsRatingInput.value = value;
    rsPaintStars(value);
}

rsStarButtons.forEach(function(btn) {
    btn.addEventListener('mouseenter', function() { rsPaintStars(parseInt(btn.dataset.val, 10)); });
    btn.addEventListener('click', function() { rsSetRating(parseInt(btn.dataset.val, 10)); });
});
document.getElementById('resenaStarPicker').addEventListener('mouseleave', function() { rsPaintStars(rsRating); });

// ── Perfume search (combobox) ─────────────────

const rsCombo      = document.getElementById('resenaCombo');
const rsInput      = document.getElementById('resenaProducto');
const rsList       = document.getElementById('resenaProductoList');
const rsValue      = document.getElementById('resenaProductoValor');
const rsClearBtn   = document.getElementById('resenaProductoClear');

/** Brand of a product: own field, else the "Marca" variant. */
function rsBrandOf(product) {
    if (product.marca) return product.marca;
    const v = (product.variantes || []).filter(function(x) { return x.nombre === 'Marca'; })[0];
    return (v && v.opciones && v.opciones[0]) || '';
}

/** Lower-case without accents, so "sauvage" also finds "Sauvagé". */
function rsPlain(text) {
    return String(text || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/**
 * Products matching the query: brand and name together, every word must match
 * a word start (then anywhere in the text). "dior sauv" finds Dior · Sauvage.
 */
function rsMatches(query) {
    const sorted = rsProducts.slice().sort(function(a, b) { return (a.nombre || '').localeCompare(b.nombre || '', 'es'); });
    const q = rsPlain(query).trim();
    if (!q) return sorted;
    const words = q.split(/\s+/);
    const text  = function(p) { return rsPlain(rsBrandOf(p) + ' ' + p.nombre); };

    const byWord = sorted.filter(function(p) {
        const parts = text(p).split(/\s+/);
        return words.every(function(w) { return parts.some(function(x) { return x.indexOf(w) === 0; }); });
    });
    if (byWord.length) return byWord;

    return sorted.filter(function(p) {
        const t = text(p);
        return words.every(function(w) { return t.indexOf(w) !== -1; });
    });
}

function rsRenderOptions(query) {
    if (!rsProducts.length) {
        rsList.innerHTML = '<li class="rs-combo-empty">Cargando perfumes…</li>';
        return;
    }
    const hits = rsMatches(query);
    if (!hits.length) {
        rsList.innerHTML = '<li class="rs-combo-empty">Ningún perfume coincide.</li>';
        return;
    }
    rsList.innerHTML = hits.map(function(p) {
        const brand = rsBrandOf(p);
        return '<li class="rs-combo-option' + (p.nombre === rsValue.value ? ' is-selected' : '') +
            '" role="option" data-nombre="' + rsEsc(p.nombre) + '">' +
            (brand ? '<small>' + rsEsc(brand) + '</small>' : '') + rsEsc(p.nombre) + '</li>';
    }).join('');
}

function rsOpenList(query) {
    rsRenderOptions(query);
    rsList.classList.add('is-open');
    rsInput.setAttribute('aria-expanded', 'true');
}

function rsCloseList() {
    rsList.classList.remove('is-open');
    rsInput.setAttribute('aria-expanded', 'false');
}

/** @param {string} nombre empty string clears the selection */
function rsSelectProduct(nombre) {
    rsValue.value = nombre || '';
    rsInput.value = nombre || '';
    rsCombo.classList.toggle('has-value', !!nombre);
    rsClearBtn.hidden = !nombre;
}

rsInput.addEventListener('input', function() {
    if (rsInput.value.trim() === '') rsSelectProduct('');
    rsOpenList(rsInput.value);
});

rsInput.addEventListener('focus', function() {
    rsOpenList('');
    rsInput.select();
});

rsInput.addEventListener('keydown', function(e) {
    const options = Array.prototype.slice.call(rsList.querySelectorAll('.rs-combo-option'));
    if (e.key === 'Escape') { rsCloseList(); return; }
    if (!options.length) return;
    const i = options.findIndex(function(o) { return o.classList.contains('is-active'); });
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!rsList.classList.contains('is-open')) rsOpenList(rsInput.value);
        const next = e.key === 'ArrowDown' ? Math.min(i + 1, options.length - 1) : Math.max(i - 1, 0);
        options.forEach(function(o, j) { o.classList.toggle('is-active', j === next); });
        options[next].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && i !== -1) {
        e.preventDefault();
        rsSelectProduct(options[i].dataset.nombre);
        rsCloseList();
    }
});

// Half-typed text that belongs to nothing must not claim a product: on leave
// the field shows the actual selection again.
rsInput.addEventListener('blur', function() {
    setTimeout(function() { rsSelectProduct(rsValue.value); }, 150);
});

rsList.addEventListener('mousedown', function(e) { e.preventDefault(); });
rsList.addEventListener('click', function(e) {
    const option = e.target.closest('.rs-combo-option');
    if (!option) return;
    rsSelectProduct(option.dataset.nombre);
    rsCloseList();
});

rsClearBtn.addEventListener('click', function() {
    rsSelectProduct('');
    rsInput.focus();
});

document.addEventListener('click', function(e) {
    if (!rsCombo.contains(e.target)) rsCloseList();
});

/** Loads the shop's catalog for the search; the form works without it. */
async function rsLoadProducts() {
    try {
        const response = await fetch(productsUrl);
        const products = await response.json();
        rsProducts = Array.isArray(products) ? products.filter(function(p) { return p.nombre; }) : [];
    } catch (err) {
        console.error('[ScentScape] No se pudieron cargar los perfumes:', err);
        rsProducts = [];
    }
    if (rsList.classList.contains('is-open')) rsRenderOptions(rsInput.value);
    rsPreselectFromUrl();
}

/** Coming from a product page ("Escribir una reseña"): ?producto=<name> preselects it. */
function rsPreselectFromUrl() {
    const nombre = new URLSearchParams(window.location.search).get('producto');
    if (!nombre) return;
    const key = rsPlain(nombre).trim();
    const match = rsProducts.filter(function(p) { return rsPlain(p.nombre).trim() === key; })[0];
    if (match) rsSelectProduct(match.nombre);
}

// ── Submit ────────────────────────────────────

function rsFormData() {
    return {
        shopId:       _shopId,
        nombre:       document.getElementById('resenaNombre').value.trim(),
        telefono:     document.getElementById('resenaTelefono').value.trim(),
        calificacion: rsRating,
        producto:     rsValue.value || null,
        texto:        document.getElementById('resenaTexto').value.trim()
    };
}

function rsValidate(data) {
    if (!data.nombre)       return 'Ingresa tu nombre.';
    if (!data.telefono)     return 'Ingresa tu WhatsApp o teléfono.';
    if (!data.calificacion) return 'Selecciona una calificación.';
    if (!data.texto)        return 'Cuéntanos tu experiencia.';
    return null;
}

function rsShowFeedback(type, text) {
    rsFeedback.textContent = text;
    rsFeedback.className = 'rs-feedback is-' + type;
}

const rsThanks     = document.getElementById('resenaThanks');
const rsCount      = document.getElementById('resenaCount');
const rsText       = document.getElementById('resenaTexto');

rsText.addEventListener('input', function() { rsCount.textContent = rsText.value.length; });

function rsReset() {
    rsForm.reset();
    rsSetRating(0);
    rsSelectProduct('');
    rsCount.textContent = '0';
    rsFeedback.textContent = '';
}

function rsShowThanks(name) {
    document.getElementById('resenaThanksName').textContent = name || 'gracias por tu tiempo';
    rsForm.hidden = true;
    rsThanks.hidden = false;
}

document.getElementById('resenaAgain').addEventListener('click', function() {
    rsThanks.hidden = true;
    rsForm.hidden = false;
});

async function rsHandleSubmit(event) {
    event.preventDefault();
    const data  = rsFormData();
    const error = rsValidate(data);
    if (error) { rsShowFeedback('error', error); return; }

    rsSubmit.disabled = true;
    try {
        const response = await fetch(resenaUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const body = await response.json().catch(function() { return {}; });
        if (!response.ok) {
            rsShowFeedback('error', body.error || 'No se pudo enviar tu reseña. Intenta de nuevo.');
            return;
        }
        rsReset();
        rsShowThanks(data.nombre);
    } catch (err) {
        console.error('[ScentScape] No se pudo enviar la reseña:', err);
        rsShowFeedback('error', 'Error de conexión. Intenta de nuevo.');
    } finally {
        rsSubmit.disabled = false;
    }
}

rsForm.addEventListener('submit', rsHandleSubmit);
rsLoadProducts();
