const mongoose = require('mongoose');
const { Schema } = mongoose;

const formSchema = new Schema({
    formName:{
        type: String,
        required: true
    },
    formEmail:{
        type: String,
        required: true
    },
    formBackground:{
        type: String,
        required: true
    },
    formAddress:{
        type: String,
        required: true
    },
    formNumber:{
        type: Number,
        required: true
    },
    formMsg:{
        type: String,
    }
  });

  module.exports = mongoose.model('forms', formSchema);
