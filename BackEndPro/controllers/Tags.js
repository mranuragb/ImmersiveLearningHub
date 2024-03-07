const Tag = require('../models/tags');

exports.createTags = async(req,res)=>{
    try {
        const {name,description} = req.body;

        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: 'All Fields are required',
            })
        }
        const tagDetails = await Tag.create({
            name: name,
            description: description
        });
        console.log(tagDetails);

        return res.status(200).json({
            success: true,
            message: 'Tags are created successfully'
        })
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: "Error creating tags"
        })
    }
};

exports.showAlltags = async(req,res)=>{
    try {
        const allTags = await Tag.find({},{name:true,description:true});
        res.status(200).json({
            success: true,
            message:"All tags Successfully shown",
            allTags
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in showAllTags"
        })
    }
}