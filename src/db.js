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

const db = {
  users,
  posts,
  Comments,
};

export default db;
