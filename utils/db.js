const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI;

const connectDB = async () => {
    if (!dbURI) {
        const err = new Error('MONGODB_URI is not set');
        console.error(err.message);
        throw err;
    }
    try {
        await mongoose.connect(dbURI);
        console.log('Connected to MongoDB successfully ✅');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};
module.exports = connectDB;
