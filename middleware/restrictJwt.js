const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer")) {
    return res.status(401).json({
      error: "Token tidak ditemukan",
      status: 401,
      message: "Unauthorized",
    });
  } else {
    const token = authorization.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          error: "Token tidak valid",
          status: 401,
          message: "Unauthorized",
        });
      } else {
        req.user = decoded;
        next();
      }
    });
  }
};
