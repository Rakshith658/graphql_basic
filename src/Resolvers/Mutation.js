import { v4 as uuidv4 } from "uuid";

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailtaken = db.users.some((user) => user.email === args.data.email);

    if (emailtaken) {
      throw new Error(`User with email ${args.email} already exists`);
    }
    const user = {
      id: uuidv4(),
      ...args.data,
    };
    db.users.push(user);
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
  createPost(parent, args, { db }, info) {
    const Userexits = db.users.some((user) => user.id === args.data.author);
    if (!Userexits) {
      throw new Error("user desn't exist");
    }
    const post = {
      id: uuidv4(),
      ...args.data,
    };
    db.posts.push(post);
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
    return Post;
  },
  createcomment(parent, args, { db }, info) {
    const UserandPost =
      db.users.some((user) => user.id === args.data.authorid) &&
      db.posts.some(
        (post) => post.id === args.data.postid && post.published === true
      );
    if (!UserandPost) {
      throw new Error(
        "User are post dosen't exist are the post may not be published"
      );
    }

    const comment = {
      id: uuidv4(),
      ...args.data,
    };
    db.Comments.push(comment);
    return comment;
  },
  deleteComment(parent, args, { db }, info) {
    const comment = db.Comments.some((comment) => comment.id === args.id);
    if (!comment) {
      throw new Error("Comment not found");
    }
    const comm = db.Comments.find((comment) => comment.id === args.id);
    db.Comments = db.Comments.filter((comment) => comment.id !== args.id);
    return comm;
  },
};

export default Mutation;
