const mongoose = require("mongoose");

const booksSchema = new mongoose.Schema({
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
      name: {
        type: String,
        required: true,
      },
      owner: {
          type: String,
          required: true,
      },
      location:{
          type: String,
          required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      discount: {
        type: Number,
      },
      quantity: {
        type: Number,
        required: true,
    },
    },
  ],
  image: {
    type: String,
    required: true,
  },
});


const Books = mongoose.model("Books",booksSchema);

module.exports = Books;