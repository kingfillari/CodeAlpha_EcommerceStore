const mongoose = require('mongoose');
const Product = require('../models/Product');

// Sample product data
const productData = [
  {
    "id": "prod_1",
    "name": "Classic Tee",
    "category": "Clothes",
    "price": 1900.75,
    "description": "Classic Tee - high quality clothes item.",
    "image": "images/clothes/clothes_1.jpg",
    "stock": 64
  },
  {
    "id": "prod_2",
    "name": "Denim Jeans",
    "category": "Clothes",
    "price": 798.1,
    "description": "Denim Jeans - high quality clothes item.",
    "image": "images/clothes/clothes_2.jpg",
    "stock": 83
  },
  {
    "id": "prod_3",
    "name": "Leather Jacket",
    "category": "Clothes",
    "price": 511.27,
    "description": "Leather Jacket - high quality clothes item.",
    "image": "images/clothes/clothes_3.jpg",
    "stock": 171
  },
  {
    "id": "prod_11",
    "name": "Toyota Corolla",
    "category": "Cars",
    "price": 148967.76,
    "description": "Toyota Corolla - high quality cars item.",
    "image": "images/cars/cars_1.jpg",
    "stock": 168
  },
  {
    "id": "prod_12",
    "name": "Honda Civic",
    "category": "Cars",
    "price": 51553.59,
    "description": "Honda Civic - high quality cars item.",
    "image": "images/cars/cars_2.jpg",
    "stock": 167
  },
  {
    "id": "prod_21",
    "name": "4K TV",
    "category": "Electronics",
    "price": 2418.11,
    "description": "4K TV - high quality electronics item.",
    "image": "images/electronics/electronics_1.jpg",
    "stock": 81
  },
  {
    "id": "prod_22",
    "name": "Bluetooth Headphones",
    "category": "Electronics",
    "price": 2196.04,
    "description": "Bluetooth Headphones - high quality electronics item.",
    "image": "images/electronics/electronics_2.jpg",
    "stock": 144
  },
  {
    "id": "prod_31",
    "name": "Luxury Villa 5BR",
    "category": "Houses",
    "price": 154090.11,
    "description": "Luxury Villa 5BR - high quality houses item.",
    "image": "images/houses/houses_1.jpg",
    "stock": 94
  },
  {
    "id": "prod_32",
    "name": "Studio Apartment",
    "category": "Houses",
    "price": 106117.67,
    "description": "Studio Apartment - high quality houses item.",
    "image": "images/houses/houses_2.jpg",
    "stock": 185
  },
  {
    "id": "prod_41",
    "name": "Smartwatch X",
    "category": "Watches",
    "price": 335.02,
    "description": "Smartwatch X - high quality watches item.",
    "image": "images/watches/watches_1.jpg",
    "stock": 57
  },
  {
    "id": "prod_42",
    "name": "Classic Leather Watch",
    "category": "Watches",
    "price": 2107.05,
    "description": "Classic Leather Watch - high quality watches item.",
    "image": "images/watches/watches_2.jpg",
    "stock": 31
  }
];

const initData = async () => {
    try {
        // Clear existing products
        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products');

        // Insert new products
        await Product.insertMany(productData);
        console.log(`✅ Inserted ${productData.length} products`);

        console.log('🎉 Database initialization completed!');
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        throw error;
    }
};

// Run if called directly
if (require.main === module) {
    require('dotenv').config();
    mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/codealpha_ecom')
        .then(() => console.log('📦 Connected to MongoDB'))
        .then(() => initData())
        .then(() => process.exit(0))
        .catch(err => {
            console.error('❌ Connection failed:', err);
            process.exit(1);
        });
}

module.exports = initData;