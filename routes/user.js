const { Router } = require("express");
const { userModel } = require("../db")

const userRouter = Router();

userRouter.post("/signup", (req, res) => {
    res.json({
        message: "signup"
    })
})

userRouter.post("/signin", (req, res) => {
    res.json({
        message: "signin"
    })
})

userRouter.post("/purchases", (req, res) => {
    res.json({
        message: "purchases"
    })
})

module.exports = {
    userRouter: userRouter
}