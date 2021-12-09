const Query = {
  me(parent, args, { db }, info) {
    return db.users[0];
  },
  Users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }
    return db.users.filter((User) =>
      User.name.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
    );
  },
  Comments(parent, args, { db }, info) {
    if (!args.query) {
      return db.Comments;
    }
    return db.Comments.filter((Comment) =>
      Comment.body.toLocaleLowerCase().includes(args.query.toLocaleLowerCase())
    );
  },
  Posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }
    return db.posts.filter((post) => {
      const isTitle = post.title
        .toLocaleLowerCase()
        .includes(args.query.toLocaleLowerCase());
      const isbody = post.body
        .toLocaleLowerCase()
        .includes(args.query.toLocaleLowerCase());
      return isTitle || isbody;
    });
  },
  post(parent, args, { db }, info) {
    return db.posts[0];
  },
};

export default Query;
