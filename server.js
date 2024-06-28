const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/userdb', { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({
    userId: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true }
});

const LoginLogSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const LoginLog = mongoose.model('LoginLog', LoginLogSchema);

app.post('/register', async (req, res) => {
    const { userId, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
        const newUser = new User({ userId, email, password: hashedPassword });
        await newUser.save();
        res.status(201).send('User registered');
    } catch (error) {
        res.status(400).send('Error registering user');
    }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ userId: user.userId }, 'your_jwt_secret');
        await new LoginLog({ userId: user.userId }).save();
        res.status(200).json({ token });
    } else {
        res.status(400).send('Invalid credentials');
    }
});

app.post('/google-login', async (req, res) => {
    const { token } = req.body;
    // Verify the token with Google
    // Assume we get userId and email from Google
    const userId = 'google_user_id';  // Replace with actual value
    const email = 'user@example.com';  // Replace with actual value
    let user = await User.findOne({ email });
    if (!user) {
        user = new User({ userId, email, password: 'google' });
        await user.save();
    }
    await new LoginLog({ userId }).save();
    const jwtToken = jwt.sign({ userId: user.userId }, 'your_jwt_secret');
    res.status(200).json({ token: jwtToken });
});

app.get('/stats', async (req, res) => {
    const userCount = await User.countDocuments();
    const loginCount = await LoginLog.countDocuments();
    res.status(200).json({ userCount, loginCount });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
