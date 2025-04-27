 const User= require("../models/User");
 const OTP= require("../models/OTP");
 const otpGenerator= require("otp-generator");
const { createTestAccount } = require("nodemailer");
const bcrypt= require("bcrypt");
require("dotenv").config();





// sendOTP
exports.sendOTP= async(req,res)=>{
    try{
        const {email}= req.body;
    // check user already present or not 
    const checkUserPresent= await User.findOne({email})
    if(checkUserPresent){
        return res.status(401).json({
            success: false,
            message: "User already exist"
        });

    }
     var otp=  otpGenerator.generate(6,{
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
     });
     console.log("OTP generated: ", otp);

     // check unique otp or not
     const result= await OTP.findOne({otp: otp});

     while(result){
        otp= otpGenerator(6,{
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
       result= await OTP.findOne({otp: otp});


     }
     
     const otpPayload= {email, otp};
     // create an entry  for otp
     const otpBody= await OTP.create(otpPayload);
     console.log(otpBody);

     res.status(200).json({
        success: true,
        message:"otp send successfully"
     })


    }catch(error){
        console.log(error);
        return res.status(500),json({
            success: false,
            message: error.message
        })


    }

    

  


};
// signup
exports.signup= async (req,res)=>{
    try{
        // data fetch from request body
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp
    }= req.body;


    // validate data

    if(!firstName|| !lastName|| !email|| !password || !confirmPassword ){
        return res.status(403).json({
            success: false,
            message: "All field are required"
        })
    }
    // 2 password match

   if(password !=confirmPassword){
    return res.status(400).json({
        success: false,
        message: "Password and confirmPassword Values does not match, please try again "
    });

   }
    // check user already exit or not

     const existingUser= await User.findOne({email});
     if(existingUser){
        return res.status(400).json({
            success: false,
            message: "user already exist please signin"
        })
     }
    // find most recent OTP stored
    const recentOtp= await OTP.find({email}).sort({createdAt: -1}). limit(1);
    console.log(recentOtp);
// validate OTP
   if(recentOtp.length==0){
    // otp is not found
    return res.status(400).json({
        success: false,
        message: "OTP is not found",

    })
   }else if(otp !=recentOtp){
    // invalid OTP
    return res.status(400).json({
        success: false,
        message: "OTP is not valid"
    })
   }
    // hashed Password
    const hashedPassword= await bcrypt.hash(password,10)

    
    
    // entry crated in data base
    const profileDetails= await  Profile.create({
        gender: null,
        dateofBirth: null,
        about: null,
        contactNumber: null
    });
    const user= await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password: hashedPassword,
        accountType,
        additionalDetails: Profile,
        image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,


    })
    // return res
    return res.status(200).json({
        success: true,
        message: "User is registered Successfully"
    });

    }catch(error){
        console.log(error)
        return  res.status(500).json({
            success: false,
            message: "User can  not be registered"
        })


    }
    
    



}


// login

exports.login= async(req,res)=>{
try{
    const {email, password}= req.body;
    if(!email || !password){
        return res.status(403).json({
            success: false,
            message: "All field are required, please try again"


        });
    }
    const user = await User.findOne({email}).populate("additionalDetails")
    if(!user){
        return res.status(401).json({
            success: false,
             message: "User is not registered, please signup first"
        });
    }
    // generate JWT, after password matched
    if(await bcrypt.compare(password, user.password)){
        const payload= {
            email: user.email,
            id: user._id,
            accountType: user.accountType

        }

        const token = jwt.sign(payload,process.env.JWT_SECERET,{
            expiresIn:"2h",

        });
        user.token= token;
        user.password= undefined;

        // create cookie and send response
        const options={
            expires: new Date(Date.now()+3*34*60*1000),
            httpsOnly: true
        }


        res.cookie("token", token, options).status(200).json({
            success: true,
            token,
            user,
            message: "Logged in successfully"
        });
    }
    else{
        return res.status(401).json({
            success: false,
            message: "Password is not matched"
        })
    }



}catch(error){
    console.log(error);
    return res.status(500).json({
        success: false,
        message:"Login Faliure , please try"
    })

}



};
// changePassword

exports. changePassword= async(req, res)=>{
    try{
        // get data from req body
        // get oldpasssword, newpassword, confirm new password
        // validation


    }catch(error){

    }
}