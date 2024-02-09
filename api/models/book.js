const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    authors:[ 
        {
            name: {
            type: String,
            required: true,
            },
        }
    ],
    publisher: {
        type: String,
        required: true,
    },
    publishingyear:{
      type: Number,
      required: true,
    },
    category:{
        type: String,
        required: true,
    },
    callnumber:{
        type: String,
        required: true,
    },
   
  stores: [
    {
      id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      } 
    }
  ],
  image: String,
});


const Book = mongoose.model("Book",bookSchema);

module.exports = Book;