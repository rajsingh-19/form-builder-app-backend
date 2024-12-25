const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const UserModel = require("../models/user.schema");

dotenv.config();                                                 // Load environment variables from .env file

//                      register controller         
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
};

//                          login controller                
const loginHandler = async (req, res) => {
    const {email, password} = req.body;
    const isUserValid = await UserModel.findOne({email});
    //          check if user is present or not
    if(!isUserValid) {
        return res.status(401).json({message: "Credential is wrong"});
    }
    //          check if the password is same or not
    const isPasswordValid = await bcrypt.compare(password, isUserValid.password);
    //          check if the password is valid or not
    if(!isPasswordValid) {
        return res.status(401).json({message: "Credential is wrong"});
    }
    //          payload for the JWT token (information we want to encode into the token)
    const payload = {
        id: isUserValid._id                         // Include mongodb id in the token payload
    }
    //          create the JWT token with the payload, using a secret key from environment variables
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return res.json({status: true, message: "Login Successfully", token: token});
};

//                      settings controller                 
const updateUserHandler = async (req, res) => {
    try {
        // Extract user ID from the authenticated token
        const userId = req.user.id;

        // Destructure the fields from the request body
        const { userName, email, oldPassword, newPassword } = req.body;

        // Find the user in the database
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update name if provided
        if (userName) {
            user.name = userName;
        }

        // Update email if provided
        if (email) {
            user.email = email;
        }

        // Update password if provided
        if (oldPassword && newPassword) {
            const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Incorrect old password" });
            }
            const salting = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salting);
            user.password = hashedPassword;
        }

        // Save updated user to the database
        await user.save();
        return res.json({ status: true, message: "User updated successfully", user });
    } catch (error) {
        console.error("Error in settingsHandler:", error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
};

module.exports = { registerHandler, loginHandler, updateUserHandler };
