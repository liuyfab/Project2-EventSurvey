const router = require('express').Router();
const { Save } = require('../../models');
const withAuth = require('../../utils/auth');


router.post('/', withAuth, (req, res) => {
    Save.create({
        user_id: req.session.user_id,
        post_id: req.body.post_id
    })
        .then(dbSaveData => res.json(dbSaveData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
})

router.delete('/:id', withAuth, (req, res) => {
    Save.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbSaveData => {
            if (!dbSaveData) {
                res.status(404).json({ message: 'No saved entry found with this id!' });
                return;
            }
            res.json(dbSaveData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})

module.exports = router;
