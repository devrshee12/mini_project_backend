const jwt = require('jsonwebtoken')


const authenticationMiddleware = async (req, res, next) => {
  // const authHeader = req.headers.authorization
  // const token = req.body.token; // for postman 
  const token = req.cookies.token; // for real purpose
  console.log("got token : " + token);


  if (!token) {
    throw new Error('No token provided')
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET)
    console.log(decoded);
    const { type, email } = decoded;
    console.log("type : " + type);
    console.log("email : " + email);
    req.user = { type, email }
    next();
  } catch (error) {
    throw new Error('Not authorized to access this route')
  }
}

module.exports = authenticationMiddleware
