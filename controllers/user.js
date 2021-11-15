module.exports = {createUser,updateUser, deleteUser,getUserArticles,getUser,getUsers};

const _= require('lodash');
const User = require('../models/user');
const Article = require('../models/article');



async function createUser(req, res, next) {
  try {
    
    const fields = [
      'firstName',
      'lastName',
      'role',
      'createdAt',
      'numberOfArticles',
      'nickname'
    ]
    const payload = _.pick(req.body,fields)
    const user = new User(payload)
    const newUser=await user.save()
    console.log(payload)

    return res.status(200).json(newUser);
  } catch (error) {
    console.log(error);
    next(error)
  }
}

async function updateUser(req, res, next) {
  try {
  
    const userId = req.params.id
    const isUserExists = await User.findById(userId ).exec()
    const fields= [
      'firstName',
      'lastName',
      'nickname'
    ]
    const update=_.pick(req.body,fields)
    if (!isUserExists) {
      throw utilError.badRequest('user is not exists');
    }
    const user =await User.findOneAndUpdate({_id:userId},update ).exec()
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    next(error)
  }
}

async function deleteUser(req, res, next) {
  try {
    
    const userId = req.params.id
    const isUserExists = await User.exists({ _id: userId })
    
    if (!isUserExists) {
      throw utilError.badRequest('user is not exists');
    }

    await User.findByIdAndDelete({ _id: userId })
    await Article.deleteMany({owner:userId})
    return res.status(200).json({ message: `user is successfully deleted` });
    
  } catch (error) {

    console.log(error);
    next(error)

  }
}

async function getUserArticles(req, res, next) {
  try {
    
    const userId = req.params.id
    const isUserExists = await User.exists({ _id: userId })
    const isArticlesByUserId = await Article.exists({ owner: userId })
    
    if (!isUserExists) {
      throw utilError.badRequest('user is not exists');
    }

    if (!isArticlesByUserId) {
      throw utilError.badRequest('user doesn\'t have articles');
    }

    const userArticles = await Article.find({ owner: userId }).populate('owner')
    
    return res.status(200).json(userArticles);

  } catch (error) {

    console.log(error);
    next(error)

  }
}

async function getUser(req, res, next) {
  try {
    
    const userId = req.params.id
    const isUserExists = await User.exists({ _id: userId })

    if (!isUserExists) {
      throw utilError.badRequest('user is not exists');
    }

    const user = await User.findOne({_id:userId})

    return res.status(200).json(user);
    
  } catch (error) {

    console.log(error);
    next(error)

  }
}

async function getUsers(req, res, next) {
  try {
    const {query:{skip=0,limit=10,search='',sortFromClient}}=req
    const sort = util.sort(sortFromClient)
    const filter = { $regex: new RegExp(util.escapeRegExpChars(search), 'i') }
    const query = { $or: [{ firsName: filter }, { lastName: filter }] }
    const result = await User.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
    
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    next(error)
  }
}
