const { Router } = require("express");
const { adminModel, courseModel } = require("../db");
const adminRouter = Router();
const bcrypt = require("bcrypt");
const { adminMiddleware } = require("../middlewares/admin");
const { z } = require("zod");

const jwt = require("jsonwebtoken");
const { ADMIN_JWT_SECRET } = require("../config");

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
        },ADMIN_JWT_SECRET);
        res.status(200).json({
            token:token
        })
    } else {
        res.status(403).json({
            message: "Incorrect Email or Password"
        })
    }
})


adminRouter.post("/course", adminMiddleware, async (req, res) => {
    try{
        const adminId = req.userId;

        const { title, desc, price, imageURL } = req.body;

        const course = await courseModel.create({
            title: title,
            desc: desc,
            price: price,
            imageURL: imageURL,
            creatorId: adminId
        })

        res.json({
            message:"Course created successfully",
            courseId: course._id
        })
    }catch(e){
        res.status(500).json({
            message: "Error while creating course"
        })
    }
})

adminRouter.put("/course", adminMiddleware, async (req, res) => {
    try {
        const adminId = req.userId;

        const { title, desc, price, imageURL, courseId } = req.body;

        const course = await courseModel.updateOne({
            _id: courseId,
            creatorId: adminId
        },{
            title: title,
            desc: desc,
            price: price,
            imageURL: imageURL
        })

        res.json({
            message: "Course updated ",
            courseId: course._id
        })
    } catch (e) {
        res.status(500).json({
            message: "Error while updating course"
        })
    }
})

adminRouter.get("/course/bulk", adminMiddleware, async(req, res) => {
    try {
        const adminId = req.userId;

        const courses = await courseModel.find({
            creatorId: adminId
        })

        res.json({
            message: "courses fetched",
            courses
        })

    } catch (error) {
        res.status(500).json({
            message: "Error while getting courses"
        })
    }
})

adminRouter.delete("/course", adminMiddleware, async (req, res) => {
    try {
        const adminId = req.userId;
        const courseId = req.body.courseId;

        await courseModel.deleteOne({
            _id: courseId,
            creatorId: adminId
        })

        res.json({
            message: "Deleted Course Successfully",
            courseId: courseId
        })

    } catch (e) {
        
    }
})

module.exports = {
    adminRouter: adminRouter
}