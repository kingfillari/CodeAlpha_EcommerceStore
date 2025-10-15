// Products page functionality
let currentPage = 1;
let currentCategory = 'all';
let currentSearch = '';

// Initialize products page
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    updateCartCount();
    setupFilterButtons();
    loadProducts();
    
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const search = urlParams.get('search');
    
    if (category) {
        currentCategory = category;
        setActiveFilter(category);
    }
    
    if (search) {
        currentSearch = search;
        document.getElementById('search-input').value = search;
    }
});

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update current category and reload products
            currentCategory = this.dataset.category;
            currentPage = 1;
            loadProducts();
        });
    });
}

function setActiveFilter(category) {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.category === category) {
            button.classList.add('active');
        }
    });
}

async function loadProducts() {
    try {
        let url = `${API_BASE}/products?page=${currentPage}&limit=12`;
        
        if (currentCategory !== 'all') {
            url += `&category=${currentCategory}`;
        }
        
        if (currentSearch) {
            url += `&search=${encodeURIComponent(currentSearch)}`;
        }
        
        const response = await fetch(url);
        const data = await response.json();
        
        displayProducts(data.products);
        setupPagination(data.totalPages, data.currentPage);
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Error loading products', 'error');
    }
}

function displayProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                <h3>No products found</h3>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = products.map(product => `
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

function setupPagination(totalPages, currentPage) {
    const pagination = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<div class="pagination-buttons">';
    
    // Previous button
    if (currentPage > 1) {
        paginationHTML += `<button class="btn btn-outline" onclick="goToPage(${currentPage - 1})">Previous</button>`;
    }
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === currentPage) {
            paginationHTML += `<button class="btn btn-primary" disabled>${i}</button>`;
        } else {
            paginationHTML += `<button class="btn btn-outline" onclick="goToPage(${i})">${i}</button>`;
        }
    }
    
    // Next button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="btn btn-outline" onclick="goToPage(${currentPage + 1})">Next</button>`;
    }
    
    paginationHTML += '</div>';
    pagination.innerHTML = paginationHTML;
}

function goToPage(page) {
    currentPage = page;
    loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Override search function for products page
function searchProducts() {
    const searchInput = document.getElementById('search-input');
    currentSearch = searchInput.value.trim();
    currentPage = 1;
    loadProducts();
}