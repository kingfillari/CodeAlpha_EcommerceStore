const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../frontend'));

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/codealpha_ecom', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.log('❌ MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));

// Serve frontend
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: '../frontend' });
});

// Serve other frontend pages
app.get('/products.html', (req, res) => {
    res.sendFile('products.html', { root: '../frontend' });
});

app.get('/cart.html', (req, res) => {
    res.sendFile('cart.html', { root: '../frontend' });
});

app.get('/checkout.html', (req, res) => {
    res.sendFile('checkout.html', { root: '../frontend' });
});

app.get('/login.html', (req, res) => {
    res.sendFile('login.html', { root: '../frontend' });
});

app.get('/register.html', (req, res) => {
    res.sendFile('register.html', { root: '../frontend' });
});

app.get('/product-details.html', (req, res) => {
    res.sendFile('product-details.html', { root: '../frontend' });
});

// Initialize sample data
app.get('/api/init-data', async (req, res) => {
    try {
        const initScript = require('./scripts/initData');
        await initScript();
        res.json({ message: '✅ Database initialized with sample data' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔗 API: http://localhost:${PORT}/api`);
});