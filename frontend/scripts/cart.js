// Cart functionality
function loadCartItems() {
    const cartItems = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Add some products to your cart to see them here.</p>
                <button class="btn btn-primary" onclick="window.location.href='products.html'">
                    Continue Shopping
                </button>
            </div>
        `;
        document.getElementById('checkout-btn').disabled = true;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="item-image">
                ${getProductIconByCategory(item.category)}
            </div>
            <div class="item-details">
                <h3>${item.name}</h3>
                <p class="item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="item-quantity">
                <button onclick="updateQuantity('${item.productId}', -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity('${item.productId}', 1)">+</button>
            </div>
            <div class="item-total">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
            <button class="remove-btn" onclick="removeFromCart('${item.productId}')">
                🗑️
            </button>
        </div>
    `).join('');

    updateCartSummary();
}

function updateQuantity(productId, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item.productId === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.productId !== productId);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        loadCartItems();
    }
}

function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCartItems();
    showNotification('Item removed from cart');
}

function updateCartSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 10;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function proceedToCheckout() {
    if (!currentUser) {
        showNotification('Please login to proceed with checkout', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    window.location.href = 'checkout.html';
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    checkAuthStatus();
});