const JWT = require('jsonwebtoken');
const jwt_secret = require('../../configs/keys').JWT_SECRET;

module.exports = (req,res,next) => {
  try{
    const token = req.headers.authorization.split(" ")[1];
    const decoded = JWT.verify(token,jwt_secret);
    req.userData = decoded;
    next();
  }catch(err){
    return res.status(401).json({
      message:'Authentication Failed'
    })
  }
}
