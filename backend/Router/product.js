const express = require('express');
const productRouter = express.Router();
const url = require("url"); 
const { escape } = require('./defense.js');

const connectDB = require("../connectDB.js"); 
const db = connectDB.connectDB();

let sql;

//----------------------for image upload---------------------
const multer = require("multer"); //for image upload
const path = require("path"); //for image upload

const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
    cb(null, './images')
  },
  filename: (req, file, cb) =>{
    console.log(file)
    cb(null, "IMG_" + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({storage: storage})
//----------------------end of for image upload---------------------

//post request for upload image
productRouter.post("/upload", upload.single('image'), (req,res)=>{

    if (err instanceof multer.MulterError) {
      res.json({status: "Error", error_message: "Some kind of error with multer"});
    } else if(err) {
      if(err==null){
        res.json({status: "Error", error_message: "err is null"});
      }
      res.json({status: "Error", error_message: err.message});
    } else {
      res.json({status: "Success", success_message: "Image uploaded successfully."});
  }
    console.log("Image uploaded!", req.file.filename)
    res.send("Image uploaded!")
  })

//----------------------for image upload---------------------


//================ get request for product===================
productRouter.get("/quote",(req,res)=>{
    sql = 'SELECT * FROM PRODUCTS';
    try{
      const queryObject = url.parse(req.url, true).query; //query parameters
      if(queryObject.PID) {//quote product with PID (prepared statements for sql defense)
        sql = 'SELECT * FROM PRODUCTS WHERE PID = ?';
        db.all(sql,[queryObject.PID],(err, rows)=>{
          if (err) return res.json({status:300, success: false, error: err});
          if (rows.length < 1) return res.json({status:300, success: false, error: "No match"});
          console.log("Query data where PID is: ",queryObject.PID);
          return res.json({ status: 200, data: rows, success:  true})
        });
      }
      else if(queryObject.CID){//quote product with CID (prepared statements for sql defense)
        sql = 'SELECT * FROM PRODUCTS WHERE CID = ?';
        db.all(sql,[queryObject.CID],(err, rows)=>{
          if (err) return res.json({status:300, success: false, error: err});
          if (rows.length < 1) return res.json({status:300, success: false, error: "No match"});
          console.log("Query data where CID is: ",queryObject.PID);
          return res.json({ status: 200, data: rows, success:  true})
        });
      }
      else if(queryObject.PAGE){//quote product page by page (prepared statements for sql defense)
        limitStart = queryObject.PAGE*queryObject.SIZE-queryObject.SIZE
        sql = ` SELECT * FROM PRODUCTS ORDER BY PID LIMIT ?, ?`
        db.all(sql,[limitStart,queryObject.SIZE],(err, rows)=>{
          if (err) return res.json({status:300, success: false, error: err});
          if (rows.length < 1) return res.json({status:300, success: false, error: "No match"});
          console.log("Query data select by page: " + limitStart + "-" +  queryObject.SIZE)
          return res.json({ status: 200, data: rows, success:  true})
        });
      }
      else{//quote all product
        db.all(sql,[],(err, rows)=>{
          if (err) return res.json({status:300, success: false, error: err});
          if (rows.length < 1) return res.json({status:300, success: false, error: "No match"});
          console.log("Query data");
          return res.json({ status: 200, data: rows, success:  true})
        });
      }
    } catch (error) {
        console.log("------------line2------------");
      return res.json({
        status: 400,
        success: false,
      })
    }
})

//================ post request for product ==============================
productRouter.post("/createproduct", upload.single('image'), (req,res)=>{

    const {CID,NAME,PRICE,INVENTORY,DESCRIPTION} = req.body;
    let msg = "Insert data CID:"+CID+" NAME:"+NAME+" PRICE:"+PRICE+" INVENTORY:"+INVENTORY+" DESCRIPTION:"+DESCRIPTION+" Filename:"+req.file.filename;
  
    try {
      console.log("Image uploaded with other info!", req.file.filename)
      //Insert data into table
      sql = 'INSERT INTO PRODUCTS(CID, NAME, PRICE, INVENTORY, DESCRIPTION, IMAGEFILE) VALUES (?,?,?,?,?,?)';
      db.run(sql,[escape(CID),escape(NAME),escape(PRICE),escape(INVENTORY),escape(DESCRIPTION),req.file.filename],(err)=>{ //server-side input sanitizations
        if (err) return res.json({status:300, success: false, error: err});
        console.log("Successful Insert data:",CID,NAME,PRICE,INVENTORY,DESCRIPTION,req.file.filename);
      });
      res.json({
        status:200,
        success: true,
        message: msg
      })
    } catch (err){
  
      if (err instanceof multer.MulterError) {
        res.json({status: "Error", error_message: "Some kind of error with multer", formdata: msg});
      } else if(err) {
        if(err==null){
          res.json({status: "Error", error_message: "err is null", formdata: msg});
        }
        res.json({status: "Error", error_message: err.message, formdata: msg});
      } else {
        res.json({status: "Success", success_message: "Image uploaded successfully."});
      }

      return res.json({
        status: 400,
        error_message: "Cannot create product",
        error: err,
        success: false,
      })
    }
})

//================ put request for product===================
productRouter.post("/updateproduct/:id", upload.single('image'),(req,res)=>{
    const PID = req.params.id
    const {CID,NAME,PRICE,INVENTORY,DESCRIPTION} = req.body;
    console.log("Image uploaded with other info!", req.file.filename)
  
      //Update data into table
      sql = 'UPDATE PRODUCTS SET CID = ?, NAME = ?, PRICE = ?, INVENTORY = ?, DESCRIPTION = ?, IMAGEFILE = ? WHERE PID = ?';
  
      db.run(sql,[escape(CID),escape(NAME),escape(PRICE),escape(INVENTORY),escape(DESCRIPTION),req.file.filename,PID],(err)=>{  //server-side input sanitizations
        if (err) return res.json({status:300, success: false, error: err});
        console.log("Successful Update data:", CID,NAME,PRICE,INVENTORY,DESCRIPTION,req.file.filename);
      });
})

//================ delete request for product===================
productRouter.delete("/deletecategory/:id",(req,res)=>{
    const categoryID = req.params.id
      //Delete data into table
      sql = 'DELETE FROM CATEGORIES WHERE CID = ?';
      db.run(sql,[categoryID],(err)=>{
        console.log("Delete categoryID CID:");
        if (err) return console.error(err.message);
      });
})

module.exports = { productRouter }; 