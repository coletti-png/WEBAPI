
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
 
router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/public/index.html'));
});
 
router.get('/AddToList',function(req,res){
    res.sendFile(path.join(__dirname+'/public/addtolist.html'));
  });
  router.get('/login',function(req,res){
    res.sendFile(path.join(__dirname+'/public/login.html'));
  });
app.use('/', router);
app.listen(process.env.port || 3000);
 //all
console.log('Running at Port 3000');