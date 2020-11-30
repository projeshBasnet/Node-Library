const mongoose = require("mongoose")
const path = require("path")
const filepath = 'books/images'
const bookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
    },
    publishdate:{
        type:Date,
        required:true
    },
    posteddate:{
        type:Date,
        default:Date.now,
        required:true
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Author',
        required:true
    },
    coverimage:{
        type:Buffer,
        required:true

    },
    coverimagetype:{
        type:String,
        required:true
    }
})

// creating a virtual variable to give a full path of image
bookSchema.virtual('coverimagefullpath').get(function(){
    if(this.coverimage != null && this.coverimagetype != null){
    return `data:${this.coverimagetype};charset=utf-8;base64,${this.coverimage.toString('base64')}`
    }
})

module.exports = mongoose.model('Book',bookSchema)