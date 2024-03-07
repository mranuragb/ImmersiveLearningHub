const mongoose = require("mongoose");
const mailsender = require("../utils/mailSender");
const { ApiError } = require("../utils/ApiError");

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
});

//A Function -> to send Emails

async function sendVerificationEmail(email,opt){
    try{
        const mailResponse = await mailsender(email,"verification Email from StudyNotaion",otp);
        console.log("Email sent Successfully : ",mailResponse);
    }
    catch(error){
        console.log("Error occured while sending mail",error);
        throw new ApiError(500,"Error Occured In Send Verification Email",error);
    }
}

OTPSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})

module.exports = mongoose.model("OTP",OTPSchema);