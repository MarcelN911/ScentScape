// ============================================
// CART.JS — ScentScape
// Shopping cart: state management, CRUD,
// price calculations, UI rendering,
// and WhatsApp checkout
// ============================================

const WHATSAPP_NUMBER         = '+573218101882';
const FREE_SHIPPING_THRESHOLD = 500000;
const CART_STORAGE_KEY        = 'elixir_cart';

let cart = [];

const CODE_STORAGE_KEY        = 'elixir_cart_code';

// ── Applied discount code ─────────────────────
//
// The rule of the code the customer entered, as /api/public/validate-code
// returned it: { codigo, tipo, etiqueta, porcentaje, valor, minimo, sobreSale,
// categorias, marcas, generos, productos }. tipo is 'porcentaje', 'monto' (fixed COP amount) or
// 'envio' (free shipping). null = no code.
//
// The cart recalculates the discount from this rule on every change, so the
// total is always current without asking the server again. The server repeats
// the same calculation when the order is placed and has the last word.
let appliedRule = null;

// ── Persistence ───────────────────────────────

/** Loads the saved cart from localStorage into the `cart` array. */
function loadCart() {
    try {
        const stored = localStorage.getItem(CART_STORAGE_KEY);
        cart = stored ? JSON.parse(stored) : [];
    } catch (e) {
        cart = [];
    }
}

/** Restores the applied code for this browser session (it survives page changes, not a new visit). */
function loadAppliedCode() {
    try {
        const stored = sessionStorage.getItem(CODE_STORAGE_KEY);
        appliedRule = stored ? JSON.parse(stored) : null;
    } catch (e) {
        appliedRule = null;
    }
}

/** Remembers (or forgets) the applied code for this browser session. */
function saveAppliedCode() {
    try {
        if (appliedRule) {
            sessionStorage.setItem(CODE_STORAGE_KEY, JSON.stringify(appliedRule));
        } else {
            sessionStorage.removeItem(CODE_STORAGE_KEY);
        }
    } catch (e) {
        // Private mode: the code simply lasts until the page changes.
    }
}

/** Saves the current `cart` array to localStorage. */
function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// ── Price Helpers ─────────────────────────────
//
// Product prices come straight from the NEXOMAR API as full COP amounts
// (e.g. precio: 1490000), not abbreviated Sheets-style numbers.

/** Parses a cart item's stored price field into a numeric COP amount. */
function rawToPrice(raw) {
    return parseInt(raw, 10);
}

/**
 * Formats a COP amount as a readable string with dot separators.
 * Example: 65000 → "65.000"
 */
