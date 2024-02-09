const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
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
    books: [
        {  id:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Book",
            } 
        }
    ],

});


const Store = mongoose.model("Store",storeSchema);

module.exports = Store;