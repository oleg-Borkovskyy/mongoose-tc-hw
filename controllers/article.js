module.exports = {createArticle, updateArticle,deleteArticle,getArticles};

const utilError = require('../config/errorHelper');
const _ = require('lodash');
const Article = require('../models/article');
const User = require('../models/user');

async function updateArticle(req, res, next) {
  const articleId = req.params.articleId;
  const body = req.body;

  try {
    const existingArticle = await Article.findOne({_id: articleId});

    if (!existingArticle) {
      throw utilError.badRequest('Article is not exists');
    }

    if (body.title) {
      existingArticle.title = body.title;
    }

    if (body.description|| body.description==='') {
      existingArticle.description = body.description;
    }

    await existingArticle.save();
    // await Article.findByIdAndUpdate(articleId,{})
    return res.status(200).json(existingArticle);
      
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function createArticle(req, res, next) {
  const fields = ['title', 'description', 'owner'];

  const body = req.body;
  const newArticle = _.pick(body, fields);
  const owner = req.body.owner
  
  try {
    
    const existingArticle = await Article.exists({ title: body.title });

    
    if (existingArticle) {
      throw utilError.badRequest('Article exists');
    }
    
    const userAuthor = await User.findById(owner)
    
    const article = new Article(newArticle);
    await article.save();
    userAuthor.numberOfArticles++
    await userAuthor.save()
    return res.status(200).json(article);
    
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function deleteArticle(req, res, next) {
  const articleId = req.params.articleId;

  try {
    const existingArticle = await Article.exists({_id: articleId});

    if (!existingArticle) {
      throw utilError.badRequest('Article is not exists');
    }
    //! if user have rights to delete article
    // if (existingArticle.owner.toString() !== user._id.toString()) {
    //   throw utilError.badRequest('Incorrect owner')
    // }


    //!
    const article=await Article.findById({_id: articleId})
    const userOwnerId = article.owner
    const userOwner = await User.findById({ _id: userOwnerId })
    userOwner.numberOfArticles--
    userOwner.save()
    article.remove()
    return res.status(200).json({message:`Article is successfully deleted`});
      
  } catch (error) {
    console.log(error);
    next(error);
  }
}

async function getArticles(req, res, next) {
  try {
    const {query:{skip=0,limit=10,search='',sortFromClient}}=req
    const sort = util.sort(sortFromClient)
    const filter = { $regex: new RegExp(util.escapeRegExpChars(search), 'i') }
    const query={$or:[{title:filter},{description:filter}]}
    const result = await Article.find(query)
      .populate('owner')
      .sort(sort)
      .skip(skip)
      .limit(limit)
    
    return res.status(200).json(result);
      
  } catch (error) {
    console.log(error);
    next(error);
  }
}
