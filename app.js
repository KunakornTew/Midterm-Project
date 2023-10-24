const express = require('express');
const app = express();

const login = require('./routes/login');
const register = require('./routes/register');
const homepage = require('./routes/homepage');
const post = require('./routes/post');

const bodyParser = require('body-parser');
const path = require('path');
const port = 3000;

app.set('views',path.join(__dirname,'views/pages')); //location template file
app.set('view engine','ejs'); //set ejs
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(login);
app.use(register);
app.use(homepage);
app.use(post);

app.get('/',(req,res)=>{
  res.redirect('/register');
})

app.get('/login',(req,res)=>{
  res.render('login.ejs');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});