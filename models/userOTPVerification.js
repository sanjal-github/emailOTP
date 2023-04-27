const mongoose = require("mongoose");

const UserOTPVerificationSchema = new mongoose.Schema({
    userId:
    {
        type:String,
    },
    otp:
    {
        type:String
    },
    createdAt:
    {
    Date
    },
    expiredAt:
    {
    Date
    }
 
})

const userOTP = new mongoose.model("UserOTP",UserOTPVerificationSchema);

module.exports = userOTP;
