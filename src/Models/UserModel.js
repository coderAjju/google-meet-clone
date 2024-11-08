import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false,
    },
    profilePicture:{
        type: String,
    },
    isVerified:{
        type:Boolean,
        required: true
    }
},{timestamps:true})

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;