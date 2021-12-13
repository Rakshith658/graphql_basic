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
  deleteUser(parent, args, { db }, info) {
    const user = db.users.some((user) => user.id === args.id);
    if (!user) {
      throw new Error(`User with id ${args.id} does not exist`);
    }
    const User = db.users.find((user) => user.id === args.id);
    db.users = db.users.filter((user) => user.id !== args.id);
    db.posts = db.posts.filter((post) => {
      const match = post.author === args.id;
      if (match) {
        db.Comments = db.Comments.filter((comment) => comment.id !== post.id);
      }
      return !match;
    });
    db.Comments = db.Comments.filter((comment) => comment.authorid !== args.id);
    return User;
  },
  updateUser(parent, args, { db }, info) {
    const userUpdateFind = db.users.find((user) => user.id === args.id);
    const userUpdateindex = db.users.findIndex((user) => user.id === args.id);
    if (!userUpdateFind) {
      throw new Error(`the user is not found with this Id ${args.id}`);
    }

    if (typeof args.data.email === "string") {
      const emailtaken = db.users.some(
        (user) => user.email === args.data.email
      );

      if (emailtaken) {
        throw new Error(`this email is already taken `);
      }
      userUpdateFind.email = args.data.email;
    }
    if (typeof args.data.name === "string") {
      userUpdateFind.name = args.data.name;
    }

    if (typeof args.data.age !== "undefined") {
      userUpdateFind.age = args.data.age;
    }
    if (userUpdateFind) {
      db.users.splice(userUpdateindex, 1, userUpdateFind);
    }

    return userUpdateFind;
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
    // if (post.published) {
    //   pubsub.publish("post", {
    //     post: {
    //       mutation: "Created",
    //       data: post,
    //     },
    //   });
    // }
    const post = await newPost.save();
    return post;
  },
  deletePost(parent, args, { db }, info) {
    const P = db.posts.some((post) => post.id === args.id);
    if (!P) {
      throw new Error("Post with id " + args.id + "doesn't exist");
    }
    const Post = db.posts.find((post) => post.id === args.id);
    db.posts = db.posts.filter((post) => post.id !== args.id);
    db.Comments = db.Comments.filter((comment) => comment.postid !== args.id);
    if (Post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "Deleted",
          data: Post,
        },
      });
    }
    return Post;
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const P = db.posts.some((post) => post.id === args.id);
    if (!P) {
      throw new Error("Post with id " + args.id + "doesn't exist");
    }
    const UpdatePost = db.posts.find((post) => post.id === args.id);
    const PostUpdateindex = db.posts.findIndex((post) => post.id === args.id);
    if (typeof args.data.title === "string") {
      UpdatePost.title = args.data.title;
    }
    if (typeof args.data.body === "string") {
      UpdatePost.body = args.data.body;
    }
    if (typeof args.data.published === "boolean") {
      if (UpdatePost.published === false) {
        UpdatePost.published = args.data.published;
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

    if (P) {
      db.posts.splice(PostUpdateindex, 1, UpdatePost);
    }
    return UpdatePost;
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
    // db.Comments.push(comment);
    // pubsub.publish(`comment ${args.data.postid}`, {
    //   comment: {
    //     mutation: "Created",
    //     data: comment,
    //   },
    // });
    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const comment = db.Comments.some((comment) => comment.id === args.id);
    if (!comment) {
      throw new Error("Comment not found");
    }
    const comm = db.Comments.find((comment) => comment.id === args.id);
    db.Comments = db.Comments.filter((comment) => comment.id !== args.id);
    pubsub.publish(`comment ${comm.postid}`, {
      comment: {
        mutation: "Deleted",
        data: comm,
      },
    });
    return comm;
  },
  updatecomment(parent, args, { db, pubsub }, info) {
    const comment = db.Comments.some((comment) => comment.id === args.id);
    if (!comment) {
      throw new Error("Comment not found");
    }
    const UpdateComment = db.Comments.find((post) => post.id === args.id);
    const CommentsUpdateindex = db.Comments.findIndex(
      (Comment) => Comment.id === args.id
    );

    if (typeof args.data.body === "string") {
      UpdateComment.body = args.data.body;
    }
    db.Comments.splice(CommentsUpdateindex, 1, UpdateComment);
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
