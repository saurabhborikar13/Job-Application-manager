const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');

// Import routes
const jobRoutes = require('./routes/jobsRoute');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

app.use('/api/Job', jobRoutes);
app.use('/api/auth', authRoutes); 


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected Successfully');
    } catch (error) {
        console.error(' MongoDB Connection Error:', error);
        process.exit(1);
    }
};

app.listen(PORT, () => {
    connectDB();
    console.log(`Server running on port ${PORT}`);
});