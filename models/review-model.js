const mongoose = require('mongoose'),
Schema = mongoose.Schema;
const ReviewSchema = Schema({

    _id: mongoose.Schema.Types.ObjectId,
    photo_id:{ type: Schema.Types.ObjectId, ref: 'photo' },

    reviews:[
        {  
            comment:String  ,
            review_author:  { type: Schema.Types.ObjectId, ref: 'users' }   
   
        }
    ],
    rating:Number,
    myrating:Number
   
  
})


const ReviewModel = mongoose.model('review', ReviewSchema);
    
    
module.exports = ReviewModel;