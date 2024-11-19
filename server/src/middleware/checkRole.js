const jwt = require("jsonwebtoken");

// Middleware for checking user roles
function checkRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden. Insufficient permissions." });
    }
    next();
  };
}

module.exports = checkRole;