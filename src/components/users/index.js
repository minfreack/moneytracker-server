const express = require('express');
const router = express.Router();
const UsersController = require('./controller')

const onCreateUser = (req, res) => {
    UsersController.newUser(req.body)
        .then((result) => res.status(result.status).json(result.data))
        .catch((err) => res.status(500).json(err));  
};

const onGetUser = (req, res) => {
    UsersController.getUser(req.body)
        .then((result) => res.status(result.status).json(result.data))
        .catch((err) => res.status(500).json(err));  
};


router.post('/user-new', onCreateUser);
router.post('/user', onGetUser);

module.exports = router;