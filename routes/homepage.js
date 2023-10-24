const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const UserModel = require('../models/users.js');

let id,userName;

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/homepage/:id',async(req,res)=>{
  const username = await UserModel.findOne({_id: req.params.id});
  id = req.params.id;
  userName = username.username;
  res.render('homepage.ejs',{username: username.username,userid: req.params.id});
});

router.get('/homepage',(req,res)=>{
  if(id == undefined){
    res.redirect('/');
  }else{
    res.redirect(`/homepage/${id}`);
  }
  
});

module.exports = router;
