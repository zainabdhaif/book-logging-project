const mongoose = require('mongoose');

const editionSchema = new mongoose.Schema ({
    publishingHouse: {
        type: String,
        required: true
    },
    datePublished: {
        type: Date,
        reuqired:true
    },
    noOfPages:{ 
    type: Number, 
    required: true 
    }
});

const bookSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    author:{
        type:String,
        required: true,
    },
    averageRating:{
        type: mongoose.Schema.Types.Decimal128,
        required: true
    },
    editions:[editionSchema]
});



const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
