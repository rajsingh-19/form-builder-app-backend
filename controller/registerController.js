const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user.schema");

const registerHandler = async (req, res) => {
    const {userName, email, password} = req.body;
    const isUserExists = await UserModel.findOne({email});
    //      check if user already exists
    if(isUserExists) {
        return res.status(400).json({message: "User already exists"});
    }
    //          hash the password using bcrypt
    const salting = await bcrypt.genSalt(10);                              // Generate a salt for password hashing
    const hashPassword = await bcrypt.hash(password, salting);             // Hash the password with the salt
    try {
        //          create the User in the Model
        const newUser = new UserModel({
            userName: userName,
            email: email,
            password: hashPassword
        });
        //          save the new user to the database
        await newUser.save();                                               // Save the new user to the model (MongoDB)
        res.status(201).json({message: "User Created"});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Error in Creating User"});
        return;
    }
}

module.exports = registerHandler;