function formatCOP(amount) {
    return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// ── Cart CRUD ─────────────────────────────────

/**
 * Adds a product to the cart.
 * If the same SKU already exists, it increases the quantity instead of adding a duplicate.
 * Opens the cart panel after every add.
 */
function addToCart(item) {
    const existing = cart.find(function(c) { return c.sku === item.sku; });
    if (existing) {
        updateExistingCartItem(existing, item.quantity || 1);
    } else {
        insertNewCartItem(item);
    }
    openBasket();
}

/** Increases the quantity of an existing cart item and updates the DOM. */
function updateExistingCartItem(existing, addQty) {
    existing.quantity += addQty;
    saveCart();
    const qtyEl = document.querySelector(`[data-sku="${existing.sku}"] .cart-qty-value`);
    if (qtyEl) {
        qtyEl.textContent = existing.quantity;
    }
    updateTotalsOnly();
}

/**
 * Adds a brand-new item to the cart array and inserts its HTML into the panel.
 * If the panel showed the empty state, it is replaced; otherwise the item is appended.
 */
function insertNewCartItem(item) {
    cart.push({ ...item, quantity: item.quantity || 1 });
    saveCart();
    const content = document.getElementById('cartPanelContent');
    if (!content) {
        return;
    }
    const emptyEl = content.querySelector('.cart-empty');
    const newHtml = buildCartItemHtml(cart[cart.length - 1]);
    if (emptyEl) {
        content.innerHTML = newHtml;
    } else {
        content.insertAdjacentHTML('beforeend', newHtml);
    }
    updateTotalsOnly();
    // A new line may need its brand/gender for the applied code.
    ensureCartRuleData();
}

/**
 * Removes a product from the cart by its SKU.
 * Shows the empty state if the cart becomes empty.
 */
function removeFromCart(sku) {
    cart = cart.filter(function(item) { return item.sku !== sku; });
    saveCart();
    const itemEl = document.querySelector(`[data-sku="${sku}"]`);
    if (itemEl) {
        itemEl.remove();
    }
    if (cart.length === 0) {
        showEmptyCartState();
    }
    updateTotalsOnly();
}

/** Changes the quantity of a cart item by `change` (+1 or −1). Removes if it reaches 0. */
function updateQuantity(sku, change) {
    const item = cart.find(function(c) { return c.sku === sku; });
    if (!item) {
        return;
    }
    const newQty = item.quantity + change;
    if (newQty < 1) {
        removeFromCart(sku);
        return;
    }
    item.quantity = newQty;
    saveCart();
    const qtyEl = document.querySelector(`[data-sku="${sku}"] .cart-qty-value`);
    if (qtyEl) {
        qtyEl.textContent = newQty;
    }
    updateTotalsOnly();
}

/** Renders the empty cart placeholder inside the cart panel. */
function showEmptyCartState() {
    const content = document.getElementById('cartPanelContent');
    if (!content) {
        return;
    }
    content.innerHTML = `
        <div class="cart-empty">
            <img src="./assets/img/shopping-car.svg" alt="Carrito vacío">
            <p>Tu carrito está vacío</p>
            <a href="productos.html" class="cart-empty-link">Ver productos</a>
        </div>`;
}

// ── Price Calculations ────────────────────────

/** Sum of all items at their regular (non-sale) price × quantity. */
function getSubtotal() {
    return cart.reduce(function(sum, item) {
        return sum + rawToPrice(item.regularPrice) * item.quantity;
    }, 0);
}

/**
 * Total amount saved across all items that have a sale price.
 * Items without a sale price are skipped.
 */
function getTotalDiscount() {
    return cart.reduce(function(sum, item) {
        if (!item.salePrice) {
            return sum;
        }
        return sum + (rawToPrice(item.regularPrice) - rawToPrice(item.salePrice)) * item.quantity;
    }, 0);
}

/** What the customer pays for one cart line right now (sale price if it has one). */
function itemLineTotal(item) {
    return rawToPrice(item.salePrice || item.regularPrice) * item.quantity;
}

/** Lower-cased, trimmed copies — the rule and the product data are compared ignoring case. */
function lowerList(list) {
    return (list || []).map(function(x) { return String(x).trim().toLowerCase(); });
}

/** True when the code only covers part of the range (categories, brands, genders or single products). */
function isCodeLimited(rule) {
    return ['categorias', 'marcas', 'generos', 'productos'].some(function(k) { return (rule[k] || []).length > 0; });
}

/**
 * The cart lines the applied code acts on. A line counts if it is one of the
 * code's single products, or if it passes every filter the code sets
 * (category AND brand AND gender). Sale items only if the code allows them.
 * Mirrors itemsAplicables() in the NEXOMAR server.
 */
function getCodeEligibleItems(rule) {
    const cats       = lowerList(rule.categorias);
    const brands     = lowerList(rule.marcas);
    const genders    = lowerList(rule.generos);
    const prods      = (rule.productos || []).map(String);
    const hasFilters = cats.length > 0 || brands.length > 0 || genders.length > 0;
    return cart.filter(function(item) {
        if (rule.sobreSale === false && item.salePrice) {
            return false;
        }
        if (!hasFilters && !prods.length) {
            return true;
        }
        if (item.productId && prods.includes(String(item.productId))) {
            return true;
        }
        if (!hasFilters) {
            return false;
        }
        if (cats.length && !cats.includes(String(item.category || '').trim().toLowerCase())) {
            return false;
        }
        if (brands.length && !brands.includes(String(item.ruleBrand || item.brand || '').trim().toLowerCase())) {
            return false;
        }
        if (genders.length && !lowerList(item.genders).some(function(g) { return genders.includes(g); })) {
            return false;
        }
        return true;
    });
}

/**
 * What the applied code does to the current cart.
 * `reason` is set when the code is entered but not usable right now (cart
 * below the minimum, no matching products) — it stays in the cart and starts
 * working again as soon as the cart qualifies.
 */
function getCodeState() {
    const none = { active: false, amount: 0, freeShipping: false, reason: '' };
    if (!appliedRule || cart.length === 0) {
        return none;
    }
    const net  = getSubtotal() - getTotalDiscount();
    const base = getCodeEligibleItems(appliedRule).reduce(function(sum, item) {
        return sum + itemLineTotal(item);
    }, 0);
    if (base <= 0) {
        const onlySale = appliedRule.sobreSale === false && !isCodeLimited(appliedRule);
        return Object.assign({}, none, {
            reason: onlySale
                ? 'Este código no aplica a productos en oferta.'
                : 'Este código no aplica a los productos de tu carrito.'
        });
    }
    if (appliedRule.minimo > 0 && net < appliedRule.minimo) {
        return Object.assign({}, none, {
            reason: `Agrega $${formatCOP(appliedRule.minimo - net)} COP más para usar ${appliedRule.codigo}.`
        });
    }
    let amount = 0;
    if (appliedRule.tipo === 'porcentaje') {
        amount = Math.round(base * (appliedRule.porcentaje || 0) / 100);
    } else if (appliedRule.tipo === 'monto') {
        amount = Math.min(Math.round(appliedRule.valor || 0), base);
    }
    return {
        active:       true,
        amount:       amount,
        freeShipping: appliedRule.tipo === 'envio',
        partial:      base < net,
        reason:       ''
    };
}

/** Amount saved by the applied discount code, on top of item-level sale prices. */
function getCodeDiscountAmount() {
    return getCodeState().amount;
}

/** The actual amount the customer pays after item discounts and the applied code. */
function getFinalTotal() {
    return getSubtotal() - getTotalDiscount() - getCodeDiscountAmount();
}

/** How many more COP the customer needs to reach free shipping. 0 if already eligible. */
function getShippingShortfall() {
    if (getCodeState().freeShipping) {
        return 0;
    }
    return Math.max(0, FREE_SHIPPING_THRESHOLD - getFinalTotal());
}

/**
 * Returns a summary object with all totals in one place.
 * Used by the render functions to avoid calling each calculation separately.
 */
function getCartSummary() {
    const subtotal          = getSubtotal();
    const totalDiscount     = getTotalDiscount();
    const codeState         = getCodeState();
    const codeDiscount      = codeState.amount;
    const finalTotal        = getFinalTotal();
    const shippingShortfall = getShippingShortfall();
    return {
        itemCount:       cart.reduce(function(sum, item) { return sum + item.quantity; }, 0),
        subtotal:        subtotal,
        totalDiscount:   totalDiscount,
        codeDiscount:    codeDiscount,
        // Only a code that is actually working on this cart goes into the order.
        appliedCode:     codeState.active ? appliedRule.codigo : '',
        appliedLabel:    codeState.active ? (appliedRule.etiqueta || '') : '',
        codeFreeShipping: codeState.freeShipping,
        codeReason:      codeState.reason,
        codePartial:     !!codeState.partial,
        finalTotal:      finalTotal,
        shippingShortfall: shippingShortfall,
        hasFreeShipping: cart.length > 0 && shippingShortfall === 0
    };
}

// ── Cart Item HTML Template ───────────────────
// Note: buildCartItemHtml is a large HTML template and is intentionally
// kept as one function for readability. It is excluded from the 14-line limit.

function buildCartItemHtml(item) {
    const saleBadge = item.salePrice
        ? '<span class="cart-item-sale-tag">Oferta</span>'
        : '';

    const priceHtml = item.salePrice
        ? `<span class="cart-item-price">$${formatCOP(rawToPrice(item.salePrice))}</span>
           <span class="cart-item-price-old">$${formatCOP(rawToPrice(item.regularPrice))}</span>`
        : `<span class="cart-item-price">$${formatCOP(rawToPrice(item.regularPrice))}</span>`;

    return `
        <div class="cart-item" data-sku="${item.sku}">
            <div class="cart-item-image">
                <img src="${item.image || './assets/img/scentscape-logo.png'}"
                     alt="${item.name}" loading="lazy">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-top">
                    <div class="cart-item-meta">
                        <p class="cart-item-name">${item.name} ${saleBadge}</p>
                        <p class="cart-item-variant">${item.size} ml · ${item.brand}</p>
                    </div>
                    <button class="cart-item-remove-x"
                            onclick="removeFromCart('${item.sku}')"
                            aria-label="Eliminar producto">×</button>
                </div>
                <div class="cart-item-bottom">
                    <div class="cart-item-qty">
                        <button class="cart-qty-btn"
                                onclick="updateQuantity('${item.sku}', -1)"
                                aria-label="Reducir cantidad">−</button>
                        <span class="cart-qty-value">${item.quantity}</span>
                        <button class="cart-qty-btn"
                                onclick="updateQuantity('${item.sku}', 1)"
                                aria-label="Aumentar cantidad">+</button>
                    </div>
                    <div class="cart-item-price-wrap">
                        ${priceHtml}
                        <span class="cart-item-cop">COP</span>
                    </div>
                </div>
            </div>
        </div>`;
}

// ── UI Rendering ──────────────────────────────

/**
 * Renders the full list of cart items into the panel.
 * Shows the empty state if the cart has no items.
 */
function renderCartItems() {
    const content = document.getElementById('cartPanelContent');
    if (!content) {
        return;
    }
    if (cart.length === 0) {
        showEmptyCartState();
        return;
    }
    content.innerHTML = cart.map(buildCartItemHtml).join('');
}

/** Updates all badge elements (icon + bar) that display the total item count. */
function updateCartCounts() {
    const summary = getCartSummary();
    document.querySelectorAll('.cart-count').forEach(function(el) {
        el.textContent = summary.itemCount;
        el.classList.toggle('active', summary.itemCount > 0);
    });
    const barCount = document.getElementById('cartBarCount');
    if (barCount) {
        barCount.textContent = summary.itemCount;
    }
}

/** Shows or hides the sticky cart bar and updates its item count and total. */
function updateCartBar() {
    const summary = getCartSummary();
    const cartBar = document.getElementById('cartBar');
    if (!cartBar) {
        return;
    }
    cartBar.classList.toggle('active', summary.itemCount > 0);
    const itemsText = document.getElementById('cartItemsText');
    if (itemsText) {
        if (summary.itemCount === 1) {
            itemsText.textContent = '1 artículo';
        } else {
            itemsText.textContent = `${summary.itemCount} artículos`;
        }
    }
    const totalEl = document.getElementById('cartTotal');
    if (totalEl) {
        totalEl.textContent = formatCOP(summary.finalTotal);
    }
}

/**
 * Renders the subtotal, discount row, and final total in the cart footer.
 * The discount row is hidden when there are no discounts.
 */
function renderPriceSummary(summary) {
    const subtotalEl = document.getElementById('cartSubtotal');
    if (subtotalEl) {
        subtotalEl.textContent = `$${formatCOP(summary.subtotal)} COP`;
    }
    const discountRow = document.getElementById('cartDiscountRow');
    const discountEl  = document.getElementById('cartDiscount');
    if (discountRow && discountEl) {
        if (summary.totalDiscount > 0) {
            discountRow.style.display = 'flex';
        } else {
            discountRow.style.display = 'none';
        }
        discountEl.textContent = `−$${formatCOP(summary.totalDiscount)} COP`;
    }
    const codeRow   = document.getElementById('cartCodeDiscountRow');
    const codeLabel = document.getElementById('cartCodeDiscountLabel');
    const codeEl    = document.getElementById('cartCodeDiscount');
    if (codeRow && codeEl) {
        if (summary.codeDiscount > 0 || summary.codeFreeShipping) {
            codeRow.style.display = 'flex';
            if (codeLabel) {
                codeLabel.textContent = `Código ${summary.appliedCode}`;
            }
            if (summary.codeFreeShipping) {
                codeEl.textContent = 'Envío gratis';
            } else {
                codeEl.textContent = `−$${formatCOP(summary.codeDiscount)} COP`;
            }
        } else {
            codeRow.style.display = 'none';
        }
    }
    const totalEl = document.getElementById('cartFinalTotal');
    if (totalEl) {
        totalEl.textContent = `$${formatCOP(summary.finalTotal)} COP`;
    }
}

/**
 * Updates the free-shipping progress bar and the text below it.
 * The bar fills up as the customer gets closer to the free-shipping threshold.
 */
function renderShippingBar(summary) {
    const progressEl   = document.getElementById('cartShippingProgress');
    const shippingText = document.getElementById('cartShippingText');
    if (!progressEl || !shippingText) {
        return;
    }
    if (cart.length === 0) {
        progressEl.style.width = '0%';
        shippingText.textContent = `Envío gratis desde $${formatCOP(FREE_SHIPPING_THRESHOLD)} COP`;
        shippingText.classList.remove('is-free');
        return;
    }
    const pct = Math.min(100, (summary.finalTotal / FREE_SHIPPING_THRESHOLD) * 100);
    progressEl.style.width = `${pct}%`;
    if (summary.codeFreeShipping) {
        progressEl.style.width = '100%';
        shippingText.textContent = `¡Envío gratis con tu código ${summary.appliedCode}! 🎉`;
        shippingText.classList.add('is-free');
    } else if (summary.hasFreeShipping) {
        shippingText.textContent = '¡Envío gratis incluido! 🎉';
        shippingText.classList.add('is-free');
    } else {
        shippingText.textContent = `Te faltan $${formatCOP(summary.shippingShortfall)} COP para envío gratis`;
        shippingText.classList.remove('is-free');
    }
}

/** Renders the full cart summary: prices, shipping bar, and checkout button state. */
function renderCartSummary() {
    const summary = getCartSummary();
    renderPriceSummary(summary);
    renderShippingBar(summary);
    renderCodeFeedback(summary);
    const checkoutBtn = document.getElementById('cartCheckoutBtn');
    if (checkoutBtn) {
        checkoutBtn.disabled = summary.itemCount === 0;
    }
}

/** Updates only the totals (no item re-render). Used after quantity changes. */
function updateTotalsOnly() {
    renderCartSummary();
    updateCartCounts();
    updateCartBar();
}

/** Full re-render of the cart: items + totals + counts + bar. */
function updateCartUI() {
    renderCartItems();
    renderCartSummary();
    updateCartCounts();
    updateCartBar();
}

// ── Checkout Modal ────────────────────────────

/** Opens the checkout modal and focuses the name field for a smooth UX. */
function openCheckoutModal() {
    if (cart.length === 0) {
        return;
    }
    const modal = document.getElementById('checkoutModal');
    if (!modal) {
        return;
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    const nameInput = document.getElementById('checkoutName');
    if (nameInput) {
        nameInput.focus();
    }
}

/** Closes the checkout modal and clears any validation error messages. */
function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (!modal) {
        return;
    }
    modal.classList.remove('active');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    const errorEl = document.getElementById('checkoutError');
    if (errorEl) {
        errorEl.textContent = '';
    }
}

/** Reads all checkout form fields into a single object. */
function readCheckoutFields() {
    return {
        name:       document.getElementById('checkoutName').value.trim(),
        celular:    document.getElementById('checkoutCelular').value.trim(),
        ciudad:     document.getElementById('checkoutCiudad').value.trim(),
        barrio:     document.getElementById('checkoutBarrio').value.trim(),
        direccion:  document.getElementById('checkoutDireccion').value.trim(),
        referencia: document.getElementById('checkoutReferencia').value.trim()
    };
}

/**
 * Returns the first required field that is empty, or null if all are filled.
 * Used to show a targeted error message to the customer.
 */
function findFirstEmptyField(fields) {
    const required = [
        { key: 'name',      id: 'checkoutName',      message: 'Por favor ingresa tu nombre completo.'   },
        { key: 'celular',   id: 'checkoutCelular',   message: 'Por favor ingresa tu número de celular.' },
        { key: 'ciudad',    id: 'checkoutCiudad',    message: 'Por favor ingresa tu ciudad.'             },
        { key: 'barrio',    id: 'checkoutBarrio',    message: 'Por favor ingresa tu barrio o sector.'   },
        { key: 'direccion', id: 'checkoutDireccion', message: 'Por favor ingresa tu dirección.'         }
    ];
    return required.find(function(field) { return !fields[field.key]; }) || null;
}

/**
 * Validates all required checkout fields.
 * Returns the filled fields object if valid, or null if a field is missing
 * (also shows an error message and focuses the empty field).
 */
function validateCheckoutForm() {
    const fields  = readCheckoutFields();
    const errorEl = document.getElementById('checkoutError');
    const invalid = findFirstEmptyField(fields);
    if (invalid) {
        errorEl.textContent = invalid.message;
        document.getElementById(invalid.id).focus();
        return null;
    }
    errorEl.textContent = '';
    return fields;
}

// ── Discount code ──────────────────────────────

/** The cart lines in the shape the NEXOMAR API expects (order and code validation). */
function buildApiItems() {
    return cart.map(function(item) {
        return {
            nombre:    item.name,
            cantidad:  item.quantity,
            precio:    rawToPrice(item.salePrice || item.regularPrice),
            variante:  item.size ? `${item.size} ml` : '',
            marca:     item.brand || '',
            productId: item.productId || null
        };
    });
}

/**
 * Shows what the applied code is doing under the code field: the saving, or
 * why it isn't applying to this cart right now. Other messages (errors while
 * checking a code) are written directly by applyDiscountCode.
 */
function renderCodeFeedback(summary) {
    const fb = document.getElementById('cartCodeFeedback');
    if (!fb || !appliedRule) {
        return;
    }
    let text;
    let state;
    if (cart.length === 0) {
        text  = `Código ${appliedRule.codigo} listo: se aplicará cuando agregues productos.`;
        state = 'ok';
    } else if (summary.codeReason) {
        text  = summary.codeReason;
        state = 'error';
    } else if (summary.codeFreeShipping) {
        text  = `¡Código ${appliedRule.codigo} aplicado! Envío gratis`;
        state = 'ok';
    } else {
        text  = `¡Código ${appliedRule.codigo} aplicado! −$${formatCOP(summary.codeDiscount)} COP`;
        if (summary.codePartial) {
            text += ' en los productos que aplican';
        }
        state = 'ok';
    }
    fb.className = `cart-code-feedback cart-code-feedback--${state}`;
    fb.textContent = text + ' ';
    const remove = document.createElement('button');
    remove.type        = 'button';
    remove.className   = 'cart-code-remove';
    remove.textContent = 'Quitar';
    remove.addEventListener('click', removeDiscountCode);
    fb.appendChild(remove);
}

/**
 * A code limited to categories, brands or genders needs that data on each
 * cart line, and the cart only stores what it shows. Fetch it once from the
 * product list (brand and gender live in the product's "Marca"/"Género"
 * variants), so the code isn't wrongly shown as "does not apply".
 */
async function ensureCartRuleData() {
    if (!appliedRule) {
        return;
    }
    const needsData = ['categorias', 'marcas', 'generos'].some(function(k) { return (appliedRule[k] || []).length > 0; });
    const missing   = cart.some(function(item) { return item.productId && !item.ruleData; });
    if (!needsData || !missing || typeof productsUrl === 'undefined') {
        return;
    }
    try {
        const res  = await fetch(productsUrl);
        const list = await res.json();
        const byId = {};
        (Array.isArray(list) ? list : []).forEach(function(p) { byId[String(p._id)] = p; });
        const variantOptions = function(p, name) {
            const v = (p.variantes || []).find(function(x) { return x.nombre === name; });
            return (v && v.opciones) || [];
        };
        cart.forEach(function(item) {
            const p = item.productId ? byId[String(item.productId)] : null;
            if (!p || item.ruleData) {
                return;
            }
            item.category  = p.categoria || '';
            item.ruleBrand = variantOptions(p, 'Marca')[0] || p.marca || '';
            item.genders   = variantOptions(p, 'Género');
            item.ruleData  = true;
        });
        saveCart();
        updateTotalsOnly();
    } catch (e) {
        // The server still applies the code correctly when the order is placed.
    }
}

/**
 * Last check before the order goes out, now that the customer's phone number
 * is known: codes can be limited per customer, and coupons can run out while
 * the cart sits open. Returns false (and takes the code off) if it no longer
 * holds, so the WhatsApp message never promises a discount the shop won't honour.
 */
async function confirmCodeForCustomer(customer) {
    try {
        const res  = await fetch(validateUrl, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ shopId: _shopId, codigo: appliedRule.codigo, telefono: customer.celular, items: buildApiItems() })
        });
        const data = await res.json();
        if (data.valid !== false) {
            return true;
        }
        const codigo = appliedRule.codigo;
        removeDiscountCode();
        const errorEl = document.getElementById('checkoutError');
        if (errorEl) {
            errorEl.textContent = `${data.error || 'El código ya no es válido'}. Quitamos ${codigo} de tu pedido: revisa el total y envíalo de nuevo.`;
        }
        return false;
    } catch (e) {
        // Don't lose a sale over a failed check; the shop sees the real total.
        return true;
    }
}

