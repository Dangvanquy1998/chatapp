const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const AccountSchema = new Schema({
 id: String,
 name: String,
 username: String,
 avatar: String,
 password: String,
 email: String,
 isPassword: String,
 loginType: String,
 googlePlusId: String,
 facebookId: String,
 friends: [
  {
   idFriend: String
  }
 ]
});

module.exports = mongoose.model('Account', AccountSchema);