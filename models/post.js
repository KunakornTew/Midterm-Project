const database = require('./connect');

let postschema = database.Schema({
    text: { type: String, required: true },
    imageName: { type: String },
    userId: { type: String, required: true},
    comments:  [{
        from: {type: String},
        commentText: { type: String} 
    }]
    
});

const Post = database.model('post',postschema);

module.exports = Post;