const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require("path");
const Jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

const User = require('./db/User');
const Product = require('./db/Product');
const Cart = require('./db/Cart');
const Purchase = require('./db/Purchase');

const app = express();
const JwtKey = process.env.JWT_SECRET || 'fallback-secret'; // Fallback for safety

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

app.use(express.json());
app.use(cors());

// ✅ API Routes
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

app.post('/register', async (req, res) => {
  let user = new User({ ...req.body, role: 'user' });
  let result = await user.save();
  result = result.toObject();
  delete result.password;

  Jwt.sign({ user: result }, JwtKey, { expiresIn: '2h' }, (err, token) => {
    if (err) return res.send({ result: 'Something went wrong, Please try next time' });
    res.send({ user: result, auth: token });
  });
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
  const product = new Product({ ...req.body, dateAdded: new Date() });
  const result = await product.save();
  res.send(result);
});

app.get('/products/:userId', verifyToken, async (req, res) => {
  const products = await Product.find({ userId: req.params.userId });
  res.send(products.length > 0 ? products : { result: "No Products Found" });
});

app.delete('/product/:id', async (req, res) => {
  const result = await Product.deleteOne({ _id: req.params.id });
  res.send(result);
});

app.get('/all-products', verifyToken, async (req, res) => {
  try {
    const products = await Product.find();
    res.send(products);
  } catch (err) {
    res.status(500).send({ error: "Unable to fetch products" });
  }
});

app.put('/product/:id', verifyToken, async (req, res) => {
  const result = await Product.updateOne({ _id: req.params.id }, { $set: req.body });
  res.send(result);
});

app.get('/search/:key', verifyToken, async (req, res) => {
  const result = await Product.find({
    '$or': [
      { name: { $regex: req.params.key, $options: 'i' } },
      { company: { $regex: req.params.key, $options: 'i' } },
      { category: { $regex: req.params.key, $options: 'i' } }
    ]
  });
  res.send(result);
});

// ✅ Cart Routes
app.post('/add-to-cart', verifyToken, async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const existing = await Cart.findOne({ userId, productId });

    if (existing) {
      existing.quantity += 1;
      const updated = await existing.save();
      return res.send(updated);
    }

    const cartItem = new Cart({ ...req.body, quantity: 1 });
    const result = await cartItem.save();
    res.send(result);
  } catch (err) {
    res.status(500).send({ error: 'Failed to add item to cart' });
  }
});

app.get('/cart/:userId', verifyToken, async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.params.userId });
    res.send(cartItems);
  } catch (err) {
    res.status(500).send({ error: 'Unable to fetch cart items' });
  }
});

app.delete('/cart/clear/:userId', verifyToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const userCartItems = await Cart.find({ userId });

    if (!userCartItems.length) {
      return res.status(400).send({ error: "Cart is already empty" });
    }

    for (const item of userCartItems) {
      const existingPurchase = await Purchase.findOne({
        userId: item.userId,
        productId: item.productId,
        price: item.price,
        status: "success"
      });

      if (!existingPurchase) {
        const purchase = new Purchase({
          userId: item.userId,
          productId: item.productId,
          productName: item.productName || item.name || 'Unnamed',
          price: item.price,
          quantity: item.quantity || 1,
          status: "in progress"
        });

        const saved = await purchase.save();
        setTimeout(async () => {
          try {
            await Purchase.findByIdAndUpdate(saved._id, { status: "success" });
          } catch (err) {
            console.error("❌ Failed to update status:", err);
          }
        }, 30000);
      }
    }

    await Cart.deleteMany({ userId });
    res.send({ message: "✅ Payment successful. Purchases saved. Cart cleared." });

  } catch (error) {
    res.status(500).send({ error: "Server error while clearing cart" });
  }
});

app.delete('/cart/:userId/:productId', verifyToken, async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const item = await Cart.findOneAndDelete({ userId, productId });

    if (!item) return res.status(404).send({ message: 'Item not found in cart' });

    const newPurchase = new Purchase({
      userId: item.userId,
      productId: item.productId,
      productName: item.productName || item.name || 'Unnamed',
      price: item.price,
      quantity: item.quantity || 1,
      status: 'in progress'
    });

    const saved = await newPurchase.save();
    setTimeout(async () => {
      try {
        await Purchase.findByIdAndUpdate(saved._id, { status: "success" });
      } catch (err) {
        console.error("❌ Failed to update status:", err);
      }
    }, 30000);

    res.send({ message: '🛒 Item removed and purchase started', purchase: saved });

  } catch (err) {
    res.status(500).send({ error: 'Failed to process cart item' });
  }
});

app.get('/purchase-history/:userId', verifyToken, async (req, res) => {
  try {
    const history = await Purchase.find({ userId: req.params.userId })
      .populate('productId', 'name price image')
      .sort({ createdAt: -1 });

    res.send(history);
  } catch (error) {
    res.status(500).send({ error: "Unable to fetch history" });
  }
});

// ✅ JWT Middleware
function verifyToken(req, res, next) {
  let token = req.headers['authorization'];
  if (token) {
    token = token.split(' ')[1];
    Jwt.verify(token, JwtKey, (err, valid) => {
      if (err) {
        res.status(401).send({ result: "Please provide valid token" });
      } else {
        next();
      }
    });
  } else {
    res.status(403).send({ result: "Please add token with header" });
  }
}

// ✅ Serve React frontend in production
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// ✅ Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
