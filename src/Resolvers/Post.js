const Post = {
  author(parent, args, { db }, info) {
    return db.users.find((user) => user.id === parent.author);
  },
  comments(parent, args, { db }, info) {
    return db.Comments.filter((comment) => comment.postid === parent.id);
  },
};
export default Post;
