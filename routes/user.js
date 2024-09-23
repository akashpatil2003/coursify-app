const { Router } = require("express");
const userRouter = Router();
const bcrypt = require("bcrypt");
const { userModel, purchaseModel, courseModel } = require("../db")
const { z } = require("zod");

const jwt = require("jsonwebtoken");
const { USER_JWT_SECRET } = require("../config");

const { userMiddleware } = require("../middlewares/user");

userRouter.post("/signup",async (req, res) => {
        const { email, password, name} = req.body

        const userBody = z.object({
            email: z.string().max(50).email(),
            password: z.string().min(8).max(50),
            name: z.string().max(50)
        })

        const reqBody = userBody.safeParse(req.body);

        if(!reqBody.success){
            return res.json({
                message: reqBody.error.issues
            })
        }

        const exstUser = await userModel.findOne({email});
        if(exstUser){
            return res.json({
                message: "User already exists"
            })
        }

        const hashedPass = await bcrypt.hash(password, 10)
    
        await userModel.create({
            email: email,
            password: hashedPass,
            name: name
        });
    
        res.status(201).json({
            message: "You are signed up as user"
        })
})

userRouter.post("/signin", async(req, res) => {
    const { email, password } = req.body;

    const user = await userModel.findOne({
        email: email
    })

    const matchedPass = await bcrypt.compare(password, user.password);
    if (user && matchedPass) {
        const token = jwt.sign({
            id: user._id.toString()
        },USER_JWT_SECRET);
        res.status(200).json({
            token:token
        })
    } else {
        res.status(403).json({
            message: "Incorrect Email or Password"
        })
    }
})

userRouter.post("/purchases", userMiddleware, async (req, res) => {
    try {
        const userId = req.userId;

        const purchases = await purchaseModel.find({
            userId: userId
        })

        const courseData = await courseModel.find({
            _id: {$in: purchases.map(x => x.courseId)}
        })

        res.json({
            message:"Your purchases",
            courseData
        })
    } catch (e) {
        res.status(500).json({
            message: "Error while fetching your courses"
        })
    }
})

module.exports = {
    userRouter: userRouter
}