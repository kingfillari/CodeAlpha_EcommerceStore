// Checkout functionality
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    updateCartCount();
    loadCheckoutItems();
    
    // Pre-fill user info if logged in
    if (currentUser) {
        document.getElementById('full-name').value = currentUser.name;
        document.getElementById('email').value = currentUser.email;
    }
});

function loadCheckoutItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const checkoutItems = document.getElementById('checkout-items');
    
    if (cart.length === 0) {
        checkoutItems.innerHTML = '<p>No items in cart</p>';
        document.getElementById('place-order-btn').disabled = true;
        return;
    }
    
    checkoutItems.innerHTML = cart.map(item => `
        <div class="checkout-item" style="display: flex; justify-content: between; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--border);">
            <div style="flex: 1;">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity}</p>
            </div>
            <div style="font-weight: 600;">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');
    
    updateCheckoutSummary();
}

function updateCheckoutSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 10;
    const total = subtotal + shipping;

    document.getElementById('checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkout-shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('checkout-total').textContent = `$${total.toFixed(2)}`;
}

async function placeOrder() {
    if (!currentUser) {
        showNotification('Please login to place an order', 'error');
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    // Validate forms
    const shippingForm = document.getElementById('shipping-form');
    const paymentForm = document.getElementById('payment-form');
    
    if (!shippingForm.checkValidity() || !paymentForm.checkValidity()) {
        showNotification('Please fill all required fields', 'error');
        return;
    }
    
    try {
        const shippingAddress = {
            street: document.getElementById('address').value,
            city: document.getElementById('city').value,
            zipCode: document.getElementById('zipcode').value,
            country: document.getElementById('country').value
        };
        
        const orderData = {
            items: cart.map(item => ({
                product: item.productId,
                quantity: item.quantity
            })),
            shippingAddress
        };
        
        const response = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            const data = await response.json();
            showNotification('Order placed successfully!');
            
            // Clear cart
            localStorage.removeItem('cart');
            updateCartCount();
            
            // Redirect to order confirmation
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            const error = await response.json();
            showNotification(error.message || 'Failed to place order', 'error');
        }
    } catch (error) {
        console.error('Order placement error:', error);
        showNotification('Failed to place order. Please try again.', 'error');
    }
}