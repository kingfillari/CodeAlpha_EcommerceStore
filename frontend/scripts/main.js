<<<<<<< HEAD
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
=======
// Amazon-style functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeAmazonStore();
});

function initializeAmazonStore() {
    updateCartCount();
    setupEventListeners();
    loadFeaturedProducts();
}

function setupEventListeners() {
    // Search form submission
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('.search-input');
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                window.location.href = `products.html?search=${encodeURIComponent(searchTerm)}`;
            }
        });
    }

    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            
            addToCart(productName, productPrice);
        });
    });

    // Account dropdown
    const accountDropdown = document.querySelector('.account-dropdown');
    if (accountDropdown) {
        accountDropdown.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

function addToCart(productName, productPrice) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Remove currency symbol and convert to number
    const price = parseFloat(productPrice.replace('$', ''));
    
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
>>>>>>> 7d896cc78c991b177e5b38c72e0f6a1249257500
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
<<<<<<< HEAD
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
=======
    
    // Show confirmation message
    showNotification(`${productName} added to cart!`);
}

function showNotification(message) {
    // Create notification element
>>>>>>> 7d896cc78c991b177e5b38c72e0f6a1249257500
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
<<<<<<< HEAD
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 1000;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
=======
        background: var(--amazon-orange);
        color: var(--amazon-text);
        padding: 15px 20px;
        border-radius: 4px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
>>>>>>> 7d896cc78c991b177e5b38c72e0f6a1249257500
        transition: all 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
<<<<<<< HEAD
=======
    // Remove notification after 3 seconds
>>>>>>> 7d896cc78c991b177e5b38c72e0f6a1249257500
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

<<<<<<< HEAD
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
=======
function loadFeaturedProducts() {
    // In a real application, this would fetch from an API
    console.log('Loading featured products...');
>>>>>>> 7d896cc78c991b177e5b38c72e0f6a1249257500
}