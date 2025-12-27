// Simple product renderer and cart (localStorage)
(function () {
  const defaultProducts = [
    { id: 'p1', title: 'Xambura Xa Woven Basket', price: 255, currency: 'P', image: 'assets/img/bascket1.jpg' },
    { id: 'p2', title: 'Handcrafted Trinket Bowl', price: 225, currency: 'P', image: 'assets/img/bascket2.jpg' },
    { id: 'p3', title: 'Strip Light Craft', price: 230, currency: 'P', image: 'assets/img/bascket3.jpg' },
  ];

  function escapeHtml(text) {
    return (text + '').replace(/[&<>"']/g, function (m) { return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"})[m]; });
  }

  function getCart() {
    try { return JSON.parse(localStorage.getItem('tswana_cart') || '{}'); } catch (e) { return {}; }
  }
  function saveCart(cart) { localStorage.setItem('tswana_cart', JSON.stringify(cart)); }

  function updateCartCount() {
    const cart = getCart();
    const count = Object.values(cart).reduce((a, b) => a + b, 0);
    const el = document.getElementById('cart-count');
    if (el) el.textContent = count;
  }

  function addToCart(id) {
    const cart = getCart();
    cart[id] = (cart[id] || 0) + 1;
    saveCart(cart);
    updateCartCount();
  }

  function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    grid.innerHTML = '';
    products.forEach(p => {
      const item = document.createElement('div');
      item.className = 'shop-link';
      item.setAttribute('role', 'article');
      item.setAttribute('tabindex', '0');
      item.setAttribute('aria-label', p.title);
      item.innerHTML = `
        <h3>${escapeHtml(p.title)}</h3>
        <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}">
        <p class="price">${escapeHtml(p.currency)} ${Number(p.price).toFixed(2)}</p>
        <div class="actions">
          <button class="link-button add-to-cart" data-id="${escapeHtml(p.id)}">Add to cart</button>
        </div>
      `;
      grid.appendChild(item);
    });

    grid.addEventListener('click', function (e) {
      if (e.target && e.target.classList.contains('add-to-cart')) {
        const id = e.target.getAttribute('data-id');
        addToCart(id);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    updateCartCount();
    // update header's cart count when cart changes elsewhere in the app
    document.addEventListener('cart-updated', updateCartCount);

    fetch('data/products.json')
      .then(r => {
        if (!r.ok) throw new Error('Network response not ok');
        return r.json();
      })
      .then(products => renderProducts(products))
      .catch(err => {
        console.warn('Could not load products.json, using fallback:', err);
        renderProducts(defaultProducts);
      });
  });
})();