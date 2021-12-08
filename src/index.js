import { GraphQLServer } from "graphql-yoga";
import { v4 as uuidv4 } from "uuid";

let users = [
  {
    id: "1",
    name: "John",
    email: "John@example.com",
    age: null,
  },
  {
    id: "2",
    name: "Raju",
    email: "Raju@example.com",
    age: 24,
  },
  {
    id: "3",
    name: "rakshith",
    email: "rakshith@example.com",
    age: 19,
  },
];

let posts = [
  {
    id: "1",
    title: "programming",
    body: "i am pragramer",
    published: true,
    author: "1",
  },
  {
    id: "2",
    title: "Stock Market",
    body: "Rakshith is investor",
    published: true,
    author: "1",
  },
  {
    id: "3",
    title: "Lover",
    body: "Rakshith loves Chaitra",
    published: true,
    author: "2",
  },
];

let Comments = [
  {
    id: "1",
    postid: "1",
    authorid: "1",
    body: "super post",
  },
  {
    id: "2",
    postid: "1",
    authorid: "1",
    body: "super Rakshith",
  },
  {
    id: "3",
    postid: "2",
    authorid: "1",
    body: "fine loves",
  },
  {
    id: "4",
    postid: "3",
    authorid: "2",
    body: "i likes this",
  },
];

const typeDefs = `
    type Query {
      Users(query:String):[User]
      Posts(query:String):[Post]
      Comments(query:String):[comment]
        me:User!
        post:Post!
    }

    type Mutation {
      createUser(data:createUserInput):User!
      deleteUser(id:ID!):User!
      createPost(data:createPostInput):Post!
      deletePost(id:ID!):Post!
      createcomment(data:createcommentInput):comment!
      deleteComment(id:ID!):comment!
    }

    input createUserInput {
      name:String!
      email:String!
      age:Int!
    }

    input createPostInput {
      title:String!
      body:String!
      published:Boolean
      author:ID!
    }
    input createcommentInput {
      body:String!
      postid:ID!
      authorid:ID!
    }

    type User {
        id:ID!
        name:String!
        email:String!
        age:Int
        posts:[Post]!
        comments:[comment]!
    }
    type Post {
        id:ID!
        title:String!
        body:String!
        published:Boolean
        author:User!
        comments:[comment]!
    }
    type comment{
      id:ID!
      postid:String!
      authorid:String!
      post:Post!
      author:User!
      body:String!
    }
    `;

const resolvers = {
  Query: {
    me() {
      return users[0];
    },
    Users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter((User) =>
        User.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
      );
    },
    Comments(parent, args, ctx, info) {
      if (!args.query) {
        return Comments;
      }
      return Comments.filter((Comment) =>
        Comment.body
          .toLocaleLowerCase()
          .includes(args.query.toLocaleLowerCase())
      );
    },
    Posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter((post) => {
        const isTitle = post.title
          .toLocaleLowerCase()
          .includes(args.query.toLocaleLowerCase());
        const isbody = post.body
          .toLocaleLowerCase()
          .includes(args.query.toLocaleLowerCase());
        return isTitle || isbody;
      });
    },
    post() {
      return posts[0];
    },
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailtaken = users.some((user) => user.email === args.data.email);

      if (emailtaken) {
        throw new Error(`User with email ${args.email} already exists`);
      }
      const user = {
        id: uuidv4(),
        ...args.data,
      };
      users.push(user);
      return user;
    },
    deleteUser(parent, args, ctx, info) {
      const user = users.some((user) => user.id === args.id);
      if (!user) {
        throw new Error(`User with id ${args.id} does not exist`);
      }
      const User = users.find((user) => user.id === args.id);
      users = users.filter((user) => user.id !== args.id);
      posts = posts.filter((post) => {
        const match = post.author === args.id;
        if (match) {
          Comments = Comments.filter((comment) => comment.id !== post.id);
        }
        return !match;
      });
      Comments = Comments.filter((comment) => comment.authorid !== args.id);
      return User;
    },
    createPost(parent, args, ctx, info) {
      const Userexits = users.some((user) => user.id === args.data.author);
      if (!Userexits) {
        throw new Error("user desn't exist");
      }
      const post = {
        id: uuidv4(),
        ...args.data,
      };
      posts.push(post);
      return post;
    },
    deletePost(parent, args, ctx, info) {
      const P = posts.some((post) => post.id === args.id);
      if (!P) {
        throw new Error("Post with id " + args.id + "doesn't exist");
      }
      const Post = posts.find((post) => post.id === args.id);
      posts = posts.filter((post) => post.id !== args.id);
      Comments = Comments.filter((comment) => comment.postid !== args.id);
      return Post;
    },
    createcomment(parent, args, ctx, info) {
      const UserandPost =
        users.some((user) => user.id === args.data.authorid) &&
        posts.some(
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
      Comments.push(comment);
      return comment;
    },
    deleteComment(parent, args, ctx, info) {
      const comment = Comments.some((comment) => comment.id === args.id);
      if (!comment) {
        throw new Error("Comment not found");
      }
      const comm = Comments.find((comment) => comment.id === args.id);
      Comments = Comments.filter((comment) => comment.id !== args.id);
      return comm;
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author);
    },
    comments(parent, args, ctx, info) {
      return Comments.filter((comment) => comment.postid === parent.id);
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => post.author === parent.id);
    },
    comments(parent, args, ctx, info) {
      return Comments.filter((comment) => comment.authorid === parent.id);
    },
  },
  comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.authorid);
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => post.id === parent.postid);
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
  console.log("server is running on port number 4000");
});
