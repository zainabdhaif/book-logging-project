const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema ({
    reviewTitle:{
        type: String,
        required: true,
    },
    reviewBody:{
        type:String,
        reuqired: true,
    }
});

const ratingSchema = new mongoose.Schema({
    reviewRating:{
        type: Number,
        required: true
    },
    
    reviews: [reviewSchema]
});


const listSchema = new mongoose.Schema({
    listType:{
        type: String,
        enum: ['want to read', 'read', 'DNF', 'favorite'],
        require: true,
    },
    description:{
        type: String,
        require: false,
    },
    books:{
        type: [mongoose.Schema.Types.ObjectId],
        ref:'Book',
        required: false
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        required: true
    },
    lists: [listSchema],
    ratings:[ratingSchema],
    reviews: [reviewSchema],
    //referencing the book
    books:{
        type: [mongoose.Schema.Types.ObjectId],
        ref:'Book',
        required: false
    }
});


const User = mongoose.model("User", userSchema);

module.exports = User;


