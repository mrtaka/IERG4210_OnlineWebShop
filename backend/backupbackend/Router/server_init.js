const express = require('express');
const init = express.Router();

init.get("/",(req,res)=>{
    res.json("The Backend v2.1 online")
    console.log("Someone visit the main backend page")
})

module.exports = { init }; 