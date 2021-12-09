import { GraphQLServer } from "graphql-yoga";
import db from "./db";
import Query from "./Resolvers/Query";
import Mutation from "./Resolvers/Mutation";
import Post from "./Resolvers/Post";
import User from "./Resolvers/User";
import comment from "./Resolvers/Comment";

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    Post,
    User,
    comment,
  },
  context: {
    db,
  },
});

server.start(() => {
  console.log("server is running on port number 4000");
});
