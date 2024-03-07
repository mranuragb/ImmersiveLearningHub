const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = async (file,floder,height,quality)=>{
    const options = {floder};
    if(height){
        options.height = height;
    }
    if(quality){
        options.quality = quality;
    }
    options.resourse_type = "auto";

    return await cloudinary.uploader.upload(file.tempFilePath,options);
}