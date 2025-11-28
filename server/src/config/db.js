const mongoose = require('mongoose');

async function connectDB(url = process.env.MONGO_URI) {
    if (!url) throw new Error('MongoDB connection URL is not defined');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
}

module.exports = {connectDB};