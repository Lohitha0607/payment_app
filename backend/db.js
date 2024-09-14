require('dotenv').config();

const mongoose = require('mongoose');

// Get database name and URI from environment variables
const dbName = process.env.MONGO_DB_NAME || 'paytm';
const baseURI = process.env.MONGO_URI;

// Create the full connection string dynamically
const connectionString = `${baseURI}/${dbName}?retryWrites=true&w=majority`;

// Connect to MongoDB
mongoose.connect(connectionString)
  .then(() => console.log(`MongoDB connected successfully to database: ${dbName}`))
  .catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    email:String
});

const accountSchema = new mongoose.Schema({
    newuserid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: Number
});

// Create models
const User = mongoose.model('User', userSchema);
const Amount = mongoose.model('Amount', accountSchema);

// Export the models
module.exports = { User, Amount };
