
const express = require("express");
const bodyParser = require("body-parser");
const fileupload = require('express-fileupload');
const ejs = require("ejs");
var moment = require('moment');
const _ = require("lodash");
const fs=require("fs");
const path = require('path');
const mongoose=require("mongoose");
const cookieParser= require('cookie-parser')
const connectDatabase=require("./config/database");
let initial_path = path.join(__dirname, "public");
require('dotenv').config();
const app = express();
connectDatabase();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(initial_path));
app.use(cookieParser())
app.use(fileupload());

const Home= require("./routes/home");
const User= require("./routes/user");
const Admin=require("./routes/admin");
app.use('/',Home);
app.use('/auth/',User);
app.use('/admin/',Admin);



app.listen(3000, function() {
  console.log("Server started on port 3000");
});

