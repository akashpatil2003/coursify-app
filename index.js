const express = require("express");
const mongoose = require("mongoose");
const { MONGO_URL } = require("./config")

const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");

const app = express();
app.use(express.json());

app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/course", courseRouter);


async function main() {
    await mongoose.connect(MONGO_URL)
    app.listen(3000);
    console.log("listening on port 3000")
}

main()