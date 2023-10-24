const mongoose = require('mongoose');
const dburl = 'mongodb+srv://645021000254:rootroot@cluster0.b43hkyh.mongodb.net/usersDB'; 

//connect database
mongoose.connect(dburl,{
    useNewUrlParser: true,
}).catch(err=>console.log(err));

module.exports = mongoose;