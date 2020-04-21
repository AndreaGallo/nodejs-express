const express = require('express');
const usersController = require('../../controllers/users-controller');
const { isValidHostname, isAuth, isAdmin } = require('../../middlewares/auth');

const router = express.Router();

router.post('/login', usersController.login);
router.post('/create', usersController.createUser);
router.delete('/delete', isAuth, isAdmin, usersController.deleteUser);
router.put('/update', isValidHostname, isAuth, usersController.updateUser);
router.get('/get-all', isAuth, isAdmin, usersController.getUsers);

module.exports = router;
