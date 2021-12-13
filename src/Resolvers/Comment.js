import User from "../models/User";
import Post from "../models/Post";

const comment = {
  author: async (parent, args, { db }, info) => {
    const user = await User.findById(
      parent.authorid.match(/^[0-9a-fA-F]{24}$/)
    );
    return user;
  },
  post: async (parent, args, { db }, info) => {
    const post = await Post.findById(parent.postid.match(/^[0-9a-fA-F]{24}$/));
    return post;
  },
};

export default comment;
