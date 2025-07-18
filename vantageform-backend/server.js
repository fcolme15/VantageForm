const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api.js');
const predictionRoutes = require('./routes/prediction.js');



const app = express();

//Middleware 
app.use(cors({
    origin: ['https://vantageform.com', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

//Routes
app.use('/api', apiRoutes);
app.use('/prediction', predictionRoutes);

//Basic route
app.get('/', (req,res) => {
    res.json({message: 'Backend server is running'});
});

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});