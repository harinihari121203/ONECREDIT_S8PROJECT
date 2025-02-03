// const http = require('node:http');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello, World!\n');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });


const express= require('express');
const dotenv = require("dotenv");
const connectDB= require('./src/config/db');
const itemModel = require('/src/models/Item');

const cors =require('cors');

dotenv.config();
const app= express();
app.use(express.json());
app.use(cors())

connectDB();

app.get('/', async (req, res) => {
    try {
        const response = await itemModel.find();
        return res.json({ items: response });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.listen(8080, () =>
{
    console.log("app is running");
}) 