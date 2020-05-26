var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var usersSchema = new Schema({
    userName: String,
    password: String
});

module.exports = mongoose.model("user", usersSchema);