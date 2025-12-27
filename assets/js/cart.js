(function () {
  function getCart() { try { return JSON.parse(localStorage.getItem('tswana_cart') || '{}'); } catch (e) { return {}; } }
  function saveCart(cart) { localStorage.setItem('tswana_cart', JSON.stringify(cart)); }

  function formatCurrency(c, amt) { return `${c} ${Number(amt).toFixed(2)}`; }

  function renderCart(products) {
    const cart = getCart();
    const container = document.getElementById('cart-container');
    const ids = Object.keys(cart);
    if (!ids.length) {
      container.innerHTML = '<p>Your cart is empty. <a href="index.html">Continue shopping</a></p>';
      return;
    }

    let html = '<table style="width:100%; border-collapse:collapse;"><thead><tr><th>Item</th><th>Price</th><th>Qty</th><th>Total</th><th></th></tr></thead><tbody>';
    let subtotal = 0;

    ids.forEach(id => {
      const prod = products.find(p => p.id === id);
      const qty = cart[id];
      const price = prod ? Number(prod.price) : 0;
      subtotal += price * qty;
      html += `<tr data-id="${id}"><td>${prod ? prod.title : id}</td><td>${formatCurrency(prod ? prod.currency : 'P', price)}</td><td><input class="qty" type="number" min="0" value="${qty}" style="width:70px"></td><td>${formatCurrency(prod ? prod.currency : 'P', price * qty)}</td><td><button class="remove">Remove</button></td></tr>`;
    });

    html += `</tbody></table><p style="text-align:right; font-weight:600;">Subtotal: ${formatCurrency('P', subtotal)}</p>`;
    html += '<div style="text-align:right;"><button id="place-order" class="link-button">Place Order (simulate)</button></div>';

    container.innerHTML = html;

    container.addEventListener('click', function (e) {
      if (e.target.classList.contains('remove')) {
        const tr = e.target.closest('tr');
        const id = tr.getAttribute('data-id');
        const cart = getCart();
        delete cart[id];
        saveCart(cart);
        renderCart(products);
      }

      if (e.target.id === 'place-order') {
        // simulate an order
        localStorage.removeItem('tswana_cart');
        container.innerHTML = '<p>Thank you! Your order has been placed (simulation). <a href="index.html">Back to shop</a></p>';
        const evt = new Event('cart-updated'); document.dispatchEvent(evt);
      }
    });

    container.querySelectorAll('.qty').forEach(input => {
      input.addEventListener('change', function () {
        const tr = input.closest('tr');
        const id = tr.getAttribute('data-id');
        const val = parseInt(input.value, 10) || 0;
        const cart = getCart();
        if (val <= 0) { delete cart[id]; } else { cart[id] = val; }
        saveCart(cart);
        renderCart(products);
        const evt = new Event('cart-updated'); document.dispatchEvent(evt);
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    fetch('data/products.json').then(r => r.json()).then(products => renderCart(products)).catch(err => {
      console.warn('Could not load products.json for cart, using fallback', err);
      renderCart([]);
    });
  });
})();