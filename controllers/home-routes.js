const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment, Save } = require('../models');

// get all posts, rendering the homepage with that data
router.get('/', (req, res) => {
  console.log('======================');
  Post.findAll({
    attributes: [
      'id',
      'post_text',
      'title',
      'created_at',
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      const posts = dbPostData.map(post => post.get({ plain: true }));

      res.render('homepage', {
        posts,
        loggedIn: req.session.loggedIn
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get single post, rendering view one post page with data
router.get('/post/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: [
      'id',
      'post_text',
      'title',
      'created_at',
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      },
      {
        model: Save,
        attributes: ['id', 'post_id', 'user_id']
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({  message: `No post found with id: ${req.params.id}` });
        return;
      }

      const post = dbPostData.get({ plain: true });

      res.render('single-post', {
        post,
        loggedIn: req.session.loggedIn
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//rendering login page, redirecting to home if logged in
router.get('/login', (req, res) => {
  // if already logged in  go to home page
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

//rendering signup page, redirecting to home if logged in 
router.get('/signup', (req, res) => {
  // if already logged in  go to home page
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  } 
  res.render('signup');
});

module.exports = router;