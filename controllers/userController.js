const Joi = require('joi');
var mongoose = require('mongoose');

// models
const User = require('../models/User');



const addUser = async (req, res) => {
    try {
        const payload = req.body;

        const schema = Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),

        });

        const result = schema.validate(payload);

        const { value, error } = result;

        const valid = error == null;

        if (!valid) {

            return res.status(400).json({ message: error.details[0].message, success: false, data: error })

        } else {
            const newUser = await User.create(req.body);
            return res.status(200).json({ message: 'User added', success: true, data: newUser });
        }
    }
    catch(error){
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email Already Exist!', stack: 'AlreadyExist', success: false, data: {} });
        }
        return res.status(400).json({ message: 'Something went wrong.', stack: '', success: false, data: {} });
    }
}

module.exports = {
    addUser,
}
