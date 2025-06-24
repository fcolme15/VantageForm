const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api.js');

dotenv.config();

const app = express();

//Middleware 
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

//Routes
app.use('/api', apiRoutes);

//Basic route
app.get('/', (req,res) => {
    res.json({message: 'Backend server is running'});
});

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});

