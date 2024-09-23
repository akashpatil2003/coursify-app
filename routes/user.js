const { Router } = require("express");
const { auth } = require("../auth")
const userRouter = Router();
const bcrypt = require("bcrypt");
const { userModel } = require("../db")
const { z } = require("zod");

const jwt = require("jsonwebtoken")
const JWT_SECRET = "aka123456"

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
        },JWT_SECRET);
        res.status(200).json({
            token:token
        })
    } else {
        res.status(403).json({
            message: "Incorrect Email or Password"
        })
    }
})

userRouter.post("/purchases", (req, res) => {
    res.json({
        message: "purchases"
    })
})

module.exports = {
    userRouter: userRouter
}