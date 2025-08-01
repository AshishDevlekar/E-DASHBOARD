const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();
const Jwt = require('jsonwebtoken');

const User = require('./db/User');
const Product = require('./db/Product');
const Cart = require('./db/Cart');
const Purchase = require('./db/Purchase');

const app = express();
const JwtKey = process.env.JWT_SECRET || 'fallback-secret';

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Middleware
app.use(express.json());

// ✅ CORS Setup - UPDATED WITH CURRENT FRONTEND DOMAIN
const allowedOrigins = [
  'http://localhost:3000',
  'https://e-dashboard-mz5d.vercel.app',
  'https://e-dashboard-mz5d-pvli0ozl5-ashish-devlekars-projects-bf9c690b.vercel.app',
  'https://e-comm-676c-qdx37j5vo-ashish-devlekars-projects-bf9c690b.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// ✅ Root
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// ✅ Debug Route - Check MongoDB Atlas Connection
app.get('/debug-db', async (req, res) => {
  try {
    // Check database connection status
    const dbStatus = mongoose.connection.readyState;
    const statusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    // Count documents in each collection
    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();
    const cartCount = await Cart.countDocuments();
    const purchaseCount = await Purchase.countDocuments();
    
    // Get sample products
    const sampleProducts = await Product.find({}).limit(5);
    
    // Get all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    res.json({
      connectionStatus: statusMap[dbStatus],
      databaseName: mongoose.connection.name,
      collections: collections.map(c => c.name),
      documentCounts: {
        products: productCount,
        users: userCount,
        carts: cartCount,
        purchases: purchaseCount
      },
      sampleProducts: sampleProducts,
      mongoUri: process.env.MONGO_URI ? 'Set (hidden for security)' : 'Not set'
    });
  } catch (err) {
    res.status(500).json({ 
      error: err.message,
      connectionStatus: 'error',
      mongoUri: process.env.MONGO_URI ? 'Set (hidden for security)' : 'Not set'
    });
  }
});

// ✅ JWT Middleware
function verifyToken(req, res, next) {
  let token = req.headers['authorization'];
  if (token) {
    token = token.split(' ')[1];
    Jwt.verify(token, JwtKey, (err, decoded) => {
      if (err) {
        return res.status(401).send({ result: "Please provide valid token" });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } else {
    res.status(403).send({ result: "Please add token with header" });
  }
}

// ✅ Auth Routes
app.post('/register', async (req, res) => {
  try {
    let user = new User({ ...req.body, role: 'user' });
    let result = await user.save();
    result = result.toObject();
    delete result.password;

    Jwt.sign({ user: result }, JwtKey, { expiresIn: '2h' }, (err, token) => {
      if (err) return res.status(500).send({ result: 'Something went wrong' });
      res.send({ user: result, auth: token });
    });
  } catch (error) {
    res.status(500).send({ result: 'Error during registration', error });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const user = await User.findOne({ email, password }).select('-password');
    if (user) {
      Jwt.sign({ user }, JwtKey, { expiresIn: '2h' }, (err, token) => {
        if (err) return res.status(500).send({ result: 'Something went wrong' });
        res.send({ user, auth: token });
      });
    } else {
      res.status(401).send({ result: 'No User Found' });
    }
  } else {
    res.status(400).send({ result: 'Email and Password are required' });
  }
});

// ✅ Product Routes
app.post('/add-product', verifyToken, async (req, res) => {
  try {
    const product = new Product(req.body);
    const result = await product.save();
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: 'Failed to add product' });
  }
});

app.get('/all-products', verifyToken, async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch products' });
  }
});

app.delete('/product/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).send({ error: 'Only admin can delete products' });
    }
    const result = await Product.deleteOne({ _id: req.params.id });
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: 'Failed to delete product' });
  }
});

app.put('/product/:id', verifyToken, async (req, res) => {
  try {
    const result = await Product.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: 'Failed to update product' });
  }
});

app.get('/product/:id', verifyToken, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    res.send(product);
  } catch (err) {
    res.status(500).send({ error: 'Failed to get product details' });
  }
});

// ✅ Search Route - Fixed potential issue
app.get('/search/:key', verifyToken, async (req, res) => {
  try {
    const key = req.params.key;
    if (!key || key.trim() === '') {
      return res.status(400).send({ error: 'Search key is required' });
    }
    
    const result = await Product.find({
      "$or": [
        { name: { $regex: key, $options: "i" } },
        { category: { $regex: key, $options: "i" } },
        { company: { $regex: key, $options: "i" } }
      ]
    });
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: 'Failed to search products' });
  }
});

// ✅ Cart Routes
app.post('/add-to-cart', verifyToken, async (req, res) => {
  try {
    const cartItem = new Cart(req.body);
    const result = await cartItem.save();
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: 'Failed to add to cart' });
  }
});

