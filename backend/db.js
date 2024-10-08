const mongoose = require("mongoose");
const { MONGO_URL } = require("./config")
mongoose.connect(MONGO_URL)

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema({
    email:{type: String, unique: true},
    password: String,
    name: String
})

const adminSchema = new Schema({
    email:{type: String, unique: true},
    password: String,
    name: String
})

const courseSchema = new Schema({
    title:{type: String, unique: true},
    desc: String,
    price: Number,
    imageURL: String,
    creatorId: String
})

const purchaseSchema = new Schema({
    userId: ObjectId,
    courseId: ObjectId
})


const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course", courseSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);

module.exports = {
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}