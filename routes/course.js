const { Router } = require("express");
const { userMiddleware } = require("../middlewares/user");
const { purchaseModel, courseModel } = require("../db");
const courseRouter = Router();

courseRouter.post("/purchase", userMiddleware, async (req, res) => {
    try{
        const userId = req.userId;
        const courseId = req.body.courseId;

        const courseExst = await purchaseModel.findOne({
            courseId: courseId,
            userId: userId
        })

        if(courseExst){
            res.json({
                message: "Course already purchased "
            })
        }

        await purchaseModel.create({
            courseId: courseId,
            userId: userId
        })

        res.json({
            message: "Course bought successfully",
            courseId: courseId
        })
    }catch(e){
        res.status(500).json({
            message: "Error while purchasing course"
        })
    }
})

courseRouter.post("/preview", async (req, res) => {
    try {
        const courses = await courseModel.find({});

        res.json({
            courses
        })
    } catch (e) {
        res.status(500)
    }
})

module.exports = {
    courseRouter: courseRouter
}