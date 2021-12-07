import { GraphQLServer } from "graphql-yoga";

const users = [
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

const posts = [
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

const Comments = [
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
