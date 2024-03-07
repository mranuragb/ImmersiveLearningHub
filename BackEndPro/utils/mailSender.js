const nodemailer = require("nodemailer");
const { ApiError } = require("./ApiError");

const mailsender = async(email,title,body)=>{
    try{
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        })

        let info = await transporter.sendMail({
            from:`StudyNotion - Anurag Bawane`,
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`,
        })
        console.log(info);
        return info;

    }catch(error){
        console.log(error.message);
        throw new ApiError(500,"Error Occured In MailSender",error);

    }
}

module.exports = mailsender;