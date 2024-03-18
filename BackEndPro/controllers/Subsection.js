const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const {uploadImageToCloudinary} = require('../utils/imagesUploader');

exports.createSubSection = async (req,res)=>{
    try {
        //fetch data from req body
        const {sectionId ,title,timeDuration,description} = req.body;

        //extract file/video
        const video = req.files.videoFile;
        //validation
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success:false,
                message: "All fields are required"
            });
        }
        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME)
        //create a SubSection
        const SubsectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl:uploadDetails.secure_url,
        })
        //Update section with this subsectin ObjectId
        const uploadSection = await Section.findByIdAndUpdate({_id:sectionId},
            {
                $push:{
                    subSection:SubsectionDetails._id,
                }
            },{new:true})
        //return response
        return res.status(200).json({
            success:true,
            message:'Sub-Section Created Successfully',
            updatedSection,
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Internal server Error Occured",
            error:error.message,
        })
    }
}