const { Router } = require("express");

const adminRouter = Router();

adminRouter.post("/signup", (req, res) => {
    res.json({
        message: "signup"
    })
})

adminRouter.post("/signin", (req, res) => {
    res.json({
        message: "signin"
    })
})

adminRouter.post("/course", (req, res) => {
    res.json({
        message: "course create "
    })
})

adminRouter.put("/course", (req, res) => {
    res.json({
        message: "course adding endpoint"
    })
})

adminRouter.get("/course/bulk", (req, res) => {
    res.json({
        message: "course adding endpoint"
    })
})

adminRouter.delete("/course", (req, res) => {
    res.json({
        message: "course deleting"
    })
})

module.exports = {
    adminRouter: adminRouter
}