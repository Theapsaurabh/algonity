const mongoose= require("mongoose");
 const ratingAndReviewsSchema= new mongoose.Schema({
    user:{
        types:mongoose.Schema.Types.ObjectId,
        require: true,
        ref:"User"
    },
    rating:{
        types: Number,
        required: true,

    },
    review:{
        type:String,
        require: true
    }
    



 });
 module.exports= mongoose.model("RatingAndReview", ratingAndReviewsSchema)