const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

//auth
exports.auth = async(req,res,next)=>{
    try{
        //extract token
        const token = req.cookies.token
                        || req.body.token   
                        || req.header("Authorization").replace("Bearer","");

        //if token Missing then return response
        if(!token)
        {
            return res.status(401).json({
                success:false,
                message:'Token is Missing',
            });
        }
        //verify the token
        try{
            const decode = await jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }catch(err){
            return res.status(401).json({
                success:false,
                message:'Token is Invalid',
            })
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:'Some thing Wrong',
        })
    }
}

//isStudent
exports.isStudent = async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Student")
        {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Student only',
            });
        }
        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:'Some thing went Wrong',
        })
    }
}

//isInstrucor
exports.isInstrucor = async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Instrucor")
        {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Instrucor only',
            });
        }
        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:'Some thing went Wrong',
        })
    }
}

//isAdmin
exports.isAdmin = async(req,res,next)=>{
    try{
        if(req.user.accountType !== "Admin")
        {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Admin only',
            });
        }
        next();
    }catch(error){
        return res.status(401).json({
            success:false,
            message:'Some thing went Wrong',
        })
    }
}