const User = require('../models/User');
const Profile = require('../models/Profile');

exports.updateProfile = async (req ,res )=>{
    try {
       const {dateOfBirth="",about="",contactNumber,gender} = req.body; 
       const id = req.user.id;

       if(!contactNumber || !gender || !id){
        return res.status(400).json({
            success : false,
            message: "All fields are required"
        })
       }

       const userDetails = await User.findById(id);
       const profileId = userDetails.additionalDetails;
       const profileDetails = await Profile.findById(profileId);


       profileDetails.dateOfBirth = dateOfBirth;
       profileDetails.about = about;
       profileDetails.contactNumber = contactNumber;

       await profileDetails.save();

       return res.status(200).json({
        success : true,
        message: "Profile Updated Successfully",
        profileDetails,
       })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error:error.message
        })
    }
}


//delete Account
exports.deleteAccount = async (req,res)=>{
    try {
        const id = req.user.id;

        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User Not Found",
            });
        }
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        await User.findByIdAndDelete({_id:id});

        return res.status(200).json({
            success: true,
            message: "Successfully Delete the User Account "
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error:error.message
        })
    }
}