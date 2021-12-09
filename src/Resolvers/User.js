const User = {
  posts(parent, args, { db }, info) {
    return db.posts.filter((post) => post.author === parent.id);
  },
  comments(parent, args, { db }, info) {
    return db.Comments.filter((comment) => comment.authorid === parent.id);
  },
};
export default User;
