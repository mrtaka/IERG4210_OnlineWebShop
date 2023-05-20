const express = require('express');
const orderRouter = express.Router();
const url = require("url");
const jwt = require("jsonwebtoken");
const { escape } = require('./defense.js');

const connectDB = require("../connectDB.js"); 
const db = connectDB.connectDB();

let sql;

//================ get request for orders===================
orderRouter.get("/getorders",(req,res)=>{
    sql = 'SELECT * FROM ORDERS ORDER BY OID DESC';
    try{
      const queryObject = url.parse(req.url, true).query; //query parameters
      console.log("GET USER ORDER WITH uid: ",queryObject.auth);
      if(queryObject.auth){//quote all order of a user with UID (prepared statements for sql defense)
        
        //change auth to UID
        const user = jwt.verify(queryObject.auth, "secret_key_54321");
        console.log("Get USER ORDER WITH uid: ",user.UID);
        sql = 'SELECT * FROM ORDERS WHERE UID = ? ORDER BY OID DESC LIMIT 5';
        db.all(sql,[user.UID],(err, rows)=>{
            if (err) return res.json({status:300, success: false, error: err});
            if (rows.length < 1) return res.json({status:300, success: false, error: "No match"});
            else{
              rows.forEach(item => {//change the productlist from string back to json
                item.PRODUCTLIST = JSON.parse(item.PRODUCTLIST);
                item.UID = user.EMAIL;
              });
              console.log("Query ORDERS with uid: ", user.UID);
              return res.json({status: 200, data: rows, success:  true,})
            }
        });
      }

      else{//quote all orders
        let userlist;
        db.all(`SELECT * FROM USER`,[],(err, users)=>{
          if (err) return res.json({status:300, success: false, error: err});
          if (users.length < 1) return res.json({status:300, success: false, error: "No match userID"});
          userlist = users
        });
        db.all(sql,[],(err, rows)=>{
            if (err) return res.json({status:300, success: false, error: err});
            if (rows.length < 1) return res.json({status:300, success: false, error: "No match"});
            rows.forEach(item => {//change the productlist from string back to json
                item.PRODUCTLIST = JSON.parse(item.PRODUCTLIST);
                //console.log(userlist);
                userlist.forEach(user => {
                  if(user.UID == item.UID){
                    item.UID = user.EMAIL;
                  }
                });
            });
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

//================ post request for orders ===================

orderRouter.post("/createorder", (req,res)=>{
    try {
      const {auth,PRODUCTLIST,STATUS,DATE} = req.body;

    //change auth to UID
    const user = jwt.verify(auth, "secret_key_54321");
    console.log("Get USER ORDER WITH uid: ",user.UID);

    console.log("Create order with UID: ", user.UID," Status: ", STATUS, " DATE: ",DATE);
    console.log("Create order with PRODUCTLIST: ", PRODUCTLIST);

    //Insert data into table
    let PRODUCTLIST_STRING = JSON.stringify(PRODUCTLIST);

      sql = 'INSERT INTO ORDERS(UID,PRODUCTLIST,STATUS,DATE) VALUES (?,?,?,?)';
      db.run(sql,[user.UID,PRODUCTLIST_STRING,STATUS,DATE],(err)=>{ //server-side input sanitizations
        if (err) return res.json({status:300, success: false, error: err});
        else{
            console.log("Successful Insert order with UID:", user.UID);
            res.json({status:200, success: true,})
        }
      });
    } catch (error){
      return res.json({
        status: 400,
        success: false,
        error: error,
      })
    }
})

module.exports = { orderRouter };