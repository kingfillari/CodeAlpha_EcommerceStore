// Product details functionality
let currentProduct = null;

document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    updateCartCount();
    loadProductDetails();
});

async function loadProductDetails() {
    // For demo purposes, we'll use a sample product
    // In a real app, you'd get the product ID from URL parameters
    const sampleProduct = {
        _id: 'prod_1',
        name: 'Classic Tee',
        category: 'Clothes',
        price: 1900.75,
        description: 'Classic Tee - high quality clothes item. Perfect for everyday wear with premium comfort and style.',
        stock: 64
    };
    
    currentProduct = sampleProduct;
    displayProductDetails(sampleProduct);
}

function displayProductDetails(product) {
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-category').textContent = product.category;
    document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('product-stock').textContent = `In stock: ${product.stock}`;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-image').innerHTML = getProductIcon(product.category);
    
    // Set max quantity based on stock
    document.getElementById('quantity').max = Math.min(product.stock, 10);
}

function addToCartFromDetails() {
    if (!currentProduct) return;
    
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    const productId = currentProduct._id;
    const productName = currentProduct.name;
    const price = currentProduct.price;
    const stock = currentProduct.stock;
    const category = currentProduct.category;
    
    if (quantity > stock) {
        showNotification(`Only ${stock} items available in stock!`, 'error');
        return;
    }
    
    // Add to cart with specified quantity
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        if (existingItem.quantity + quantity <= stock) {
            existingItem.quantity += quantity;
            showNotification(`${productName} quantity updated!`);
        } else {
            showNotification(`Cannot add ${quantity} items. Only ${stock - existingItem.quantity} more available!`, 'error');
            return;
        }
    } else {
        cart.push({
            productId,
            name: productName,
            price,
            quantity,
            stock,
            category
        });
        showNotification(`${quantity} ${productName}(s) added to cart!`);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}