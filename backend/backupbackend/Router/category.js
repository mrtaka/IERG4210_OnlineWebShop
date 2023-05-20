const express = require('express');
const categoryRouter = express.Router();
const url = require("url"); 
const { escape } = require('./defense.js');

const connectDB = require("../connectDB.js"); 
const db = connectDB.connectDB();

let sql;

//================ get request for categories===================
categoryRouter.get("/categories",(req,res)=>{
    sql = 'SELECT * FROM CATEGORIES';
    try{
      const queryObject = url.parse(req.url, true).query; //query parameters
      if(queryObject.CID){//quote category detail with CID (prepared statements for sql defense)
        sql = 'SELECT * FROM CATEGORIES WHERE CID = ?';
        db.all(sql,[queryObject.CID],(err, rows)=>{
            if (err) return res.json({status:300, success: false, error: err});
            if (rows.length < 1) return res.json({status:300, success: false, error: "No match"});
            console.log("Query CATEGORIES");
            return res.json({status: 200, data: rows, success:  true,})
        });
      }
      else{//quote all product categories
        db.all(sql,[],(err, rows)=>{
            if (err) return res.json({status:300, success: false, error: err});
            if (rows.length < 1) return res.json({status:300, success: false, error: "No match"});
            console.log("Query CATEGORIES");
            return res.json({status: 200, data: rows, success:  true,})
        });
      }
    } catch (error) {
      return res.json({
        status: 400,
        success: false,
      })
    }
})

//================ post request for category ===================

categoryRouter.post("/createcategory", (req,res)=>{
    try {
      const {NAME} = req.body;

      //Insert data into table
      sql = 'INSERT INTO CATEGORIES(NAME) VALUES (?)';
      db.run(sql,[escape(NAME)],(err)=>{ //server-side input sanitizations
        if (err) return res.json({status:300, success: false, error: err});
        console.log("Successful Insert category:",NAME);
      });
      res.json({
        status:200,
        success: true,
      })
    } catch (error){
      return res.json({
        status: 400,
        success: false,
      })
    }
})
  
//================ put request for category===================
  
categoryRouter.put("/updatecategory/:id",(req,res)=>{
    const CID = req.params.id
    const {NAME} = req.body;
  
      //Update data into table
      sql = 'UPDATE CATEGORIES SET NAME = ? WHERE CID = ?';
  
      db.run(sql,[escape(NAME),CID],(err)=>{ //server-side input sanitizations
        if (err) return res.json({status:300, success: false, error: err});
        console.log("Successful Update CATEGORIES:", NAME);
      });
})
  
  
  
//================ delete request ===================
  
categoryRouter.delete("/deleteproduct/:id",(req,res)=>{
    const productID = req.params.id
      //Delete data into table
      sql = 'DELETE FROM PRODUCTS WHERE PID = ?';
      db.run(sql,[productID],(err)=>{
        console.log("Delete data PID:");
        if (err) return console.error(err.message);
      });
})

module.exports = { categoryRouter };