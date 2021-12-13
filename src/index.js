import { GraphQLServer, PubSub } from "graphql-yoga";
const env = require("dotenv");
import db from "./db";
import Query from "./Resolvers/Query";
import Mutation from "./Resolvers/Mutation";
import Post from "./Resolvers/Post";
import User from "./Resolvers/User";
import comment from "./Resolvers/Comment";
import Subscription from "./Resolvers/Subscription";
import connectDB from "./models/db";

env.config();
connectDB();
const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    Post,
    User,
    comment,
    Subscription,
  },
  context: {
    db,
    pubsub,
  },
});

server.start(() => {
  console.log("server is running on port number 4000");
});
