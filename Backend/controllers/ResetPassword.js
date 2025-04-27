const User= require("../models/User")
const mailSender= require("../utils/mailSender")



// resetPasswordToken
exports.resetPasswordToken= async (req,res)=>{
    try{

         // get email from req ki body
    const email= req.body.email;

    // check user for this email, email verifaction
    const user = await User.findOne({email: email});
    if(!user){
        return res.json({
            success: false,
             message: "Your email is not registered yet"
        })
    }
    const token= crypto.randomUUID()
    // generate token
    // Update user  by adding token and exipratioon time
    const updatedDetails= await User.findOneAndUpdate({email:email},
                                                      {
                                                        token : token,
                                                         resetPasswordExpires: Date.now()+ 5*60*1000,

                                                      },
                                                      {new:true});

    // create url
    const url= `http://localhost:3000/update-password/${token}`


    // send mail containing the url
    await mailSender(email, "password Reset Link",
                            `Password Reset Link : ${url}`);

    // return response
    return res.json({
        success: true,
        message: "Email sent successfull, please check email and change password"
    });
}

catch(error){
    console.log(error)
    return res.status(500).json({
        success: false,
         message:"Something went wrong while reset password "
    })

    }
}
// reset password
exports.resetPassword= async(req,res)=>{
    // fetch data
    try{
        const {password, confirmPassword, token}= req.body;

        // validation
        if(password != confirmPassword){
            return res.json({
                success: false,
                 message: "Password not matching ",
            });
        }
        const userDetails=  await user.findOne({token: token})
        // get user details  from db using token
        // if no entry- invalid token
        if(!userDetails){
            return res.json({
                success: false,
                 message: "Token is invalid",
    
            });
    
        }
        if( userDetails.resetPasswordExpires < Date.now()){
            return res.json({
                success: false,
                 message :" token is expires please re-generate your password "
            })
    
    
        }
        const hashedPassword= await bcrypt.hash(password,10);
        await User.findOneAndUpdate(
            {token: token},
            {password: hashedPassword},
            {new: true}
        );
        return res.status(200).json({
            success: true,
            message: "Password Reset successfull"
        })
    
       

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success: false,
             message:"Something went wrong while reset password "
        })


    }
   
    // token time check
    //hash password
    //return response



}

