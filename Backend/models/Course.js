const mongoose= require("mongoose")
const courseSchema= new mongoose.Schema({
courseName:{
    type: String,
    require: true

},
courseDescription:{
    type: String,
    require: true

},
instructor :{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required: true
},
whatYouWillLearn:{
    type: String,

},
courseContent:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Section",
}
],
ratingAndReviews:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"RatingAndReview"
    
}],
price:{
    type: Number,

},
thumbnail:{
    type: String
},
tags:{
     type: mongoose.Schema.Types.ObjectId,
    ref:"Tag"

},
studentsEnrolled:[{
   type: mongoose.Schema.Types.ObjectId,
   require: true,
    ref:"User"
}]

})

module.exports= mongoose.model("Course", courseSchema);