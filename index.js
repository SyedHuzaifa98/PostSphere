require('dotenv').config();
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL).then(() => {
    console.log("Database Connected...!!")
}).catch((err) => {
    console.error("Mongodb connection error : " + error);
});

const express = require('express');
const app = express();
app.use(express.json());

app.use(express.static('public'));

// Auth route
const authRoute = require('./routes/authRoutes');
app.use('/api', authRoute);


// Admin route
const adminRoute = require('./routes/adminRoute');
app.use('/api/admin', adminRoute);

const port = process.env.SERVER_PORT | 8000;

app.listen(port, () => {
    console.log("Server is running on port : " + port);
})