/** Takes the applied code off the cart. */
function removeDiscountCode() {
    appliedRule = null;
    saveAppliedCode();
    const input = document.getElementById('cartCodigo');
    const fb    = document.getElementById('cartCodeFeedback');
    if (input) {
        input.value = '';
    }
    if (fb) {
        fb.textContent = '';
        fb.className   = 'cart-code-feedback';
    }
    updateTotalsOnly();
}

/** Validates the entered code against the shop's active discounts and applies it. */
async function applyDiscountCode() {
    const input  = document.getElementById('cartCodigo');
    const btn    = document.getElementById('cartCodeApplyBtn');
    const fb     = document.getElementById('cartCodeFeedback');
    const codigo = input ? input.value.trim().toUpperCase() : '';

    if (!fb) {
        return;
    }
    if (!codigo) {
        fb.textContent = 'Ingresa un código.';
        fb.className   = 'cart-code-feedback cart-code-feedback--error';
        return;
    }

    if (btn) {
        btn.disabled = true;
    }
    fb.textContent = 'Verificando…';
    fb.className   = 'cart-code-feedback';

    try {
        // Without items the server checks only what it can say without a cart
        // (active, dates, coupons left) and returns the rule; the conditions
        // that depend on the cart are then evaluated here, on every change.
        const res  = await fetch(validateUrl, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ shopId: _shopId, codigo: codigo })
        });
        const data = await res.json();
        if (data.valid) {
            appliedRule = {
                codigo:     data.codigo,
                tipo:       data.tipo || 'porcentaje',
                etiqueta:   data.etiqueta || `${data.porcentaje}%`,
                porcentaje: data.porcentaje || 0,
                valor:      data.valor || 0,
                minimo:     data.minimo || 0,
                sobreSale:  data.sobreSale !== false,
                categorias: data.categorias || [],
                marcas:     data.marcas || [],
                generos:    data.generos || [],
                productos:  data.productos || []
            };
        } else {
            appliedRule    = null;
            fb.textContent = data.error || 'Código no válido';
            fb.className   = 'cart-code-feedback cart-code-feedback--error';
        }
        saveAppliedCode();
        updateTotalsOnly();
        ensureCartRuleData();
    } catch (e) {
        fb.textContent = 'Error al verificar el código';
        fb.className   = 'cart-code-feedback cart-code-feedback--error';
    }
    if (btn) {
        btn.disabled = false;
    }
}

