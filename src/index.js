import { GraphQLServer } from "graphql-yoga";

const users = [
  {
    id: "123e",
    name: "John",
    email: "John@example.com",
    age: null,
  },
  {
    id: "1",
    name: "Raju",
    email: "Raju@example.com",
    age: 24,
  },
  {
    id: "12",
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
  },
  {
    id: "2",
    title: "Stock Market",
    body: "Rakshith is investor",
    published: true,
  },
  {
    id: "3",
    title: "Lover",
    body: "Rakshith loves Chaitra",
    published: true,
  },
];

const typeDefs = `
    type Query {
      Users(query:String):[User]
      Posts(query:String):[Post]
        me:User!
        post:Post!
    }
    type User {
        id:ID!
        name:String!
        email:String!
        age:Int
    }
    type Post {
        id:ID!
        title:String!
        body:String!
        published:Boolean
    }
    `;

const resolvers = {
  Query: {
    me() {
      return {
        id: "123e",
        name: "John",
        email: "John@example.com",
        age: null,
      };
    },
    Users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter((User) =>
        User.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
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
      return {
        id: "1",
        title: "John",
        body: "Rakshith Kumar S is a king of his owm kingdom",
        published: false,
      };
    },
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });

server.start(() => {
  console.log("server is running on port number 4000");
});
