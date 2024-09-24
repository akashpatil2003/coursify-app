const jwt = require("jsonwebtoken");
const { ADMIN_JWT_SECRET } = require("../config");

function adminMiddleware( req, res, next){
    const token = req.headers.token;

    const decodedData = jwt.verify(token, ADMIN_JWT_SECRET);

    if (decodedData) {
        req.userId = decodedData.id;
        next();
    } else {
        res.status(403).json({
            message:"Invalid creds"
        })
    }
}

module.exports = {
    adminMiddleware: adminMiddleware
}