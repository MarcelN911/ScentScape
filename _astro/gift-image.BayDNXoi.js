import{t as e}from"./gift-card.B5vriQ9d.js";function t(e){return e.match(/#[0-9a-f]{3,8}/gi)??[`#1E2342`]}function n(e){return e.map((t,n)=>`<stop offset="${n/Math.max(1,e.length-1)*100}%" stop-color="${t}"/>`).join(``)}function r(e){return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">${n(t(e.background))}</linearGradient></defs>
<g transform="rotate(-8 120 120)">
<rect x="22" y="58" width="196" height="124" rx="14" fill="url(#g)"/>
<rect x="22.5" y="58.5" width="195" height="123" rx="13.5" fill="none" stroke="${e.line}"/>
<text x="40" y="86" fill="${e.ink}" font-family="Helvetica,Arial,sans-serif" font-size="11" letter-spacing="3">GIFT CARD</text>
<text x="40" y="150" fill="${e.amount}" font-family="Georgia,serif" font-style="italic" font-size="30">ScentScape</text>
<line x1="40" y1="164" x2="200" y2="164" stroke="${e.line}"/>
</g>
</svg>`}function i(t){let n=e.find(e=>e.name===t)??e[0];return`data:image/svg+xml,${encodeURIComponent(r(n))}`}function a(e){return e.giftCard?i(e.color):e.image}export{a as n,i as t};