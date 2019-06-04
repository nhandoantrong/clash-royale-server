const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username : {type: String, required:true},
    password : {type: String, required:true},
    pawn :   {type: Number, default: 1},
    bishop: {type: Number, default: 1},
    rook : {type: Number, default: 1},
    knight: {type: Number, default: 1},
    prince :{type: Number, default: 1},
    queen :{type: Number, default: 1},
    king:{type: Number, default: 1},
    guard :{type: Number, default: 1},
    exp:{type: Number, default: 0}
})

const User = mongoose.model("User",UserSchema);
module.exports = {
    User,UserSchema
}