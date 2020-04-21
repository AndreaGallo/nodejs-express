const express = require('express');
const usersController = require('../../controllers/users-controller');

const router = express.Router();

router.post('/login', usersController.login);
router.post('/create', usersController.createUser);
router.delete('/delete', usersController.deleteUser);
router.put('/update', usersController.updateUser);
router.get('/get-all', usersController.getUsers);

module.exports = router;
