const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req,res)=>{
    try {
        //data fetch
        const {sectionName , couserId} = req.body;
        //data validation
        if(!sectionName || !couserId){
            return res.status(400).json({
                success:false,
                message : "Missing Properties"
            })
        }
        
        //create section
        const newSection = await Section.create({sectionName});

        //update course with section objectID
        const updatedCourseDetails = await Course.findByIdAndUpdate(couserId,
            {
                $push:{
                    courseContent:newSection._id,
                }
            },{new:true})//everytime give new course

        return res.status(200).json({
            success:true,
            message:"Section Created Successfully",
            updatedCourseDetails,
        })
            
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to create Section , please try again",
            error: error.message,
        });
    }
}


exports.updateSection = async (res,req)=>{

    try {
        const {sectionName,sectionId} = res.body;
        if(!sectionName || sectionId){
            return res.status(400).json({
                success:false,
                message : "Missing Properties"
            })
        }
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName},{new:true});

        return res.status(200).json({
            success:true,
            message:"Section Updated Successfully",
     
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to create Section , please try again",
            error: error.message,
        });
    }
}


exports.deleteSection = async(req,res)=>{
    try {
        const {sectionId} = req.params
        await Section.findByIdAndDelete(sectionId);

        return res.status(200).json({
            success: true,
            message: 'Section deleted successfully',
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete, please try again",
            error:error.message
        })
    }
}