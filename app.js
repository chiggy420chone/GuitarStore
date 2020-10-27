const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();

//Set Routes
const indexRoutes = require('./api/routes/');

//Middlewares
app.use(logger('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());
app.use(session({
	secret:'Bob Marley & the Wailers',
	saveUninitialized:true,
	resave:false
  })
);
app.use(express.static(path.join(__dirname,'./public/')));

//CORS
app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Origin,X-Requested-With,Content-Type,Accept,Authorization');
    if(req.method === 'OPTIONS'){
      res.header('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');      return res.status(200).json({});
    }
    next();
  }
);

//Routes
app.use('/',indexRoutes);
app.use('/logout',function(req,res){
    req.logout();
    res.redirect('/');
  }
);
app.use('*',function(req,res){
  res.redirect('/');
  }
);
app.use(function(req,res,next){
  let error = new Error('Not Found');
  error.status = 404;
  next(error);
  }
);
app.use(function(req,res,next){
    res.status(error.status || 500);
    res.json({
      error:{
        message:error.message
      }
    })
  }
);

module.exports = app;
