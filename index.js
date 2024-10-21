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


const auth = require('./middlewares/authMiddleware');
const { onlyAdminAccess } = require('./middlewares/adminMiddleware');
const routerController = require('./controllers/admin/routerController'); 


app.get('/api/admin/all-routes', auth,onlyAdminAccess, routerController.getAllRoutes);


// Category route
const commonRoute = require('./routes/commonRoute');
app.use('/api', commonRoute);

const port = process.env.SERVER_PORT | 8000;

app.listen(port, () => {
    console.log("Server is running on port : " + port);
})