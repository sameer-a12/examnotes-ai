import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    credits: {
        type: Number,
        default: 50,
        min: 0
    },
    isCreditAvailable: {
        type: Boolean,
        default: true
    },
    notes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Notes",
        default: []

    },
    role: { 
        type: String, default: "user" 
    },
    isBanned: { 
        type: Boolean, default: false 
    },
    streak: {
    type: Number,
    default: 0
},
lastActiveDate: {
    type: String,
    default: null
},

}, { timestamps: true })

const UserModel = mongoose.model("UserModel", userSchema)

export default UserModel