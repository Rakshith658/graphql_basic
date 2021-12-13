import User from "../models/User";
import Post from "../models/Post";
import Comment from "../models/Comment";
const Query = {
  me: async (parent, args, { db }, info) => {
    const a = await db.users[0];
    return a;
  },
  Users: async (parent, args, { db }, info) => {
    if (!args.query) {
      const users = await User.find();
      return users;
    }
    const q_user = await User.find({
      name: { $regex: args.query, $options: "i" },
    });
    return q_user;
  },
  Comments: async (parent, args, { db }, info) => {
    if (!args.query) {
      const comments = await Comment.find();
      return comments;
    }
    const comments = await Comment.find({
      body: { $regex: args.query, $options: "i" },
    });
    return comments;
    // return db.Comments.filter((Comment) =>
    //   Comment.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
    // );
  },
  Posts: async (parent, args, { db }, info) => {
    if (!args.query) {
      const post = await Post.find();
      return post;
    }
    const q_post = await Post.find({
      title: { $regex: args.query, $options: "i" },
    });

    return q_post;
    // return db.posts.filter((post) => {
    //   const isTitle = post.title
    //     .toLocaleLowerCase()
    //     .includes(args.query.toLocaleLowerCase());
    //   const isbody = post.body
    //     .toLocaleLowerCase()
    //     .includes(args.query.toLocaleLowerCase());
    //   return isTitle || isbody;
    // });
  },
  post(parent, args, { db }, info) {
    return db.posts[0];
  },
};

export default Query;
