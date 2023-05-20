const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const filepath = 'cart.db';

function connectDB(){
    if (fs.existsSync(filepath)) {
        console.log("Connnected to sqlite by import!")
        return new sqlite3.Database(filepath);
    } else {
        const db = new sqlite3.Database(filepath, sqlite3.OPEN_READWRITE, (err)=>{
        if (err) return console.error(err.message); 
        console.log("Connnected to sqlite by import! (case2)")
      });
      console.log("Connnected to sqlite by import! (case3)")
      return db;
    }
}

module.exports = { connectDB };