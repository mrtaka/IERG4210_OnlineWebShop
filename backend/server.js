//================ open express backend server ===================
const express = require("express");
const bodyParser = require("body-parser"); //for transfer sqlite date fromat to json
const cors = require("cors"); //for access from url control
const url = require("url");  //for getting values in url
var cookieParser = require('cookie-parser'); 
const csrf = require("csurf");


//---------for https---------------
var fs = require("fs");
var http = require('http');
var https = require("https");
//----------------------------------

//================ init backend ===================
const app = express();

app.use(bodyParser.json()); //allow output as json format

//----------------csrf--------------------
/*const csrfProtection = csrf(); //csrdf protection function init
app.use({
  session: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: store
});
app.use(csrfProtection);*/
//----------------csrf--------------------

const corsOptions = {
  origin: true, 
  credentials: true,
}

app.use(express.urlencoded({extended: true,}));
app.use(cors(corsOptions)); //allow access api from others domain
app.options('*', cors(corsOptions))

app.use(cookieParser());  //allow set cookies



//================ backend online page ===================
const { init } = require('./Router/server_init.js');
app.use("/",init);

//====================allow static file access =====================
app.use('/images', express.static(__dirname + '/images'));

//================ request for product/category ===================
const { productRouter } = require('./Router/product.js');
app.use("/",productRouter);

const { categoryRouter } = require('./Router/category.js');
app.use("/",categoryRouter);

const { loginRouter } = require('./Router/login.js');
app.use("/auth",loginRouter);

const { orderRouter } = require('./Router/order.js');
app.use("/order",orderRouter);

//=================== listen to http(80) and https port(443)==============
var httpServer = http.createServer(app);

httpServer.listen(8801, ()=>{
    console.log("Connnected to express http backend listening on port 8801")
})

var httpsServer = https.createServer({
    key: fs.readFileSync("SSL_crt/secure.s5.ierg4210.ie.cuhk.edu.hk.key"),
    cert: fs.readFileSync("SSL_crt/secure_s5_ierg4210_ie_cuhk_edu_hk.crt"),
  },app);

httpsServer.listen(8800, function () {
    console.log("Connnected to express https backend listening on port 8800!");
});