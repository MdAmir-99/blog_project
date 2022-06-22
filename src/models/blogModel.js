const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId


const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength:6
    },
    body: {
        type: String,
        required: true,
        maxlength: 1000
    },
    authorId: {
        type: ObjectId,
        ref: "author",
        required: true
    },
    tags: [{type : String}],
    category: {
        type: [String],
        required: true
    },
    subcategory: [String],
    deletedAt: String,
    isDeleted: {
        type: Boolean,
        default: false
    },
    publishedAt: String,
    isPublished: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('blog', blogSchema)