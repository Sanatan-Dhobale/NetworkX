import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture:{
        type: String,
        default: "https://res.cloudinary.com/dlrgwmg7s/image/upload/v1784666724/default_faw8vz.jpg",
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    token:{
        type: String,
        default:"",
    }

});

const User = mongoose.model("User", UserSchema);

export default User;