// ── WhatsApp Message Builder ──────────────────

/**
 * Builds the text line for a single cart item in the WhatsApp message.
 * Shows the sale price and original price if the item is on offer.
 */
function buildItemLine(item) {
    const qty = `${item.quantity} x `;
    let total;
    let priceText;
    if (item.salePrice) {
        total     = rawToPrice(item.salePrice) * item.quantity;
        priceText = `*$${formatCOP(total)} COP* ¡Oferta! (antes $${formatCOP(rawToPrice(item.regularPrice))} COP)`;
    } else {
        total     = rawToPrice(item.regularPrice) * item.quantity;
        priceText = `$${formatCOP(total)} COP`;
    }
    return `• ${qty}${item.brand} - ${item.name} (${item.size} ml) — ${priceText}`;
}

/** Builds the discount, shipping, and reference lines for the order summary. */
function buildOrderExtras(summary, referencia) {
    let discountLine;
    if (summary.totalDiscount > 0) {
        discountLine = `\nDescuento: − $${formatCOP(summary.totalDiscount)} COP`;
    } else {
        discountLine = '';
    }
    let codeLine;
    if (summary.codeDiscount > 0) {
        codeLine = `\nCódigo *${summary.appliedCode}* (${summary.appliedLabel}): − $${formatCOP(summary.codeDiscount)} COP`;
    } else if (summary.codeFreeShipping) {
        codeLine = `\nCódigo *${summary.appliedCode}*: envío gratis`;
    } else {
        codeLine = '';
    }
    let shippingLine;
    if (summary.hasFreeShipping) {
        shippingLine = '\nEnvío: *¡GRATIS!*';
    } else {
        shippingLine = '\nEnvío: A calcular';
    }
    let refLine;
    if (referencia) {
        refLine = `\n*Referencia:* ${referencia}`;
    } else {
        refLine = '';
    }
    return { discountLine, codeLine, shippingLine, refLine };
}

