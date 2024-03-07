const User = require("../models/User");
const OTP = require("../models/OTP"); 
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//sendOTP
exports.sendOTP = async(req,res)=>{
    try{
        //fetch email from request body
        const {email} = req.body;
        //check if user already exist
        const checkUserPresent = await User.findOne({email});

        if(checkUserPresent){
            return res.stutus(401).json({
                sucess:false,
                message:`User Already Registered`,
            });
        }
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP Generated : ",otp);

        let result = await OTP.findOne({otp:otp});
        //Unique OTP Generated
        while(result){
            otp = otpGenerator(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = await OTP.findOne({otp:otp});

        }
        const otpPayload = {email,otp};

        //Create An Entry For OTP
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(200).json({
            sucess:true,
            message:`OTP sent Successfully`,
            otp,
        })
         
    }catch(error){
        console.log(error);
        return res.status(500).json({
            sucess:false,
            message:error.message,
        })
    }
};

//SignUp
exports.signUp = async (req,res)=>{
    try{
        //Data Fetch Request Body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;

        //Validate
        if(!firstName||!lastName||!email||!password||!confirmPassword || !otp){
            return res.status(403).json({
                sucess:false,
                message:"All Field are Required",
            });

        }

        //Password Match
        if(password !== confirmPassword){
            return res.status(400).json({
                sucess:false,
                message:`Password and confirm Password Value does not Match,please try again`,
            });

        }
        //check user already exist or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                sucess:false,
                message:`User is Already Registered`
            });
        }
        //find most recent OTP stored for the user
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);

        //validate OTP
        if(recentOtp.length == 0){
            // OTP not found
            return res.stutus(400).json({
                sucess:false,
                message:'OTP not Found',
            })
        }else if(otp !== recentOtp.otp){
            return res.stutus(400).json({
                sucess:false,
                message:'Invalid OTP',
            }) 
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password,10);

        //entry create in DB
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });
        const user = await User({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstname} ${lastName}`,

        })
        //return Response
        return res.status(200).json({
            sucess:true,
            message:'User is registered Successfully',
            user,
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            sucess:false,
            message:err.message,
        });
    }
}
//login
exports.login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        //validation data
        if(!email || !password){
            return res.status(403).json({
                sucess:false,
                message:'All field are required, please try again',
            });

        }
        //user check exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                sucess:false,
                message:"User is not registered, please signup first",

            });
        }
        //generate JWT after password matching
        if(await bcrypt.compare(password,user.password)){
            const payload = {
                email: user.email,
                id: user_id,
                accountType:user.accountType,
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            });
            user.token = token;
            user.password = undefined;
        }
        else{
            return res.status(400).json({
                sucess:false,
                message:'Password is Incorrect',
            });
        }
    }catch(error){
        console.log(error);
        return res.status(500).json({
            sucess:false,
            message:error.message,
        });
    }
};

//changePassword
exports.changePassword = async(req,res)=>{
    
}
