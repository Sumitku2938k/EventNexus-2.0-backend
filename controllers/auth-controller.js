const User = require('../models/user-model');
const bcrypt = require('bcrypt');

const home = async (req, res) => {
    try {
        res.status(200).json({ message: 'Home endpoint' });
    } catch (error) {
        console.error('Error in home controller:', error);
        res.status(500).json({ message: 'Internal Server Error' });     
    }
};

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body; // Extract user details from request body
        const userExist = await User.findOne({ email }); // Check if user already exists
        if (userExist) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const userCreated = await User.create({ name, email, password });
        res.status(200).json({ 
            message: 'User created successfully', 
            user: userCreated,
            token: await userCreated.generateToken(), // Generate JWT token for the newly created user
            userId: userCreated._id.toString() // Return user ID as string for frontend use
        });
    } catch (error) {
        console.error('Error in register controller:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        res.status(200).json({
            message: 'Login successful',
            user: user,
            token: await user.generateToken(),
            userId: user._id.toString()
        });
    } catch (error) {
        console.error('Error in login controller:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Return currently authenticated user (requires authMiddleware earlier in route chain)
const getUser = async (req, res) => {
    try {
        // authMiddleware attached req.user
        console.log("User Token:", req.token);
        res.status(200).json({ userData: req.user });
    } catch (error) {
        console.error('Error in getUser controller:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = { home, register, login, getUser };