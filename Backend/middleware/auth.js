const jwt= require("jsonwebtoken");
require("dotenv").config();
const User= require("../models/User");

// auth
exports.auth= async(req,resizeBy,next)=>{
    try{
        // extract token
        const token= req.cookies.token
         || req.body.token
        || req.header("Authorization").replace("Bearer ","" );

        // if token is missing, then return response 
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing"

            })
        }
        // verift token 
        try{
            const decode= await jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode)
            req.user= decode;

        }catch(error){
            // verification issue
            return res.status(401).json({
                success: false,
                message: "Token is invalid"

            });

        }
        next();
     }catch(error){
        return res.status(401).json({
            success: false,
            message: "something went wrong while validating the  token"
        })

    }
}
// isStudent
exports.isStudent= async(req,res, next)=>{
    try{
        if(req.user.accountType !== "Student"){
            return res.status(400).json({
                success: false,
                 message: "This is protected route for student only",
            });
        }

    }catch(error){
        return res.status(401).json({
            success: false,
            message: "User role can  not be verified"
        })

    }
}
// isInstructor
exports.isInstructor= async(req,res, next)=>{
    try{
        if(req.user.accountType !== "Instructor"){
            return res.status(400).json({
                success: false,
                 message: "This is protected route for Instructor only",
            });
        }

    }catch(error){
        return res.status(401).json({
            success: false,
            message: "User role can  not be verified"
        })

    }
}
// isAdmin
exports.isAdmin= async(req,res, next)=>{
    try{
        if(req.user.accountType !== "Admin"){
            return res.status(400).json({
                success: false,
                 message: "This is protected route for Admin only",
            });
        }

    }catch(error){
        return res.status(401).json({
            success: false,
            message: "User role can  not be verified"
        })

    }
}