const express = require('express')
const router = express.Router()

const userController = require('../controllers/user')

router.post('/', userController.createUser)
    .get('/', userController.getUsers)
router.put('/:id', userController.updateUser)
    .get('/:id', userController.getUser)
    .delete('/:id', userController.deleteUser)
    .get('/:id/articles', userController.getUserArticles)


module.exports = router;