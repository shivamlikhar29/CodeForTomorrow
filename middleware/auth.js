const jwt = require('jsonwebtoken');

const auth = async (req,res,next) =>{
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized Access' });
    }
    jwt.verify(token,process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized Access' });
      }
      req.user = decoded;
      next();
    });
}

module.exports = auth