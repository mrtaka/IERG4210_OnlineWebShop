const express = require('express');
const loginRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const url = require("url"); 

const connectDB = require("../connectDB.js"); 
const db = connectDB.connectDB();

let sql;

loginRouter.post("/login_test",(req,res)=>{
    const {EMAIL,PASSWORD} = req.body;
    try{
        return res.json({
          status: 200,
          data: {EMAIL,PASSWORD},
          success:  true,
      });
    } catch (error) {
      return res.json({
        status: 400,
        success: false,
      })
    }
})

loginRouter.post("/login",(req,res)=>{
    //const {CID,NAME,PRICE,INVENTORY,DESCRIPTION} = req.body;
    console.log("---start user auth------");
    const {EMAIL,PASSWORD} = req.body;
    //console.log(req);
    console.log(EMAIL,PASSWORD);
    try{
       sql = `SELECT * FROM USER WHERE EMAIL = (?)`;
       db.all(sql,[EMAIL],(err, user)=>{
        if (err) return res.json({status:300, success: false, error: err});
        if (user.length > 1) return res.json({status:300, success: false, error: "error, more than one same email user"});
        else if (user.length < 1) return res.json({status:300, success: false, error: "error, no user find"});
        else if (user.length == 1){
            console.log("Check user password is correct or not");
            bcrypt.compare(PASSWORD, user[0].PASSWORD, function(err, result) {
                if (result) {// login auth sccuess
                    const auth = jwt.sign(user[0], "secret_key_54321", {expiresIn: "1h"});

                    res.cookie("auth", auth, {
                        httpOnly: true,
                        SameSite: "None",
                        secure: true,
                        //maxAge: 1000000,
                        //signed: true;
                    });

                    //res.redirect("/");

                    return res.json({
                        status: 200,
                        ADMIN: user[0].ADMIN,
                        auth: auth,
                        expireDate: 1, // expire after 1 day
                        msg: "password is correct",
                        success:  true,
                    })
                }
                else{return res.json({status: 300, success:  false, error: "password is wrong"})}
            });
        }
      });
    } catch (error) {return res.json({status: 400, success: false,})
    }
})

loginRouter.post("/getemail",(req,res)=>{  //use auth_token get the EMAIL
    let auth;
    if(req.body) {
        auth = req.body.auth;
    }else{
        auth = req.cookies.auth;
    }
    console.log("auth token is:",req.body.auth)
    try{
        const user = jwt.verify(auth, "secret_key_54321")
        return res.json({
          status: 200,
          auth: auth,
          data: user.EMAIL,
          success:  true,
        });
    } catch (error) {return res.json({status: 400, success: false, msg: "has no auth token / this auth token is not correct"})
    }
})

loginRouter.post("/checkadmin",(req,res)=>{ //use auth_token check if admin or not
    let auth;
    if(req.body) {
        auth = req.body.auth;
    }else{
        auth = req.cookies.auth;
    }
    console.log("auth token is:",req.body.auth)
    try{
        const user = jwt.verify(auth, "secret_key_54321")
        sql = `SELECT * FROM USER WHERE EMAIL = (?)`;
        console.log(user.EMAIL);
        db.all(sql,[user.EMAIL],(err, user_in_DB)=>{
         if (err) return res.json({status:300, success: false, error: err});
         if (user_in_DB.length > 1) return res.json({status:300, success: false, error: "error, more than one same email user"});
         else if (user_in_DB.length < 1) return res.json({status:300, success: false, error: "error, no user find"});
         else if (user_in_DB.length == 1){
            console.log("Check user:" + user_in_DB[0]);
             console.log("Check " + user_in_DB[0].EMAIL + " is admin or not:", user_in_DB[0].ADMIN);
                if (user_in_DB[0].ADMIN == 1 ){// admin auth sccuess
                    //res.redirect("/");
                    return res.json({ status: 200, success:  true, auth: auth, msg: "this auth_token is admin",})
                }
                else{
                    return res.json({status: 300, success:  false, error: "this auth_token is not admin"})
                }
         }
       });
    } catch (error) {return res.json({status: 400, success: false, msg: "has no token / this token is not correct"})
    }
})

loginRouter.post("/resetpw",(req,res)=>{ //use auth_token check if admin or not
    let auth;
    if(req.body) {
        auth = req.body.auth;
    }else{
        auth = req.cookies.auth;
    }
    console.log("auth token is:",req.body.auth)
    try{
        const user = jwt.verify(auth, "secret_key_54321")
        sql = `SELECT * FROM USER WHERE UID = (?)`;
        console.log(user.UID);
        db.all(sql,[user.UID],(err, user_in_DB)=>{
         if (err) return res.json({status:300, success: false, error: err});
         if (user_in_DB.length > 1) return res.json({status:300, success: false, error: "error, more than one same email user"});
         else if (user_in_DB.length < 1) return res.json({status:300, success: false, error: "error, no user find"});
         else if (user_in_DB.length == 1){
                //hash input password
                bcrypt.hash(req.body.PASSWORD, user_in_DB[0].SALT, function(err, hash) {
                    let HASHED_INPUT_PW = hash;
                    console.log("Check pw "+ req.body.PASSWORD +" (hased: "+ HASHED_INPUT_PW +" ) " +  "is correct or not with " + user_in_DB[0].PASSWORD);
        
                    if (HASHED_INPUT_PW == user_in_DB[0].PASSWORD){// password is correct

                        console.log("New password is: " + req.body.NEW_PASSWORD);

                        bcrypt.genSalt(10, (err, salt) => {//Set new pasword
                            bcrypt.hash(req.body.NEW_PASSWORD, salt, function(err, hash) {
                    
                                //Insert data into table
                                sql = 'UPDATE USER SET SALT = ?, PASSWORD = ? WHERE UID = (?)';
                                db.run(sql,[salt,hash,user.UID],(err)=>{
                                    if (err) return res.json({status:300, success: false, error: err});
                                    console.log("Successful cahnged password hashed to:", hash);
                                });
                    
                            });
                        })

                        return res.json({ status: 200, success: true, auth: auth, msg: "Correct password, password is now changed!",})
                    }
                    else{
                        return res.json({status: 300, success:  false, error: "Wrong password"})
                    }
                });
         }
       });
    } catch (error) {return res.json({status: 400, success: false, msg: "has no token / this token is not correct"})
    }
})


loginRouter.post("/register_user", (req,res)=>{
    try {
      const {EMAIL,PASSWORD} = req.body;
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(PASSWORD, salt, function(err, hash) {

            //Insert data into table
            sql = 'INSERT INTO USER(EMAIL,SALT,PASSWORD) VALUES (?,?,?)';
            db.run(sql,[EMAIL,salt,hash],(err)=>{
                if (err) return res.json({status:300, success: false, error: err});
                console.log("Successful register user:",EMAIL,salt,hash);
            });
            res.json({
                status:200,
                success: true,
                message: "Successful register user!"
            })

        });
      })
    } catch (error){
      return res.json({
        status: 400,
        success: false,
      })
    }
})

module.exports = { loginRouter };