app.get('/cart/:userId', verifyToken, async (req, res) => {
  try {
    const result = await Cart.find({ userId: req.params.userId });
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch cart' });
  }
});

// ✅ Delete specific cart item (Original route - URL params)
app.delete('/cart/:productId/:userId', verifyToken, async (req, res) => {
  try {
    console.log('Delete request received:', {
      productId: req.params.productId,
      userId: req.params.userId
    });

    const result = await Cart.deleteOne({
      'productId': req.params.productId,
      'userId': req.params.userId
    });

    console.log('Delete result:', result);

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: 'Cart item not found' });
    }

    res.send({ success: true, message: 'Cart item deleted', result });
  } catch (err) {
    console.error('Delete cart item error:', err);
    res.status(500).send({ error: 'Failed to delete cart item' });
  }
});

// ✅ Alternative route for removing cart item with request body
app.delete('/cart/remove', verifyToken, async (req, res) => {
  try {
    const { productId, userId } = req.body;
    
    if (!productId || !userId) {
      return res.status(400).send({ error: 'ProductId and UserId are required' });
    }

    const result = await Cart.deleteOne({
      'productId': productId,
      'userId': userId
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: 'Cart item not found' });
    }

    res.send({ success: true, message: 'Cart item deleted', result });
  } catch (err) {
    console.error('Delete cart item error:', err);
    res.status(500).send({ error: 'Failed to delete cart item' });
  }
});

// ✅ Alternative route for removing cart item by cart item ID
app.delete('/cart/item/:cartItemId', verifyToken, async (req, res) => {
  try {
    const result = await Cart.deleteOne({
      '_id': req.params.cartItemId,
      'userId': req.user._id // Ensure user can only delete their own cart items
    });

    if (result.deletedCount === 0) {
      return res.status(404).send({ error: 'Cart item not found' });
    }

    res.send({ success: true, message: 'Cart item deleted', result });
  } catch (err) {
    console.error('Delete cart item error:', err);
    res.status(500).send({ error: 'Failed to delete cart item' });
  }
});

// ✅ Update cart item quantity
app.put('/cart/update', verifyToken, async (req, res) => {
  try {
    const { productId, userId, quantity } = req.body;
    
    if (!productId || !userId || quantity === undefined) {
      return res.status(400).send({ error: 'ProductId, UserId, and quantity are required' });
    }

    if (quantity <= 0) {
      // If quantity is 0 or negative, remove the item
      const result = await Cart.deleteOne({
        'productId': productId,
        'userId': userId
      });
      return res.send({ success: true, message: 'Cart item removed', result });
    }

    const result = await Cart.updateOne(
      { 'productId': productId, 'userId': userId },
      { $set: { quantity: quantity } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: 'Cart item not found' });
    }

    res.send({ success: true, message: 'Cart item updated', result });
  } catch (err) {
    console.error('Update cart item error:', err);
    res.status(500).send({ error: 'Failed to update cart item' });
  }
});

app.delete('/cart/clear/:userId', verifyToken, async (req, res) => {
  try {
    const result = await Cart.deleteMany({ userId: req.params.userId });
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: 'Failed to clear cart' });
  }
});

// ✅ Purchase Routes
app.post('/purchase', verifyToken, async (req, res) => {
  try {
    const { userId, items, total } = req.body;

    if (!userId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).send({ error: "Invalid purchase request" });
    }

    // Save each item as a separate Purchase entry
    const purchases = await Promise.all(
      items.map(item => {
        const purchase = new Purchase({
          userId,
          productId: item.productId || item._id,
          productName: item.name,
          price: item.price,
          quantity: item.quantity || 1,
          total: item.price * (item.quantity || 1),
          status: "in progress"
        });
        return purchase.save();
      })
    );

    // Clear user's cart
    await Cart.deleteMany({ userId });

    res.send({ success: true, message: "Purchase successful", purchases });

    // Schedule status update for each purchase entry after 30 sec
    purchases.forEach(p => {
      setTimeout(async () => {
        try {
          const status = Math.random() < 0.9 ? "success" : "failed";
          await Purchase.findByIdAndUpdate(p._id, {
            status,
            statusUpdatedAt: new Date()
          });
          console.log(`✅ Purchase ${p._id} marked as ${status}`);
        } catch (err) {
          console.error("❌ Failed to update status:", err);
        }
      }, 30000);
    });

  } catch (err) {
    console.error("❌ Purchase error:", err);
    res.status(500).send({ error: 'Failed to complete purchase' });
  }
});

app.get('/purchase-history/:userId', verifyToken, async (req, res) => {
  try {
    const history = await Purchase.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.send(history);
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch purchase history' });
  }
});

// ✅ Serve React Frontend in Production - FIXED CATCH-ALL ROUTE
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, 'front-end/build');
  app.use(express.static(frontendPath));

  // Fixed: Use '*' instead of '/*' for catch-all route
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});