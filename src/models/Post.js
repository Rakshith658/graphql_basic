const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    min: 5,
    max: 20,
  },
  body: {
    type: String,
    min: 5,
    max: 50,
  },
  published: {
    type: Boolean,
    require: true,
  },
  author: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Post", PostSchema);
