const { Router } = require("express");
const { adminModel } = require("../db")
const adminRouter = Router();
const bcrypt = require("bcrypt");
const { auth } = require("../auth")
const { z } = require("zod");

const jwt = require("jsonwebtoken")
const JWT_SECRET = "aka123456"

adminRouter.post("/signup", async (req, res) => {
    try{
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

        const exstUser = await adminModel.findOne({email});
        if(exstUser){
            return res.json({
                message: "User already exists"
            })
        }

        const hashedPass = await bcrypt.hash(password, 10)
    
        await adminModel.create({
            email: email,
            password: hashedPass,
            name: name
        });
    
        res.status(201).json({
            message: "You are signed up as admin"
        })
    }catch(e){
        res.json({
            error: e
        })
    }
})

adminRouter.post("/signin", async(req, res) => {
    const { email, password } = req.body;

    const admin = await adminModel.findOne({
        email: email
    })

    const matchedPass = await bcrypt.compare(password, admin.password);
    if (admin && matchedPass) {
        const token = jwt.sign({
            id: admin._id.toString()
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


adminRouter.post("/course", auth, async(req, res) => {
    
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