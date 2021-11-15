const express = require('express')
const router = express.Router()

const articleController = require('../controllers/article')

//! await function userMiddleware(req, res, next) {
//     try {
//         const token = req.headers['Authorisation']
//         const userId = util.getUserIdByToken(token)
//         const user = util.extractUser(userId)
//         req.user
//         next()
//     } catch (error) {
//         console.log(error)
//         next(error)
//     }
// }



router.post('/', articleController.createArticle)
    .get('/',articleController.getArticles)
router.put('/:articleId',articleController.updateArticle)
    .delete('/:articleId',articleController.deleteArticle)//! <--- add middleware here 
    


module.exports = router;