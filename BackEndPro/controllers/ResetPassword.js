const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");

//resetPasswordToken
exports.resetPasswordToken = async(req,res)=>{
    try{
        //get email from req body
        const email = req.body.email;
        //check user for this email validation
        const user = await User.findOne({email:email});
        if(!user)
        {
            return res.json({
                success:false,
                message:'Your Email is not registered with us'
            })
        }
        //generate token
        const token = crypto.randomUUID();
        //update user by adding token and expiration 
        const updateDetails = await User.findByIdAndUpdate(
                                {email},
                                {
                                    token:TokenExpiredError,
                                    resetPasswordExpires:Date.now()+5*60*1000,
                                },
                                {new:true});
        const url = `http://localhost:3000/update-password/${token}`;
        //send mail containing the url
        await mailSender(email,
            "Password Reset Link",
            `Password Reset Link: ${url}`
            );
        //return response
        return res.json({
            success:true,
            message:'Email sent Successfully , Please check Email and change password',
        }) 
    } catch(error){
        return res.status(401).json({
            success:false,
            message:'Something went Wrong',
        })
    } 
}

//resetPassword
exports.resetPassword = async(req,res)=>{
    try{
        //data fetch
        const {password,confirmPassword,token} = req.body;
        //validation
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:'Password not Matching',
            })
        }
        //get userdetails from db using token
        const userDetails = await User.findOne({token:token});
        //if no entry - invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:'Token is Invalid',
            });
        }
        //token Time check
        if(userDetails.resetPasswordExpires<Date.now()){
            return res.json({
                success:false,
                message:'Token is expired, please regenerate your token',
            });
        }
        //hash pwd
        const hashedPassword = await bcrypt.hash(password,10);

        //password update
        await User.findByIdAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        );
        //return response
        return res.status(200).json({
            success:true,
            message:'Password reset Successful',
        }); 
    } catch(error){
        return res.status(401).json({
            success:false,
            message:'Something went Wrong in resetPassword',
        })
    } 
}