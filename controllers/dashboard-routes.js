const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment, Save } = require('../models');
const withAuth = require('../utils/auth');

//getting data for post, rendering dashboard using the data with authorization
router.get('/', withAuth, (req, res) => {
  // console.log(req.session);
  console.log('======================');
  Promise.all([Post.findAll({
    where: {
      user_id: req.session.user_id
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
      }
    ]
  }),
  Save.findAll({
    where: {
      user_id: req.session.user_id
    },
    include: [
      {
        model: Post,
        attributes: [
          'id',
          'post_text',
          'title',
          'created_at',
        ],
        include: [
          {
            model: User, 
            attributes: ['username']
          }
        ]
      }
    ]
  })
])
  .then(([dbPostData, dbSaveData]) => {
    console.log(dbSaveData)
      const posts = dbPostData.map(post => post.get({ plain: true }));
      const saved = dbSaveData.map(save => save.post.get({ plain: true }));
      res.render('dashboard', { posts, saved, loggedIn: true });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// get post by id, use that data to render the edit post page with authorization
router.get('/edit/:id', withAuth, (req, res) => {
  Post.findByPk(req.params.id, {
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
      if (dbPostData) {
        const post = dbPostData.get({ plain: true });
        
        res.render('edit-post', {
          post,
          loggedIn: true
        });
      } else {
        res.status(404).end();
      }
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

// render the new post page with authorization
router.get('/add-post/', withAuth, (req, res) => {
  res.render('add-post', {
    loggedIn: true
  });
});

module.exports = router;