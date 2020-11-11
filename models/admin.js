const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

//create a schema
const adminSchema = new Schema({
  _id:mongoose.Schema.Types.ObjectId,
  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true
  },
  password:{
    type:String,
    required:true
  },
  dateCreated:{
    type:Date,
    default:Date.now
  }	
});
//create a model
const Admin = mongoose.model('admins',adminSchema);
//export the model
module.exports = Admin;
