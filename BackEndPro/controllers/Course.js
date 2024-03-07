const Course = require('../models/Course');
const Tag = require('../models/tags');
const User = require('../models/User')
const {uploadImageToCloudinary} = require('../utils/imagesUploader')

exports.createCourse = async (req,res)=>{
    try {
        const {courseName,courseDescription,whatYouLearn,price,tag} = req.body;

        const thumbnail = req.body.thumbnailImage;

        if(!courseName || !courseDescription || !whatYouLearn || !tag || !price || !thumbnail){
            return res.status(400).json({
                success : false,
                message: "All fields are reduired"
            });
        }
        // check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);

        if(!instructorDetails){
            return res.status(404).json({
                success: false,
                message: "Instructors Details are not available"
            })
        }
        //check given tag is valids or not
        const tagDetails = await Tag.findById(tag);
        if(!tagDetails){
            return res.status(404).json({
                success: false,
                message: "Tag Details are not available"
            });
        } 

        //upload Image top Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME)

        //create a entry for new course

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price,
            tag:tagDetails._id,
            thumbnail: thumbnailImage.secure_url,
        });
        //add the new course to the user schema of Instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id,
                }
            },
            {new: true}
        );

        return res.status(200).json({
            success: true,
            message: 'Course created successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//getAll courses handler function

exports.showAllCourse = async (req,res)=>{
    try {
        const allCourse = await Course.find({},{courseName:true,price:true,thumbnail:true,instructor:true,ratingAndReviews:true,studentEnrolled:true}).populate("instructor").exec();

        return res.status(200).json({
            success:true,
            message: "Data found for all courses successfully",
            data: allCourse
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}