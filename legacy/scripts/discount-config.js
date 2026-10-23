// Site-specific settings for the discount widget (scripts/discount-widget.js).
window.NXDW_CONFIG = {
    // Extra non-discount lines shown in the announcement bar, alongside
    // whatever discount is currently destacado/en la barra.
    extraItems: [
        { texto: 'Envío gratis desde $500.000 COP' },
        { texto: 'Envíos a toda Colombia' }
    ],
    // The cart (scripts/cart.js) listens for the widget's `nxdw:apply-code`
    // event, so the modal can offer "Usar en mi carrito".
    canApplyToCart: true
};
