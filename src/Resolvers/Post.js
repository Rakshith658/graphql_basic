import User from "../models/User";
import Comment from "../models/Comment";

const Post = {
  author: async (parent, args, { db }, info) => {
    const users = await User.findById(parent.author.match(/^[0-9a-fA-F]{24}$/));
    return users;
  },
  comments: async (parent, args, { db }, info) => {
    const Comments = await Comment.find({ postid: parent.id });
    return Comments;
  },
};
export default Post;
