const express = require("express");
const mongoose = require("mongoose");

const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
const app = express();

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/course", courseRouter);


async function main() {
    await mongoose.connect("mongodb+srv://admin:admin@cluster0.3qgszuq.mongodb.net/coursify-app")
    app.listen(3000);
    console.log("listening on port 3000")
}

main()