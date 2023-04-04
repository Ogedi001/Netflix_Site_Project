require('dotenv').config()
const jwt = require('jsonwebtoken');

const SECRET = process.env.SECRET


const requireAuth = (req, res, next) => {

  const token = req.cookies.users
  console.log(token)
  if (!token) {
    res.redirect('/login');
    return;
  }

  jwt.verify(token, `${SECRET}`, (error, decoded) => {
    if (!error) {
      console.log(decoded);
      next();
      return;
    }
    console.log(error);
    res.redirect('/login');
  });

};

module.exports = requireAuth