/** Composes the full WhatsApp order message from customer data and cart summary. */
function buildWhatsAppText(customer, itemLines, summary, extras) {
    return (
`*NUEVO PEDIDO — ScentScape*

Hola, quiero hacer un pedido con la siguiente información:

*Cliente:* ${customer.name}
*Celular:* ${customer.celular}
*Dirección:* ${customer.direccion}
*Ciudad/Barrio:* ${customer.ciudad} / ${customer.barrio}${extras.refLine}

*Productos:*
${itemLines}

*Resumen del pedido:*
Subtotal: $${formatCOP(summary.subtotal)} COP${extras.discountLine}${extras.codeLine}${extras.shippingLine}

*Total a pagar: $${formatCOP(summary.finalTotal)} COP*`
    );
}

/** Assembles the complete WhatsApp message by calling the helper functions above. */
function generateWhatsAppMessage(customerData) {
    const summary   = getCartSummary();
    const itemLines = cart.map(buildItemLine).join('\n');
    const extras    = buildOrderExtras(summary, customerData.referencia);
    return buildWhatsAppText(customerData, itemLines, summary, extras);
}

// ── Order Submission ──────────────────────────

/** Returns true when the user is on a mobile device (used to open the native WhatsApp app). */
function isMobileDevice() {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/** Saves the cliente + order to NEXOMAR in the background (fire-and-forget). */
function saveOrder(customer) {
    if (typeof orderUrl === 'undefined' || typeof _shopId === 'undefined') {
        return;
    }
    const summary = getCartSummary();
    const items = buildApiItems();
    fetch(orderUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            shopId:          _shopId,
            nombre:          customer.name,
            telefono:        customer.celular,
            ciudad:          customer.ciudad,
            barrio:          customer.barrio    || '',
            direccion:       customer.direccion || '',
            items:           items,
            // Prices, total and discount are recalculated by the server.
            codigoDescuento: summary.appliedCode || ''
        })
    }).catch(function() {});
}

