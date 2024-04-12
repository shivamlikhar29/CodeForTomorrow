const express = require("express");
const ejs = require('ejs')
const bodyParser = require("body-parser");

const userRoutes = require('./routes/users')
const createSchema = require('./models/user')
require("dotenv").config({ path: "./.env" });


const PORT = 5000 || process.env.PORT

const app = express();
app.use(bodyParser.json());
app.set('view engine', 'ejs');


app.use('/users',userRoutes)

app.listen(PORT,()=>{
    console.log(`Server Running on Port : ${PORT}`)
    createSchema()
})


