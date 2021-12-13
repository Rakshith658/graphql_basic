const mongoose = require("mongoose");

const Comment = mongoose.Schema({
  postid: {
    type: String,
    require: true,
  },
  authorid: {
    type: String,
    require: true,
  },
  body: {
    type: String,
  },
});

module.exports = mongoose.model("Comment", Comment);
