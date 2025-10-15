// API Base URL
const API_BASE = 'http://localhost:5001/api';

// Global state
let currentUser = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    updateCartCount();
    loadCategories();
    loadFeaturedProducts();
});

// Check authentication status
async function checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch(`${API_BASE}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                currentUser = data.user;
                showUserMenu();
            } else {
                localStorage.removeItem('token');
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
        }
    }
}

// Show user menu when logged in
function showUserMenu() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const userMenu = document.getElementById('user-menu');
    const userName = document.getElementById('user-name');
    
    if (currentUser) {
        loginBtn.classList.add('hidden');
        registerBtn.classList.add('hidden');
        userMenu.classList.remove('hidden');
        userName.textContent = currentUser.name;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    currentUser = null;
    window.location.reload();
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
}

// Load categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE}/products/categories/list`);
        const categories = await response.json();
        
        const categoriesGrid = document.getElementById('categories-grid');
        if (categoriesGrid) {
            categoriesGrid.innerHTML = categories.map(category => `
                <a href="products.html?category=${category}" class="category-card">
                    <div class="icon">${getCategoryIcon(category)}</div>
                    <h3>${category}</h3>
                </a>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load featured products
async function loadFeaturedProducts() {
    try {
        const response = await fetch(`${API_BASE}/products?limit=8`);
        const data = await response.json();
        
        const productsGrid = document.getElementById('featured-products');
        if (productsGrid) {
            productsGrid.innerHTML = data.products.map(product => `
                <div class="product-card">
                    <div class="product-image">
                        ${getProductIcon(product.category)}
                    </div>
                    <h3>${product.name}</h3>
                    <div class="category">${product.category}</div>
                    <div class="price">$${product.price.toFixed(2)}</div>
                    <div class="description">${product.description}</div>
                    <div class="stock">In stock: ${product.stock}</div>
                    <button class="add-to-cart" onclick="addToCart('${product._id}', '${product.name}', ${product.price}, ${product.stock}, '${product.category}')">
                        Add to Cart
                    </button>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading featured products:', error);
    }
}

// Add to cart function
function addToCart(productId, productName, price, stock, category) {
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        if (existingItem.quantity < stock) {
            existingItem.quantity += 1;
            showNotification(`${productName} quantity updated!`);
        } else {
            showNotification(`Only ${stock} items available in stock!`, 'error');
            return;
        }
    } else {
        cart.push({
            productId,
            name: productName,
            price,
            quantity: 1,
            stock,
            category
        });
        showNotification(`${productName} added to cart!`);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Search products
function searchProducts() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    
    if (query) {
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    }
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        transition: all 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Helper functions for icons
function getCategoryIcon(category) {
    const icons = {
        'Clothes': '👕',
        'Cars': '🚗',
        'Electronics': '📱',
        'Houses': '🏠',
        'Watches': '⌚',
        'Shoes': '👟',
        'Phones': '📞',
        'Laptops': '💻',
        'Furniture': '🛋️',
        'Books': '📚'
    };
    return icons[category] || '📦';
}

function getProductIcon(category) {
    return getCategoryIcon(category);
}

function getProductIconByCategory(category) {
    return getCategoryIcon(category);
}