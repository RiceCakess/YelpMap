var router = require('express').Router();
var mysql = require('mysql');
const config = require('./config');
var conn = mysql.createConnection(config.mysql);

router.get("/", (req,res,next)=>{
  conn = mysql.createConnection(config.mysql);
  conn.connect((err) =>{
    if(err){
        console.log(err);
        return;
    }
  });
    conn.query("SELECT * FROM yelpmap ORDER BY timestamp DESC LIMIT 10", (error, results, fields)=>{
      if(error) next(error);
      res.json(results);
    });
    conn.end();
  });

module.exports = router;