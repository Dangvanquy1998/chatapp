const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const MessageSchema = new Schema({
 id: String,
 username: String,
 picture: String,
 message: String,
 userIdTo: String,
 timeSend: Date
});

module.exports = mongoose.model('Message', MessageSchema);