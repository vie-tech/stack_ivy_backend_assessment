const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');

dotenv.config();

const extractBearerToken = (authorizationHeader) => {
  if (!authorizationHeader) return null;
  const parts = authorizationHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
};

const tokenDecode = async (req) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = extractBearerToken(authorizationHeader);
    
    if (!token) {
      console.log("Token not found");
      return undefined;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_PASSKEY);
    return decoded;
  } catch (err) {
    console.log("Token decode function threw an error", err);
    return undefined;
  }
};

const auth = async (req, res, next) => {
  try {
    const decoded = await tokenDecode(req);
    console.log(decoded);
    
    if (!decoded) {
      throw new Error('Error in decoding');
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

module.exports = {
  auth,
};
