const comment = {
  author(parent, args, { db }, info) {
    return db.users.find((user) => user.id === parent.authorid);
  },
  post(parent, args, { db }, info) {
    return db.posts.find((post) => post.id === parent.postid);
  },
};

export default comment;
