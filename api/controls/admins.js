const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Admin = require('../../models/admin');
const jwt_secret = require('../../configs/keys').JWT_SECRET;

signToken = admin => {
  return JWT.sign({
    iss:'GuitarStore Online',
    sub:admin._id,
    iat:new Date().getTime(),//current time
    exp:new Date().setDate(new Date().getDate()+1)
  },jwt_secret)
}

module.exports = {
  //signUp
  signUp:async (req,res,next) => {
    try{
      console.log('UsersController.signUp() called');
      //email & password 
      const {email,password} = req.body;
      //check for an existing email
      const foundEmail = await Admin.findOne({'email':email})
      if(foundEmail){
        return res.status(403).json({
          message:"Email already exists"
        })
      }
      //create a new admin
      bcrypt.hash(password,10,(err,hash) => {
        if(err){
          return res.status(500).json({
	    error:err
	  })
        }else{
          const newAdmin = new Admin({
            _id:new mongoose.Types.ObjectId(),
            email:email,
            password:hash
          })
         newAdmin
	    .save()
	    .then(result => {
	      res.status(201).json({
	        message:"Admin successfully created"
	      })
	    })
	    .catch(err => {
	      console.log(err);
	      res.status(500).json({
	        error:err
	      })
	    })
        }
      })
    }catch(errors){
      throw new Error(errors)
    }	    
  },
  signIn:async (req,res,next) => {
    Admin.findOne({email:req.body.email})
      .exec()
      .then(user => {
        if(!user){
	  return res.status(401).json({
	    message:"Unauthorized Sign In"
	  })
	}
	bcrypt.compare(req.body.password,user.password,(err,result) => {
	  if(err){
	    return res.status(401).json({
	      message:"Authentication Failed"
	    })
	  }
	  if(result){
	    const token = JWT.sign({
	      email:user.email,
	      userId:user._id
	    },jwt_secret,{
	      expiresIn:"160s"
	    })
	    return res.status(200).json({
	      message:"Authentication Successful",
	      token:token
	    })
	  }
	  res.status(401).json({
	    message:"Authentication Failed"
	  })
	})
      })
      .catch(err => {
        console.log(err);
	res.status(500).json({
	  error:err
	})
      })
  },
  dashboard:async (req,res,next) => {
    console.log('I managed to get here');
    res.status(200).json({secret:"resource"});
  },
  deleteAdmin:async (req,res,next) => {
    try{
      Admin.remove({_id:req.params.userId})
        .exec()
	.then(result => {
	  res.status(200).json({
	    message:"Admin Deleted"
	  })
	})
	.catch(err => {
	  console.log(err);
	  res.status(500).json({
	    error:err
	  })
	})
    }catch(error){
      throw new Error(error)
    }
  }
}
