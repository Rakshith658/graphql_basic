const Subscription = {
  count: {
    subscribe(parent, args, { db, pubsub }, info) {
      let count = 0;
      setInterval(() => {
        count++;
        pubsub.publish("count", {
          count,
        });
      }, 1000);
      return pubsub.asyncIterator("count");
    },
  },
  comment: {
    subscribe(parent, { postid }, { db, pubsub }, info) {
      const post = db.posts.find(
        (post) => post.id === postid && post.published
      );
      if (!post) {
        throw new Error("the post was not found");
      }
      return pubsub.asyncIterator(`comment ${postid}`);
    },
  },
  post: {
    subscribe(parent, args, { db, pubsub }, info) {
      return pubsub.asyncIterator(`post`);
    },
  },
};

export default Subscription;
