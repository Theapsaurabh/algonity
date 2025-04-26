const nodemailer= require("nodemailer");
const mailSender= async(req, res)=>{
    try{

        let transporter= nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });
        let info= await transporter.sendMail({
            from:'ALGONITY || EduTec- By saurabh ',
            to: `${email}`,
            subject: `${title}`,
            html:`${body}`,
        })
        console.log(info);
        return info;

    }catch(error){
        console.error(error.message);



    }
}
module.exports= mailSender;