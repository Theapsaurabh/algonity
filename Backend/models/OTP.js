const  mongoose= require("mongoose");
const mailSender = require("../utils/mailSender");
 const OTPSchema= new mongoose.Schema({
    email:{
        type: String,
        require: true,

    },
    otp:{
        type: String,
        require: true,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires: 5*60
    },
 })
 // a function- > to send email
 async function sendVerificationEmail(email){
    try{
        const mailResponse= await mailSender(email, "Verification email from algonity ", otp)
        console.log("Email send Successfully by Algonity", mailResponse)

    }catch(error){
        console.log("error occur while sending mail");
        console.log(error)
    }

 }

 OTPSchema.pre("save", async function (next) {
    await sendVerificationEmail(this.email, this.otp)
    next();
    
 })


 module.exports= mongoose.model("OTP", OTPSchema);