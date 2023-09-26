const { Router } = require('express');

const userRouter = Router();

const userController = require('../controllers/userController');


/**
 * @typedef addUser
 * @property {string} name
 * @property {string} email
 */
/**
 * @group User - User
 * For addUser
 * @route POST /user/addUser
 * @param {addUser.model} addUser.body.required
 * @returns {object} 200 - Successfull
 * @returns {Error} Error - Unexpected
 */
userRouter.post('/addUser', userController.addUser)


module.exports = userRouter