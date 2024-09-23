const jwt = require("jsonwebtoken");
const { USER_JWT_SECRET } = "aka123456";

function userMiddleware( req, res, next){
    const token = req.headers.token;

    const decodedData = jwt.verify(token, USER_JWT_SECRET);

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
    userMiddleware: userMiddleware
}