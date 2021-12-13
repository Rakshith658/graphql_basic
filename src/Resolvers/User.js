import Post from "../models/Post";
import Comment from "../models/Comment";

const User = {
  posts(parent, args, { db }, info) {
    const posts = Post.find({ author: parent.id });
    return posts;
  },
  comments(parent, args, { db }, info) {
    const Comments = Comment.find({ authorid: parent.id });
    return Comments;
  },
};
export default User;
