const mongoose = require('mongoose');  
  
const itemSchema = new mongoose.Schema({  
  name: {  
    type: String,  
    required: true,  
    index: true  
  },  
  imageUrl: String,  
  description: String,  
  productionCost: Number,  
  estimatedProfit: Number,  
  likes: {  
    type: Number,  
    default: 0  
  },  
  searches: {  
    type: Number,  
    default: 1  
  },  
  lastUpdated: {  
    type: Date,  
    default: Date.now  
  }  
}, { timestamps: true });  
  
module.exports = mongoose.model('Item', itemSchema);