(function () {
  function getCart() { try { return JSON.parse(localStorage.getItem('tswana_cart') || '{}'); } catch (e) { return {}; } }
  function saveCart(cart) { localStorage.setItem('tswana_cart', JSON.stringify(cart)); }

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('checkout-form');
    const result = document.getElementById('checkout-result');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name');
      const email = data.get('email');
      const address = data.get('address');
      if (!name || !email || !address) {
        result.innerHTML = '<p style="color:red;">Please fill required fields.</p>';
        return;
      }

      // simulate placing order
      const cart = getCart();
      if (!Object.keys(cart).length) {
        result.innerHTML = '<p>Your cart is empty.</p>';
        return;
      }

      // simulate server latency
      result.innerHTML = '<p>Placing order...</p>';
      setTimeout(function () {
        localStorage.removeItem('tswana_cart');
        document.dispatchEvent(new Event('cart-updated'));
        result.innerHTML = `<p>Thank you, ${name}! Your order has been placed (simulation). An email confirmation has been sent to ${email} (simulation).</p><p><a href="index.html">Back to shop</a></p>`;
      }, 900);
    });
  });
})();