/**
 * Validates the form, generates the WhatsApp message, and opens WhatsApp.
 * On mobile: opens the native app. On desktop: opens WhatsApp Web in a new tab.
 */
async function submitOrder() {
    const customerData = validateCheckoutForm();
    if (!customerData) {
        return;
    }
    const mobile = isMobileDevice();
    let waWindow = null;
    if (getCartSummary().appliedCode) {
        // The tab has to be opened inside the click itself — after the check
        // below, browsers treat window.open as an unrequested pop-up.
        if (!mobile) {
            waWindow = window.open('', '_blank');
        }
        const stillValid = await confirmCodeForCustomer(customerData);
        if (!stillValid) {
            if (waWindow) {
                waWindow.close();
            }
            return;
        }
    }
    const message = generateWhatsAppMessage(customerData);
    const phone   = WHATSAPP_NUMBER.replace('+', '');
    const encoded = encodeURIComponent(message);
    if (mobile) {
        window.location.href = `whatsapp://send?phone=${phone}&text=${encoded}`;
    } else if (waWindow) {
        waWindow.location.href = `https://wa.me/${phone}?text=${encoded}`;
    } else {
        window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
    }
    saveOrder(customerData);
    closeCheckoutModal();
}

// ── Init & Event Listeners ────────────────────

