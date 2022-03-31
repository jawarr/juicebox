const express = require('express');
const postsRouter = express.Router();
const { getAllPosts } = require('../db');
const { getUserByUsername } = require('../db');
const { createPost } = require('../db');
const { requireUser } = require('./utils');


postsRouter.post('/', requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;

  const tagArr = tags.trim().split(/\s+/)
  const postData = {};

  // only send the tags if there are some to send
  if (tagArr.length) {
    postData.tags = tagArr;
  }

  try {
    const { id } = await getUserByUsername(req.user.username);
    const authID = id;
    postData.authorID = authID;
    postData.title = title;
    postData.content = content;
    console.log(postData);
    const post = await createPost(postData);
    if (post) {
      res.send({ post });
    } else {
      next({
        name: 'Create Post Error',
        message: 'Failed to create post',
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next();
});

postsRouter.get('/', async (req, res) => {
  const posts = await getAllPosts();

  res.send({
    posts
  });
});

module.exports = postsRouter;