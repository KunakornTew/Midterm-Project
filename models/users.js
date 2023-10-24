const database = require('./connect');
const bcrypt = require('bcrypt');

// design schema
let userschema = database.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  postID: { type: [String]}
});



//encrypt
userschema.pre('save', async function(next) {
    const user = this;
    try {
      const hash = await bcrypt.hash(user.password, 10);
      user.password = hash;
      next();
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

//create model
let Users = database.model('users',userschema);

//export
module.exports = Users;