loadCart();
loadAppliedCode();
ensureCartRuleData();

// The discount modal hands over the code the customer just unlocked.
window.addEventListener('nxdw:apply-code', function(e) {
    const input = document.getElementById('cartCodigo');
    if (!input || !e.detail || !e.detail.codigo) {
        return;
    }
    input.value = String(e.detail.codigo).toUpperCase();
    openBasket();
    applyDiscountCode();
});

const cartBarButton = document.getElementById('cartBar');
if (cartBarButton) {
    cartBarButton.addEventListener('click', openBasket);
}

const cartButtonMobile = document.getElementById('cartButtonMobile');
if (cartButtonMobile) {
    cartButtonMobile.addEventListener('click', openBasket);
}

const cartCheckoutBtn = document.getElementById('cartCheckoutBtn');
if (cartCheckoutBtn) {
    cartCheckoutBtn.addEventListener('click', openCheckoutModal);
}

const cartCodeApplyBtn = document.getElementById('cartCodeApplyBtn');
if (cartCodeApplyBtn) {
    cartCodeApplyBtn.addEventListener('click', applyDiscountCode);
}

const cartCodigoInput = document.getElementById('cartCodigo');
if (cartCodigoInput) {
    if (appliedRule) {
        cartCodigoInput.value = appliedRule.codigo;
    }
    cartCodigoInput.addEventListener('input', function() {
        this.value = this.value.toUpperCase();
    });
    cartCodigoInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyDiscountCode();
        }
    });
}

const checkoutModalClose = document.getElementById('checkoutModalClose');
if (checkoutModalClose) {
    checkoutModalClose.addEventListener('click', closeCheckoutModal);
}

const checkoutModalOverlay = document.getElementById('checkoutModalOverlay');
if (checkoutModalOverlay) {
    checkoutModalOverlay.addEventListener('click', closeCheckoutModal);
}

const checkoutForm = document.getElementById('checkoutForm');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        submitOrder();
    });
}

updateCartUI();
