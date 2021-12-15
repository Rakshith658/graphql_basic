import { v4 as uuidv4 } from "uuid";
import User from "../models/User";
import Post from "../models/Post";
import Comment from "../models/Comment";

const Mutation = {
  createUser: async (parent, args, { db }, info) => {
    const emailtaken = await User.findOne({ email: args.data.email });

    if (emailtaken) {
      throw new Error(`User with email ${args.data.email} already exists`);
    }

    const newUser = new User({
      name: args.data.name,
      email: args.data.email,
      age: args.data.age,
    });

    const user = await newUser.save();
    return user;
  },
  deleteUser: async (parent, args, { db }, info) => {
    const user = await User.findById(args.id.match(/^[0-9a-fA-F]{24}$/));
    if (!user) {
      throw new Error(`User with id ${args.id} does not exist`);
    }
    const _user = await User.findByIdAndDelete(
      args.id.match(/^[0-9a-fA-F]{24}$/)
    );
    await Post.deleteMany({ author: _user.id });
    await Comment.deleteMany({ authorid: _user.id });
    // db.users = db.users.filter((user) => user.id !== args.id);
    // db.posts = db.posts.filter((post) => {
    //   const match = post.author === args.id;
    //   if (match) {
    //     db.Comments = db.Comments.filter((comment) => comment.id !== post.id);
    //   }
    //   return !match;
    // });
    // db.Comments = db.Comments.filter((comment) => comment.authorid !== args.id);
    return _user;
  },
  updateUser: async (parent, args, { db }, info) => {
    // const userUpdateFind = db.users.find((user) => user.id === args.id);
    // const userUpdateindex = db.users.findIndex((user) => user.id === args.id);
    const userUpdateFind = await User.findById(
      args.id.match(/^[0-9a-fA-F]{24}$/)
    );
    if (!userUpdateFind) {
      throw new Error(`the user is not found with this Id ${args.id}`);
    }

    if (typeof args.data.email === "string") {
      // const emailtaken = db.users.some(
      //   (user) => user.email === args.data.email
      // );
      const emailtaken = await User.findOne({ email: args.data.email });
      if (emailtaken) {
        throw new Error(`this email is already taken `);
      }
      await User.findByIdAndUpdate(args.id.match(/^[0-9a-fA-F]{24}$/), {
        email: args.data.email,
      });
    }
    if (typeof args.data.name === "string") {
      await User.findByIdAndUpdate(args.id.match(/^[0-9a-fA-F]{24}$/), {
        name: args.data.name,
      });
    }

    if (typeof args.data.age !== "undefined") {
      await User.findByIdAndUpdate(args.id.match(/^[0-9a-fA-F]{24}$/), {
        age: args.data.age,
      });
    }
    // if (userUpdateFind) {
    //   db.users.splice(userUpdateindex, 1, userUpdateFind);
    // }
    const Updateuser = await User.findById(args.id.match(/^[0-9a-fA-F]{24}$/));
    return Updateuser;
  },
  createPost: async (parent, args, { db, pubsub }, info) => {
    const Userexits = await User.findById(
      args.data.author.match(/^[0-9a-fA-F]{24}$/)
    );
    // console.log(Userexits);
    if (!Userexits) {
      throw new Error("user desn't exist");
    }
    const newPost = new Post({
      title: args.data.title,
      body: args.data.body,
      published: args.data.published,
      author: args.data.author,
    });
    // const post = {
    //   id: uuidv4(),
    //   ...args.data,
    // };
    // db.posts.push(post);
    if (newPost.published) {
      pubsub.publish("post", {
        post: {
          mutation: "Created",
          data: post,
        },
      });
    }
    const post = await newPost.save();
    return post;
  },
  deletePost: async (parent, args, { db }, info) => {
    const P = await Post.findById(args.id.match(/^[0-9a-fA-F]{24}$/));
    if (!P) {
      throw new Error("Post with id " + args.id + "doesn't exist");
    }
    const post = await Post.findByIdAndDelete(
      args.id.match(/^[0-9a-fA-F]{24}$/)
    );
    await Comment.deleteMany({ postid: post.id });
    // db.posts = db.posts.filter((post) => post.id !== args.id);
    // db.Comments = db.Comments.filter((comment) => comment.postid !== args.id);
    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "Deleted",
          data: Post,
        },
      });
    }
    return post;
  },
  updatePost: async (parent, args, { db, pubsub }, info) => {
    const UpdatePost = await Post.findById(args.id.match(/^[0-9a-fA-F]{24}$/));
    if (!UpdatePost) {
      throw new Error("Post with id " + args.id + "doesn't exist");
    }
    // const UpdatePost = db.posts.find((post) => post.id === args.id);
    // const PostUpdateindex = db.posts.findIndex((post) => post.id === args.id);
    if (typeof args.data.title === "string") {
      await Post.findByIdAndUpdate(args.id.match(/^[0-9a-fA-F]{24}$/), {
        title: args.data.title,
      });
    }
    if (typeof args.data.body === "string") {
      await Post.findByIdAndUpdate(args.id.match(/^[0-9a-fA-F]{24}$/), {
        body: args.data.body,
      });
    }
    if (typeof args.data.published === "boolean") {
      if (UpdatePost.published === false) {
        await Post.findByIdAndUpdate(args.id.match(/^[0-9a-fA-F]{24}$/), {
          published: args.data.published,
        });
      }
    }
    if (args.data.published) {
      pubsub.publish("post", {
        post: {
          mutation: "Created",
          data: UpdatePost,
        },
      });
    } else {
      pubsub.publish("post", {
        post: {
          mutation: "Updated",
          data: UpdatePost,
        },
      });
    }
    const UpdatePostss = await Post.findById(
      args.id.match(/^[0-9a-fA-F]{24}$/)
    );
    return UpdatePostss;
  },
  createcomment: async (parent, args, { db, pubsub }, info) => {
    const user = await User.findById(
      args.data.authorid.match(/^[0-9a-fA-F]{24}$/)
    );
    const post = await Post.findById(
      args.data.postid.match(/^[0-9a-fA-F]{24}$/)
    );

    const published = post.published;

    if (user === null || post === null || published === false) {
      throw new Error(
        "User are post dosen't exist are the post may not be published"
      );
    }

    // const comment = {
    //   id: uuidv4(),
    //   ...args.data,
    // };
    const newComment = new Comment({
      postid: args.data.postid,
      authorid: args.data.authorid,
      body: args.data.body,
    });

    const comment = await newComment.save();
    db.Comments.push(comment);
    pubsub.publish(`comment ${args.data.postid}`, {
      comment: {
        mutation: "Created",
        data: comment,
      },
    });
    return comment;
  },
  deleteComment: async (parent, args, { db, pubsub }, info) => {
    const comment = await Comment.findById(args.id.match(/^[0-9a-fA-F]{24}$/));
    if (!comment) {
      throw new Error("Comment not found");
    }
    const comm = await Comment.findByIdAndDelete(
      args.id.match(/^[0-9a-fA-F]{24}$/)
    );
    pubsub.publish(`comment ${comm.postid}`, {
      comment: {
        mutation: "Deleted",
        data: comm,
      },
    });
    return comm;
  },
  updatecomment: async (parent, args, { db, pubsub }, info) => {
    const comment = await Comment.findById(args.id.match(/^[0-9a-fA-F]{24}$/));
    if (!comment) {
      throw new Error("Comment not found");
    }
    await Comment.findByIdAndUpdate(args.id.match(/^[0-9a-fA-F]{24}$/), {
      body: args.data.body,
    });
    const UpdateComment = Comment.findById(args.id.match(/^[0-9a-fA-F]{24}$/));
    // const CommentsUpdateindex = db.Comments.findIndex(
    //   (Comment) => Comment.id === args.id
    // );

    // if (typeof args.data.body === "string") {
    //   UpdateComment.body = args.data.body;
    // }
    // db.Comments.splice(CommentsUpdateindex, 1, UpdateComment);
    pubsub.publish(`comment ${UpdateComment.postid}`, {
      comment: {
        mutation: "Updated",
        data: UpdateComment,
      },
    });
    return UpdateComment;
  },
};

export default Mutation;
